# 临时仓库克隆管理

当用户没有上游仓库的本地副本时，Skill 自动将其克隆到系统临时目录，
用完即删，不留缓存。支持 GitHub / GitLab / Gitea / Bitbucket / 自建 Git 任意平台。

---

## 工作流概览

```
读取 .sync-upstream.json
        ↓
local_path 存在且有效？
   ├── Yes → 直接使用本地仓库（最快）
   └── No  → 使用 remote_url 自动克隆
                  ↓
            克隆到 /tmp/sync-upstream-{name}-{timestamp}/
                  ↓
            执行分析（git log / diff-tree ...）
                  ↓
            分析完成 → rm -rf 临时目录
```

---

## Step A：确定临时目录路径

```bash
UPSTREAM_NAME="ant-design"
TMP_DIR="/tmp/sync-upstream-${UPSTREAM_NAME}-$(date +%s)"

echo "临时目录: $TMP_DIR"
```

---

## Step B：克隆仓库

### 标准浅克隆（推荐，只需最近历史）

```bash
REMOTE_URL="https://github.com/ant-design/ant-design.git"
LAST_COMMIT="a1b2c3d4e5f6"  # 从 .sync-upstream.json 读取

# 浅克隆，深度足够覆盖上次同步到现在的提交即可
# --filter=blob:none 只下载 commit/tree 元数据，不下载文件内容（速度极快）
git clone \
  --filter=blob:none \
  --no-checkout \
  --single-branch \
  "$REMOTE_URL" \
  "$TMP_DIR"

echo "✅ 克隆完成: $TMP_DIR"
```

### 私有仓库（带认证）

```bash
# 方式1：URL 内嵌 token（GitLab/Gitea 常用）
git clone "https://oauth2:${TOKEN}@gitlab.example.com/org/repo.git" "$TMP_DIR"

# 方式2：使用 SSH（需要 SSH key 已配置）
git clone "git@github.com:ant-design/ant-design.git" "$TMP_DIR"

# 方式3：临时 credential helper（不污染全局 git 配置）
GIT_ASKPASS=/dev/null GIT_TERMINAL_PROMPT=0 \
git -c "credential.helper=store --file=/tmp/git-creds-$$" \
clone "$REMOTE_URL" "$TMP_DIR"
```

### 验证克隆结果

```bash
if [ -d "$TMP_DIR/.git" ]; then
    echo "✅ 克隆成功"
    git -C "$TMP_DIR" log --oneline -3  # 展示最新3条确认正常
else
    echo "❌ 克隆失败，请检查 remote_url 和网络"
    exit 1
fi
```

---

## Step C：验证 last_synced_commit 是否存在

```bash
if git -C "$TMP_DIR" cat-file -t "$LAST_COMMIT" 2>/dev/null | grep -q "commit"; then
    echo "✅ 起始 commit 存在，开始分析"
else
    echo "⚠️ 起始 commit $LAST_COMMIT 不在此仓库中"
    echo "   可能原因：浅克隆深度不够，尝试 --unshallow 或重新指定起点"
    # 回退方案：从最近100个 commit 开始
    FALLBACK=$(git -C "$TMP_DIR" log --oneline -100 | tail -1 | awk '{print $1}')
    echo "   建议使用回退起点: $FALLBACK"
fi
```

---

## Step D：执行分析

克隆完成后，`$TMP_DIR` 就是一个普通的 git 仓库，
所有 `references/local-git.md` 中的命令均可直接使用，
只需将路径替换为 `$TMP_DIR`：

```bash
# 获取 fix/feat commit 列表
git -C "$TMP_DIR" log "${LAST_COMMIT}..HEAD" \
  --pretty=format:"%H|%h|%s|%ad|%an" \
  --date=short \
  --extended-regexp \
  --grep="^(fix|feat|feature|perf|revert)(\(.+\))?!?:|^Merge pull request #"

# 获取某 commit 的改动文件
git -C "$TMP_DIR" diff-tree --no-commit-id -r <sha> --name-only
```

---

## Step E：清理临时目录（必须执行）

```bash
cleanup() {
    if [ -d "$TMP_DIR" ]; then
        rm -rf "$TMP_DIR"
        echo "🧹 已清理临时目录: $TMP_DIR"
    fi
}

# 注册退出钩子，确保异常退出时也能清理
trap cleanup EXIT

# 或者分析完成后手动调用
cleanup
```

