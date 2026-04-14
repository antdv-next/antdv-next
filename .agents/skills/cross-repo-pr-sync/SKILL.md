---
name: cross-repo-pr-sync
description: >
  跨仓库 PR 同步追踪技能。当用户需要追踪一个上游仓库（如 ant-design）的 fix/feature
  变更，并同步到下游移植仓库（如 antdv-next）时使用此技能。
  触发场景：用户给出一个起始 commit SHA，需要列出从该 commit 往后所有需要同步的 PR，
  并生成带优先级排序的同步表格和 checklist 模板。
  也适用于：两个仓库之间的变更追踪、上下游组件库同步分析、跨框架移植任务管理。
  如果用户提到"同步上游"、"追踪 PR"、"从某个 commit 开始"、"移植 fix"、"同步 issue"
  等关键词，务必使用此技能。
  特别地：若用户只说"同步仓库"、"继续同步"、"sync"，应优先读取下游仓库根目录的
  .sync-upstream.json 文件，从中获取上次同步位置，无需用户再次提供任何参数。
---

# Cross-Repo PR Sync Tracker

## 概述

本技能用于分析上游仓库（如 ant-design React 版）从某个 commit 起的所有变更，
筛选出需要同步到下游移植仓库（如 antdv-next Vue3 版）的 PR，
输出带优先级的同步表格和每个 PR 对应的 checklist 模板。

---

## Step 0：读取同步状态（优先执行）

在做任何事之前，先检查下游仓库根目录是否存在 `.sync-upstream.json`：

```bash
cat /path/to/downstream/.sync-upstream.json
```

### 情况 A：文件存在 ✅

读取上次同步位置，**无需用户再次提供任何参数**，然后按以下优先级确定数据源：

| 优先级 | 条件 | 行为 |
|--------|------|------|
| 1️⃣ 最优 | `local_path` 有效且目录存在 | 直接使用本地仓库 |
| 2️⃣ 自动 | `local_path` 为空或不存在，有 `remote_url` | 克隆到 tmp，用完删除 |
| 3️⃣ 兜底 | 仅有 `repo` 字段（GitHub） | 使用 GitHub API |

**当触发自动克隆时**，告知用户：
> 🌐 本地仓库不可用，正在从 `{remote_url}` 克隆到临时目录，分析完成后自动清理...

**正常续传时**，告知用户：
> 📖 读取到同步记录，上次同步到 `a1b2c3d`（2024-03-01），继续从该点往后分析...

> 克隆和清理的完整流程见 `references/tmp-clone.md`

### 情况 B：文件不存在 ⚠️

首次使用，询问用户以下信息，然后**创建**该文件：

| 需要询问 | 说明 |
|---------|------|
| 上游仓库地址 | 本地路径 或 GitHub `owner/repo` |
| 起始 commit SHA | 从哪个版本开始往后追踪 |
| 上游仓库名称（可选） | 用于显示，默认取路径最后一段 |

> 详见 `references/sync-state.md` 了解文件格式和读写操作

---

## 前置准备

### 模式判断（优先检查）

**根据用户提供的内容自动选择模式**：

| 用户提供 | 使用模式 |
|---------|---------|
| 本地仓库路径（`/home/...`、`~/...`、`./...`） | 🖥️ **Local 模式**（git CLI，最快） |
| 任意 Git remote URL（GitHub/GitLab/Gitea/自建） | 🔄 **Auto-clone 模式**（克隆到 tmp，用完删除） |
| 仅 GitHub `owner/repo` 名称 | 🌐 **Remote 模式**（GitHub API，兜底方案） |

**优先级**：Local > Auto-clone > Remote API

> Auto-clone 支持所有 Git 平台，只需提供一次 URL 写入 `.sync-upstream.json`，后续自动处理。详见 `references/tmp-clone.md`。

---

### 参数清单

| 参数 | Local 模式 | Auto-clone 模式 | Remote API 模式 |
|------|-----------|----------------|----------------|
| 上游仓库 | 本地路径 | 任意 Git URL | `owner/repo` |
| 下游仓库 | 本地路径 | 本地路径 | `owner/repo` |
| `start_commit` | commit SHA | commit SHA | commit SHA |
| `github_token` | 不需要 | 不需要 | 可选，推荐 |
| `max_prs` | 默认 50 | 默认 50 | 默认 50 |

