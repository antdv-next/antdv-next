---
name: antdv-next-create-pr
description: Create or prepare pull requests for antdv-next using this repository's official PR templates. Use this skill when the user says “PR” or “提交 PR”, asks to create/open/submit a PR, requests a PR title or body, or wants branch changes summarized for a PR. Trigger by PR-creation intent, including short colloquial requests; do not trigger for purely conceptual discussions about pull requests.
---

# antdv-next PR 创建规范

## 目标

一、基于当前分支相对基线分支的全部已提交改动生成 PR，不只看最后一个 commit。

二、严格使用 `antdv-next` 仓库自带的中英文模板，不自行发明 PR 结构。

三、PR 正文跟随用户语言习惯，PR 标题始终使用英文并符合仓库的 semantic title 校验。

四、真正执行推送或 `gh pr create` 前，必须先向用户展示 `base`、`title`、`body` 和验证结果，得到明确确认后才能创建 PR。

## 触发范围

按意图触发，不要求用户使用固定句式。

- 用户只发送“PR”或“提交 PR”时，必须触发本 skill，并将其理解为准备当前分支的 PR。
- “创建 PR”“提个 PR”“开 PR”“帮我写 PR”“生成 PR 描述”等表达均应触发。
- 用户只询问 PR 的概念、GitHub 功能或通用最佳实践时，不触发本仓库创建流程。

## 基本规则

### 使用仓库模板

始终读取并使用以下模板之一：

- 中文：`.github/PULL_REQUEST_TEMPLATE_CN.md`
- 英文：`.github/PULL_REQUEST_TEMPLATE.md`

不要修改 section 名称或删除主结构。填写时可删除 HTML 注释、引用式说明和占位文本，但必须保留最终提交所需的类型、Related Issues、Background and Solution、Change Log 等 section。

### 正文语言与标题语言

正文模板按以下顺序选择：

1. 当前请求主要为中文：使用中文模板。
2. 当前请求主要为英文：使用英文模板。
3. 当前请求很短或混合：沿用对话中的主要语言。
4. 仍无法判断且会实质影响结果时：再询问用户。

代码、分支名、commit message 或 issue 链接的语言不影响模板选择。无论正文使用哪种语言，PR 标题都必须是英文。

### 分析整个分支

创建草稿前必须检查：

- 当前分支和工作区状态；
- 目标仓库、远端和 tracking branch；
- 基线分支；
- `base..HEAD` 的 commit 列表；
- `base...HEAD` 的完整 diff 和统计。

工作区未提交内容不会进入远端 PR。若存在未提交改动，明确列出并提醒用户，不要把它们混入 PR 摘要，也不要擅自提交。

### 先草稿，后创建

即使用户说“直接创建”或“提交 PR”，也要先：

1. 生成 `base`、`title`、`body` 草稿；
2. 汇报已运行和未运行的验证；
3. 标出推断值、未确认信息与未提交改动；
4. 请求用户确认是否按该内容推送并创建。

只有用户确认当前草稿后，才能执行会改变远端状态的 `git push` 和 `gh pr create`。如果标题、类型、正文或 base 发生变化，更新草稿后再次确认。

### 信息不足时保持诚实

关联 issue、变动性质、验证方式或 base 无法可靠推断时，使用 `None`、`N/A` 或清晰的待确认标记，不得编造。若关键信息会改变目标分支或远端写入位置，必须等待用户确认。

## 执行流程

### 1. 检查仓库与 GitHub CLI

先执行只读检查：

```bash
git status --short
git branch --show-current
git branch -vv
git remote -v
gh auth status
gh repo view --json nameWithOwner,defaultBranchRef
```

若不在 Git 仓库、处于 detached HEAD、`gh` 不可用或未登录，应说明真实状态，不要伪造 PR 结果。

检查当前分支是否已有 PR，避免重复创建：

```bash
gh pr view --repo antdv-next/antdv-next --json url,title,baseRefName,headRefName,state
```

若已有 PR，先报告链接和状态；除非用户明确要求，否则不要再创建重复 PR。

### 2. 确定基线分支

不要只凭分支名称猜测。按以下顺序判断：

1. 用户明确指定的 base；
2. 当前分支的 checkout/reflog 来源与 merge-base；
3. tracking/upstream 线索；
4. 目标仓库默认分支。

本仓库模板约定 feature/bugfix 分支通常基于 `main`，目标仓库默认分支也通常是 `main`，但仍应通过真实 Git/GitHub 信息确认。

可使用：

```bash
git reflog show --date=local <current-branch>
git remote show origin
git merge-base HEAD <candidate-branch>
```

tracking branch 不是父分支的绝对证据，reflog 也可能不完整。不确定时在草稿中将 base 标为推断值。

### 3. 收集 PR 将包含的全部改动

至少执行：

```bash
git log --oneline <base>..HEAD
git diff --stat <base>...HEAD
git diff --name-status <base>...HEAD
git diff <base>...HEAD
```

