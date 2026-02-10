---
category: Components
group: Data Entry
title: DatePicker
description: To select or input a date.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*qK9mRqFnBbAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*wz1QTJSQgmAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use
By clicking the input box, you can select a date from a popup calendar.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/range-picker.vue">Range Picker</demo>
  <demo src="./demo/multiple.vue" version="5.14.0">Multiple</demo>
  <demo src="./demo/needConfirm.vue" version="5.14.0">Need Confirm</demo>
  <demo src="./demo/switchable.vue">Switchable picker</demo>
  <demo src="./demo/format.vue">Date Format</demo>
  <demo src="./demo/time.vue">Choose Time</demo>
  <demo src="./demo/mask.vue" version="5.14.0">Mask Format</demo>
  <demo src="./demo/date-range.vue" version="5.14.0">Limit Date Range</demo>
  <demo src="./demo/disabled.vue">Disabled</demo>
  <demo src="./demo/disabled-date.vue">Disabled Date &amp; Time</demo>
  <demo src="./demo/allow-empty.vue">Allow Empty</demo>
  <demo src="./demo/select-in-range.vue">Select range dates</demo>
  <demo src="./demo/preset-ranges.vue">Preset Ranges</demo>
  <demo src="./demo/extra-footer.vue">Extra Footer</demo>
  <demo src="./demo/size.vue">Three Sizes</demo>
  <demo src="./demo/cell-render.vue">Customized Cell Rendering</demo>
  <demo src="./demo/components.vue" version="5.14.0">Customize Panel</demo>
  <demo src="./demo/external-panel.vue">External use panel</demo>
  <demo src="./demo/buddhist-era.vue" version="5.14.0">Buddhist Era</demo>
  <demo src="./demo/status.vue">Status</demo>
  <demo src="./demo/variant.vue" version="5.13.0">Variants</demo>
  <demo src="./demo/style-class.vue" version="6.0.0">Custom semantic dom styling</demo>
  <demo src="./demo/placement.vue">Placement</demo>
  <demo src="./demo/suffix.vue">Prefix and Suffix</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

There are five kinds of picker:

- DatePicker
- DatePicker[picker="month"]
- DatePicker[picker="week"]
- DatePicker[picker="year"]
- DatePicker[picker="quarter"] (Added in 4.1.0)
- RangePicker

### Localization

The default locale is en-US, if you need to use other languages, recommend to use internationalized components provided by us at the entrance. Look at: [ConfigProvider](/components/config-provider/).

If there are special needs (only modifying single component language), Please use the property: locale. Example: [default](https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json).

```vue
<script setup lang="ts">
import zhCN from 'antdv-next/locale/zh_CN'
import dayjs from 'dayjs'

import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
</script>

<template>
  <a-config-provider :locale="zhCN">
    <a-date-picker :default-value="dayjs('2015-01-01', 'YYYY-MM-DD')" />
  </a-config-provider>
</template>
```

### Common API