首次使用时 Skill 会将上游 URL 写入 `.sync-upstream.json`，后续无需再次提供。

如用户未提供起始 commit，**先检查 Step 0 是否已从 `.sync-upstream.json` 读到**，若无则询问用户。

---

## Step 1：获取 Commit 列表

### 🖥️ Local 模式（推荐）

```bash
git -C /path/to/upstream log <start_commit>..HEAD \
  --pretty=format:"%H|%h|%s|%ad|%an" \
  --date=short \
  --extended-regexp \
  --grep="^(fix|feat|feature|perf|revert)(\(.+\))?!?:|^Merge pull request #"
```

> 完整命令和批量脚本见 `references/local-git.md` → Section 1 & 7

### 🌐 Remote 模式

通过 GitHub API 获取从 `start_commit` 往后的所有提交：

```
GET https://api.github.com/repos/{upstream_repo}/commits
  ?sha=HEAD          # 从最新往前，需要客户端过滤
  &per_page=100
```

**过滤策略**：
- 只保留 `type` 为 `fix` 或 `feat` 的 conventional commits
- commit message 模式匹配：
  - `fix(component): ...`
  - `feat(component): ...`
  - `fix: ...` / `feature: ...`
  - PR 合并提交：`Merge pull request #xxx`

> 详见 `references/github-api.md` 中的 API 调用示例和分页处理

---

## Step 2：关联 PR 信息 & 检查同步状态

### 🖥️ Local 模式

从 commit message 中提取 PR 编号，并检查下游是否已同步：

```bash
# 检查下游是否已同步某个 PR
git -C /path/to/downstream log --oneline --grep="12345"
```

> 详见 `references/local-git.md` → Section 3 & 5

### 🌐 Remote 模式

对每个 commit，通过以下方式关联 PR：

```
GET https://api.github.com/repos/{upstream_repo}/commits/{sha}/pulls
```

从 PR 中提取：
- PR 编号、标题、URL
- Labels（标签，用于判断优先级）
- 涉及的文件路径（推断影响的组件）
- PR body 中的关联 issue
- 合并时间

---

## Step 3：分析影响范围

### 3.1 获取 commit 改动文件列表

**🖥️ Local / Auto-clone 模式**：
```bash
git -C /path/to/upstream diff-tree --no-commit-id -r <sha> --name-only
```

**🌐 Remote 模式**：`GET /repos/{owner}/{repo}/pulls/{number}/files`

---

### 3.2 路径映射：上游文件 → 下游子包

读取 `.sync-upstream.json` 中该上游的 `packages` 映射表，将上游改动文件路径转换为下游 monorepo 的子包路径。

**映射逻辑**：

```
upstream 改动文件路径
        ↓
匹配 packages[].upstream_path 前缀
        ↓
替换为 packages[].downstream_path
        ↓
输出：下游子包 + 组件名
```

**示例**（pro-components → antdv-next monorepo）：

```
上游改动文件                          packages 映射                    下游定位
─────────────────────────────────────────────────────────────────────────────
packages/table/src/Table.tsx    →  upstream: packages/table      →  packages/pro-table / Table
                                   downstream: packages/pro-table
packages/form/src/Form.tsx      →  upstream: packages/form       →  packages/pro-form / Form
                                   downstream: packages/pro-form
components/button/index.tsx     →  upstream: .                   →  packages/components / Button
                                   downstream: packages/components
site/docs/intro.md              →  (无匹配，标记为文档，P3)
```

**无 `packages` 字段时**（上游是单包仓库，下游也是单包）：
- 直接按 `components/{name}/` 规则推断组件名，不做路径转换

---

### 3.3 组件名推断

路径确定后，从子路径中提取组件名：
- `components/{name}/` → `{Name}`（首字母大写）
- `src/{Name}.tsx` → `{Name}`
- `site/` / `docs/` → 文档类，优先级自动降低
- `scripts/` / `.github/` / `__tests__/` only → 跳过或 P3

