---
title: CLI
tag: new
---

This guide explains how to use `@antdv-next/cli` to query antdv-next component knowledge, analyze project usage, and guide version migrations from the command line.

## What is Antdv Next CLI? {#what-is-antdv-next-cli}

[`@antdv-next/cli`](https://github.com/antdv-next/cli) is the official command-line tool that brings Antdv Next knowledge to your terminal. All metadata is installed with the package: every Props, Events, Slots, Token, Demo, and Changelog entry can be queried in milliseconds, completely offline.

## Highlights {#highlights}

- 📦 **Fully offline** — All metadata is installed with the package. No network requests, no latency, and no API key required.
- 🎯 **Version-accurate** — Query the exact API for antdv-next@x.y.z instead of only "latest".
- 🤖 **Agent-optimized** — Every command supports `--format json`, with structured error codes and suggested fixes. stdout and stderr are strictly separated.
- 🔮 **Smart corrections** — Typed `Buttn`? The CLI suggests `Button` based on Levenshtein distance, prioritizing candidates with the same first letter.
- 🔌 **MCP server** — `antdv mcp` starts a stdio server with native integration for Claude Desktop, Cursor, and other IDEs.

## Installation {#install}

```bash
npm install -g @antdv-next/cli
```

Node.js `>=20.0.0` is required. You can also install it globally with `pnpm add -g @antdv-next/cli` or `bun add -g @antdv-next/cli`.

## Quick Start {#quick-start}

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

## Commands {#commands}

### Project Initialization

| Command | Description |
| --- | --- |
| `antdv init [project-name]` | Initialize a Vite project by default |
| `antdv init [project-name] --nuxt` | Initialize a Nuxt-based antdv-next project |

### Knowledge Queries {#knowledge-query}

| Command | Description |
| --- | --- |
| `antdv list` | List all components, including bilingual names, categories, and the version in which they were introduced |
| `antdv info <Component>` | Display Props, Events, and Slots tables with types, default values, and descriptions |
| `antdv doc <Component>` | Display the complete Markdown documentation for a component |
| `antdv demo <Component> [name]` | Display runnable demo source code (TSX) |
| `antdv token [Component]` | Display global or component-level Design Tokens |
| `antdv design.md` | Display the design language document for AI design tools |
| `antdv semantic <Component>` | Display the semantic `class` / `styles` structure and usage examples |
| `antdv changelog [v1] [v2] [component]` | Display Changelog entries, a version range, or an API comparison across versions |

#### antdv design.md {#design-md}

`antdv design.md` outputs the antdv-next design language description file, following the [google-labs-code/design.md](https://github.com/google-labs-code/design.md) specification. The file is intended for AI design tools such as Figma Make and Google Stitch, enabling them to follow the antdv-next visual language when generating UIs.

```bash
antdv design.md                # Output the complete design.md content
antdv design.md --format json  # Output in JSON format
```

The file includes:

- **YAML Front Matter** — Structured Token definitions for colors, typography, border radii, spacing, and core components, with support for the `{path.to.token}` reference syntax
- **Design overview** — The four antdv-next values: Natural, Certain, Meaningful, and Growing
- **Color system** — Functional colors, preset palettes, and why neutral colors use `rgba()`
- **Typography** — A 14px base font size, the font stack, and a two-weight constraint
- **Layout** — A 4px grid, spacing scale, and three-layer surface model
- **Hierarchy and depth** — Four shadow levels, motion durations, and easing functions
- **Shape** — A default 6px border radius and per-component classifications
- **Components** — Style descriptions for core component archetypes and states
- **Design guidance** — Do's and Don'ts

The file is also published at [antdv-next.com/design.md](https://antdv-next.com/design.md), allowing AI tools to read it directly from the URL.

### Project Analysis {#project-analysis}

| Command | Description |
| --- | --- |
| `antdv doctor` | Run 10 diagnostic checks covering Vue compatibility, duplicate installations, peer dependencies, SSR, and Babel plugins |
| `antdv env [dir]` | Collect antdv-next-related environment information for bug reports or AI-assisted diagnosis |
| `antdv usage [dir]` | Report import statistics, subcomponent distribution, and non-component exports |
| `antdv lint [target]` | Check deprecated APIs, accessibility issues, performance problems, and best practices |
| `antdv migrate <from> <to>` | Produce a migration checklist that distinguishes automatic fixes from manual work; `--apply` generates an Agent prompt |

### Issue Reporting {#issue-reporting}

| Command | Description |
| --- | --- |
| `antdv bug` | Report a bug to the antdv-next repository |
| `antdv bug-cli` | Report a bug to the antdv-next/cli repository |

### CLI Management {#cli-management}

| Command | Description |
| --- | --- |
| `antdv mcp` | Start an MCP server that provides six tools and supports IDE integration with Claude Code, Cursor, VS Code, and more |
| `antdv setup` | Connect Antdv Next MCP/Skill to Claude Code, Cursor, VS Code, or Codex |
| `antdv upgrade` | Upgrade the CLI to the latest version |

The `antdv mcp` command starts a [Model Context Protocol](https://modelcontextprotocol.io/) server, giving AI assistants direct access to Antdv Next knowledge. See the [MCP Server](/docs/vue/mcp) guide for detailed configuration instructions.

The `antdv setup` command can write MCP configuration, install the built-in Antdv Next Skill, or do both:

```bash
antdv setup --client claude
antdv setup --client cursor --mode both
antdv setup --client vscode --write-instructions
antdv setup --client codex
antdv setup --client claude --dry-run
antdv setup --client claude --check
```

### Global Options {#global-flags}

| Option | Description | Default |
| --- | --- | --- |
| `--format json\|text\|markdown` | Output format | `text` |
| `--ver <v>` | Target antdv-next version (for example, `1.5.0`) | Auto-detected |
| `-V, --version` | Print the CLI version | - |

The target version is detected in the following order: the `--version` option, `node_modules/antd`, the dependency declaration in `package.json`, and finally the default fallback version.

## Usage with AI Tools {#usage-with-ai-tools}

The CLI includes a [Skill file](https://github.com/antdv-next/cli/blob/main/skills/antdv/SKILL.md) that guides coding agents to invoke the right command at the right time:

```bash
npx skills add antdv-next/cli
```

| Tool | Description |
| --- | --- |
| **Claude Code** | Install it as an Agent Skill or use the `antdv` command directly in the terminal. [Documentation](https://docs.anthropic.com/en/docs/claude-code) |
| **Cursor** | After the Skill is installed, the Agent automatically invokes CLI commands. [Documentation](https://docs.cursor.com/zh/context/@-symbols/@-docs) |
| **Codex** | Install the Skill to give the Agent access. [Documentation](https://github.com/openai/codex) |
| **Gemini CLI** | Install the Skill to enable automatic command invocation. [Documentation](https://github.com/google-gemini/gemini-cli) |

All Agents compatible with the [skills](https://github.com/nicepkg/agent-skills) protocol are supported.

## Learn More {#learn-more}

- [@antdv-next/cli GitHub repository](https://github.com/antdv-next/cli)
- [@antdv-next/cli on npm](https://www.npmjs.com/package/@antdv-next/cli)
- [Antdv Next LLMs.txt guide](/docs/vue/llms)
- [Antdv Next MCP Server](/docs/vue/mcp)
