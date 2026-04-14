# 同步状态文件参考：.sync-upstream.json

下游仓库根目录下的 `.sync-upstream.json` 记录了与上游仓库的同步进度，
是实现"继续同步"功能的核心，支持同时追踪多个上游仓库。

---

## 文件格式

### 单包仓库对应 monorepo 子包（典型场景）

```json
{
  "version": "1",
  "downstream": {
    "name": "antdv-next",
    "local_path": "/path/to/antdv-next"
  },
  "upstreams": [
    {
      "name": "ant-design",
      "remote_url": "https://github.com/ant-design/ant-design.git",
      "local_path": null,
      "packages": [
        {
          "upstream_path": ".",
          "downstream_path": "packages/components",
          "description": "核心组件库"
        }
      ],
      "last_synced_commit": "a1b2c3d4e5f6",
      "last_synced_commit_short": "a1b2c3d",
      "last_synced_at": "2024-03-01T12:00:00Z",
      "last_synced_tag": "v5.15.0",
      "sync_count": 3
    },
    {
      "name": "ant-design-icons",
      "remote_url": "https://github.com/ant-design/ant-design-icons.git",
      "local_path": null,
      "packages": [
        {
          "upstream_path": "packages/icons-vue",
          "downstream_path": "packages/icons",
          "description": "图标库 Vue3 子包"
        }
      ],
      "last_synced_commit": "b2c3d4e5f6a7",
      "last_synced_commit_short": "b2c3d4e",
      "last_synced_at": "2024-02-15T08:00:00Z",
      "last_synced_tag": "v5.3.0",
      "sync_count": 1
    },
    {
      "name": "pro-components",
      "remote_url": "https://github.com/ant-design/pro-components.git",
      "local_path": null,
      "packages": [
        {
          "upstream_path": "packages/table",
          "downstream_path": "packages/pro-table",
          "description": "ProTable"
        },
        {
          "upstream_path": "packages/form",
          "downstream_path": "packages/pro-form",
          "description": "ProForm"
        }
      ],
      "last_synced_commit": "c3d4e5f6a7b8",
      "last_synced_commit_short": "c3d4e5f",
      "last_synced_at": "2024-02-01T00:00:00Z",
      "last_synced_tag": "v2.6.0",
      "sync_count": 2
    }
  ]
}
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `version` | 是 | 文件格式版本，当前为 `"1"` |
| `downstream.name` | 否 | 下游仓库名称，便于显示 |
| `downstream.local_path` | 否 | 下游仓库根目录路径 |
| `upstreams[].name` | 是 | 上游仓库名称（唯一标识） |
| `upstreams[].remote_url` | 条件必填 | 上游 Git remote 地址，支持任意平台。`local_path` 为 null 时必填 |
| `upstreams[].local_path` | 条件必填 | 上游仓库本地路径，有本地副本时填写，优先于 remote_url，无则填 `null` |
| `upstreams[].packages` | 否 | 路径映射表，描述上游路径到下游 monorepo 子包路径的对应关系（见下） |
| `upstreams[].last_synced_commit` | 是 | 上次分析到的上游 commit 完整 SHA |
| `upstreams[].last_synced_commit_short` | 否 | SHA 短版本（7位） |
| `upstreams[].last_synced_at` | 是 | 上次同步时间（ISO 8601 UTC） |
| `upstreams[].last_synced_tag` | 否 | 上次同步时对应的 tag |
| `upstreams[].sync_count` | 否 | 累计同步次数 |

### packages 路径映射字段

| 字段 | 必填 | 说明 |
|------|------|------|
| `upstream_path` | 是 | 上游仓库中的路径，`.` 表示整个仓库根目录 |
| `downstream_path` | 是 | 下游 monorepo 中对应的子包路径（相对于仓库根目录） |
| `description` | 否 | 说明这个映射的用途 |

> **`packages` 字段的作用**：分析 PR 时，Skill 会根据 commit 改动的文件路径，结合 `packages` 映射，判断该变更影响下游 monorepo 中的哪个子包，并在输出表格中标注。若不填，则只显示上游路径，不做映射。

**数据源优先级**：`local_path`（本地仓库）> 自动克隆 `remote_url` 到 tmp > GitHub API

---

## 读取操作

### 检查文件是否存在

```bash
DOWNSTREAM=/path/to/downstream

if [ -f "$DOWNSTREAM/.sync-upstream.json" ]; then
    echo "✅ 找到同步记录"
    cat "$DOWNSTREAM/.sync-upstream.json"
else
    echo "⚠️ 首次使用，需要初始化"
fi
```

### 读取上次同步的 commit（bash）

```bash
LAST_COMMIT=$(cat "$DOWNSTREAM/.sync-upstream.json" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['upstreams'][0]['last_synced_commit'])")

