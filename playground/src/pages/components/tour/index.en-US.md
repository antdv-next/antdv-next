---
category: Components
group: Data Display
title: Tour
description: A popup component for guiding users through a product.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NMvqRZpuJfQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*D70qQJJmzhgAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

Use when you want to guide users through a product.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/non-modal.vue">Non-modal</demo>
  <demo src="./demo/placement.vue">Placement</demo>
  <demo src="./demo/mask.vue">Custom mask style</demo>
  <demo src="./demo/indicator.vue">Custom indicator</demo>
  <demo src="./demo/actions-render.vue">Custom action</demo>
  <demo src="./demo/gap.vue">Custom highlighted area style</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Comon props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| steps | Tour steps | TourStepItem[\] | - | - |
| open | Open tour, support `v-model:open` | boolean | false | - |
| current | What is the current step | number | - | - |
| arrow | Whether to show the arrow, including the configuration whether to point to the center of the element | boolean \| &#123; pointAtCenter: boolean &#125; | true | - |
| closeIcon | Customize close icon | VueNode | true | - |
| disabledInteraction | Disable interaction on highlighted area | boolean | false | - |
| gap | Control the radius of the highlighted area and the offset between highlighted area and the element | &#123; offset?: number \| [number, number]; radius?: number &#125; | &#123; offset: 6, radius: 2 &#125; | - |
| placement | Position of the guide card relative to the target element | `center` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` | - |
| mask | Whether to enable masking, change mask style and fill color by pass custom props | boolean \| &#123; style?: CSSProperties; color?: string &#125; | true | - |
| type | Type, affects the background color and text color | 'default' \| 'primary' | `default` | - |
| scrollIntoViewOptions | support pass custom scrollIntoView options | boolean \| ScrollIntoViewOptions | true | - |
| indicatorsRender | Custom indicator | (current: number, total: number) =&gt; VueNode | - | - |
| actionsRender | Custom action | (originNode: VueNode, info: &#123; current: number, total: number &#125;) =&gt; VueNode | - | - |
| zIndex | Tour zIndex | number | 1001 | - |
| getPopupContainer | Set the rendering node of Tour floating layer | (node: HTMLElement) =&gt; HTMLElement | () =&gt; document.body | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | TourClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | TourStylesType | - | - |
| rootClass | Root container class | string | - | - |
| prefixCls | - | string | - | - |

### Events
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback when the step changes. Current is the previous step | (current: number) =&gt; void | - |
| close | Callback function on shutdown | (current: number) =&gt; void | - |
| finish | Callback when tour is finished | () =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| actionsRender | Custom action | (originNode: any, info: &#123; current: number, total: number &#125;) =&gt; any | - |
| indicatorsRender | Custom indicator | (current: number, total: number) =&gt; any | - |
| nextButton | Customize next button | (params: &#123; current: number, isFirst: boolean, isLast: boolean &#125;) =&gt; any | - |
| prevButton | Customize previous button | (params: &#123; current: number, isFirst: boolean, isLast: boolean &#125;) =&gt; any | - |
| coverRender | Customize step cover | (params: &#123; step: TourStepItem, index: number &#125;) =&gt; any | - |
| titleRender | Customize step title | (params: &#123; step: TourStepItem, index: number &#125;) =&gt; any | - |
| descriptionRender | Customize step description | (params: &#123; step: TourStepItem, index: number &#125;) =&gt; any | - |

## Types

### TourStepItem

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| target | Get the element the guide card points to. Empty makes it show in center of screen | HTMLElement \| (() =&gt; HTMLElement) \| null | - | - |
| arrow | Whether to show the arrow, including the configuration whether to point to the center of the element | boolean \| &#123; pointAtCenter: boolean &#125; | true | - |
| closeIcon | Customize close icon | VueNode | true | - |
| cover | Displayed pictures or videos | VueNode | - | - |
| title | Title | VueNode | - | - |
| description | Description | VueNode | - | - |
| placement | Position of the guide card relative to the target element | `center` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` | - |
| mask | Whether to enable masking, change mask style and fill color by pass custom props, the default follows the `mask` property of Tour | boolean \| &#123; style?: CSSProperties; color?: string &#125; | true | - |
| type | Type, affects the background color and text color | 'default' \| 'primary' | `default` | - |
| nextButtonProps | Properties of the Next button | &#123; children?: VueNode; onClick?: () =&gt; void; class?: string; style?: CSSProperties &#125; | - | - |
| prevButtonProps | Properties of the previous button | &#123; children?: VueNode; onClick?: () =&gt; void; class?: string; style?: CSSProperties &#125; | - | - |
| scrollIntoViewOptions | support pass custom scrollIntoView options, the default follows the `scrollIntoViewOptions` property of Tour | boolean \| ScrollIntoViewOptions | true | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Tour"></ComponentTokenTable>