The following APIs are shared by DatePicker, RangePicker.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Customize clear button | boolean \| \{ clearIcon?: VueNode \} | true | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - | - |
| dateRender | Custom rendering function for date cells, >= 5.4.0 use `cellRender` instead. | function(currentDate: dayjs, today: dayjs) => VueNode | - | - |
| cellRender | Custom rendering function for picker cells | (current: dayjs, info: { originNode: VueNode, today: DateType, range?: 'start' \| 'end', type: PanelMode, locale?: Locale, subType?: 'hour' \| 'minute' \| 'second' \| 'meridiem' }) => VueNode | - | - |
| components | Custom panels | Record<Panel \| 'input', Component> | - | - |
| defaultOpen | Initial open state of picker | boolean | - | - |
| disabled | Determine whether the DatePicker is disabled | boolean | false | - |
| disabledDate | Specify the date that cannot be selected | (currentDate: dayjs, info: { from?: dayjs, type: Picker }) => boolean | - | - |
| format | To set the date format, support multi-format matching when it is an array, display the first one shall prevail. refer to [dayjs#format](https://day.js.org/docs/en/display/format). for example: [Custom Format](#date-picker-demo-format) | [formatType](#formattype) | [@rc-component/picker](https://github.com/react-component/picker/blob/f512f18ed59d6791280d1c3d7d37abbb9867eb0b/src/utils/uiUtil.ts#L155-L177) | - |
| order | Auto order date when multiple or range selection | boolean | true | - |
| ~~popupClassName~~ | To customize the className of the popup calendar, use `classes.popup.root` instead | string | - | - |
| preserveInvalidOnBlur | Not clean input on blur even when the typing is invalidate | boolean | false | - |
| getPopupContainer | To set the container of the floating layer, while the default is to create a `div` element in `body` | function(trigger) | - | - |
| inputReadOnly | Set the `readonly` attribute of the input tag (avoids virtual keyboard on touch devices) | boolean | false | - |
| locale | Localization configuration | object | [default](https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json) | - |
| minDate | The minimum date, which also limits the range of panel switching | dayjs | - | - |
| maxDate | The maximum date, which also limits the range of panel switching | dayjs | - | - |
| mode | The picker panel mode（ [Cannot select year or month anymore?](/docs/vue/faq#when-set-mode-to-datepickerrangepicker-cannot-select-year-or-month-anymore) ) | `time` \| `date` \| `month` \| `year` \| `decade` | - | - |
| needConfirm | Need click confirm button to trigger value change. Default `false` when `multiple` | boolean | - | - |
| nextIcon | The custom next icon | VueNode | - | - |
| open | The open state of picker | boolean | - | - |
| panelRender | Customize panel render | (panelNode) => VueNode | - | - |
| picker | Set picker type | `date` \| `week` \| `month` \| `quarter` \| `year` | `date` | - |
| placeholder | The placeholder of date input | string \| [string, string] | - | - |
| placement | The position where the selection box pops up | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft | - |
| ~~popupStyle~~ | To customize the style of the popup calendar, use `styles.popup.root` instead | CSSProperties | {} | - |
| prefix | The custom prefix | VueNode | - | - |
| presets | The preset ranges for quick selection, Since `5.8.0`, preset value supports callback function. | { label: VueNode, value: Dayjs \| (() => Dayjs) }[] | - | - |
| prevIcon | The custom prev icon | VueNode | - | - |
| previewValue | When the user selects the date hover option, the value of the input field undergoes a temporary change | false \| hover | hover | - |
| size | To determine the size of the input box, the height of `large` and `small`, are 40px and 24px respectively, while default size is 32px | `large` \| `middle` \| `small` | - | - |
| status | Set validation status | 'error' \| 'warning' | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | - |
| suffixIcon | The custom suffix icon | VueNode | - | - |
| superNextIcon | The custom super next icon | VueNode | - | - |
| superPrevIcon | The custom super prev icon | VueNode | - | - |
| variant | Variants of picker | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | - |

### Common Methods

| Name | Description | Version |
| --- | --- | --- |
| blur() | Remove focus | - |
| focus() | Get focus | - |

### DatePicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultPickerValue | Default panel date, will be reset when panel open | [dayjs](https://day.js.org/) | - | - |
| defaultValue | To set default date, if start time or end time is null or undefined, the date range will be an open interval | [dayjs](https://day.js.org/) | - | - |
| disabledTime | To specify the time that cannot be selected | function(date) | - | - |
| format | To set the date format. refer to [dayjs#format](https://day.js.org/docs/en/display/format) | [formatType](#formattype) | `YYYY-MM-DD` | - |
| multiple | Enable multiple selection. Not support `showTime` | boolean | false | - |
| pickerValue | Panel date. Used for controlled switching of panel date. Work with `onPanelChange` | [dayjs](https://day.js.org/) | - | - |
| renderExtraFooter | Render extra footer in panel | (mode) => VueNode | - | - |
| showNow | Show the fast access of current datetime | boolean | - | - |
| showTime | To provide an additional time selection | object \| boolean | [TimePicker Options](/components/time-picker/#api) | - |
| ~~showTime.defaultValue~~ | Use `showTime.defaultOpenValue` instead | [dayjs](https://day.js.org/) | dayjs() | - |
| showTime.defaultOpenValue | To set default time of selected date, [demo](#date-picker-demo-disabled-date) | [dayjs](https://day.js.org/) | dayjs() | - |
| showWeek | Show week info when in DatePicker | boolean | false | - |
| value | To set date, support `v-model:value` | [dayjs](https://day.js.org/) | - | - |

### DatePicker[picker=year]

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | To set default date | [dayjs](https://day.js.org/) | - | - |
| format | To set the date format. refer to [dayjs#format](https://day.js.org/docs/en/display/format) | [formatType](#formattype) | `YYYY` | - |
| multiple | Enable multiple selection | boolean | false | - |
| renderExtraFooter | Render extra footer in panel | () => VueNode | - | - |
| value | To set date, support `v-model:value` | [dayjs](https://day.js.org/) | - | - |

### DatePicker[picker=quarter]

Added in `4.1.0`.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | To set default date | [dayjs](https://day.js.org/) | - | - |
| format | To set the date format. refer to [dayjs#format](https://day.js.org/docs/en/display/format) | [formatType](#formattype) | `YYYY-\QQ` | - |
| multiple | Enable multiple selection | boolean | false | - |
| renderExtraFooter | Render extra footer in panel | () => VueNode | - | - |
| value | To set date, support `v-model:value` | [dayjs](https://day.js.org/) | - | - |

### DatePicker[picker=month]

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | To set default date | [dayjs](https://day.js.org/) | - | - |
| format | To set the date format. refer to [dayjs#format](https://day.js.org/docs/en/display/format) | [formatType](#formattype) | `YYYY-MM` | - |
| multiple | Enable multiple selection | boolean | false | - |
| renderExtraFooter | Render extra footer in panel | () => VueNode | - | - |
| value | To set date, support `v-model:value` | [dayjs](https://day.js.org/) | - | - |

### DatePicker[picker=week]

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | To set default date | [dayjs](https://day.js.org/) | - | - |
| format | To set the date format. refer to [dayjs#format](https://day.js.org/docs/en/display/format) | [formatType](#formattype) | `YYYY-wo` | - |
| multiple | Enable multiple selection | boolean | false | - |
| renderExtraFooter | Render extra footer in panel | (mode) => VueNode | - | - |
| value | To set date, support `v-model:value` | [dayjs](https://day.js.org/) | - | - |
| showWeek | Show week info when in DatePicker | boolean | true | - |

### RangePicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowEmpty | Allow start or end input leave empty | [boolean, boolean] | [false, false] | - |
| cellRender | Custom rendering function for picker cells | (current: dayjs, info: { originNode: VueNode, today: DateType, range?: 'start' \| 'end', type: PanelMode, locale?: Locale, subType?: 'hour' \| 'minute' \| 'second' \| 'meridiem' }) => VueNode | - | - |
| dateRender | Custom rendering function for date cells, >= 5.4.0 use `cellRender` instead. | function(currentDate: dayjs, today: dayjs) => VueNode | - | - |
| defaultPickerValue | Default panel date, will be reset when panel open | [dayjs](https://day.js.org/)[] | - | - |
| defaultValue | To set default date | [dayjs](https://day.js.org/)[] | - | - |
| disabled | If disable start or end | [boolean, boolean] | - | - |
| disabledTime | To specify the time that cannot be selected | function(date: dayjs, partial: `start` \| `end`, info: { from?: dayjs }) | - | - |
| format | To set the date format. refer to [dayjs#format](https://day.js.org/docs/en/display/format) | [formatType](#formattype) | `YYYY-MM-DD HH:mm:ss` | - |
| id | Config input ids | { start?: string, end?: string } | - | - |
| pickerValue | Panel date. Used for controlled switching of panel date. Work with `onPanelChange` | [dayjs](https://day.js.org/)[] | - | - |
| presets | The preset ranges for quick selection, Since `5.8.0`, preset value supports callback function. | { label: VueNode, value: (Dayjs \| (() => Dayjs))[] }[] | - | - |
| renderExtraFooter | Render extra footer in panel | () => VueNode | - | - |
| separator | Set separator between inputs | VueNode | `<SwapRightOutlined />` | - |
| showTime | To provide an additional time selection | object \| boolean | [TimePicker Options](/components/time-picker/#api) | - |
| ~~showTime.defaultValue~~ | Use `showTime.defaultOpenValue` instead | [dayjs](https://day.js.org/)[] | [dayjs(), dayjs()] | - |
| showTime.defaultOpenValue | To set default time of selected date, [demo](#date-picker-demo-disabled-date) | [dayjs](https://day.js.org/)[] | [dayjs(), dayjs()] | - |
| value | To set date, support `v-model:value` | [dayjs](https://day.js.org/)[] | - | - |

#### formatType

```typescript
import type { Dayjs } from 'dayjs'

type Generic = string
type GenericFn = (value: Dayjs) => string

export type FormatType
  = | Generic
    | GenericFn
    | Array<Generic | GenericFn>
    | {
      format: string
      type?: 'mask'
    }
```

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback function, can be executed when the selected time is changing | (date: Dayjs \| Dayjs[] \| null, dateString: string \| string[] \| null) => void | - |
| update:value | - | (date: Dayjs \| Dayjs[] \| null) => void | - |
| calendarChange | Callback function, can be executed when the start time or the end time of the range is changing. `info` argument is added in 4.4.0 | (dates: [Dayjs, Dayjs], dateStrings: [string, string], info: { range: 'start' \| 'end' }) => void | - |
| panelChange | Callback when picker panel mode is changed | (value: Dayjs, mode: PickerMode) => void | - |
| openChange | Callback function, can be executed whether the popup calendar is popped up or closed | (open: boolean) => void | - |
| ok | Callback when click ok button | () => void | - |
| select | - | (date: Dayjs) => void | - |
| focus | Trigger when get focus | (event: FocusEvent, info: { range: 'start' \| 'end' }) => void | - |
| blur | Trigger when lose focus | (event: FocusEvent, info: { range: 'start' \| 'end' }) => void | - |
| keydown | - | (event: KeyboardEvent, preventDefault: VoidFunction) => void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| suffixIcon | The custom suffix icon | () => any | - |
| renderExtraFooter | Render extra footer in panel | (mode: PickerMode) => any | - |
| panelRender | Customize panel render | (originPanel: VueNode) => any | - |
| inputRender | - | (props: Record<string, any>) => any | - |
| cellRender | Custom rendering function for picker cells | (ctx: { current: AnyObject, info: any }) => any | - |
| dateRender | Custom rendering function for date cells, >= 5.4.0 use `cellRender` instead. | (ctx: { date: AnyObject, today: AnyObject }) => any | - |
| monthCellRender | - | (ctx: { date: AnyObject, locale: any }) => any | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="DatePicker"></ComponentTokenTable>

## FAQ

### When set mode to DatePicker/RangePicker, cannot select year or month anymore? {#faq-mode-cannot-select}

Please refer [FAQ](/docs/vue/faq#when-set-mode-to-datepickerrangepicker-cannot-select-year-or-month-anymore)

### Why does the date picker switch to the date panel after selecting the year instead of the month panel? {#faq-year-to-date-panel}

After selecting the year, the system directly switches to the date panel instead of month panel. This design is intended to reduce the user's operational burden by allowing them to complete the year modification with just one click, without having to enter the month selection interface again. At the same time, it also avoids additional cognitive burden of remembering the month.

### How to use DatePicker with customize date library like dayjs? {#faq-custom-date-library}

Please refer [Use custom date library](/docs/vue/use-custom-date-library#datepicker)

### Why config dayjs.locale globally not work? {#faq-locale-not-work}

DatePicker default set `locale` as `en` in v4. You can config DatePicker `locale` prop or [ConfigProvider `locale`](/components/config-provider) prop instead.

#### Date-related components locale is not working?

See FAQ [Date-related-components-locale-is-not-working?](/docs/vue/faq#date-related-components-locale-is-not-working)

### How to modify start day of week? {#faq-week-start-day}

Please use correct [language](/docs/vue/i18n) ([#5605](https://github.com/ant-design/ant-design/issues/5605)), or update dayjs `locale` config:

- Example: <https://codesandbox.io/s/dayjs-day-of-week-x9tuj2?file=/demo.tsx>

```js
import dayjs from 'dayjs'

import updateLocale from 'dayjs/plugin/updateLocale'

import 'dayjs/locale/zh-cn'

dayjs.extend(updateLocale)
dayjs.updateLocale('zh-cn', {
  weekStart: 0,
})
```

### Why origin panel don't switch when using `panelRender`? {#faq-panel-render-switch}

When you change the layout of nodes by `panelRender`, React will unmount and re-mount it which reset the component state. You should keep the layout stable. Please ref [#27263](https://github.com/ant-design/ant-design/issues/27263) for more info.

### How to understand disabled time and date? {#faq-disabled-date-time}

Please refer to the blog ['Why is it so hard to disable the date?'](/docs/blog/picker), to learn how to use it.
