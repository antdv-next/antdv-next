---
title: 贡献指南
---

这篇指南会帮助你了解如何为 Antdv Next 贡献一份自己的力量，请你在提issue 或者 pull request 之前花几分钟来阅读一遍这篇指南。

## 行为准则

我们使用了与Ant Design社区相同的[行为准则](https://github.com/antdv-next/antdv-next/blob/main/CODE_OF_CONDUCT.md), 希望所有的贡献者都能遵守，请花时间阅读一遍全文以确保你能明白哪些是可以做的，哪些是不能做的。

## 开发透明

我们所有的开发工作都是在[Github](https://github.com/antdv-next/antdv-next)上进行的。不管是团队成员还是社区贡献者的 pull request 都需要经过同样的流程 review。

## 分支管理

我们目前长期维护两个分支`main`和`feat`。如果你需要修复一个bug，那么请发 pull request 到 main，每隔一段时间(最长一个月)我们从`main`发布一个`patch`版本;如果你需要添加一个新功能的 pull request,那么请基于`feat`分支来做，我们尽可能的会在两个月内从`feat`合并到`main`，并发布一个包含新特性的`minor`版本。

:::info 为什么周期不确定？
我们无法像 Ant Design 那样有一个庞大的团队来支持频繁的版本发布，所以我们只能尽可能的在保证质量的前提下，尽快的发布新版本。希望大家理解。
:::

## 第一次贡献

如果你还不清楚怎么在 GitHub 上提 Pull Request ，可以阅读下面这篇文章来学习：

[如何优雅地在 GitHub 上贡献代码](https://segmentfault.com/a/1190000000736629)

为了能帮助你开始你的第一次尝试，我们用 [good first issues](https://github.com/antdv-next/antdv-next/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 标记了一些比较容易修复的 bug 和小功能。这些 issue 可以很好地作为你的首次尝试。

如果你打算开始处理一个 issue，请先检查一下 issue 下面的留言以确保没有别人正在处理这个 issue。如果当前没有人在处理的话你可以留言告知其他人你将会处理这个 issue，以免别人重复劳动。

如果之前有人留言说会处理这个 issue 但是一两个星期都没有动静，那么你也可以接手处理这个 issue，当然还是需要留言告知其他人。

## Pull Request

Antdv Next Team 会关注所有的 pull request，我们会 review 以及合并你的代码，也有可能要求你做一些修改或者告诉你我们为什么不能接受这样的修改。

**在你发送 Pull Request 之前**，请确认你是按照下面的步骤来做的：

1. 基于 [正确的分支](#分支管理) 做修改。
2. 在项目根目录下运行了 `pnpm install`。
3. 如果你修复了一个 bug 或者新增了一个功能，请确保编写了相应的测试，这很重要。

由于antdv-next的大部分是基于`vue-components`的，所以有时候你需要给[vue-components](https://github.com/antdv-next/vue-components)仓库发送一个 pull request。如果你修复了某个bug，那么我们在合并你的修改后会尽快发布一个patch版本，然后你只要重新安装你的依赖就可以使用新发布的版本了。如果你的 pull request 是新增了某个功能，那么在你的修改合并并且发布版本后，你还需要发送一个 pull request 到 Antdv Next 来升级响应的依赖、文档以及Typescript类型定义。

## 开发流程

我们项目默认是一个 monorepo 仓库，使用 [pnpm workspace](https://pnpm.io/workspaces) 来管理多个子包(package)，所以在你开始贡献代码之前，请确保你已经了解了 pnpm workspace 的基本使用方法。

所以下面的步骤假设你已经安装并且配置好了 pnpm。

1. Fork 这个仓库到你的个人账号下。
2. 克隆你 Fork 的仓库到本地：`git clone https://github.com/xxx/antdv-next.git`。
3. 进入项目目录：`cd antdv-next`。
4. 安装依赖：`pnpm install`。
5. 运行开发环境：`pnpm dev`。
6. 运行代码风格检查：`pnpm lint`。
7. 站点构建：`pnpm build`。
8. 编译构建：`pnpm build:antdv`

## 致谢

感谢所有为Antdv Next 贡献代码和文档的朋友们，是你们让这个项目变得更好！我们期待更多的贡献者加入到这个项目中来，共同推动 Antdv Next 的发展。

<a href="https://github.com/antdv-next/antdv-next/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=antdv-next/antdv-next&max=100&columns=15" />
</a>
