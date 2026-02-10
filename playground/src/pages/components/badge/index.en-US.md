---
category: Components
title: Badge
description: Small numerical value or status descriptor for UI elements.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*e0qITYqF394AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*v8EQT7KoGbcAAAAAAAAAAAAADrJ8AQ/original
group: Data Display
demo:
  cols: 2
---

## When To Use {#when-to-use}

Badge normally appears in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count.

## Examples {#examples}

<demo-group>
<demo src="./demo/basic.vue">Basic</demo>
<demo src="./demo/no-wrapper.vue">Standalone</demo>
<demo src="./demo/overflow.vue">Overflow Count</demo>
<demo src="./demo/dot.vue">Red badge</demo>
<demo src="./demo/change.vue">Dynamic</demo>
<demo src="./demo/link.vue">Clickable</demo>
<demo src="./demo/offset.vue">Offset</demo>
<demo src="./demo/size.vue">Size</demo>
<demo src="./demo/status.vue">Status</demo>
<demo src="./demo/colorful.vue">Colorful Badge</demo>
<demo src="./demo/ribbon.vue">Ribbon</demo>
<demo src="./demo/style-class.vue" version="6.0.0">Custom semantic dom styling</demo>
<demo src="./demo/title.vue" debug>Title</demo>
</demo-group>

## API

### Props {#props}

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| count | Number to show in badge | VueNode | - | - |
| showZero | Whether to show badge when `count` is zero | boolean | false | - |
| overflowCount | Max count to show | number | 99 | - |
| dot | Whether to display a red dot instead of `count` | boolean | false | - |
| scrollNumberPrefixCls | - | string | - | - |
| status | Set Badge as a status dot | PresetStatusColorType | - | - |
| color | Customize Badge dot color | LiteralUnion&lt;PresetColorKey&gt; | - | - |
| text | If `status` is set, `text` sets the display text of the status `dot` | VueNode | - | - |
| size | If `count` is set, `size` sets the size of badge | 'default' \| 'small' | - | - |
| offset | Set offset of the badge dot | [number \| string, number \| string] | - | - |
| title | Text to show when hovering over the badge | string | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | BadgeClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | BadgeStylesType | - | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| count | Number to show in badge | () =&gt; any | - |
| text | If `status` is set, `text` sets the display text of the status `dot` | () =&gt; any | - |

## Semantic DOM

### Badge

<demo src="./demo/_semantic.vue" simplify></demo>

### BadgeRibbon

<demo src="./demo/_semantic_ribbon.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Badge" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
