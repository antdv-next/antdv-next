---
category: Components
group: Data Entry
title: Slider
description: A Slider component for displaying current value and intervals in range.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_4heQaUrFn4AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*XkgXTaudeosAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

Used to input a value within a specified range.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/input-number.vue">Slider with InputNumber</demo>
  <demo src="./demo/icon-slider.vue">Slider with icon</demo>
  <demo src="./demo/tip-formatter.vue">Customize tooltip</demo>
  <demo src="./demo/event.vue">Event</demo>
  <demo src="./demo/mark.vue">Graduated slider</demo>
  <demo src="./demo/vertical.vue">Vertical</demo>
  <demo src="./demo/show-tooltip.vue">Control ToolTip</demo>
  <demo src="./demo/reverse.vue">Reverse</demo>
  <demo src="./demo/draggableTrack.vue">Draggable Track</demo>
  <demo src="./demo/multiple.vue">Multiple Handles</demo>
  <demo src="./demo/editable.vue">Dynamic edit nodes</demo>
  <demo src="./demo/style-class.vue">Customize Semantic Elements</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props {#props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| defaultValue | The default value of the slider. When `range` is false, use number, otherwise, use [number, number] | number \| [number, number] | 0 \| [0, 0] | - |
| disabled | If true, the slider will not be interactive | boolean | false | - |
| dots | Whether the thumb can only be dragged to tick marks | boolean | false | - |
| included | Takes effect when `marks` is not null. True means containment and false means coordinative | boolean | true | - |
| keyboard | Support using keyboard to move handlers | boolean | true | 5.2.0+ |
| marks | Tick marks of Slider. The type of key must be `number`, and must be in closed interval [min, max]. Each mark can declare its own style | object | &#123; number: VueNode &#125; \| &#123; number: &#123; style: CSSProperties, label: VueNode &#125; &#125; | - |
| max | The maximum value the slider can slide to | number | 100 | - |
| min | The minimum value the slider can slide to | number | 0 | - |
| orientation | Orientation direction | `horizontal` \| `vertical` | `horizontal` | - |
| range | Enable dual thumb mode for range selection | boolean \| [RangeConfig](#rangeconfig) | false | - |
| reverse | Reverse the component | boolean | false | - |
| step | The granularity the slider can step through values. Must be greater than 0, and be divisible by (max - min). When `step` is `null` and `marks` exist, valid points will only be marks, `min` and `max` | number \| null | 1 | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| tooltip | The tooltip related props | [TooltipConfig](#tooltipconfig) | - | 4.23.0 |
| value | The value of slider. When `range` is false, use number, otherwise, use [number, number], support `v-model:value` | number \ | [number, number] | - | - |
| vertical | If true, the slider will be vertical. Simultaneously existing with `orientation`, `orientation` takes priority | boolean | false | - |

### RangeConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| draggableTrack | Whether range track can be dragged | boolean | false | - |
| editable | Dynamic edit nodes. Cannot be used with `draggableTrack` | boolean | false | 5.20.0 |
| minCount | The minimum count of nodes | number | 0 | 5.20.0 |
| maxCount | The maximum count of nodes | number | - | 5.20.0 |

### TooltipConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | Whether to automatically adjust the popup position | boolean | true | 5.8.0 |
| formatter | Slider will pass its value to `formatter`, display its value in Tooltip, and hide the Tooltip when the returned value is null | (value: number) =&gt; VueNode \| null | IDENTITY | 4.23.0 |
| getPopupContainer | The DOM container of the Tooltip. The default behavior is to create a div element in the body | (triggerNode: HTMLElement) =&gt; HTMLElement | () =&gt; document.body | 4.23.0 |
| open | If true, Tooltip will always be visible; if false, it will never be visible, even when dragging or hovering | boolean | - | 4.23.0 |
| placement | Set Tooltip display position. Ref [Tooltip](/components/tooltip/) | string | - | 4.23.0 |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback function that is fired when the user changes the slider's value | (value: number \| [number, number]) =&gt; void | - |
| changeComplete | Fire when `mouseup` or `keyup` is fired | (value: number \| [number, number]) =&gt; void | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| mark | Custom mark content | (mark: &#123; point: number; label?: any &#125;) =&gt; VueNode | - |

### Methods {#methods}

| Name | Description | Version |
| --- | --- | --- |
| blur() | Remove focus | - |
| focus() | Get focus | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Slider"></ComponentTokenTable>