> 详见 `references/local-git.md` → Section 4

---

## Step 4：评估同步优先级

按以下规则自动评分，生成优先级：

### 优先级规则表

| 优先级 | 标记 | 判断条件 |
|--------|------|---------|
| P0 紧急 | 🔴 | Labels 含 `Security`；标题含 `crash`/`security`/`XSS`/`data loss` |
| P1 高 | 🟠 | Bug fix 影响核心组件（Button/Form/Table/Select/Input）；Labels 含 `bug`+`important` |
| P2 中 | 🟡 | 普通 bug fix；功能增强；体验优化；Labels 含 `feat` |
| P3 低 | 🟢 | 文档更新；样式微调；废弃警告；TypeScript 类型修复 |
| Skip | ⚪ | 仅 React 特有（如 `ReactNode`、`React.forwardRef` 特有改动）；SSR 专属；测试文件 only |

### 同步难度评估

| 难度 | 判断条件 |
|------|---------|
| Low | 纯逻辑/样式修复，无 JSX 特有写法 |
| Medium | 需要 React→Vue3 语法转换（props/emit/slots） |
| High | 涉及 Hooks 深度改造、Context API、React 特有生命周期 |

---

## Step 5：输出格式

### 5.1 汇总表格

输出 Markdown 表格，按优先级从高到低排列：

```markdown
## 📋 同步 PR 汇总表

> 上游仓库: ant-design/ant-design
> 分析起点: commit `a1b2c3d` (2024-01-15)
> 分析范围: 从起点到最新，共 X 个 fix/feat PR
> 生成时间: YYYY-MM-DD

| 优先级 | 上游仓库 | PR # | 类型 | 标题 | 上游路径 → 下游子包 | 涉及组件 | 同步难度 | 状态 | 链接 |
|--------|---------|------|------|------|-------------------|---------|---------|------|------|
| 🔴 P0 | ant-design | #12345 | fix | fix: Button crash | `.` → `packages/components` | Button | Low | ⬜ | [链接] |
| 🟠 P1 | pro-components | #8800 | fix | fix: ProTable sort bug | `packages/table` → `packages/pro-table` | ProTable | Medium | ⬜ | [链接] |
| 🟡 P2 | ant-design | #12280 | feat | feat: Input clearIcon | `.` → `packages/components` | Input | Low | ⬜ | [链接] |
| 🟡 P2 | ant-design-icons | #560 | feat | feat: add new icons | `packages/icons-vue` → `packages/icons` | - | Low | ⬜ | [链接] |
| 🟢 P3 | ant-design | #12200 | docs | docs: Form examples | `.` → `packages/components` | Form | - | ⬜ | [链接] |
| ⚪ Skip | ant-design | #12100 | fix | fix: SSR hydration | - | - | - | 跳过 | [链接] |
```

状态值：`⬜ 待同步` / `🔄 进行中` / `✅ 已完成` / `❌ 不适用`

> 多上游时，表格按优先级统一排序，上游仓库列便于快速识别来源。

### 5.2 逐 PR Checklist 模板

对每个**非 Skip**的 PR，生成以下模板：

```markdown
---

## ✅ 同步任务：#{PR编号} - {PR标题}

**优先级**: {🔴/🟠/🟡/🟢} {P0/P1/P2/P3}
**类型**: {fix/feat/docs}
**上游 PR**: https://github.com/{upstream_repo}/pull/{编号}
**上游 Commit**: `{sha}`
**涉及组件**: {组件名}
**同步难度**: {Low/Medium/High}
**关联 Issue**: {issue 链接，若有}

### 📖 变更摘要
{PR body 或 commit message 的简要总结}

### 🔍 Pre-sync 分析
- [ ] 阅读上游 PR 完整内容和 review 评论
- [ ] 确认 antdv-next 中是否存在相同问题/缺失相同功能
- [ ] 查看上游变更的文件列表，评估 Vue3 适配工作量
- [ ] 检查是否有相关联的其他 PR 需要一起同步

### 🛠️ 实现步骤
- [ ] 创建功能分支：`sync/ant-design-#{PR编号}`
- [ ] 实现对应的 fix/feat（参考上游代码逻辑）
- [ ] 处理 React→Vue3 差异（见下方注意事项）
- [ ] 编写/更新单元测试
- [ ] 更新组件文档（若有 API 变更）
- [ ] 本地运行测试套件确认无回归