必要时查看相关测试、文档、changeset 和配置文件。摘要必须覆盖整条分支，不得只复述最后一个 commit 或逐文件罗列。

如果 `base...HEAD` 没有改动，停止 PR 创建流程并说明原因。

### 4. 判断 PR 类型

以用户可感知的主要结果为准，优先选最贴近的一项；确实跨两类时可选两项，不要滥选。

- 组件新能力或公开 API：`feat` / `🆕 New feature`
- 组件缺陷、行为异常或样式 bug：`fix` / `🐞 Bug fix`
- 站点或说明文档：`docs` 或 `site` / `📝 Site / documentation improvement`
- 仅 demo：`demo` / `📽️ Demo improvement`
- CI、workflow、发布或校验流程：`ci` / `⏩ Workflow`
- 重构、测试、类型、性能、包体积、无障碍：使用对应的 `refactor`、`test`、`type`、`perf`、`build`、`a11y` 语义和模板选项。
- 普通维护且无更准确类型：`chore` / `❓ Other`

不要因为 diff 中存在逻辑代码就自动判为 `fix`，也不要因为代码量增加就自动判为 `feat`。

### 5. 选择并填写模板

读取对应语言模板后，整理：

- 变更类型：勾选主类型；
- Related Issues：使用 `close #123`、`fix #123`、`ref #123` 或 `None`；
- Background and Solution：概括问题背景、解决方式，以及 API/UI/交互影响；
- Change Log：描述对开发者或组件使用者的影响，而不是实现过程。

涉及 UI 或交互变化时，提醒用户补充截图或 GIF。更多示例见 [references/template-notes-and-examples.md](references/template-notes-and-examples.md)。

### 6. 生成英文 PR 标题

使用以下形式：

```text
<type>: <subject>
<type>(<scope>): <subject>
```

要求：

- subject 必须以小写字母开头，以满足 `.github/workflows/semantic-pull-requests.yml`；
- 使用英文概括整条分支的主要结果；
- 单一组件或明确模块才使用 scope，如 `fix(Select): keep dropdown position stable`；
- 避免 `update`、`fix issues`、`misc changes`、`some improvements` 等空泛表达；
- 不照搬单个 commit message。

常用 type：`feat`、`fix`、`docs`、`refactor`、`type`、`site`、`demo`、`test`、`ci`、`chore`、`perf`、`build`、`a11y`。

### 7. 按改动范围验证

优先运行最小但足以覆盖风险的检查，并如实记录结果。常用命令：

```bash
pnpm ci:lint
pnpm -F antdv-next test <relevant-test-file>
pnpm -F antdv-next test
pnpm -F antdv-next build
pnpm -F docs build
```

不要为了写 PR 草稿机械运行所有命令。不要使用会自动修复代码的 `pnpm lint` 作为只读验证；仓库级无修改校验使用 `pnpm ci:lint`。未运行的检查明确写为未运行，不得声称通过。

### 8. 展示草稿并请求确认

至少向用户展示：

- Target repository：应为 `antdv-next/antdv-next`；
- Head branch 与计划推送的 remote；
- Base branch；
- PR title；
- 完整 PR body；
- 验证结果；
- 未提交改动、推断值及待补充项。

明确说明这是准备提交的内容，并询问是否按此内容推送和创建 PR。没有明确确认，不执行远端写操作。

### 9. 推送并创建 PR

用户确认后，再次检查当前状态，防止草稿确认后分支发生变化：

```bash
git status --short
git branch --show-current
git branch -vv
git remote -v
gh repo view --repo antdv-next/antdv-next --json nameWithOwner,defaultBranchRef
```

要求：

1. 目标仓库必须明确为 `antdv-next/antdv-next`，不要依赖 `gh` 的当前仓库推断。
2. 明确哪个 remote 是用户 fork，以及要推送的 head branch。
3. remote 缺失、指向不清晰或不是预期 fork 时，先询问用户。
4. 不得擅自 force-push、创建 commit、改写历史或包含未确认的工作区改动。
5. 需要推送时使用明确 remote：`git push -u <fork-remote> HEAD`。
6. 使用用户确认的 base、title 和 body 创建 PR，并显式指定目标仓库。

推荐将确认后的正文写入安全的临时文件，再执行：

```bash
gh pr create \
  --repo antdv-next/antdv-next \
  --base <base> \
  --head <owner>:<branch> \
  --title "<title>" \
  --body-file <body-file>
```

创建成功后返回 PR 链接；失败时返回真实错误和已发生的状态变化，不要声称成功。

## Change Log 规则

当改动影响公开 API、组件使用方式、交互行为、视觉表现或发布内容时，填写实质 changelog，并同时提供英文和中文描述。

以下改动通常无需实质 changelog：

- `site`、`docs`、`demo`、`ci`；
- 纯测试；
- 内部维护或无外部可感知变化的重构。

这类情况仍保留模板 section，并填写 `No changelog required` / `无需更新日志`，不要编造用户影响。
