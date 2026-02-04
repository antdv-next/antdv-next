---
category: Components
group: 数据录入
title: DatePicker
subtitle: 日期选择框
description: 输入或选择日期的控件。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*qK9mRqFnBbAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*wz1QTJSQgmAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/range-picker.vue">范围选择器</demo>
  <demo src="./demo/multiple.vue" version="5.14.0">多选</demo>
  <demo src="./demo/needConfirm.vue" version="5.14.0">选择确认</demo>
  <demo src="./demo/switchable.vue">切换不同的选择器</demo>
  <demo src="./demo/format.vue">日期格式</demo>
  <demo src="./demo/time.vue">日期时间选择</demo>
  <demo src="./demo/mask.vue" version="5.14.0">格式对齐</demo>
  <demo src="./demo/date-range.vue" version="5.14.0">日期限定范围</demo>
  <demo src="./demo/disabled.vue">禁用</demo>
  <demo src="./demo/disabled-date.vue">不可选择日期和时间</demo>
  <demo src="./demo/allow-empty.vue">允许留空</demo>
  <demo src="./demo/select-in-range.vue">选择不超过一定的范围</demo>
  <demo src="./demo/preset-ranges.vue">预设范围</demo>
  <demo src="./demo/extra-footer.vue">额外的页脚</demo>
  <demo src="./demo/size.vue">三种大小</demo>
  <demo src="./demo/cell-render.vue">定制单元格</demo>
  <demo src="./demo/components.vue" version="5.14.0">定制面板</demo>
  <demo src="./demo/external-panel.vue">外部使用面板</demo>
  <demo src="./demo/buddhist-era.vue" version="5.14.0">佛历格式</demo>
  <demo src="./demo/status.vue">自定义状态</demo>
  <demo src="./demo/variant.vue" version="5.13.0">形态变体</demo>
  <demo src="./demo/style-class.vue" version="6.0.0">自定义语义结构的样式和类</demo>
  <demo src="./demo/placement.vue">弹出位置</demo>
  <demo src="./demo/suffix.vue">前后缀</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

日期类组件包括以下五种形式。

- DatePicker
- DatePicker[picker="month"]
- DatePicker[picker="week"]
- DatePicker[picker="year"]
- DatePicker[picker="quarter"] (4.1.0 新增)
- RangePicker

### 国际化配置 {#localization}

默认配置为 en-US，如果你需要设置其他语言，推荐在入口处使用我们提供的国际化组件，详见：[ConfigProvider](/components/config-provider/)。

如有特殊需求（仅修改单一组件的语言），请使用 locale 参数，参考：[默认配置](https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json)。

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

### 共同的 API {#common-api}