---

## 完整封装脚本

```bash
#!/bin/bash
# sync-clone.sh - 自动克隆、分析、清理

set -e

# 在下游仓库根目录执行
UPSTREAM_NAME="${2:-}"   # 指定上游名称（多上游时用）

# ── 读取配置 ──────────────────────────────────────────
CONFIG=".sync-upstream.json"
if [ ! -f "$CONFIG" ]; then
    echo "❌ 未找到 .sync-upstream.json，请先初始化"
    exit 1
fi

read_config() {
    python3 -c "
import json, sys
with open('.sync-upstream.json') as f:
    d = json.load(f)
upstreams = d['upstreams']
name = '$UPSTREAM_NAME'
u = next((x for x in upstreams if not name or x['name'] == name), upstreams[0])
print(u.get('remote_url', ''))
print(u.get('local_path') or '')
print(u.get('last_synced_commit', ''))
print(u.get('name', 'upstream'))
"
}

IFS=$'\n' read -r REMOTE_URL LOCAL_PATH LAST_COMMIT UNAME <<< "$(read_config)"

# ── 选择数据源 ─────────────────────────────────────────
if [ -n "$LOCAL_PATH" ] && [ -d "$LOCAL_PATH/.git" ]; then
    echo "📂 使用本地仓库: $LOCAL_PATH"
    REPO_DIR="$LOCAL_PATH"
    CLEANUP=false
elif [ -n "$REMOTE_URL" ]; then
    echo "🌐 本地仓库不可用，从远程克隆: $REMOTE_URL"
    TMP_DIR="/tmp/sync-upstream-${UNAME}-$(date +%s)"
    git clone --filter=blob:none --no-checkout --single-branch "$REMOTE_URL" "$TMP_DIR"
    REPO_DIR="$TMP_DIR"
    CLEANUP=true
    trap 'rm -rf "$TMP_DIR"; echo "🧹 已清理 $TMP_DIR"' EXIT
else
    echo "❌ 既无 local_path 也无 remote_url，请检查 .sync-upstream.json"
    exit 1
fi

# ── 验证起始 commit ────────────────────────────────────
if ! git -C "$REPO_DIR" cat-file -t "$LAST_COMMIT" 2>/dev/null | grep -q "commit"; then
    echo "⚠️ 起始 commit $LAST_COMMIT 未找到，将从全量历史分析"
    LAST_COMMIT=""
fi

# ── 执行分析 ───────────────────────────────────────────
RANGE="${LAST_COMMIT:+${LAST_COMMIT}..}HEAD"
echo "📊 分析范围: $RANGE"

git -C "$REPO_DIR" log $RANGE \
  --pretty=format:"%H|%h|%s|%ad|%an" \
  --date=short \
  --extended-regexp \
  --grep="^(fix|feat|feature|perf|revert)(\(.+\))?!?:|^Merge pull request #"

# ── 清理由 trap 自动处理 ───────────────────────────────
```

---

## 支持的 Remote URL 格式

| 平台 | URL 示例 |
|------|---------|
| GitHub | `https://github.com/ant-design/ant-design.git` |
| GitHub SSH | `git@github.com:ant-design/ant-design.git` |
| GitLab | `https://gitlab.com/group/project.git` |
| GitLab 自建 | `https://git.company.com/group/repo.git` |
| Gitea | `https://gitea.example.com/owner/repo.git` |
| Bitbucket | `https://bitbucket.org/workspace/repo.git` |
| 私有（token） | `https://oauth2:TOKEN@gitlab.example.com/org/repo.git` |

---

## 注意事项

- `--filter=blob:none` 只下载元数据，**不下载文件内容**，速度快，适合只需要 commit log 的场景
- 如果需要查看文件内容（如 `git show <sha> -- file`），git 会按需下载对应 blob，仍很快
- 临时目录使用时间戳命名，并发执行时不会冲突
- `trap ... EXIT` 确保脚本异常中断时也会清理，不留垃圾文件
- 私有仓库 token 不要硬编码，通过环境变量传入：`SYNC_TOKEN=xxx bash sync-clone.sh`
