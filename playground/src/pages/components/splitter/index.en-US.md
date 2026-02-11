---
category: Components
group: Layout
title: Splitter
description: Split panels to isolate content.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*f0SISaETY0wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*y92yRYhObU8AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
tag: 5.21.0
---

## When To Use

Provide a draggable split panel for creating complex multi-column or multi-row layouts.

## Examples {#examples}

<demo-group>
  <demo src="./demo/size.vue">Basic</demo>
  <demo src="./demo/vertical.vue">Vertical</demo>
  <demo src="./demo/control.vue">Controlled</demo>
  <demo src="./demo/collapsible.vue">Collapsible</demo>
  <demo src="./demo/collapsibleIcon.vue">Collapsible Icon</demo>
  <demo src="./demo/multiple.vue">Multiple</demo>
  <demo src="./demo/group.vue">Layout Group</demo>
  <demo src="./demo/size-mix.vue">Size Mix</demo>
  <demo src="./demo/lazy.vue">Lazy</demo>
  <demo src="./demo/reset.vue" version="1.0.3">Double-clicked reset</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Splitter

#### Props {#splitter-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| collapsibleIcon | Custom collapsible icon | &#123; start?: VueNode; end?: VueNode &#125; | - | 6.0.0 |
| draggerIcon | Custom dragger icon | VueNode | - | 6.0.0 |
| lazy | Lazy rendering mode | boolean | false | 5.23.0 |
| orientation | Layout direction | `vertical` \| `horizontal` | `horizontal` | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| vertical | Orientation, Simultaneously existing with `orientation`, `orientation` takes priority | boolean | false | - |

#### Events {#splitter-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| collapse | Callback when expanding or collapsing | (collapsed: boolean[], sizes: number[]) =&gt; void | 5.28.0 |
| resize | Panel size change callback | (sizes: number[]) =&gt; void | - |
| resizeEnd | Drag end callback | (sizes: number[]) =&gt; void | - |
| resizeStart | Callback before dragging starts | (sizes: number[]) =&gt; void | - |

#### Slots {#splitter-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| collapsibleIconEnd | Custom collapsible end icon | () =&gt; VueNode | - |
| collapsibleIconStart | Custom collapsible start icon | () =&gt; VueNode | - |
| draggerIcon | Custom dragger icon | () =&gt; VueNode | 6.0.0 |

### SplitterPanel

#### Props {#splitter-panel-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| collapsible | Enable collapsible | boolean \| &#123; start?: boolean; end?: boolean; showCollapsibleIcon?: boolean \| 'auto' &#125; | false | 5.28.0 |
| defaultSize | Initial panel size, supports px and percentage | number \| string | - | - |
| max | Maximum threshold, supports px and percentage | number \| string | - | - |
| min | Minimum threshold, supports px and percentage | number \| string | - | - |
| resizable | Whether to enable resize | boolean | true | - |
| size | Controlled panel size, supports px and percentage | number \| string | - | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Splitter" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
