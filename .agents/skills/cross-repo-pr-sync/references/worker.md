# Worker 并行执行参考

每个 worker 是一个独立子进程，负责一个上游仓库（或子包）的完整分析流程，
与其他 worker 完全隔离，结果通过共享临时目录传递给主进程。

---

## Worker 生命周期

```
主进程派发任务 (worker_input.json)
        ↓
Worker 启动
        ↓
① 准备数据源（本地 or clone to tmp）
        ↓
② git log 过滤 fix/feat commits
        ↓
③ 按 upstream_path 过滤文件范围
        ↓
④ 提取 PR 编号，检查下游同步状态
        ↓
⑤ 评估优先级 & 同步难度
        ↓
⑥ 写出 {worker_id}.json 到 results_dir
        ↓
⑦ 清理临时 clone（若有）
        ↓
Worker 退出（exit code 0=成功, 1=失败）
```

---

## Worker 输入格式

主进程通过文件或 stdin 传递给每个 worker：

```json
{
  "worker_id": "worker-C",
  "upstream_name": "pro-components",
  "remote_url": "https://github.com/ant-design/pro-components.git",
  "local_path": null,
  "upstream_path": "packages/table",
  "downstream_path": "packages/pro-table",
  "downstream_local_path": "./",
  "last_synced_commit": "c3d4e5f6a7b8",
  "max_prs": 50,
  "results_dir": "/tmp/sync-results-1712345678"
}
```

---

## Worker 核心：按子路径过滤

当 `upstream_path` 不是 `.` 时，worker 只分析改动了该路径下文件的 commits：

```bash
UPSTREAM_PATH="packages/table"
LAST_COMMIT="c3d4e5f"
REPO_DIR="/tmp/sync-upstream-pro-components-xxx"

# 获取改动了指定子路径的 fix/feat commits
git -C "$REPO_DIR" log "${LAST_COMMIT}..HEAD" \
  --pretty=format:"%H|%h|%s|%ad|%an" \
  --date=short \
  --extended-regexp \
  --grep="^(fix|feat|feature|perf|revert)(\(.+\))?!?:|^Merge pull request #" \
  -- "$UPSTREAM_PATH"   # ← 关键：只看这个子路径的变更
```

`-- <path>` 参数告诉 git 只返回影响该路径的提交，天然隔离各 worker 的分析范围。

当 `upstream_path` 为 `.` 时，省略 `--` 参数，分析整个仓库。

---

## Worker 输出格式

写入 `{results_dir}/{worker_id}.json`：

```json
{
  "worker_id": "worker-C",
  "upstream_name": "pro-components",
  "upstream_path": "packages/table",
  "downstream_path": "packages/pro-table",
  "latest_commit": "d4e5f6a7b8c9",
  "latest_commit_short": "d4e5f6a",
  "latest_tag": "v2.7.0",
  "analyzed_at": "2024-03-01T12:05:33Z",
  "duration_seconds": 18,
  "total_commits_scanned": 142,
  "prs": [
    {
      "pr_number": 8800,
      "title": "fix(table): sort not reset on filter change",
      "type": "fix",
      "commit": "c3d4e5f6",
      "commit_short": "c3d4e5f",
      "committed_at": "2024-02-20",
      "components": ["ProTable"],
      "priority": "P1",
      "difficulty": "Medium",
      "upstream_url": "https://github.com/ant-design/pro-components/pull/8800",
      "upstream_path": "packages/table",
      "downstream_path": "packages/pro-table",
      "status": "pending",
      "skip_reason": null
    }
  ],
  "skipped_prs": [
    {
      "pr_number": 8750,
      "title": "fix: SSR support for table",
      "skip_reason": "SSR 专属"
    }
  ],
  "error": null
}
```

**错误情况**（clone 失败、网络超时等）：

```json
{
  "worker_id": "worker-C",
  "upstream_name": "pro-components",
  "prs": [],
  "error": "clone failed: Repository not found or network timeout after 60s",
  "analyzed_at": "2024-03-01T12:05:00Z"
}
```

---

## 并发调度实现（Python 参考）

