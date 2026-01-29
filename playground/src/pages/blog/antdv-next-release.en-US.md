---
title: Antdv Next v1.0 Released - Aligning with Ant Design v6
datetime: 2026-02-03
author: aibayanyu20
---

Today, we are finally releasing the very first version of **Antdv Next — v1.0**.

After more than a year of design, experimentation, and development, we have completed the first full implementation of the **Ant Design v6 Design Token system** in the Vue ecosystem.

Since Antdv Next is built upon the Ant Design v6 design system, we intentionally keep a high level of consistency with Ant Design in terms of design principles and specifications.
For detailed explanations of Design Tokens, CSS Variables, and the styling runtime, we will not repeat them here. Instead, we recommend referring directly to the official Ant Design documentation and related articles, such as: [Some Notes on V6](https://ant.design/docs/blog/css-tricks-cn).

However, **Vue and React naturally differ in their component design paradigms**.
Therefore, during the migration process, we did not simply "mirror the APIs", but made a series of necessary engineering-level adjustments based on Vue's idiomatic usage patterns.

## Design Adjustments

### Property Adjustments

Since we are rebuilding a design system specifically for the Vue ecosystem, we must respect Vue’s own design philosophy rather than mechanically copying React-style APIs.

The most typical example is the global common property `className`.

This property carries a strong React semantic meaning and does not align well with the naming conventions widely adopted in the Vue community.
Therefore, in Antdv Next, we unified these properties as follows:

- `classNames` → `classes`
- `rootClassName` → `rootClass`

This is the first step in making Antdv Next more idiomatic to Vue at the API level, ensuring that component interfaces feel natural to Vue developers.

For some properties that Ant Design plans to remove in future versions, or those kept only for historical compatibility, we still retain them temporarily to ensure a smooth migration experience.
However, in future major releases, these React-style APIs will be gradually removed, and we no longer recommend using them.

### Slot Support

Vue provides native slot mechanisms, which are one of its most important language-level features for component composition.
In contrast, React usually passes child content through props, essentially following a functional composition model.

In Antdv Next, we prioritize Vue slots as the default way to extend component content.
This significantly lowers the learning cost and integrates more naturally with Vue's template-based workflow.

At the same time, for users who prefer JSX / TSX styles, Antdv Next still fully supports passing nodes via props.
You can continue using Antdv Next in a React-like style if desired.

#### Unified Context Parameter Design

To better support slot-based rendering, we redesigned several multi-parameter callback APIs into a unified single-context pattern.

For example, in React, the original type definition of Modal’s `footer` renderer is:

```ts
(originNode: ReactNode, extra: { OkBtn: React.FC, CancelBtn: React.FC }) => ReactNode
```

In Antdv Next, we unify it into a single context parameter:

```ts
(ctx: {
  originNode: VueNode
  extra: {
    OkBtn: VNode
    CancelBtn: VNode
  }
}) => VNode
```

This design provides several advantages:

- Better alignment with Vue’s slot context model
- Clearer semantics without relying on parameter order
- Easier API extension and long-term maintainability

Therefore, when using slot-related features, we recommend referring to the documented context structure.

### Semantic Adjustments for Content Rendering

In some components, Ant Design uses `children` to represent content, directly passing it as a `ReactNode`.
However, in Antdv Next, we believe that the core semantic meaning of `children` should represent *tree structure*, not *content containers*.

Therefore, we adjusted these APIs at the semantic level:

- Renamed `children` to `content`
- Introduced `contentRender` as the corresponding slot-based renderer

This avoids semantic ambiguity and better matches Vue’s conceptual model of content and structure.

### Standardized Render Slot Conventions

In Antdv Next, we defined a unified naming convention for common "render-type" slots:

- `labelRender`: replaces `label` in `options`, supports custom label rendering
- `contentRender`: replaces original `children`, supports custom node rendering
- `extraRender`: replaces `extra`, supports custom extra content
- `iconRender`: replaces `icon`, supports custom icon rendering

This naming convention serves as the foundational design standard of Antdv Next.
In future similar scenarios, we will continue following and extending this convention.

## Documentation Improvements

In v1.0, we also performed a systematic refactor of the documentation structure.

Following common Vue community reading patterns, we clearly separated component documentation into:

- Props
- Emits
- Slots
- Methods

We also extracted complex types into independent sections for easier navigation and readability.

The documentation is still continuously evolving. If you encounter any issues while using Antdv Next,
feel free to contribute via [Issue](https://github.com/antdv-next/antdv-next/issues) or [PR](https://github.com/antdv-next/antdv-next/pulls).
We would be more than happy to improve this documentation together with the community.

## AI Support

In this release, we have added AI support to the documentation system.

1. **llm.txt integration**  
   Built-in support for `llm.txt` is enabled by default, making it easy to use local or remote LLM models for offline Q&A.

2. **Skills support**  
   We now support popular local skills libraries. When used together with the [Antfu Skills collection](https://github.com/antfu/skills), this can help reduce issues caused by AI hallucinations.


## Acknowledgements

We would like to sincerely thank all community contributors who have provided code, documentation, and valuable feedback over the past year.

Without your support and dedication, this project would not have reached its current state.

Special thanks to the following core contributors (in no particular order):

- [@selicens](https://github.com/selicens)
- [@cc-hearts](https://github.com/cc-hearts)
- [@ffgenius](https://github.com/ffgenius)

We also appreciate every contributor who has ever participated in Antdv Next — whether through code, issues, or discussions.
You are all essential parts of this project.

## Future Outlook

We hope that Antdv Next can be maintained in a stable and sustainable way in the long term,
and gradually grow into a mature, reliable, and evolving design system infrastructure for the Vue ecosystem.

This is not just a component library, but a long-term community-driven engineering project.
We sincerely welcome more developers to join us in designing, implementing, and discussing the future of this system together.

If you are interested in Antdv Next, feel free to visit our
[GitHub repository](https://github.com/antdv-next/antdv-next) for more details, and contribute via Issues or PRs.

### On Sustainability

To ensure the long-term sustainability of the project, we may explore reasonable commercialization approaches in the future, such as sponsorship support.
These resources will be used to subsidize core maintenance costs and allow us to continue investing time and effort into the project.

If you encounter sponsorship information during usage, we hope you can understand and support it —
this directly helps us make the project more stable, longer-lasting, and better.

### On Community Governance

Although Antdv Next was originally initiated by individuals, we do not intend for it to remain a "personal project".
A healthy open-source project should have strong community continuity, rather than relying on any single maintainer.

If, for any real-world reasons, I can no longer continue as the primary maintainer in the future,
I hope the project can be fully handed over to new maintainers and continue evolving within the community.

Antdv Next belongs to the community, and it will always serve the community.
