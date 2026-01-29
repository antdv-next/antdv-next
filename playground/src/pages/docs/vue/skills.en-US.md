---
title: Skills
tag: New
---

Agent Skills are modular capabilities that extend AI functionality. Antdv Next Skills provide AI Agents with specialized knowledge of the Antdv Next component library, enabling AI to accurately understand and use components.

## What are Agent Skills?

Agent Skills are reusable, file-system based resources that provide AI Agents with domain-specific expertise: workflows, context, and best practices, transforming a general-purpose agent into an expert. Unlike prompts (which are conversation-level, one-time task instructions), **Skills are loaded on-demand without needing to repeat the same guidance across multiple conversations**.

### Why Use Antdv Next Skills?

**Key Benefits**:
- **Specialize AI**: Customize functionality for Antdv Next component development, making AI a component library expert
- **Reduce Repetition**: Create once, use automatically. No need to tell AI how to use components every time
- **Compose Capabilities**: Combine Skills to build complex component development workflows
- **Reduce Hallucinations**: Avoid AI generating non-existent Props or incorrect usage by providing real documentation and examples
- **Offline Available**: Skills localizes documentation content, ensuring stability and reliability without depending on external links

## How Skills Work

Skills leverage AI Agent's virtual machine environment to provide capabilities beyond what's possible with prompts alone. AI Agents run in a virtual machine with file system access, allowing Skills to exist as directories containing instructions, executable code, and reference materials.

This file-system based architecture supports **progressive disclosure**: AI Agents load information on-demand in stages, rather than consuming context upfront.

### Three-Level Loading Mechanism

Skills can contain three types of content, each loaded at different times:

| Level | Load Time | Token Cost | Content |
|---|---|---|---|
| **Level 1: Metadata** | Always (at startup) | ~100 tokens | `name` and `description` in YAML frontmatter |
| **Level 2: Instructions** | When Skill is triggered | < 5k tokens | SKILL.md body with instructions and guidance |
| **Level 3: Resources** | On-demand | Virtually unlimited | Bundled files executed via bash, not loaded into context |

**What does this mean?**
- AI Agent only knows at startup that "there's an Antdv Next Skill available to help with components"
- When you request "use Button component", the AI loads the complete Button documentation
- If documentation references example code, AI reads those files on-demand
- Unused component documentation doesn't consume any context

> 💡 **Analogy**: Like an onboarding guide for a new team member. They know the guide exists (metadata), open relevant chapters when needed (instructions), and consult detailed appendices when necessary (resources).

## Installation

:::success Important Note
We recommend using Antdv Next Skill together with [Antfu's Skills Collection](https://github.com/antfu/skills) for better results. If you use `vue`, consider importing the `vue` skill and related skills to reduce AI hallucinations and ensure more standardized output!
:::

Install the Antdv Next skill set via Skills CLI:

```bash
npx skills add antdv-next/skills
```

## Usage

Once installed, AI Agents will **automatically use** Skills when you make requests related to Antdv Next components. For the most stable results, it's recommended to explicitly declare:

```
use antdv-next skill, <your requirement>
```

This explicitly triggers the skill; otherwise, activation may be unstable due to insufficient matching.

### Usage Examples

**Basic Component Development**:
```
use antdv-next skill, create a login page with form validation
```

**Complex Interactions**:
```
use antdv-next skill, implement a data table with search, pagination, and filtering
```

**Component Customization**:
```
use antdv-next skill, refactor the Button component according to AGENTS.md specifications, ensuring Props/Emits/Slots are correctly defined
```

**Problem Diagnosis**:
```
use antdv-next skill, why isn't my Form component validation working?
```

## Technical Implementation

### Skill Structure

Antdv Next Skills follows the standard Skill structure:

```yaml
---
name: antdv-next
description: Antdv Next component library development expert...
---

# Antdv Next Component Development

## Quick Start
[Component development workflow]

## API Conventions
[Props/Emits/Slots specifications]

## Examples
For specific component usage, see [references/components/](references/components/)
```

### Generation Process

1. **Documentation Extraction**: Extract component documentation markdown files from the playground
2. **Example Conversion**: Convert Vue SFC examples to markdown format
3. **Content Aggregation**: Copy documentation and examples to the `references/` directory
4. **Metadata Generation**: Create YAML frontmatter and main instructions
5. **Offline Optimization**: Ensure all content is available offline without depending on external links

The generation scripts support single-language output to reduce Skill size:

```bash
pnpm run generate:en  # Generate English version
pnpm run generate:zh  # Generate Chinese version
```

## Supported AI Platforms

Antdv Next Skills, as a **custom Skill**, can be used on multiple AI platforms:

1. Claude Code
2. Codex
3. Github Copilot
4. Cursor
5. Antigravity
6. ...

## Contributing

This project is an **early experiment** aimed at providing specialized skills for AI Agents working with Antdv Next. Feedback via [GitHub Issues](https://github.com/antdv-next/skills/issues) is welcome to help us improve coverage and accuracy.
