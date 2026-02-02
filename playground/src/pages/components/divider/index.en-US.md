---
category: Components
title: Divider
description: A divider line separates different content.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*7sMiTbzvaDoAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*KPSEQ74PLg4AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
group:
  title: Layout
  order: 2
---

## When To Use

- Divide sections of an article.
- Divide inline text and links such as the operation column of table.

## Examples

<demo-group>
  <demo src="./demo/horizontal.vue">Horizontal</demo>
  <demo src="./demo/with-text.vue">Divider with title</demo>
  <demo src="./demo/vertical.vue">Vertical</demo>
  <demo src="./demo/plain.vue">Text without heading style</demo>
  <demo src="./demo/variant.vue">Variant</demo>
  <demo src="./demo/size.vue">Set the spacing size of the divider</demo>
  <demo src="./demo/customize-style.vue">Style Customization</demo>
  <demo src="./demo/style-calss.vue">Custom semantic dom styling</demo>
</demo-group>

## API

### Props

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| dashed | Whether line is dashed | boolean | false |
| orientation | Whether line is horizontal or vertical | `horizontal` \| `vertical` | `horizontal` |
| plain | Divider text show as plain style | boolean | true |
| size | The size of divider. Only valid for horizontal layout | `small` \| `middle` \| `large` | - |
| titlePlacement | The position of title inside divider | `start` \| `end` \| `center` | `center` |
| variant | Whether line is dashed, dotted or solid | `dashed` \| `dotted` \| `solid` | `solid` |
| vertical | Orientation, Simultaneously configure with `orientation` and prioritize `orientation` | boolean | false |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Divider" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
