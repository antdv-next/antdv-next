# GitHub API 参考手册

## 认证

```http
Authorization: Bearer {GITHUB_TOKEN}
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2022-11-28
```

---

## 1. 获取从指定 commit 往后的所有提交

GitHub API 的 `/commits` 接口只支持从最新往前翻，所以需要客户端处理：

### 策略 A：获取全部后过滤（推荐，commit 数量 < 500 时）

```bash
# 获取所有 commit，直到找到 start_commit 为止
GET https://api.github.com/repos/{owner}/{repo}/commits
  ?sha=HEAD
  &per_page=100
  &page=1
```

客户端逻辑（伪代码）：
```python
commits = []
page = 1
while True:
    batch = api_get(f"/commits?per_page=100&page={page}")
    for commit in batch:
        if commit.sha.startswith(start_commit):
            return commits  # 找到起点，停止
        commits.append(commit)
    page += 1
    if len(batch) < 100:
        break  # 已到仓库末尾
return commits
```

### 策略 B：使用 compare API（推荐，精确高效）

```
GET https://api.github.com/repos/{owner}/{repo}/compare/{start_commit}...HEAD
```

返回字段：
```json
{
  "commits": [
    {
      "sha": "abc123",
      "commit": {
        "message": "fix(Button): loading state not cleared",
        "author": { "date": "2024-01-20T10:00:00Z" }
      },
      "html_url": "https://github.com/..."
    }
  ],
  "total_commits": 42
}
```

> ⚠️ compare API 最多返回 250 个 commit，超过时需要分段使用

---

## 2. 过滤 fix/feat commits

### Conventional Commits 正则匹配

```python
import re

CONVENTIONAL_PATTERN = re.compile(
    r'^(fix|feat|feature|bugfix|perf|revert)(\([^)]+\))?!?:\s+.+',
    re.IGNORECASE
)

PR_MERGE_PATTERN = re.compile(
    r'^Merge pull request #(\d+)',
    re.IGNORECASE
)

def is_sync_candidate(message: str) -> bool:
    first_line = message.split('\n')[0]
    return bool(
        CONVENTIONAL_PATTERN.match(first_line) or
        PR_MERGE_PATTERN.match(first_line)
    )
```

---

## 3. 查询 commit 关联的 PR

```
GET https://api.github.com/repos/{owner}/{repo}/commits/{commit_sha}/pulls
```

Headers 需要加：
```
Accept: application/vnd.github.groot-preview+json
```

返回 PR 列表（通常 0 或 1 个），取第一个。

---

## 4. 获取 PR 详情

```
GET https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}
```

重要字段：
```json
{
  "number": 12345,
  "title": "fix(Button): loading state not cleared after async",
  "body": "## Summary\n...",
  "labels": [{"name": "bug"}, {"name": "🐛 Bug"}],
  "html_url": "https://github.com/...",
  "merged_at": "2024-01-20T12:00:00Z",
  "user": {"login": "contributor"}
}
```

---

## 5. 获取 PR 文件变更列表

```
GET https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}/files
```

返回：
```json
[
  {
    "filename": "components/button/index.tsx",
    "status": "modified",
    "additions": 10,
    "deletions": 3
  }
]
```

用于推断影响的组件名。

---

## 6. 组件名推断规则

```python
import re

def extract_components(files: list[str]) -> list[str]:
    components = set()
    for f in files:
        # components/button/xxx -> Button
        m = re.match(r'components/([^/]+)/', f)
        if m:
            name = m.group(1)
            # 过滤非组件目录
            if name not in ('_util', 'style', '__tests__', 'locale'):
                components.add(name.replace('-', ' ').title().replace(' ', ''))
    return sorted(components)
```

---

## 7. 限流处理

```python
import time

def api_get_with_retry(url, headers, max_retries=3):
    for i in range(max_retries):
        resp = requests.get(url, headers=headers)
        if resp.status_code == 403:
            reset_time = int(resp.headers.get('X-RateLimit-Reset', 0))
            wait = reset_time - time.time() + 5
            print(f"限流，等待 {wait:.0f} 秒...")
            time.sleep(max(wait, 1))
            continue
        if resp.status_code == 200:
            # 检查剩余次数
            remaining = int(resp.headers.get('X-RateLimit-Remaining', 100))
            if remaining < 10:
                print(f"⚠️ API 剩余调用次数: {remaining}")
            return resp.json()
    raise Exception(f"API 请求失败: {url}")
```

---

## 8. 完整示例脚本

见 `../scripts/fetch_prs.py`（如需运行脚本版本）

---

## 常见问题

**Q: commit 没有关联 PR 怎么办？**
A: 直接用 commit message 作为条目，在表格中标注 `(no PR)` 并降低优先级。

**Q: PR 被 revert 了怎么办？**
A: 检查 PR 标题是否以 `Revert "..."` 开头，若是则标注 `⚪ Reverted`，跳过同步。

**Q: 同一个 bug 有多个 PR 修复怎么办？**
A: 只保留最终合并的那个；可以通过 PR body 中的 `Supersedes #xxx` 关键词识别。
