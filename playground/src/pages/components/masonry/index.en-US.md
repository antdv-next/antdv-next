---
category: Components
group: Layout
title: Masonry
description: A masonry layout component for displaying content with different heights.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cELTRrM5HpAAAAAAOGAAAAgAegCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*2CxJRYJmfbIAAAAAPqAAAAgAegCCAQ/original
demo:
  cols: 1
tag: 6.0.0
---

## When To Use

- When displaying images or cards with irregular heights.
- When content needs to be evenly distributed in columns.
- When column count needs to be responsive.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/responsive.vue">Responsive</demo>
  <demo src="./demo/image.vue">Image</demo>
  <demo src="./demo/dynamic.vue">Dynamic</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
  <demo src="./demo/fresh.vue" debug>Fresh</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| columns | Number of columns, can be a fixed value or a responsive configuration | number \| &#123; xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number &#125; | 3 | - |
| fresh | Whether to continuously monitor the size changes of child items | boolean | false | - |
| gutter | Spacing, can be a fixed value, responsive configuration, or a configuration for horizontal and vertical spacing | [Gap](#gap) \| [[Gap](#gap), [Gap](#gap)] | 0 | - |
| items | Masonry items | [MasonryItem](#masonryitem)[] | - | - |
| itemRender | Custom item rendering function | (item: MasonryItem) =&gt; VueNode | - | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| layoutChange | Callback for column sorting changes | (sortInfo: &#123; key: Key; column: number &#125;[]) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| itemRender | Custom item rendering slot | (itemInfo: MasonryItem & &#123; index: number &#125;) =&gt; VueNode | - |

## Types

### MasonryItem

| Parameter | Description | Type | Default Value |
| --- | --- | --- | --- |
| key | Unique identifier for the item | string \| number | - |
| height | Height of the item | number | - |
| column | Specifies the column to which the item belongs | number | - |
| data | Custom data storage | T | - |
| children | Custom display content, takes precedence over `itemRender` | VueNode | - |

### Gap

`Gap` represents the spacing between items. It can either be a fixed value or a responsive configuration.

```ts
type Gap = undefined | number | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number>>
```

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>


## Design Token

<ComponentTokenTable component="Masonry" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
