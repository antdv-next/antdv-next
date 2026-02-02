---
category: Components
group: Data Display
title: Timeline
description: Vertical display timeline.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*FkTySqNt3sYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*yIl9S4hAIBcAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

- When a series of information needs to be ordered by time (ascending or descending).
- When you need a timeline to make a visual connection.

## Examples {#examples}

<demo-group>
<demo src="./demo/basic.vue">Basic</demo>
<demo src="./demo/alternate.vue">Alternate</demo>
<demo src="./demo/custom.vue">Custom</demo>
<demo src="./demo/pending.vue">Pending</demo>
<demo src="./demo/title.vue">Label</demo>
<demo src="./demo/variant.vue">Variant</demo>
<demo src="./demo/end.vue">Right Alternate</demo>
<demo src="./demo/horizontal.vue">Horizontal</demo>
<demo src="./demo/title-span.vue">Title Offset</demo>
<demo src="./demo/semantic.vue">Semantic Sample</demo>
<demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

### Props

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function | Record&lt;SemanticDOM, string&gt; | - | - |
| items | Each node of timeline | TimelineItemProps[] | - | - |
| mode | By sending `alternate` the timeline will distribute the nodes to the left and right | `left` \| `alternate` \| `right` | - | - |
| pending | Set the last ghost node's existence or its content. Use `item.loading` instead | VueNode | false | - |
| pendingDot | Set the dot of the last ghost node when pending is true. Use `item.icon` instead | VueNode | &lt;LoadingOutlined /&gt; | - |
| reverse | Whether reverse nodes or not | boolean | false | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record&lt;SemanticDOM, CSSProperties&gt; | - | - |
| dotRender | Custom rendering function for timeline dot | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - | - |
| labelRender | Custom rendering function for timeline label | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - | - |
| contentRender | Custom rendering function for timeline content | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| pending | Set the last ghost node's existence or its content | () =&gt; VueNode | - |
| pendingDot | Set the dot of the last ghost node when pending is true | () =&gt; VueNode | - |
| dotRender | Custom rendering function for timeline dot | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - |
| labelRender | Custom rendering function for timeline label | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - |
| contentRender | Custom rendering function for timeline content | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - |

## Types

### TimelineItem

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Set the content | VueNode | - | - |
| color | Set the circle's color to `blue`, `red`, `green`, `gray` or other custom colors | string | `blue` | - |
| dot | Customize timeline dot | VueNode | - | - |
| key | Unique key for this item | Key | - | - |
| label | Set the label | VueNode | - | - |
| loading | Set loading state | boolean | false | - |
| pending | Whether this item is pending | boolean | false | - |
| position | Customize node position | `left` \| `right` | - | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token {#design-token}

<ComponentTokenTable component="Timeline"></ComponentTokenTable>
