---
category: Components
group: 数据展示
title: Calendar
subtitle: 日历
description: 按照日历形式展示数据的容器。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*nF6_To7pDSAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-p-wQLik200AAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

当数据是日期或按照日期划分时，例如日程、课表、价格日历等，农历等。目前支持年/月切换。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue" clientOnly>基本</demo>
  <demo src="./demo/notice-calendar.vue" clientOnly>通知事项日历</demo>
  <demo src="./demo/card.vue" clientOnly>卡片模式</demo>
  <demo src="./demo/select.vue" clientOnly>选择功能</demo>
  <demo src="./demo/lunar.vue" clientOnly>农历日历</demo>
  <demo src="./demo/week.vue" clientOnly>周数</demo>
  <demo src="./demo/customize-header.vue" clientOnly>自定义头部</demo>
  <demo src="./demo/style-class.vue" clientOnly>自定义语义结构的样式和类</demo>
</demo-group>

## API

### 属性 {#props}

通用属性参考：[通用属性](/docs/vue/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| prefixCls | - | string | - | - |
| rootClass | - | string | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | CalendarClassNamesType&lt;DateType&gt; | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | CalendarStylesType&lt;DateType&gt; | - | - |
| locale | 国际化配置 | typeof enUS | [(默认配置)](https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json) | - |
| validRange | 设置可以显示的日期 | [DateType, DateType] | - | - |
| disabledDate | 不可选择的日期，参数为当前 `value`，注意使用时[不要直接修改](https://github.com/ant-design/ant-design/issues/30987) | (date: DateType) =&gt; boolean | - | - |
| dateFullCellRender | 自定义渲染日期单元格，返回内容覆盖单元格，&gt;= 5.4.0 请用 `fullCellRender` | (date: DateType) =&gt; VueNode | - | - |
| dateCellRender | Deprecated. | (date: DateType) =&gt; VueNode | - | - |
| monthFullCellRender | Deprecated. | (date: DateType) =&gt; VueNode | - | - |
| monthCellRender | Deprecated. | (date: DateType) =&gt; VueNode | - | - |
| cellRender | 自定义单元格的内容 | (date: DateType, info: any) =&gt; VueNode | - | - |
| fullCellRender | 自定义单元格的内容 | (date: DateType, info: any) =&gt; VueNode | - | - |
| headerRender | 自定义头部内容 | HeaderRender&lt;DateType&gt; | - | - |
| value | 展示日期，支持 `v-model:value` | DateType | - | - |
| defaultValue | 默认展示的日期 | DateType | - | - |
| mode | 初始模式 | CalendarMode | `month` | - |
| fullscreen | 是否全屏显示 | boolean | true | - |
| showWeek | 是否显示周数列 | boolean | false | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 日期变化回调 | (date: DateType) =&gt; void | - |
| update:value | - | (date: DateType) =&gt; void | - |
| panelChange | 日期面板变化回调 | (date: DateType, mode: CalendarMode) =&gt; void | - |
| select | 选择日期回调，包含来源信息 | (date: DateType, selectInfo: SelectInfo) =&gt; void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| dateFullCellRender | 自定义渲染日期单元格，返回内容覆盖单元格，&gt;= 5.4.0 请用 `fullCellRender` | (ctx: &#123; date: AnyObject &#125;) =&gt; any | - |
| dateCellRender | - | (ctx: &#123; date: AnyObject &#125;) =&gt; any | - |
| monthFullCellRender | - | (ctx: &#123; date: AnyObject &#125;) =&gt; any | - |
| monthCellRender | - | (ctx: &#123; date: AnyObject &#125;) =&gt; any | - |
| cellRender | 自定义单元格的内容 | (ctx: &#123; date: AnyObject, info: any &#125;) =&gt; any | - |
| fullCellRender | 自定义单元格的内容 | (ctx: &#123; date: AnyObject, info: any &#125;) =&gt; any | - |
| headerRender | 自定义头部内容 | (config: &#123; value: AnyObject, type: CalendarMode, onChange: (date: AnyObject) =&gt; void, onTypeChange: (type: CalendarMode) =&gt; void &#125;) =&gt; any | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）

<ComponentTokenTable component="Calendar" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
