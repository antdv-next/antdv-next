---
title: For Agents
tag: new
---

本页面提供一段开箱即用的提示词，让任何 AI 编程 Agent 高效使用 antdv-next。

## 复制这段 prompt {#copy-prompt}

复制到你的 Agent 对话或自动化流程中。

```text
这个版本可能包含破坏性变更，组件 API、约定、文件结构都可能与你训练数据中的内容不同。在编写任何代码之前，请先阅读 https://antdv-next.com/docs/vue/for-agents-cn.md 和 https://raw.githubusercontent.com/antdv-next/cli/main/skills/antdv/SKILL.md，留意弃用提示，并按照说明使用 antdv-next。

如果你可以安装 skills，请运行：
npx skills add antdv-next/cli
```

## Agent 获得什么 {#what-the-agent-gets}

### CLI — 离线知识和项目工具 {#cli}

[`@antdv-next/cli`](https://github.com/antdv-next/cli) 将所有元数据随包安装的每个 Prop、Events、Slots、Token、Demo 和 Changelog 条目 — 毫秒级查询，完全离线。

```bash
npm install -g @antdv-next/cli
```

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

完整参考：[CLI](/docs/vue/cli-cn)

### design.md — 设计语言上下文 {#design-md}

[design.md](https://antdv-next.com/design.md) 面向 AI 设计工具，描述 antdv-next 默认 Light 主题的视觉语言、组件范式和主题 Token。

完整参考：[design.md](/docs/vue/design-md-cn)

### MCP Server — IDE 集成 {#mcp}

CLI 同时支持作为 MCP 服务器运行，提供 6 个工具，支持 IDE 集成（Claude Code、Cursor、VS Code 等）。

```json
{
  "mcpServers": {
    "antdv": {
      "command": "npx",
      "args": ["-y", "@antdv-next/cli", "mcp"]
    }
  }
}
```

完整参考：[MCP Server](/docs/vue/mcp-cn)

### LLMs.txt — LLM 结构化文档 {#llms-txt}

将完整的组件文档直接注入 AI 上下文：

| 文件                                                      | 说明                                 |
|---------------------------------------------------------| ------------------------------------ |
| [llms.txt](https://antdv-next.com/llms.txt)             | 导航文件，包含所有文档和组件的链接   |
| [design.md](https://antdv-next.com/design.md)               | 设计语言描述文件，供 AI 设计工具使用 |
| [llms-full.txt](https://antdv-next.com/llms-full.txt)       | 完整的组件文档（英文）               |
| [llms-full-cn.txt](https://antdv-next.com/llms-full-cn.txt) | 完整的组件文档（中文）               |

也可以获取单个组件文档：`https://antdv-next.com/components/<name>.md`。

完整参考：[LLMs.txt](/docs/vue/llms-cn)、[design.md](/docs/vue/design-md-cn)