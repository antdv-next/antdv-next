---
category: Components
group: Data Display
title: Tag
description: Used for marking and categorization.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_SBsSrKLg00AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JPNAQYrVkYkAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

<DocHeading></DocHeading>

## When To Use {#when-to-use}

- It can be used to tag by dimension or property.

- When categorizing.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/colorful.vue">Colorful Tag</demo>
  <demo src="./demo/control.vue">Add & Remove Dynamically</demo>
  <demo src="./demo/checkable.vue">Checkable</demo>
  <demo src="./demo/icon.vue">Icon</demo>
  <demo src="./demo/status.vue">Status Tag</demo>
  <demo src="./demo/customize.vue">Customize close</demo>
  <demo src="./demo/disabled.vue">Disabled</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

### Property {#property}

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| checked | It is an absolute controlled component and has no uncontrolled mode.  .zh-cn 该组件为完全受控组件，不支持非受控用法。 | boolean | - | - |
| icon | Set the icon of tag | VueNode | - | - |
| disabled | Whether the tag is disabled | boolean | false | 6.0.0 |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| close | Callback executed when tag is closed (can be prevented by `e.preventDefault()`) | (e: MouseEvent) =&gt; void | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| icon | Set the icon of tag | () =&gt; any | - |
| closeIcon | Custom close icon. 5.7.0: close button will be hidden when setting to `null` or `false` | () =&gt; any | 4.4.0 |
