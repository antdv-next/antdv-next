---
title: MCP Server
tag: new
---

本指南介绍如何通过 Model Context Protocol (MCP) 在 AI 工具中使用 antdv-next。

## 什么是 MCP？ {#what-is-mcp}

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 是一个开放协议，使 AI 模型能够与外部工具和数据源进行交互。通过 MCP，AI 助手可以访问实时文档、代码示例和 API 参考资料。

## 官方 MCP Server {#official-mcp-server}

安装 [`@antdv-next/cli`](https://github.com/antdv-next/cli) 后，你可以通过 `antd mcp` 命令启动官方 MCP 服务器，提供 6 个工具，支持 IDE 集成。

### 工具 {#tools}

| 工具                | 说明                    |
|-------------------| ----------------------- |
| `antdv_list`      | 列出可用组件            |
| `antdv_info`      | 获取组件属性规格        |
| `antdv_doc`       | 获取完整文档            |
| `antdv_demo`      | 获取可运行的代码示例    |
| `antdv_token`     | 查询 Design Token 值    |
| `antdv_design_md` | 获取设计语言文档        |
| `antdv_semantic`  | 查看 DOM 结构和样式钩子 |

### 配置 {#configuration}

将 MCP 服务器添加到 IDE 配置：

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

如果你已全局安装 CLI（`npm i -g @antdv-next/cli`），也可以使用：

```json
{
  "mcpServers": {
    "antdv": {
      "command": "antdv",
      "args": ["mcp"]
    }
  }
}
```

你可以通过额外参数指定 antdv-next 版本：

```json
{
  "mcpServers": {
    "antdv": {
      "command": "npx",
      "args": ["-y", "@antdv-next/cli", "mcp", "--ver", "1.5.0"]
    }
  }
}
```

也可以让 CLI 自动写入支持的项目配置：

```bash
antdv setup --client claude
antdv setup --client cursor --mode both
antdv setup --client vscode --write-instructions
antdv setup --client codex
```

支持的客户端包括 `claude`、`cursor`、`vscode` 和 `codex`。Setup 模式包括 `mcp`、`skill` 和 `both`。

## 在 AI 工具中的使用 {#usage-with-ai-tools}

| 工具 | 说明 | 配置                                                                                              |
| --- | --- |-------------------------------------------------------------------------------------------------|
| **Cursor** | 添加到 `.cursor/mcp.json` 或设置 → 功能 → MCP。[文档](https://docs.cursor.com/zh/context/@-symbols/@-docs) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }` |
| **Windsurf** | 添加到 `~/.codeium/windsurf/mcp_config.json`。[文档](https://docs.windsurf.com/windsurf/cascade/memories) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }`  |
| **Claude Code** | 添加到 Claude 设置的 `mcpServers`。[文档](https://docs.anthropic.com/en/docs/claude-code) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }` |
| **VS Code** | 添加到 `.vscode/mcp.json` 或设置 → MCP。[文档](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) | `{ "servers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }`     |
| **Codex** | 添加到 `.codex/mcp.json`。[文档](https://github.com/openai/codex) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }`  |
| **Gemini CLI** | 添加到 MCP 配置。[文档](https://ai.google.dev/gemini-api/docs?hl=zh-cn) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }`  |
| **Trae** | 添加到 MCP 设置。[文档](https://www.trae.ai/docs) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }`  |
| **Qoder** | 添加到 MCP 配置。[文档](https://docs.qoder.com/) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }`  |
| **Neovate Code** | 在设置中配置 MCP 或使用提示词描述任务。[文档](https://github.com/neovateai/neovate-code) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }`  |


## 备选方案：使用 LLMs.txt {#alternative-llms-txt}

如果您的 AI 工具不支持 MCP，可以使用我们的 [LLMs.txt](/docs/vue/llms-cn) 支持。我们提供：

- [llms.txt](https://antdv-next.com/llms.txt) - 所有组件的结构化概览
- [llms-full.txt](https://antdv-next.com/llms-full.txt) - 包含示例的完整文档

## 了解更多 {#learn-more}

- [Model Context Protocol 文档](https://modelcontextprotocol.io/)
- [Antdv Next CLI](/docs/vue/cli-cn)
- [@antdv-next/cli GitHub 仓库](https://github.com/antdv-next/cli)
- [Antdv Next LLMs.txt 指南](/docs/vue/llms-cn)
