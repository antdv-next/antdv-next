---
title: 技能
tag: New
---

Agent Skills 是扩展 AI 功能的模块化能力。Antdv Next Skills 为 AI Agent 提供 Antdv Next 组件库的专业知识，让 AI 能够准确理解和使用组件。

## 什么是 Agent Skills？

Agent Skills 是可重用的、基于文件系统的资源，为 AI Agent 提供特定领域的专业知识：工作流、上下文和最佳实践，将通用代理转变为专家。与提示不同（提示是对话级别的一次性任务指令），**Skills 按需加载，无需在多个对话中重复提供相同的指导**。

### 为什么使用 Antdv Next Skills？

**主要优势**：
- **专业化 AI**：为 Antdv Next 组件开发定制功能，让 AI 成为组件库专家
- **减少重复**：创建一次，自动使用。无需每次都告诉 AI 如何使用组件
- **组合功能**：结合 Skills 构建复杂的组件开发工作流
- **减少幻觉**：通过提供真实的文档和示例，避免 AI 生成不存在的 Props 或错误的用法
- **离线可用**：Skills 将文档内容本地化，不依赖外部链接，确保稳定可靠

## Skills 如何工作

Skills 利用 AI Agent 的虚拟机环境提供超越仅使用提示可能实现的功能。AI Agent 在具有文件系统访问权限的虚拟机中运行，允许 Skills 作为包含指令、可执行代码和参考资料的目录存在。

这种基于文件系统的架构支持**渐进式披露**：AI Agent 按需分阶段加载信息，而不是预先消耗上下文。

### 三级加载机制

Skills 可以包含三种类型的内容，每种在不同时间加载：

| 级别 | 加载时间 | 令牌成本 | 内容 |
|---|---|---|---|
| **第 1 级：元数据** | 始终（启动时） | 约 100 个令牌 | YAML 前置数据中的 `name` 和 `description` |
| **第 2 级：指令** | 触发 Skill 时 | 不到 5k 个令牌 | 包含指令和指导的 SKILL.md 主体 |
| **第 3 级：资源** | 按需 | 实际上无限制 | 通过 bash 执行的捆绑文件，不将内容加载到上下文中 |

**这意味着什么？**
- AI Agent 启动时只知道「有一个 Antdv Next Skill 可以帮助处理组件」
- 当你请求「使用 Button 组件」时，AI 才加载 Button 的完整文档
- 如果文档引用了示例代码，AI 会按需读取这些文件
- 未使用的组件文档不会消耗任何上下文

> 💡 **类比**：就像为新团队成员准备的入职指南。他们知道指南的存在（元数据），需要时打开相关章节（指令），必要时查看详细附录（资源）。

## 安装

::: tip 需要注意的是

我们建议不要单独食用 Antdv Next Skill 配合 [Antfu Skills 集合](https://github.com/antfu/skills) 来使用更佳，如果你使用 `vue` 可以将 `vue` 的skill以及相关的 `skills` 全都导入以减少 `AI` 幻觉，让他的输出更为标准！

:::

通过 Skills CLI 安装 Antdv Next 技能集：

```bash
npx skills add antdv-next/skills
```

## 使用方法

安装后，AI Agent 会在与 Antdv Next 组件相关的请求中**自动使用** Skills。为了获得最稳定的效果，建议在提示词前显式声明：

```
use antdv-next skill, <你的需求>
```

这样可以显式触发技能；否则可能因匹配度不足导致触发不稳定。

### 使用示例

**基础组件开发**：
```
use antdv-next skill, 创建一个包含表单验证的登录页面
```

**复杂交互**：
```
use antdv-next skill, 实现一个带搜索、分页和筛选功能的数据表格
```

**组件定制**：
```
use antdv-next skill, 根据 AGENTS.md 规范重构 Button 组件，确保 Props/Emits/Slots 定义正确
```

**问题诊断**：
```
use antdv-next skill, 为什么我的 Form 组件验证不生效？
```

## 技术实现

### Skill 结构

Antdv Next Skills 遵循标准 Skill 结构：

```yaml
---
name: antdv-next
description: Antdv Next 组件库开发专家...
---

# Antdv Next 组件开发

## 快速开始
[组件开发工作流]

## API 约定
[Props/Emits/Slots 规范]

## 示例
有关具体组件用法，请参阅 [references/components/](references/components/)
```

### 生成流程

1. **文档提取**：从 playground 提取组件文档的 markdown 文件
2. **示例转换**：将 Vue SFC 示例转换为 markdown 格式
3. **内容聚合**：将文档和示例复制到 `references/` 目录
4. **元数据生成**：创建 YAML 前置数据和主指令
5. **离线优化**：确保所有内容离线可用，不依赖外部链接

生成脚本支持单语言输出，以减少 Skill 体积：

```bash
pnpm run generate:en  # 生成英文版本
pnpm run generate:zh  # 生成中文版本
```

## 支持的AI平台

Antdv Next Skills 作为**自定义 Skills** 可在多个 AI 平台使用：

1. Claude Code
2. Codex
3. Github Copilot
4. Cusor
5. Antigravity
6. ...

## 贡献

该项目是一个**早期实验**，旨在为 AI Agent 提供面向 Antdv Next 的专用技能。欢迎通过 [GitHub Issues](https://github.com/antdv-next/skills/issues) 提供反馈，帮助我们提升覆盖范围与准确性。
