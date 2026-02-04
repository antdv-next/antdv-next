---
category: Components
group: Data Entry
title: TimePicker
description: To select/input a time.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*kGmGSLk_1fwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*1hDmQJIDFJQAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use

By clicking the input box, you can select a time from a popup panel.

## Examples

<demo-group>
<demo src="./demo/basic.vue">Basic</demo>
<demo src="./demo/value.vue">Under Control</demo>
<demo src="./demo/size.vue">Three Sizes</demo>
<demo src="./demo/need-confirm.vue" version="5.14.0">Need Confirm</demo>
<demo src="./demo/disabled.vue">disabled</demo>
<demo src="./demo/hide-column.vue">Hour and minute</demo>
<demo src="./demo/interval-options.vue">interval option</demo>
<demo src="./demo/addon.vue">Addon</demo>
<demo src="./demo/12hours.vue">12 hours</demo>
<demo src="./demo/change-on-scroll.vue" version="5.14.0">Change on scroll</demo>
<demo src="./demo/range-picker.vue">Time Range Picker</demo>
<demo src="./demo/variant.vue" version="5.13.0">Variants</demo>
<demo src="./demo/status.vue">Status</demo>
<demo src="./demo/suffix.vue">Prefix and Suffix</demo>
<demo src="./demo/style-class.vue" version="6.0.0">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### TimePicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Customize clear icon | boolean \| { clearIcon?: VueNode } | true | 5.8.0: Support object type |
| cellRender | Custom rendering function for picker cells | (current: number, info: { originNode: VueNode, today: dayjs, range?: 'start' \| 'end', subType: 'hour' \| 'minute' \| 'second' \| 'meridiem' }) => VueNode | - | 5.4.0 |
| changeOnScroll | Trigger selection when scroll the column | boolean | false | 5.14.0 |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  |
| defaultValue | To set default time | [dayjs](http://day.js.org/) | - |  |
| disabled | Determine whether the TimePicker is disabled | boolean | false |  |
| disabledTime | To specify the time that cannot be selected | [DisabledTime](#disabledtime) | - | 4.19.0 |
| format | To set the time format | string | `HH:mm:ss` |  |
| getPopupContainer | To set the container of the floating layer, while the default is to create a div element in body | function(trigger) | - |  |
| hideDisabledOptions | Whether hide the options that can not be selected | boolean | false |  |
| hourStep | Interval between hours in picker | number | 1 |  |
| inputReadOnly | Set the `readonly` attribute of the input tag (avoids virtual keyboard on touch devices) | boolean | false |  |
| minuteStep | Interval between minutes in picker | number | 1 |  |
| needConfirm | Need click confirm button to trigger value change | boolean | - | 5.14.0 |
| open | Whether to popup panel | boolean | false |  |
| placeholder | Display when there's no value | string \| \[string, string] | `Select a time` |  |
| placement | The position where the selection box pops up | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft |  |
| ~~popupClassName~~ | The className of panel, please use `classes.popup` instead | string | - |  |
| ~~popupStyle~~ | The style of panel, please use `styles.popup` instead | CSSProperties | - |  |
| prefix | The custom prefix | VueNode | - | 5.22.0 |
| previewValue | When the user selects the time hover option, the value of the input field undergoes a temporary change | false \| hover | hover | 6.0.0 |
| renderExtraFooter | Called from time picker panel to render some addon to its bottom | () => VueNode | - |  |
| secondStep | Interval between seconds in picker | number | 1 |  |
| showNow | Whether to show `Now` button on panel | boolean | - | 4.4.0 |
| size | To determine the size of the input box, the height of `large` and `small`, are 40px and 24px respectively, while default size is 32px | `large` \| `middle` \| `small` | - |  |
| status | Set validation status | 'error' \| 'warning' \| 'success' \| 'validating' | - | 4.19.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  |
| suffixIcon | The custom suffix icon | VueNode | - |  |
| use12Hours | Display as 12 hours format, with default format `h:mm:ss a` | boolean | false |  |
| value | To set time, support `v-model:value` | [dayjs](http://day.js.org/) | - |  |
| variant | Variants of picker | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 5.13.0 \| `underlined`: 5.24.0 |
| onChange | A callback function, can be executed when the selected time is changing | function(time: dayjs, timeString: string): void | - |  |
| onOpenChange | A callback function which will be called while panel opening/closing | (open: boolean) => void | - |  |

#### DisabledTime

```typescript
type DisabledTime = (now: Dayjs) => {
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  disabledMilliseconds?: (
    selectedHour: number,
    selectedMinute: number,
    selectedSecond: number,
  ) => number[]
}
```

Note: `disabledMilliseconds` is added in `5.14.0`.

## Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | Remove focus |         |
| focus() | Get focus    |         |

### RangePicker

Same props from [RangePicker](/components/date-picker/#rangepicker) of DatePicker. And includes additional props:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabledTime | To specify the time that cannot be selected | [RangeDisabledTime](#rangedisabledtime) | - | 4.19.0 |
| order | Order start and end time | boolean | true | 4.1.0 |

### RangeDisabledTime

```typescript
type RangeDisabledTime = (
  now: Dayjs,
  type = 'start' | 'end',
) => {
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
}
```

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="DatePicker"></ComponentTokenTable>

## FAQ

- [How to use TimePicker with customize date library like dayjs](/docs/vue/use-custom-date-library#timepicker)
