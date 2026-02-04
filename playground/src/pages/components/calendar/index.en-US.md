---
category: Components
group: Data Display
title: Calendar
description: A container that displays data in calendar form.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*nF6_To7pDSAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-p-wQLik200AAAAAAAAAAAAADrJ8AQ/original
---

## When To Use {#when-to-use}

When data is in the form of dates, such as schedules, timetables, prices calendar, lunar calendar. This component also supports Year/Month switch.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue" clientOnly>Basic</demo>
  <demo src="./demo/notice-calendar.vue" clientOnly>Notice Calendar</demo>
  <demo src="./demo/card.vue" clientOnly>Card</demo>
  <demo src="./demo/select.vue" clientOnly>Selectable Calendar</demo>
  <demo src="./demo/lunar.vue" clientOnly>Lunar Calendar</demo>
  <demo src="./demo/week.vue" clientOnly>Show Week</demo>
  <demo src="./demo/customize-header.vue" clientOnly>Customize Header</demo>
  <demo src="./demo/style-class.vue" clientOnly>Custom semantic dom styling</demo>
</demo-group>

## API

### Props

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefixCls | - | string | - | - |
| rootClass | - | string | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | CalendarClassNamesType&lt;DateType&gt; | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | CalendarStylesType&lt;DateType&gt; | - | - |
| locale | The calendar's locale | typeof enUS | [(default)](https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json) | - |
| validRange | To set valid range | [DateType, DateType] | - | - |
| disabledDate | Function that specifies the dates that cannot be selected, `currentDate` is same dayjs object as `value` prop which you [shouldn't mutate it](https://github.com/ant-design/ant-design/issues/30987) | (date: DateType) =&gt; boolean | - | - |
| dateFullCellRender | Customize the display of the date cell, the returned content will override the cell | (date: DateType) =&gt; VueNode | - | - |
| dateCellRender | Deprecated. | (date: DateType) =&gt; VueNode | - | - |
| monthFullCellRender | Deprecated. | (date: DateType) =&gt; VueNode | - | - |
| monthCellRender | Deprecated. | (date: DateType) =&gt; VueNode | - | - |
| cellRender | Customize cell content | (date: DateType, info: any) =&gt; VueNode | - | - |
| fullCellRender | Customize cell content | (date: DateType, info: any) =&gt; VueNode | - | - |
| headerRender | Render custom header in panel | HeaderRender&lt;DateType&gt; | - | - |
| value | The current selected date, support `v-model:value` | DateType | - | - |
| defaultValue | The date selected by default | DateType | - | - |
| mode | The display mode of the calendar | CalendarMode | `month` | - |
| fullscreen | Whether to display in full-screen | boolean | true | - |
| showWeek | Whether to display week number | boolean | false | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback for when date changes | (date: DateType) =&gt; void | - |
| update:value | - | (date: DateType) =&gt; void | - |
| panelChange | Callback for when panel changes | (date: DateType, mode: CalendarMode) =&gt; void | - |
| select | Callback for when a date is selected, include source info | (date: DateType, selectInfo: SelectInfo) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| dateFullCellRender | Customize the display of the date cell, the returned content will override the cell | (ctx: &#123; date: AnyObject &#125;) =&gt; any | - |
| dateCellRender | - | (ctx: &#123; date: AnyObject &#125;) =&gt; any | - |
| monthFullCellRender | - | (ctx: &#123; date: AnyObject &#125;) =&gt; any | - |
| monthCellRender | - | (ctx: &#123; date: AnyObject &#125;) =&gt; any | - |
| cellRender | Customize cell content | (ctx: &#123; date: AnyObject, info: any &#125;) =&gt; any | - |
| fullCellRender | Customize cell content | (ctx: &#123; date: AnyObject, info: any &#125;) =&gt; any | - |
| headerRender | Render custom header in panel | (config: &#123; value: AnyObject, type: CalendarMode, onChange: (date: AnyObject) =&gt; void, onTypeChange: (type: CalendarMode) =&gt; void &#125;) =&gt; any | - |

## Semantic DOM 

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Calendar" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