### ⚠️ React→Vue3 差异注意事项
- [ ] `children` / `ReactNode` → `slots`
- [ ] `React.forwardRef` → `defineExpose` / `ref`
- [ ] `useEffect` → `watchEffect` / `onMounted`
- [ ] `className` → `class`
- [ ] `onChange` → `@update:value` 或 `@change`（确认 emits 声明）
- [ ] Context API → `provide` / `inject`
- [ ] `React.cloneElement` → 无直接等价，需重构

### 📦 提交与发布
- [ ] 创建 antdv-next PR，标题格式：`[sync] fix(Button): xxx (#上游PR编号)`
- [ ] PR 描述中链接上游 PR
- [ ] Code Review 通过（至少 1 人）
- [ ] CI 全部通过
- [ ] Merge 到主分支
- [ ] 确认是否需要单独发布 patch 版本
```

---

## 使用示例

### 场景 A：首次初始化（monorepo，多个上游）

用户输入：
```
帮我追踪 antdv-next（/home/user/antdv-next）的上游同步，
上游有三个仓库：
- ant-design: https://github.com/ant-design/ant-design.git → packages/components
- ant-design-icons: https://github.com/ant-design/ant-design-icons.git（packages/icons-vue）→ packages/icons
- pro-components: https://github.com/ant-design/pro-components.git（packages/table → packages/pro-table，packages/form → packages/pro-form）
从各自的最新 tag 开始
```

Claude 执行流程：
1. 检查 `.sync-upstream.json` → 不存在，进入初始化
2. 按用户描述创建配置文件，写入三个上游的 `remote_url` 和 `packages` 映射
3. 依次 clone 三个上游到 tmp，各取当前 HEAD 作为 `last_synced_commit`
4. 清理 tmp，告知用户配置完成

### 场景 B：续传同步（已有配置）

用户输入：
```
同步仓库
```

Claude 执行流程：
1. 读取 `.sync-upstream.json` → 找到三个上游及各自的 `last_synced_commit`
2. 对每个上游依次（或并行）：clone to tmp → 分析新 commit → 按 `packages` 映射定位下游子包
3. 合并输出一张汇总表格，按上游分组、优先级排序
4. 输出每个 PR 的 checklist，标注影响的下游子包路径
5. 更新三个上游各自的 `last_synced_commit`，清理 tmp

---

## Step 6：更新同步状态文件

每次完成分析后，将本次分析到的**上游最新 commit** 写回 `.sync-upstream.json`：

```bash
# 获取上游当前 HEAD commit
LATEST=$(git -C /path/to/upstream rev-parse HEAD)
LATEST_SHORT=$(git -C /path/to/upstream rev-parse --short HEAD)
LATEST_TAG=$(git -C /path/to/upstream describe --tags --abbrev=0 2>/dev/null || echo "")
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
```

更新 `last_synced_commit` 为 `$LATEST`，`last_synced_at` 为 `$NOW`。

告知用户：
> ✅ 同步状态已更新：下次直接说"继续同步"即可，无需提供 commit SHA。

> 详见 `references/sync-state.md` 了解完整的读写操作和多上游支持

---

## 注意事项

- GitHub API 未认证限流为 60次/小时，认证后为 5000次/小时，建议用户提供 token
- 部分 commit 可能没有关联 PR（直接 push），这类提交单独列出供人工判断
- "Skip" 类 PR 仍然列出，方便人工复核是否真的不适用
- 如果 PR 数量 > 50，建议分批处理或按时间段拆分
- `.sync-upstream.json` 建议加入版本控制（git commit），方便团队共享同步进度
- 详细 API 调用示例见 `references/github-api.md`
- 优先级规则可按项目需求调整，见 `references/priority-rules.md`
