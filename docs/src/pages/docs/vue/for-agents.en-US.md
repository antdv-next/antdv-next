---
title: For Agents
tag: new
---

This page provides a ready-to-use prompt that helps any AI coding agent work effectively with antdv-next.

## Copy This Prompt {#copy-prompt}

Copy it into your Agent conversation or automation workflow.

```text
This version may contain breaking changes. Its component APIs, conventions, and file structure may differ from those in your training data. Before writing any code, read https://antdv-next.com/docs/vue/for-agents.md and https://raw.githubusercontent.com/antdv-next/cli/main/skills/antdv/SKILL.md, pay attention to deprecation notices, and follow the instructions for using antdv-next.

If you can install skills, run:
npx skills add antdv-next/cli
```

## What the Agent Gets {#what-the-agent-gets}

### CLI — Offline Knowledge and Project Tools {#cli}

[`@antdv-next/cli`](https://github.com/antdv-next/cli) installs all metadata with the package: every Prop, Event, Slot, Token, Demo, and Changelog entry can be queried in milliseconds, completely offline.

```bash
npm install -g @antdv-next/cli
```

```bash
antdv init                           # Initialize a project
antdv list                           # List all components and version information
antdv info Button                    # Component props, events, slots, types, and defaults
antdv doc Button                     # Complete Markdown documentation
antdv demo Select basic              # Runnable demo source code
antdv token DatePicker               # Design Token values
antdv design.md                      # Design language documentation (design.md)
antdv semantic Table                 # class / styles structure
antdv changelog 1.2.0 1.0.0 Select   # Compare API differences across versions
antdv doctor                         # Diagnose project configuration issues
antdv env                            # Collect environment information for bug reports
antdv usage ./src                    # Analyze antdv-next imports in a project
antdv lint ./src                     # Check deprecated APIs and best practices
antdv migrate 1 2                    # v1-to-v2 migration guide
antdv migrate 1 2 --apply ./src      # Generate an Agent migration prompt
antdv mcp                            # Start the MCP server for IDE integration
antdv setup --client claude          # Connect an AI Agent through MCP/Skill
antdv upgrade                        # Upgrade the CLI to the latest version
```

Complete reference: [CLI](/docs/vue/cli)

### design.md — Design Language Context {#design-md}

[design.md](https://antdv-next.com/design.md) is intended for AI design tools. It describes the visual language, component patterns, and theme Tokens of the default antdv-next Light theme.

Complete reference: [design.md](/docs/vue/design-md)

### MCP Server — IDE Integration {#mcp}

The CLI can also run as an MCP server. It provides seven tools and supports integration with IDEs such as Claude Code, Cursor, and VS Code.

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

Complete reference: [MCP Server](/docs/vue/mcp)

### LLMs.txt — Structured Documentation for LLMs {#llms-txt}

Inject the complete component documentation directly into the AI context:

| File | Description |
| --- | --- |
| [llms.txt](https://antdv-next.com/llms.txt) | Navigation file containing links to all documentation and components |
| [design.md](https://antdv-next.com/design.md) | Design language description for AI design tools |
| [llms-full.txt](https://antdv-next.com/llms-full.txt) | Complete component documentation in English |
| [llms-full-cn.txt](https://antdv-next.com/llms-full-cn.txt) | Complete component documentation in Chinese |

You can also retrieve documentation for an individual component at `https://antdv-next.com/components/<name>.md`.

Complete references: [LLMs.txt](/docs/vue/llms) and [design.md](/docs/vue/design-md)