echo "上次同步到: $LAST_COMMIT"
```

### 读取指定上游的同步记录（多上游场景）

```bash
# 读取名为 "ant-design" 的上游记录
UPSTREAM_NAME="ant-design"
LAST_COMMIT=$(cat "$DOWNSTREAM/.sync-upstream.json" \
  | python3 -c "
import sys, json
d = json.load(sys.stdin)
upstream = next((u for u in d['upstreams'] if u['name'] == '$UPSTREAM_NAME'), None)
if upstream:
    print(upstream['last_synced_commit'])
else:
    print('NOT_FOUND')
")
```

---

## 写入操作

### 初始化文件（首次使用）

```bash
DOWNSTREAM=/path/to/downstream
UPSTREAM_LOCAL=/path/to/ant-design
UPSTREAM_REPO="ant-design/ant-design"
START_COMMIT="a1b2c3d4e5f6"

# 获取当前上游 HEAD
LATEST=$(git -C "$UPSTREAM_LOCAL" rev-parse HEAD)
LATEST_SHORT=$(git -C "$UPSTREAM_LOCAL" rev-parse --short HEAD)
LATEST_TAG=$(git -C "$UPSTREAM_LOCAL" describe --tags --abbrev=0 2>/dev/null || echo "")
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat > "$DOWNSTREAM/.sync-upstream.json" << JSON
{
  "version": "1",
  "downstream": {
    "name": "$(basename $DOWNSTREAM)",
    "local_path": "$DOWNSTREAM"
  },
  "upstreams": [
    {
      "name": "ant-design",
      "repo": "$UPSTREAM_REPO",
      "local_path": "$UPSTREAM_LOCAL",
      "last_synced_commit": "$LATEST",
      "last_synced_commit_short": "$LATEST_SHORT",
      "last_synced_at": "$NOW",
      "last_synced_tag": "$LATEST_TAG",
      "sync_count": 1
    }
  ]
}
JSON

echo "✅ 已创建 .sync-upstream.json"
```

### 更新文件（每次同步后）

```bash
DOWNSTREAM=/path/to/downstream
UPSTREAM_LOCAL=/path/to/ant-design
UPSTREAM_NAME="ant-design"

LATEST=$(git -C "$UPSTREAM_LOCAL" rev-parse HEAD)
LATEST_SHORT=$(git -C "$UPSTREAM_LOCAL" rev-parse --short HEAD)
LATEST_TAG=$(git -C "$UPSTREAM_LOCAL" describe --tags --abbrev=0 2>/dev/null || echo "")
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

python3 - << PYEOF
import json, sys

path = "$DOWNSTREAM/.sync-upstream.json"
with open(path, 'r') as f:
    data = json.load(f)

# 找到对应的上游记录并更新
for upstream in data['upstreams']:
    if upstream['name'] == '$UPSTREAM_NAME':
        upstream['last_synced_commit'] = '$LATEST'
        upstream['last_synced_commit_short'] = '$LATEST_SHORT'
        upstream['last_synced_at'] = '$NOW'
        upstream['last_synced_tag'] = '$LATEST_TAG'
        upstream['sync_count'] = upstream.get('sync_count', 0) + 1
        break

with open(path, 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ 同步状态已更新")
PYEOF
```

### 添加新的上游记录（多上游扩展）

```bash
python3 - << PYEOF
import json

path = "$DOWNSTREAM/.sync-upstream.json"
with open(path, 'r') as f:
    data = json.load(f)

new_upstream = {
    "name": "new-upstream",
    "repo": "owner/new-upstream",
    "local_path": "/path/to/new-upstream",
    "last_synced_commit": "$LATEST",
    "last_synced_commit_short": "$LATEST_SHORT",
    "last_synced_at": "$NOW",
    "last_synced_tag": "",
    "sync_count": 0
}

# 避免重复添加
names = [u['name'] for u in data['upstreams']]
if new_upstream['name'] not in names:
    data['upstreams'].append(new_upstream)

with open(path, 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
PYEOF
```

---

## 建议的 Git 管理方式

### 加入版本控制（推荐）

```bash
# 加入 git 追踪，让团队共享同步进度
git -C "$DOWNSTREAM" add .sync-upstream.json
git -C "$DOWNSTREAM" commit -m "chore: update upstream sync state to $LATEST_SHORT"
```

这样团队成员 pull 之后就能看到最新的同步起点，不会重复同步。

### 加入 .gitignore（不推荐，但如需本地独立管理）

```bash
echo ".sync-upstream.json" >> "$DOWNSTREAM/.gitignore"
```

---

## 用户体验提示语模板

**首次初始化后**：
> ✅ 已在下游仓库创建 `.sync-upstream.json`，记录了本次同步起点。
> 下次只需说**"继续同步"**，无需再提供 commit SHA 或仓库地址。

**续传同步时**：
> 📖 读取到同步记录：上次同步到 `{short_sha}`（{date}，{tag}）
> 正在从该点往后分析新的 fix/feat...

**更新后**：
> ✅ 同步状态已更新至 `{new_short_sha}`（{new_tag}），建议 commit 这个文件以共享团队进度。

---

## 常见问题

**Q: commit SHA 过期了（上游 rebase/force push）怎么办？**

```bash
# 验证 commit 是否还存在
git -C /path/to/upstream cat-file -t <last_synced_commit>
# 若输出不是 "commit"，说明已失效，需要用户重新指定起点
```

**Q: 文件内容损坏或格式错误怎么办？**

```bash
# 验证 JSON 格式
python3 -m json.tool "$DOWNSTREAM/.sync-upstream.json"
# 若报错，提示用户手动修复或删除文件重新初始化
```

**Q: 多人协作时 commit 冲突怎么处理？**

建议在更新 `.sync-upstream.json` 时，先 `git pull` 再更新，
或者约定由负责同步的人统一更新该文件。
