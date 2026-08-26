---
title: MCP Server
tag: new
---

This guide explains how to use antdv-next with AI tools through the Model Context Protocol (MCP).

## What is MCP? {#what-is-mcp}

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open protocol that enables AI models to interact with external tools and data sources. Through MCP, AI assistants can access up-to-date documentation, code examples, and API references.

## Official MCP Server {#official-mcp-server}

After installing [`@antdv-next/cli`](https://github.com/antdv-next/cli), you can start the official MCP server with the `antdv mcp` command. It provides seven tools and supports IDE integration.

### Tools {#tools}

| Tool | Description |
| --- | --- |
| `antdv_list` | List available components |
| `antdv_info` | Get component API specifications |
| `antdv_doc` | Get complete documentation |
| `antdv_demo` | Get runnable code examples |
| `antdv_token` | Query Design Token values |
| `antdv_design_md` | Get the design language document |
| `antdv_semantic` | Inspect the DOM structure and styling hooks |

### Configuration {#configuration}

Add the MCP server to your IDE configuration:

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

If you have installed the CLI globally (`npm i -g @antdv-next/cli`), you can also use:

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

You can specify an antdv-next version with an additional option:

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

You can also let the CLI write the configuration for a supported client automatically:

```bash
antdv setup --client claude
antdv setup --client cursor --mode both
antdv setup --client vscode --write-instructions
antdv setup --client codex
```

Supported clients include `claude`, `cursor`, `vscode`, and `codex`. Available setup modes are `mcp`, `skill`, and `both`.

## Usage with AI Tools {#usage-with-ai-tools}

| Tool | Instructions | Configuration |
| --- | --- | --- |
| **Cursor** | Add it to `.cursor/mcp.json` or go to Settings → Features → MCP. [Documentation](https://docs.cursor.com/zh/context/@-symbols/@-docs) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }` |
| **Windsurf** | Add it to `~/.codeium/windsurf/mcp_config.json`. [Documentation](https://docs.windsurf.com/windsurf/cascade/memories) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }` |
| **Claude Code** | Add it to `mcpServers` in the Claude settings. [Documentation](https://docs.anthropic.com/en/docs/claude-code) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }` |
| **VS Code** | Add it to `.vscode/mcp.json` or go to Settings → MCP. [Documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) | `{ "servers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }` |
| **Codex** | Add it to `.codex/mcp.json`. [Documentation](https://github.com/openai/codex) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }` |
| **Gemini CLI** | Add it to the MCP configuration. [Documentation](https://ai.google.dev/gemini-api/docs?hl=en) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }` |
| **Trae** | Add it in the MCP settings. [Documentation](https://www.trae.ai/docs) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }` |
| **Qoder** | Add it to the MCP configuration. [Documentation](https://docs.qoder.com/) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }` |
| **Neovate Code** | Configure MCP in Settings or describe the task in a prompt. [Documentation](https://github.com/neovateai/neovate-code) | `{ "mcpServers": { "antdv": { "command": "npx", "args": ["-y", "@antdv-next/cli", "mcp"] } } }` |

## Alternative: Use LLMs.txt {#alternative-llms-txt}

If your AI tool does not support MCP, you can use our [LLMs.txt](/docs/vue/llms) resources instead. We provide:

- [llms.txt](https://antdv-next.com/llms.txt) - A structured overview of all components
- [llms-full.txt](https://antdv-next.com/llms-full.txt) - Complete documentation with examples

## Learn More {#learn-more}

- [Model Context Protocol documentation](https://modelcontextprotocol.io/)
- [Antdv Next CLI](/docs/vue/cli)
- [@antdv-next/cli GitHub repository](https://github.com/antdv-next/cli)
- [Antdv Next LLMs.txt guide](/docs/vue/llms)
