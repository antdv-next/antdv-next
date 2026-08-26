---
title: CLI
tag: new
---

本指南介绍如何使用 `@antdv-next/cli` 从命令行查询 antdv-next 组件知识、分析项目用量和指导版本迁移。

## 什么是 Antdv Next CLI？ {#what-is-antdv-next-cli}

[`@antdv-next/cli`](https://github.com/antdv-next/cli) 是官方命令行工具，将 Antdv Next 知识带到你的终端。所有元数据随包安装的每个
Props、Events、Slots、Token、Demo 和 Changelog 条目 — 毫秒级查询，完全离线。

## 亮点 {#highlights}

- 📦 **完全离线** — 所有元数据随包安装，无需网络请求，无延迟，无 API Key。
- 🎯 **版本精确** — 查询 antdv-next@x.y.z 的精确 API，而非仅 "latest"。
- 🤖 **Agent 优化** — 所有命令支持 `--format json`。结构化错误码与修复建议。stdout/stderr 严格分离。
- 🔮 **智能纠错** — 输入 `Buttn`？CLI 基于 Levenshtein 距离建议 `Button`，优先匹配首字母相同的候选。
- 🔌 **MCP 服务** — `antdv mcp` 启动 stdio 服务，原生集成 Claude Desktop、Cursor 等 IDE。

## 安装 {#install}

```bash
npm install -g @antdv-next/cli
```

需要 Node.js `>=20.0.0`。也可以使用 `pnpm add -g @antdv-next/cli` 或 `bun add -g @antdv-next/cli` 全局安装。

## 快速开始 {#quick-start}

```bash
antdv init                           # 初始化项目
antdv list                           # 所有组件及版本信息
antdv info Button                    # 组件 Props、事件、插槽、类型、默认值
antdv doc Button                     # 完整 Markdown 文档
antdv demo Select basic              # 可运行的 Demo 源码
antdv token DatePicker               # Design Token 值
antdv design.md                      # 设计语言文档（design.md）
antdv semantic Table                 # class / styles 结构
antdv changelog 1.2.0 1.0.0 Select   # 跨版本 API 差异对比
antdv doctor                         # 诊断项目配置问题
antdv env                            # 收集环境信息用于 Bug 报告
antdv usage ./src                    # 分析项目中的 antdv-next 导入
antdv lint ./src                     # 检查废弃 API 和最佳实践
antdv migrate 1 2                    # v1 到 v2 迁移指南
antdv migrate 1 2 --apply ./src      # 生成 Agent 迁移提示
antdv mcp                            # 启动 MCP 服务，供 IDE 集成
antdv setup --client claude          # 为 AI Agent 接入 MCP/Skill
antdv upgrade                        # 升级 CLI 到最新版本
```

## 命令 {#commands}

### 项目初始化

| 命令                                 | 说明                       |
|------------------------------------|--------------------------|
| `antdv init [project-name]`        | 默认初始化 vite 版本项目          |
| `antdv init [project-name] --nuxt` | 初始化 nuxt 版 antdv-next 项目 |

### 知识查询 {#knowledge-query}

| 命令                                      | 说明                                |
|-----------------------------------------|-----------------------------------|
| `antdv list`                            | 列出所有组件，含双语名称、分类和引入版本              |
| `antdv info <Component>`                | Props、Event、Slots 表格，含类型、默认值和描述内容 |
| `antdv doc <Component>`                 | 组件完整 Markdown 文档                  |
| `antdv demo <Component> [name]`         | 可运行的 Demo 源码（TSX）                 |
| `antdv token [Component]`               | 全局或组件级 Design Token               |
| `antdv design.md`                       | 设计语言文档，供 AI 设计工具使用                |
| `antdv semantic <Component>`            | 语义化 `class` / `styles` 结构及用法示例    |
| `antdv changelog [v1] [v2] [component]` | Changelog 条目、版本范围或跨版本 API 对比      |

#### antd design.md {#design-md}

`antdv design.md` 输出 antdv-next
的设计语言描述文件，遵循 [google-labs-code/design.md](https://github.com/google-labs-code/design.md) 规范。该文件面向 AI
设计工具（如 Figma Make、Google Stitch 等），让它们在生成 UI 时能够遵循 antdv-next 的视觉语言。

```bash
antdv design.md                # 输出完整的 design.md 内容
antdv design.md --format json  # JSON 格式输出
```

文件内容包括：

- **YAML Front Matter** — 颜色、字体、圆角、间距和核心组件的结构化 Token 定义，支持 `{path.to.token}` 引用语法
- **设计概览** — andtv-next 遵循 Ant Design 四大设计价值观（自然、确定、有意义、生长）
- **颜色系统** — 功能色、预设色板、中性色使用 `rgba()` 的原因
- **字体排版** — 14px 基础字号、字体栈、两种字重限制
- **布局** — 4px 网格、间距比例尺、三层表面模型
- **层次与深度** — 四级阴影、动效时长与缓动函数
- **形状** — 6px 默认圆角及各组件分类
- **组件** — 核心组件原型和状态的样式描述
- **设计建议** — Do's and Don'ts 规则

该文件也已发布在 [antdv-next.com/design.md](antdv-next.com/design.md)，AI 工具可直接通过 URL 读取。

### 项目分析 {#project-analysis}

| 命令                          | 说明                                         |
|-----------------------------|--------------------------------------------|
| `antdv doctor`              | 10 项诊断检查：vue 兼容性、重复安装、peer 依赖、SSR、babel 插件 |
| `antdv env [dir]`           | 一键收集 antdv-next 相关环境信息，用于 Bug 报告或 AI 辅助诊断  |
| `antdv usage [dir]`         | 导入统计、子组件分布、非组件导出                           |
| `antdv lint [target]`       | 废弃 API、无障碍缺陷、性能问题、最佳实践                     |
| `antdv migrate <from> <to>` | 迁移清单，区分自动修复/手动处理，`--apply` 生成 Agent 提示     |

### 问题反馈 {#issue-reporting}

| 命令              | 说明                         |
|-----------------|----------------------------|
| `antdv bug`     | 提交 Bug 到 antdv-next 仓库     |
| `antdv bug-cli` | 提交 Bug 到 antdv-next/cli 仓库 |

### CLI 管理 {#cli-management}

| 命令              | 说明                                                           |
|-----------------|--------------------------------------------------------------|
| `antdv mcp`     | 启动 MCP 服务器，提供 6 个工具，支持 IDE 集成（Claude Code、Cursor、VS Code 等）  |
| `antdv setup`   | 为 Claude Code、Cursor、VS Code 或 Codex 接入 Antdv Next MCP/Skill |
| `antdv upgrade` | 将 CLI 升级到最新版本                                                |

`antdv mcp` 命令启动 [Model Context Protocol](https://modelcontextprotocol.io/) 服务器，让 AI 助手可以直接访问 Antdv Next
知识。详细配置参见 [MCP Server](/docs/vue/mcp-cn) 指南。

`antdv setup` 命令可以写入 MCP 配置、安装内置 Antdv Next Skill，或同时完成两者：

```bash
antdv setup --client claude
antdv setup --client cursor --mode both
antdv setup --client vscode --write-instructions
antdv setup --client codex
antdv setup --client claude --dry-run
antdv setup --client claude --check
```

### 全局参数 {#global-flags}

| 参数                              | 说明                          | 默认值    |
|---------------------------------|-----------------------------|--------|
| `--format json\|text\|markdown` | 输出格式                        | `text` |
| `--ver <v>`                     | 目标 antdv-next 版本（如 `1.5.0`） | 自动检测   |
| `-V, --version`                 | 打印 CLI 版本号                  | -      |

版本自动检测顺序：`--version` 参数、`node_modules/antd`、`package.json` 依赖声明，然后使用默认回退版本。

## 在 AI 工具中的使用 {#usage-with-ai-tools}

CLI 内置 [Skill 文件](https://github.com/antdv-next/cli/blob/main/skills/antdv/SKILL.md)，指导 Code Agent 在正确的时机调用正确的命令：

```bash
npx skills add antdv-next/cli
```

| 工具              | 说明                                                                                      |
|-----------------|-----------------------------------------------------------------------------------------|
| **Claude Code** | 安装为 Agent Skill 或直接在终端使用 `antd` 命令。[文档](https://docs.anthropic.com/en/docs/claude-code) |
| **Cursor**      | 安装 Skill 后，Agent 会自动调用 CLI 命令。[文档](https://docs.cursor.com/zh/context/@-symbols/@-docs) |
| **Codex**       | 安装 Skill 以启用 Agent 访问。[文档](https://github.com/openai/codex)                             |
| **Gemini CLI**  | 安装 Skill 以启用自动命令调用。[文档](https://github.com/google-gemini/gemini-cli)                    |

支持所有兼容 [skills](https://github.com/nicepkg/agent-skills) 协议的 Agent。

## 了解更多 {#learn-more}

- [@antdv-next/cli GitHub 仓库](https://github.com/antdv-next/cli)
- [@antdv-next/cli npm 地址](https://www.npmjs.com/package/@antdv-next/cli)
- [Antdv-Next LLMs.txt 指南](/docs/vue/llms-cn)
- [Antdv-Next MCP Server](/docs/vue/mcp-cn)