# 本地 Git 命令参考手册

适用于用户提供了本地仓库路径的场景，直接使用 `git` CLI，无需 GitHub API 或网络连接。

---

## 前置检查

> **变量说明**：本文档中 `$UPSTREAM_DIR` 为上游仓库路径（来自 `local_path` 或 auto-clone 的 tmp 路径），`$DOWNSTREAM_DIR` 为下游仓库路径（通常为 `./`）。

```bash
# 确认路径有效且是 git 仓库
git -C $UPSTREAM_DIR rev-parse --git-dir
git -C $DOWNSTREAM_DIR rev-parse --git-dir

# 确认起始 commit 存在
git -C $UPSTREAM_DIR cat-file -t <start_commit>
# 输出应为 "commit"
```

---

## 1. 获取从起始 commit 往后的所有提交

```bash
# 基础：从 start_commit 到 HEAD 的全部提交
git -C $UPSTREAM_DIR log <start_commit>..HEAD \
  --pretty=format:"%H|%h|%s|%ad|%an" \
  --date=short

# 只看 fix / feat 类型（conventional commits）
git -C $UPSTREAM_DIR log <start_commit>..HEAD \
  --pretty=format:"%H|%h|%s|%ad|%an" \
  --date=short \
  --extended-regexp \
  --grep="^(fix|feat|feature|perf|revert)(\(.+\))?!?:"

# 同时匹配 PR merge commit（GitHub 风格）
git -C $UPSTREAM_DIR log <start_commit>..HEAD \
  --pretty=format:"%H|%h|%s|%ad|%an" \
  --date=short \
  --extended-regexp \
  --grep="^(fix|feat|feature|perf|revert)(\(.+\))?!?:|^Merge pull request #"
```

输出示例：
```
a1b2c3d4e5f6|a1b2c3d|fix(Button): loading state not cleared|2024-03-01|contributor
```

---

## 2. 查看某次提交的完整信息

```bash
# 完整 commit 信息 + 文件统计
git -C $UPSTREAM_DIR show <sha> --stat

# 只看改动了哪些文件
git -C $UPSTREAM_DIR diff-tree --no-commit-id -r <sha> --name-only

# 查看具体 diff 内容
git -C $UPSTREAM_DIR show <sha> -- components/button/index.tsx
```

---

## 3. 从 commit message 提取 PR 编号

GitHub merge commit 格式为 `Merge pull request #123 from branch`，可用以下命令提取：

```bash
git -C $UPSTREAM_DIR log <start_commit>..HEAD \
  --pretty=format:"%H %s" \
  --extended-regexp \
  --grep="Merge pull request #" \
| grep -oP "#\d+"
```

对于 squash merge，PR 编号通常在 commit message 末尾：
```
fix(Button): loading state not cleared (#12345)
```

```bash
# 提取括号内的 PR 编号
echo "fix(Button): loading state not cleared (#12345)" \
| grep -oP "\(#\d+\)" | grep -oP "\d+"
```

---

## 4. 推断涉及的组件

```bash
# 获取某 commit 改动的文件列表，过滤出组件路径
git -C $UPSTREAM_DIR diff-tree --no-commit-id -r <sha> --name-only \
| grep "^components/" \
| sed 's|components/\([^/]*\)/.*|\1|' \
| sort -u
```

排除非组件目录：
```bash
| grep -vE "^(_util|style|locale|theme|__tests__)$"
```

---

## 5. 检查下游仓库是否已同步某个 PR

```bash
# 在下游 commit message 中搜索上游 PR 编号
git -C $DOWNSTREAM_DIR log --oneline \
| grep -i "#12345\|ant-design.*12345\|sync.*12345"

# 更宽泛的搜索（搜索关键词）
git -C $DOWNSTREAM_DIR log --oneline --grep="12345"
```

若搜索无结果，则该 PR **尚未同步**，状态标记为 `⬜ 待同步`。

---

## 6. 对比两个仓库的文件差异

```bash
# 对比上游某组件文件与下游对应文件的差异
diff \
  <(git -C $UPSTREAM_DIR show HEAD:components/button/index.tsx) \
  <(git -C $DOWNSTREAM_DIR show HEAD:components/button/index.vue)

# 使用 git diff 风格输出
git diff \
  --no-index \
  $UPSTREAM_DIR/components/button/index.tsx \
  $DOWNSTREAM_DIR/components/button/index.vue
```

---

## 7. 批量处理：生成完整的待同步清单

```bash
#!/bin/bash
UPSTREAM=$UPSTREAM_DIR  # 从 local_path 或 auto-clone tmp 路径读取
START_COMMIT=abc123

git -C "$UPSTREAM" log "${START_COMMIT}..HEAD" \
  --pretty=format:"%h|%s|%ad" \
  --date=short \
  --extended-regexp \
  --grep="^(fix|feat|feature|perf)(\(.+\))?!?:|Merge pull request #" \
| while IFS='|' read -r sha subject date; do
    # 提取组件名
    components=$(git -C "$UPSTREAM" diff-tree --no-commit-id -r "$sha" --name-only \
      | grep "^components/" \
      | sed 's|components/\([^/]*\)/.*|\1|' \
      | grep -vE "^(_util|style|locale)$" \
      | sort -u | tr '\n' ',' | sed 's/,$//')
    
    echo "$sha | $date | $subject | ${components:-unknown}"
done
```

---

## 8. 常见问题

**Q: 起始 commit 是浅克隆（shallow）找不到怎么办？**
```bash
git -C $UPSTREAM_DIR fetch --unshallow
```

**Q: 想按时间范围而不是 commit 范围筛选？**
```bash
git -C $UPSTREAM_DIR log \
  --after="2024-01-01" --before="2024-06-01" \
  --pretty=format:"%h|%s|%ad" --date=short \
  --extended-regexp \
  --grep="^(fix|feat)(\(.+\))?!?:"
```

**Q: 下游仓库用的不是 GitHub PR 格式，怎么追踪同步状态？**

在 commit message 中约定格式，例如：
```
[sync] fix(Button): loading (#upstream-12345)
```
然后用：
```bash
git -C /downstream log --grep="\[sync\]" --oneline
```
