---
category: Components
group: Data Display
title: Tooltip
description: Simple text popup box.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*9LKlRbWytugAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*bCbPTJ7LQngAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

- The tip is shown on mouse enter, and is hidden on mouse leave. The Tooltip doesn't support complex text or operations.
- To provide an explanation of a `button/text/operation`. It's often used instead of the html `title` attribute.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/smooth-transition.vue">Smooth Transition</demo>
  <demo src="./demo/placement.vue">Placement</demo>
  <demo src="./demo/arrow.vue">Arrow</demo>
  <demo src="./demo/shift.vue" iframe="300">Auto Shift</demo>
  <demo src="./demo/colorful.vue">Colorful Tooltip</demo>
  <demo src="./demo/disabled.vue">Disabled</demo>
  <demo src="./demo/disabled-children.vue" debug>Disabled children</demo>
  <demo src="./demo/wrap-custom-component.vue">Wrap custom component</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

### Props

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | Popup alignment config | AlignType | - | - |
| arrow | Show, hide or keep arrow in the center | boolean \| &#123; pointAtCenter?: boolean &#125; | - | - |
| autoAdjustOverflow | Auto adjust placement when tooltip is invisible | boolean \| AdjustOverflow | - | - |
| color | The background color. After using this attribute, the internal text color will adapt automatically | LiteralUnion&lt;PresetColorType&gt; | - | - |
| open | Whether tooltip is visible | boolean | - | - |
| defaultOpen | Initial open state | boolean | false | - |
| getPopupContainer | Specify container for tooltip | (triggerNode: HTMLElement) =&gt; HTMLElement | - | - |
| destroyOnHidden | Destroy tooltip when hidden | boolean | - | - |
| zIndex | Set z-index of tooltip | number | - | - |
| placement | Tooltip placement | TooltipPlacement | top | - |
| trigger | Trigger action | ActionType \| ActionType[] | - | - |
| fresh | Update content even when tooltip is hidden | boolean | - | - |
| mouseEnterDelay | Delay in seconds before showing tooltip | number | 0.1 | - |
| mouseLeaveDelay | Delay in seconds before hiding tooltip | number | 0.1 | - |
| classes | Semantic DOM class. Supports object or function | TooltipClassNamesType | - | - |
| styles | Semantic DOM style. Supports object or function | TooltipStylesType | - | - |
| getTooltipContainer | Legacy alias of `getPopupContainer` | (node: HTMLElement) =&gt; HTMLElement | - | - |
| motion | Popup motion config | VcTooltipProps['motion'] | - | - |
| afterOpenChange | Callback after visibility change | (open: boolean) =&gt; void | - | - |
| builtinPlacements | Built-in placement config | typeof Placements | - | - |
| title | The text shown in the tooltip | VueNode | - | - |
| overlay | Legacy alias of `title` | VueNode | - | - |
| openClass | Class added to child when tooltip is open | string | - | - |
| unique | Enable unique display inside `AUniqueProvider`/ConfigProvider | boolean | - | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| openChange | Callback when tooltip visibility changes | (open: boolean) =&gt; void | - |
| update:open | Emit when tooltip visibility changes | (open: boolean) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | The text shown in the tooltip | () =&gt; any | - |

### Methods

| Method | Description | Type | Version |
| --- | --- | --- | --- |
| forcePopupAlign | Deprecated | VoidFunction | - |
| forceAlign | Force popup realign | VoidFunction | - |
| nativeElement | Wrapped dom element. Not promise valid if child not support ref | HTMLElement | - |
| popupElement | Popup dom element | HTMLDivElement | - |

### ConfigProvider - tooltip.unique {#config-provider-tooltip-unique}

You can configure global unique display for Tooltip through ConfigProvider. When `unique` is set to `true`, only one Tooltip under the ConfigProvider will be displayed at the same time, providing better user experience and smooth transition effects.

Note: After configuration, properties like `getPopupContainer`, `arrow` etc. will be ignored.

```vue
<template>
  <a-config-provider :tooltip="{ unique: true }">
    <a-space>
      <a-tooltip title="First tooltip">
        <a-button>Button 1</a-button>
      </a-tooltip>
      <a-tooltip title="Second tooltip">
        <a-button>Button 2</a-button>
      </a-tooltip>
    </a-space>
  </a-config-provider>
</template>
```

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Tooltip"></ComponentTokenTable>

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.

## FAQ

### Why doesn't HOC work sometimes? {#faq-hoc-component}

Please ensure that the child elements of `Tooltip` can accept `mouseenter`, `mouseleave`, `pointerenter`, `pointerleave`, `focus`, `click` events.

Please refer to https://github.com/ant-design/ant-design/issues/15909

### Why Tooltip not update content when close? {#faq-content-not-update}

Tooltip will cache content when it is closed to avoid flicker when content is updated:

```vue
<a-tooltip :open="user" :title="user?.name" />
```

<div>
<img alt="no blink" height="50" src="https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*KVx7QLOYwVsAAAAAAAAAAAAADrJ8AQ/original" />
</div>

If need update content when close, you can set `fresh` property ([#44830](https://github.com/ant-design/ant-design/issues/44830)):

```vue
<a-tooltip :open="user" :title="user?.name" fresh />
```

<div>
<img alt="no blink" height="50" src="https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*rUbsR4xWpMsAAAAAAAAAAAAADrJ8AQ/original" />
</div>