```python
#!/usr/bin/env python3
"""主进程调度器示例"""
import json
import subprocess
import concurrent.futures
import os
import time
from pathlib import Path

def build_worker_tasks(config: dict, results_dir: str) -> list[dict]:
    """从 .sync-upstream.json 构建 worker 任务列表。
    
    粒度固定为：每个 packages 条目一个 worker（下游子包粒度）。
    """
    settings = config.get("settings", {})
    tasks = []
    worker_id = 0

    for upstream in config["upstreams"]:
        packages = upstream.get("packages", [{"upstream_path": ".", "downstream_path": ""}])

        for pkg in packages:
            tasks.append({
                "worker_id": f"worker-{worker_id}",
                "upstream_name": upstream["name"],
                "remote_url": upstream.get("remote_url"),
                "local_path": upstream.get("local_path"),
                "upstream_path": pkg["upstream_path"],
                "downstream_path": pkg["downstream_path"],
                "last_synced_commit": upstream["last_synced_commit"],
                "results_dir": results_dir,
                "max_prs": settings.get("max_prs", 50),
            })
            worker_id += 1

    return tasks


def run_worker(task: dict) -> dict:
    """在子进程中运行单个 worker，返回结果"""
    worker_id = task["worker_id"]
    result_path = Path(task["results_dir"]) / f"{worker_id}.json"

    # 写入 worker 输入
    input_path = Path(task["results_dir"]) / f"{worker_id}_input.json"
    input_path.write_text(json.dumps(task, indent=2))

    try:
        subprocess.run(
            ["python3", "worker.py", str(input_path)],
            timeout=300,  # 5分钟超时
            check=True
        )
        return json.loads(result_path.read_text())
    except subprocess.TimeoutExpired:
        return {"worker_id": worker_id, "prs": [], "error": "Worker timeout after 300s"}
    except Exception as e:
        return {"worker_id": worker_id, "prs": [], "error": str(e)}


def orchestrate(config_path: str):
    """主进程入口"""
    # 合并主配置与本地覆盖（.sync-upstream.local.json）
    config = load_config()  # 见 references/sync-state.md → 合并实现
    settings = config.get("settings", {})

    # 准备结果目录
    results_dir = f"/tmp/sync-results-{int(time.time())}"
    os.makedirs(results_dir, exist_ok=True)

    # 构建任务
    tasks = build_worker_tasks(config, results_dir)
    max_workers = settings.get("max_workers", 4)

    print(f"🚀 启动 {len(tasks)} 个 worker，最大并发 {max_workers}")
    for t in tasks:
        pkg_info = t.get('upstream_path', 'all packages')
        print(f"   {t['worker_id']}: {t['upstream_name']} ({pkg_info}) → {t.get('downstream_path', '')}")

    # 并发执行
    results = []
    with concurrent.futures.ProcessPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(run_worker, task): task for task in tasks}
        for future in concurrent.futures.as_completed(futures):
            task = futures[future]
            result = future.result()
            status = "✅" if not result.get("error") else "❌"
            pr_count = len(result.get("prs", []))
            print(f"   {status} {task['worker_id']} 完成，发现 {pr_count} 个待同步 PR")
            results.append(result)

    # 清理 worker 输入文件
    for f in Path(results_dir).glob("*_input.json"):
        f.unlink()

    return results, results_dir
```

---

## 进度展示（主进程实时输出）

```
🚀 启动 4 个 worker，最大并发 4
   worker-0: ant-design (.) → packages/components
   worker-1: ant-design-icons (packages/icons-vue) → packages/icons
   worker-2: pro-components (packages/table) → packages/pro-table
   worker-3: pro-components (packages/form) → packages/pro-form

🌐 worker-0: 正在克隆 ant-design... (预计 30s)
🌐 worker-1: 正在克隆 ant-design-icons... (预计 10s)
🌐 worker-2: 正在克隆 pro-components... (预计 20s)
📂 worker-3: 复用 worker-2 的克隆（同一上游）

✅ worker-1 完成，发现 3 个待同步 PR（用时 12s）
✅ worker-3 完成，发现 2 个待同步 PR（用时 25s）
✅ worker-2 完成，发现 5 个待同步 PR（用时 28s）
✅ worker-0 完成，发现 12 个待同步 PR（用时 45s）

📊 全部完成，共 22 个待同步 PR，开始汇总...
```

---

## 优化：同一上游跨 worker 复用 clone

当多个 worker 来自**同一个上游仓库**的不同子包时，重复 clone 是浪费。
优化策略：主进程先做 clone，生成共享的本地路径传给各 worker。

```python
def preload_shared_clones(tasks: list[dict], results_dir: str) -> list[dict]:
    """对同一 remote_url 只 clone 一次，复用给多个 worker"""
    cloned = {}   # remote_url → tmp_path

    for task in tasks:
        url = task.get("remote_url")
        local = task.get("local_path")

        if local and Path(local).exists():
            continue  # 本地已有，不需要 clone

        if url and url not in cloned:
            tmp = f"/tmp/sync-upstream-{task['upstream_name']}-{int(time.time())}"
            subprocess.run([
                "git", "clone", "--filter=blob:none", "--no-checkout",
                "--single-branch", url, tmp
            ], check=True, timeout=120)
            cloned[url] = tmp
            print(f"🌐 克隆完成: {url} → {tmp}")

        if url and url in cloned:
            task["local_path"] = cloned[url]
            task["_shared_clone"] = True  # 标记为共享，worker 不负责清理

    return tasks, cloned


def cleanup_shared_clones(cloned: dict):
    """主进程统一清理共享 clone"""
    for url, tmp in cloned.items():
        import shutil
        shutil.rmtree(tmp, ignore_errors=True)
        print(f"🧹 清理: {tmp}")
```

---

## 错误处理策略

| 错误类型 | 处理方式 |
|---------|---------|
| 单个 worker clone 失败 | 标记该 worker `error`，其余 worker 继续，主进程汇总时单独报告 |
| Worker 超时（默认 300s） | 强制终止，写入 timeout 错误 |
| 所有 worker 失败 | 主进程报错退出，不更新 `last_synced_commit` |
| 部分 worker 失败 | 只更新**成功** worker 对应上游的 `last_synced_commit`，失败的保留原值待下次重试 |
| results_dir 写入冲突 | 每个 worker 写自己的 `{worker_id}.json`，天然隔离，无冲突 |
