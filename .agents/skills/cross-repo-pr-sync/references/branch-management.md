# 分支管理：一 PR 一分支

每个上游 PR 在下游 monorepo 中对应一个独立的本地分支，
主进程在汇总阶段对所有非 Skip 的 PR 统一自动创建分支，每个分支附带对应的 checklist 文件。

---

## 分支命名规则

```
sync/{upstream-name}-{pr-number}
```

示例：

| 上游 PR | 分支名 |
|---------|--------|
| ant-design #12345 | `sync/ant-design-12345` |
| pro-components #8800 | `sync/pro-components-8800` |
| ant-design-icons #560 | `sync/ant-design-icons-560` |

命名规则说明：
- `upstream-name` 取 `.sync-upstream.json` 中的 `name` 字段，统一小写，空格替换为 `-`
- `pr-number` 直接使用上游 PR 编号，无需补零
- 前缀固定为 `sync/`，方便在 git 中统一过滤和管理

---

## 自动创建策略

| 优先级 | 行为 |
|--------|------|
| 🔴 P0 | 自动创建分支 + 写入 checklist 文件 |
| 🟠 P1 | 自动创建分支 + 写入 checklist 文件 |
| 🟡 P2 | 自动创建分支 + 写入 checklist 文件 |
| 🟢 P3 | 自动创建分支 + 写入 checklist 文件 |
| ⚪ Skip | 不处理 |

---

## 分支创建流程

### 主进程在 Step 7 汇总后执行

```bash
BASE_BRANCH="main"   # 来自 settings.base_branch
UPSTREAM_NAME="ant-design"
PR_NUMBER="12345"
BRANCH="sync/${UPSTREAM_NAME}-${PR_NUMBER}"

# 1. 确认基准分支是最新的
git fetch origin "$BASE_BRANCH"

# 2. 检查分支是否已存在（避免重复创建）
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
    echo "⚠️  分支 $BRANCH 已存在，跳过创建"
else
    # 3. 从基准分支创建
    git checkout -b "$BRANCH" "origin/$BASE_BRANCH"
    echo "✅ 已创建分支: $BRANCH"

    # 4. 写入 checklist 文件到分支
    cat > ".sync-checklist-${UPSTREAM_NAME}-${PR_NUMBER}.md" << CHECKLIST
$(generate_checklist $PR_DATA)
CHECKLIST
    git add ".sync-checklist-${UPSTREAM_NAME}-${PR_NUMBER}.md"
    git commit -m "chore: add sync checklist for ${UPSTREAM_NAME}#${PR_NUMBER}"

    # 5. 切回基准分支，不留在同步分支上
    git checkout "$BASE_BRANCH"
fi
```

### Python 实现（主进程批量创建）

```python
import subprocess
from pathlib import Path

def create_sync_branch(pr: dict, settings: dict) -> bool:
    """为单个 PR 创建同步分支，返回是否成功"""
    upstream_name = pr["upstream_name"].lower().replace(" ", "-")
    pr_number = pr["pr_number"]
    branch = f"sync/{upstream_name}-{pr_number}"
    base = settings.get("base_branch", "main")

    # 检查是否已存在
    result = subprocess.run(
        ["git", "show-ref", "--verify", "--quiet", f"refs/heads/{branch}"],
        capture_output=True
    )
    if result.returncode == 0:
        print(f"   ⚠️  {branch} 已存在，跳过")
        return False

    try:
        # 从基准分支创建
        subprocess.run(
            ["git", "checkout", "-b", branch, f"origin/{base}"],
            check=True, capture_output=True
        )

        # 写入 checklist 文件
        checklist_path = Path(f".sync-checklist-{upstream_name}-{pr_number}.md")
        checklist_path.write_text(render_checklist(pr))
        subprocess.run(["git", "add", str(checklist_path)], check=True)
        subprocess.run(
            ["git", "commit", "-m",
             f"chore: add sync checklist for {upstream_name}#{pr_number}\n\n"
             f"upstream: {pr['upstream_url']}"],
            check=True
        )

        # 切回基准分支
        subprocess.run(["git", "checkout", base], check=True, capture_output=True)
        print(f"   ✅ {branch}")
        return True

    except subprocess.CalledProcessError as e:
        # 创建失败时切回基准分支，清理残留
        subprocess.run(["git", "checkout", base], capture_output=True)
        subprocess.run(["git", "branch", "-D", branch], capture_output=True)
        print(f"   ❌ {branch} 创建失败: {e}")
        return False


def batch_create_branches(results: list[dict], settings: dict):
    """主进程汇总后批量创建所有待同步 PR 的分支（Skip 除外）"""
    candidates = [
        pr for r in results
        for pr in r.get("prs", [])
        if pr["status"] == "pending"
    ]

    if not candidates:
        print("📭 无需自动创建同步分支")
        return

    print(f"\n🌿 自动创建同步分支（共 {len(candidates)} 个）")
    created, skipped, failed = 0, 0, 0

    for pr in sorted(candidates, key=lambda p: (p["priority"], p["pr_number"])):
        result = create_sync_branch(pr, settings)
        if result is True:   created += 1
        elif result is False: skipped += 1
        else:                 failed  += 1

    print(f"\n   创建 {created} 个 / 跳过 {skipped} 个（已存在）/ 失败 {failed} 个")
```

---

## Checklist 文件落地位置

Checklist 文件随分支创建时一并 commit 进去，文件名和分支名对应：

```
sync/ant-design-12345  分支
└── .sync-checklist-ant-design-12345.md   ← 随分支一起创建
```

加入 `.gitignore` 防止合并时带入主分支：

```bash
# Skill 初始化时自动写入
echo ".sync-checklist-*.md" >> .gitignore
```

这样 checklist 文件只在同步分支上存在，合并到 main 后自动消失，不污染主分支历史。

---

## 主进程最终输出摘要

所有分支创建完成后，主进程打印汇总：

```
════════════════════════════════════════════════
 同步分析完成
════════════════════════════════════════════════

 📊 发现 22 个待同步 PR
    🔴 P0:  1 个   🟠 P1:  4 个
    🟡 P2: 11 个   🟢 P3:  4 个   ⚪ Skip: 2 个

 🌿 已自动创建 5 个同步分支：
    ✅ sync/ant-design-12345        fix(Button): loading state
    ✅ sync/pro-components-8800     fix(Table): sort reset
    ✅ sync/ant-design-12300        fix(Select): dropdown z-index
    ⚠️  sync/ant-design-11900       已存在，跳过
    ✅ sync/ant-design-icons-560    feat: add new icons

 💾 同步状态已更新，建议执行：
    git add .sync-upstream.json && git commit -m "chore: sync state update"

════════════════════════════════════════════════
```

---

## 常用 git 操作

```bash
# 查看所有同步分支
git branch | grep "^  sync/"

# 查看某个同步分支的 checklist
git show sync/ant-design-12345:.sync-checklist-ant-design-12345.md

# 切换到某个同步分支开始工作
git checkout sync/ant-design-12345

# 同步分支完成后推送并开 PR
git push origin sync/ant-design-12345
# 然后在 GitHub/GitLab 上开 PR，目标分支填 main

# 批量删除已合并的同步分支
git branch --merged main | grep "sync/" | xargs git branch -d
```
