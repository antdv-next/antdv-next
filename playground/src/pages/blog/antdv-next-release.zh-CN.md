---
title: Antdv Next v1.0 发布：升级Ant Design v6
datetime: 2026-02-03
author: aibayanyu20
---

今天，我们终于发布了 **Antdv Next 的第一个版本 —— v1.0**。

在经历了一年多的酝酿与开发之后，我们完成了这一代 **Ant Design v6 Design Token 体系** 在 Vue 生态中的第一次完整落地。

由于 Antdv Next 本身是从 Ant Design v6 体系迁移而来，因此在设计理念与规范层面，我们始终与 Ant Design 保持高度一致。
关于 Design Token、CSS Variables、样式运行时等基础设计体系的详细说明，这里不再重复展开，建议直接参考官方文档与相关文章，例如：[V6 的一些琐事](https://ant.design/docs/blog/css-tricks-cn)。

但与此同时，**Vue 与 React 在组件设计范式上存在天然差异**。
因此在迁移过程中，我们并不是简单地“对齐 API”，而是结合 Vue 的使用习惯，对部分设计做了必要的工程级调整。

## 设计调整

### 属性调整

既然选择在 Vue 生态中重新实现一套设计系统，我们就必须尊重 Vue 本身的设计范式，而不是机械复制 React 的接口风格。

最典型的例子，是全局通用属性中的 `className`。

这个属性在语义上具有明显的 React 风格，与 Vue 社区长期形成的 API 命名习惯并不一致。
因此在 Antdv Next 中，我们对相关属性做了统一调整：

- `classNames` → `classes`
- `rootClassName` → `rootClass`

这是 Antdv Next 在 API 层面“去 React 风味”的第一步，目的是让组件接口在语义上更贴近 Vue 社区的长期使用习惯。

对于一些 Ant Design 未来版本中计划移除、或仅用于兼容历史实现的属性，我们暂时仍然保留，以保证平滑迁移体验。
但在后续的大版本中，这类带有明显 React 风格的 API 将会逐步彻底移除，我们也不再推荐继续使用。

### 插槽支持

Vue 提供了天然的插槽机制（Slots），这是 Vue 在组件组合能力上最重要的语言级特性之一；
而在 React 中，组件的子节点内容通常通过 props 进行传递，本质上是一种函数式组合模型。

在 Antdv Next 中，我们优先采用 Vue 插槽作为默认的内容扩展方式，
以降低使用门槛，并更自然地融入 Vue 的模板与组合式写法。

同时，为了兼容部分偏好 JSX / TSX 风格的用户，
Antdv Next 仍然完整支持通过 props 传递节点内容，你可以继续保留原有的 React 风格使用方式。

#### 单一上下文参数设计

为了更好地支持插槽能力，我们对部分多参数回调形式的 props API 做了统一设计调整。

例如在 Modal 的 `footer` 渲染中，React 原始类型定义为：

```ts
(originNode: ReactNode, extra: { OkBtn: React.FC, CancelBtn: React.FC }) => ReactNode
```

在 Antdv Next 中，我们将其统一收敛为单一上下文参数：

```ts
(ctx: {
  originNode: VueNode
  extra: {
    OkBtn: VNode
    CancelBtn: VNode
  }
}) => VNode
```

这种设计的好处在于：

- 更符合 Vue 插槽的上下文传递模型
- 参数语义更清晰，避免顺序依赖
- 更利于后续 API 的扩展与维护

因此我们建议在使用插槽相关能力时，优先参考文档中的上下文参数结构。

---

### 内容渲染语义调整

在部分组件中，Ant Design 为了兼容 React 的 `children` 模型，将节点内容直接作为 `ReactNode` 进行传递。
但在 Antdv Next 中，我们认为 `children` 的核心语义应当是“树形结构的嵌套关系”，而不是“内容容器”。

因此我们对这类 API 做了语义层面的调整：

- 将原有 `children` 改为 `content`
- 在插槽中对应提供 `contentRender` 能力

这样可以避免语义歧义，同时也更符合 Vue 对内容与结构的设计哲学。

---

### 标准化渲染插槽约定

在 Antdv Next 中，我们为常见的“内容渲染型属性”统一定义了一套插槽命名规范：

- `labelRender`：用于替代 `options` 中的 `label`，支持自定义渲染标签内容
- `contentRender`：用于替代原 `children` 内容，支持自定义节点渲染
- `extraRender`：用于替代 `extra` 内容，支持额外区域渲染
- `iconRender`：用于替代 `icon` 内容，支持图标自定义渲染

这套命名规范将作为 Antdv Next 的基础设计标准，
后续在更多类似场景中，我们也将遵循这一约定持续补充和扩展。

## 文档优化

在 v1.0 中，我们也对整体文档结构进行了系统性的重构。

我们按照 Vue 社区更通用的阅读习惯，对组件文档中的：

- 属性（Props）
- 事件（Emits）
- 插槽（Slots）
- 方法（Methods）

进行了明确分区，并将部分复杂类型单独抽离，方便快速定位与查阅。

文档本身仍然在持续完善中，如果你在使用过程中发现任何问题，
欢迎通过 [Issue](https://github.com/antdv-next/antdv-next/issues) 或 [PR](https://github.com/antdv-next/antdv-next/pulls) 的方式参与共建，我们非常乐意一起把这套文档打磨得更好。

## AI 支持

本次我们对文档系统增加了对 AI 的支持能力。

1. llm.txt 集成，默认集成了 llm.txt 支持，方便用户通过本地或远程 LLM 模型进行离线问答。
2. skills 支持，目前比较流行的本地的技能库，配合 [Antfu Skills 集合](https://github.com/antfu/skills) 一起使用，可以减少 AI 幻觉导致的一些问题。



## 致谢

感谢所有在过去一年多时间里，为 Antdv Next 贡献代码、文档和建议的社区伙伴们。
没有你们的支持与投入，这个项目不可能走到今天。

特别感谢以下几位核心贡献者（排名不分先后）：

- [@selicens](https://github.com/selicens)
- [@cc-hearts](https://github.com/cc-hearts)
- [@ffgenius](https://github.com/ffgenius)

同时也感谢所有曾经参与过 Antdv Next 的朋友们，无论是提交代码、反馈问题，还是参与讨论，你们都是这个项目不可或缺的一部分。

<a href="https://github.com/antdv-next/antdv-next/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=antdv-next/antdv-next&max=100&columns=15" />
</a>

## 未来展望

我们希望 Antdv Next 能够在未来持续稳定地维护下去，
并逐步成长为 Vue 生态中一套成熟、可靠、可长期演进的设计系统基础设施。

这不仅是一个组件库项目，更是一项需要社区长期共同参与的工程。
我们非常期待有更多开发者加入进来，一起参与设计、实现与讨论，共同推动这套设计体系不断完善。

如果你对 Antdv Next 感兴趣，欢迎访问我们的
[GitHub 仓库](https://github.com/antdv-next/antdv-next) 了解更多细节，也欢迎通过 Issue / PR 的方式参与共建。

### 关于可持续性

为了项目能够长期稳定地发展，我们后续也会尝试一些合理的商业化方式，例如赞助支持等，用于补贴核心维护成本，保障项目可以持续投入时间与精力进行维护与演进。

如果你在使用过程中看到相关赞助信息，也希望能够理解并支持，这将直接帮助我们把项目做得更久、更稳、更好。

### 关于社区治理

Antdv Next 虽然由个人发起，但我们并不希望它成为“个人项目”。
一个健康的开源项目，应该具备良好的社区传承能力，而不是依赖某一个人的长期投入。

未来如果因为现实原因，我无法继续承担主要维护角色，
我也希望能够将项目完整地交接给新的维护者，由社区继续推进和发展。

Antdv Next 属于社区，也将长期服务于社区。