以下 API 为 DatePicker、RangePicker 共享的 API。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 自定义清除按钮 | boolean \| { clearIcon?: VueNode } | true | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - | - |
| dateRender | 自定义日期单元格的内容，>= 5.4.0 起用 `cellRender` 代替 | function(currentDate: dayjs, today: dayjs) => VueNode | - | - |
| cellRender | 自定义单元格的内容 | (current: dayjs, info: { originNode: VueNode, today: DateType, range?: 'start' \| 'end', type: PanelMode, locale?: Locale, subType?: 'hour' \| 'minute' \| 'second' \| 'meridiem' }) => VueNode | - | - |
| components | 自定义面板 | Record<Panel \| 'input', Component> | - | - |
| defaultOpen | 是否默认展开控制弹层 | boolean | - | - |
| disabled | 禁用 | boolean | false | - |
| disabledDate | 不可选择的日期 | (currentDate: dayjs, info: { from?: dayjs, type: Picker }) => boolean | - | - |
| format | 设置日期格式，为数组时支持多格式匹配，展示以第一个为准。配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。示例：[自定义格式](#date-picker-demo-format) | [formatType](#formattype) | [@rc-component/picker](https://github.com/react-component/picker/blob/f512f18ed59d6791280d1c3d7d37abbb9867eb0b/src/utils/uiUtil.ts#L155-L177) | - |
| order | 多选、范围时是否自动排序 | boolean | true | - |
| ~~popupClassName~~ | 额外的弹出日历 className，使用 `classes.popup.root` 替代 | string | - | - |
| preserveInvalidOnBlur | 失去焦点是否要清空输入框内无效内容 | boolean | false | - |
| getPopupContainer | 定义浮层的容器，默认为 body 上新建 div | function(trigger) | - | - |
| inputReadOnly | 设置输入框为只读（避免在移动设备上打开虚拟键盘） | boolean | false | - |
| locale | 国际化配置 | object | [默认配置](https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json) | - |
| minDate | 最小日期，同样会限制面板的切换范围 | dayjs | - | - |
| maxDate | 最大日期，同样会限制面板的切换范围 | dayjs | - | - |
| mode | 日期面板的状态（[设置后无法选择年份/月份？](/docs/vue/faq#when-set-mode-to-datepickerrangepicker-cannot-select-year-or-month-anymore)） | `time` \| `date` \| `month` \| `year` \| `decade` | - | - |
| needConfirm | 是否需要确认按钮，为 `false` 时失去焦点即代表选择。当设置 `multiple` 时默认为 `false` | boolean | - | - |
| nextIcon | 自定义下一个图标 | VueNode | - | - |
| open | 控制弹层是否展开 | boolean | - | - |
| panelRender | 自定义渲染面板 | (panelNode) => VueNode | - | - |
| picker | 设置选择器类型 | `date` \| `week` \| `month` \| `quarter` \| `year` | `date` | - |
| placeholder | 输入框提示文字 | string \| [string, string] | - | - |
| placement | 选择框弹出的位置 | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft | - |
| ~~popupStyle~~ | 额外的弹出日历样式，使用 `styles.popup.root` 替代 | CSSProperties | {} | - |
| prefix | 自定义前缀 | VueNode | - | - |
| presets | 预设时间范围快捷选择, 自 `5.8.0` 起 value 支持函数返回值 | { label: VueNode, value: Dayjs \| (() => Dayjs) }[] | - | - |
| prevIcon | 自定义上一个图标 | VueNode | - | - |
| previewValue | 当用户选择日期悬停选项时，输入字段的值会发生临时更改 | false \| hover | hover | - |
| size | 输入框大小，`large` 高度为 40px，`small` 为 24px，默认是 32px | `large` \| `middle` \| `small` | - | - |
| status | 设置校验状态 | 'error' \| 'warning' | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | - |
| suffixIcon | 自定义的选择框后缀图标 | VueNode | - | - |
| superNextIcon | 自定义 `>>` 切换图标 | VueNode | - | - |
| superPrevIcon | 自定义 `<<` 切换图标 | VueNode | - | - |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | - |

### 共同的方法 {#common-methods}

| 名称 | 描述 | 版本 |
| --- | --- | --- |
| blur() | 移除焦点 | - |
| focus() | 获取焦点 | - |

### DatePicker

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultPickerValue | 默认面板日期，每次面板打开时会被重置到该日期 | [dayjs](https://day.js.org/) | - | - |
| defaultValue | 默认日期，如果开始时间或结束时间为 `null` 或者 `undefined`，日期范围将是一个开区间 | [dayjs](https://day.js.org/) | - | - |
| disabledTime | 不可选择的时间 | function(date) | - | - |
| format | 展示的日期格式，配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。 | [formatType](#formattype) | `YYYY-MM-DD` | - |
| multiple | 是否为多选，不支持 `showTime` | boolean | false | - |
| pickerValue | 面板日期，可以用于受控切换面板所在日期。配合 `onPanelChange` 使用。 | [dayjs](https://day.js.org/) | - | - |
| renderExtraFooter | 在面板中添加额外的页脚 | (mode) => VueNode | - | - |
| showNow | 显示当前日期时间的快捷选择 | boolean | - | - |
| showTime | 增加时间选择功能 | Object \| boolean | [TimePicker Options](/components/time-picker-cn#api) | - |
| ~~showTime.defaultValue~~ | 请使用 `showTime.defaultOpenValue` | [dayjs](https://day.js.org/) | dayjs() | - |
| showTime.defaultOpenValue | 设置用户选择日期时默认的时分秒，[例子](#date-picker-demo-disabled-date) | [dayjs](https://day.js.org/) | dayjs() | - |
| showWeek | DatePicker 下展示当前周 | boolean | false | - |
| value | 日期，支持 `v-model:value` | [dayjs](https://day.js.org/) | - | - |

### DatePicker[picker=year] {#date-picker-picker-year}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultValue | 默认日期 | [dayjs](https://day.js.org/) | - | - |
| format | 展示的日期格式，配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。 | [formatType](#formattype) | `YYYY` | - |
| multiple | 是否为多选 | boolean | false | - |
| renderExtraFooter | 在面板中添加额外的页脚 | () => VueNode | - | - |
| value | 日期，支持 `v-model:value` | [dayjs](https://day.js.org/) | - | - |

### DatePicker[picker=quarter] {#date-picker-picker-quarter}

`4.1.0` 新增。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultValue | 默认日期 | [dayjs](https://day.js.org/) | - | - |
| format | 展示的日期格式，配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。 | [formatType](#formattype) | `YYYY-\QQ` | - |
| multiple | 是否为多选 | boolean | false | - |
| renderExtraFooter | 在面板中添加额外的页脚 | () => VueNode | - | - |
| value | 日期，支持 `v-model:value` | [dayjs](https://day.js.org/) | - | - |

### DatePicker[picker=month] {#date-picker-picker-month}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultValue | 默认日期 | [dayjs](https://day.js.org/) | - | - |
| format | 展示的日期格式，配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。 | [formatType](#formattype) | `YYYY-MM` | - |
| multiple | 是否为多选 | boolean | false | - |
| renderExtraFooter | 在面板中添加额外的页脚 | () => VueNode | - | - |
| value | 日期，支持 `v-model:value` | [dayjs](https://day.js.org/) | - | - |

### DatePicker[picker=week] {#date-picker-picker-week}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultValue | 默认日期 | [dayjs](https://day.js.org/) | - | - |
| format | 展示的日期格式，配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。 | [formatType](#formattype) | `YYYY-wo` | - |
| multiple | 是否为多选 | boolean | false | - |
| renderExtraFooter | 在面板中添加额外的页脚 | (mode) => VueNode | - | - |
| value | 日期，支持 `v-model:value` | [dayjs](https://day.js.org/) | - | - |
| showWeek | DatePicker 下展示当前周 | boolean | true | - |

### RangePicker

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowEmpty | 允许起始项部分为空 | [boolean, boolean] | [false, false] | - |
| cellRender | 自定义单元格的内容 | (current: dayjs, info: { originNode: VueNode, today: DateType, range?: 'start' \| 'end', type: PanelMode, locale?: Locale, subType?: 'hour' \| 'minute' \| 'second' \| 'meridiem' }) => VueNode | - | - |
| dateRender | 自定义日期单元格的内容，>= 5.4.0 起用 `cellRender` 代替 | function(currentDate: dayjs, today: dayjs) => VueNode | - | - |
| defaultPickerValue | 默认面板日期，每次面板打开时会被重置到该日期 | [dayjs](https://day.js.org/)[] | - | - |
| defaultValue | 默认日期 | [dayjs](https://day.js.org/)[] | - | - |
| disabled | 禁用起始项 | [boolean, boolean] | - | - |
| disabledTime | 不可选择的时间 | function(date: dayjs, partial: `start` \| `end`, info: { from?: dayjs }) | - | - |
| format | 展示的日期格式，配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。 | [formatType](#formattype) | `YYYY-MM-DD HH:mm:ss` | - |
| id | 设置输入框 `id` 属性。 | { start?: string, end?: string } | - | - |
| pickerValue | 面板日期，可以用于受控切换面板所在日期。配合 `onPanelChange` 使用。 | [dayjs](https://day.js.org/)[] | - | - |
| presets | 预设时间范围快捷选择，自 `5.8.0` 起 value 支持函数返回值 | { label: VueNode, value: (Dayjs \| (() => Dayjs))[] }[] | - | - |
| renderExtraFooter | 在面板中添加额外的页脚 | () => VueNode | - | - |
| separator | 设置分隔符 | VueNode | `<SwapRightOutlined />` | - |
| showTime | 增加时间选择功能 | Object\|boolean | [TimePicker Options](/components/time-picker-cn#api) | - |
| ~~showTime.defaultValue~~ | 请使用 `showTime.defaultOpenValue` | [dayjs](https://day.js.org/)[] | [dayjs(), dayjs()] | - |
| showTime.defaultOpenValue | 设置用户选择日期时默认的时分秒，[例子](#date-picker-demo-disabled-date) | [dayjs](https://day.js.org/)[] | [dayjs(), dayjs()] | - |
| value | 日期，支持 `v-model:value` | [dayjs](https://day.js.org/)[] | - | - |

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

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 时间发生变化的回调 | (date: Dayjs \| Dayjs[] \| null, dateString: string \| string[] \| null) => void | - |
| update:value | - | (date: Dayjs \| Dayjs[] \| null) => void | - |
| calendarChange | 待选日期发生变化的回调。`info` 参数自 4.4.0 添加 | (dates: [Dayjs, Dayjs], dateStrings: [string, string], info: { range: 'start' \| 'end' }) => void | - |
| panelChange | 日历面板切换的回调 | (value: Dayjs, mode: PickerMode) => void | - |
| openChange | 弹出日历和关闭日历的回调 | (open: boolean) => void | - |
| ok | 点击确定按钮的回调 | () => void | - |
| select | - | (date: Dayjs) => void | - |
| focus | 聚焦时回调 | (event: FocusEvent, info: { range: 'start' \| 'end' }) => void | - |
| blur | 失焦时回调 | (event: FocusEvent, info: { range: 'start' \| 'end' }) => void | - |
| keydown | - | (event: KeyboardEvent, preventDefault: VoidFunction) => void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| suffixIcon | 自定义的选择框后缀图标 | () => any | - |
| renderExtraFooter | 在面板中添加额外的页脚 | (mode: PickerMode) => any | - |
| panelRender | 自定义渲染面板 | (originPanel: VueNode) => any | - |
| inputRender | - | (props: Record<string, any>) => any | - |
| cellRender | 自定义单元格的内容 | (ctx: { current: AnyObject, info: any }) => any | - |
| dateRender | 自定义日期单元格的内容，>= 5.4.0 起用 `cellRender` 代替 | (ctx: { date: AnyObject, today: AnyObject }) => any | - |
| monthCellRender | - | (ctx: { date: AnyObject, locale: any }) => any | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="DatePicker"></ComponentTokenTable>

## FAQ

### 当我指定了 DatePicker/RangePicker 的 `mode` 属性后点击后无法选择年份月份？ {#faq-mode-cannot-select}

请参考 [FAQ](/docs/vue/faq#when-set-mode-to-datepickerrangepicker-cannot-select-year-or-month-anymore)

### 为什么选完年之后会直接切回日期面板而不是月面板？ {#faq-year-to-date-panel}

选完年之后会直接切回日期面板而不是月面板，这是为了减少用户操作步骤。在绝大多数场景下，用户修改年份的同时，很可能不会修改月份，所以在选完年之后，直接切回日期面板更符合用户需求。

### 如何在 DatePicker 中使用自定义日期库（如 dayjs）? {#faq-custom-date-library}

请参考 [Use custom date library](/docs/vue/use-custom-date-library#datepicker)

### 为什么全局设置了 dayjs.locale 但 DatePicker 语言没变化？ {#faq-locale-not-work}

DatePicker 在 v4 默认将 `locale` 设置为 `en`，你可以通过 DatePicker 的 `locale` 属性或 [ConfigProvider `locale`](/components/config-provider) 属性来指定语言。

#### 日期相关的组件语言为什么不生效？

请查看 FAQ [Date-related-components-locale-is-not-working?](/docs/vue/faq#date-related-components-locale-is-not-working)

### 如何修改周的起始日？ {#faq-week-start-day}

请使用正确的 [language](/docs/vue/i18n) ([#5605](https://github.com/ant-design/ant-design/issues/5605))，或更新 dayjs `locale` 配置：

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

### 使用 `panelRender` 时为什么面板不会切换？ {#faq-panel-render-switch}

当你通过 `panelRender` 改变节点 layout 的时候，原本 Panel 会被 React 卸载然后重新挂载，造成内部状态被重置。这就导致 Panel 的切换失效。你需要保持节点结构稳定。详见 [#27263](https://github.com/ant-design/ant-design/issues/27263)。

### 如何理解日期时间的禁用？ {#faq-disabled-date-time}

请参考博客 [《为什么禁用日期这么难》](/docs/blog/picker) 了解使用方式。
