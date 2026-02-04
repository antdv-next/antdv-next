---
category: Components
title: ColorPicker
subtitle: 颜色选择器
description: 用于选择颜色。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*PpY4RYNM8UcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EHL-QYJofZsAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
group:
  title: 数据录入
---

## 何时使用 {#when-to-use}

当用户需要自定义颜色选择的时候使用。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本使用</demo>
  <demo src="./demo/size.vue">触发器尺寸大小</demo>
  <demo src="./demo/controlled.vue">受控模式</demo>
  <demo src="./demo/line-gradient.vue">渐变色</demo>
  <demo src="./demo/text-render.vue">渲染触发器文本</demo>
  <demo src="./demo/disabled.vue">禁用</demo>
  <demo src="./demo/disabled-alpha.vue">禁用透明度</demo>
  <demo src="./demo/allow-clear.vue">清除颜色</demo>
  <demo src="./demo/trigger.vue">自定义触发器</demo>
  <demo src="./demo/trigger-event.vue">自定义触发事件</demo>
  <demo src="./demo/format.vue">颜色编码</demo>
  <demo src="./demo/presets.vue">预设颜色</demo>
  <demo src="./demo/panel-render.vue">自定义面板</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 允许清除选择的颜色 | boolean | false | - |
| arrow | 配置弹出的箭头 | boolean \| &#123; pointAtCenter: boolean &#125; | true | - |
| autoAdjustOverflow | 弹窗不可见时自动调整位置 | boolean \| AdjustOverflow | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | ColorPickerClassNamesType | - | - |
| defaultFormat | 颜色格式默认的值 | ColorFormatType | `hex` | - |
| defaultValue | 颜色默认的值 | [ColorValueType](#colorvaluetype) | - | - |
| destroyOnHidden | 关闭后是否销毁弹窗 | boolean | false | - |
| disabled | 禁用颜色选择器 | boolean | false | - |
| disabledAlpha | 禁用透明度 | boolean | false | - |
| disabledFormat | 禁用选择颜色格式 | boolean | false | - |
| format | 颜色格式，支持 `v-model:format` | ColorFormatType | - | - |
| getPopupContainer | 指定弹层挂载的节点 | (triggerNode: HTMLElement) => HTMLElement | - | - |
| mode | 选择器模式，用于配置单色与渐变 | ModeType \| ModeType[] | `single` | - |
| open | 是否显示弹出窗口，支持 `v-model:open` | boolean | - | - |
| placement | 弹出窗口的位置 | TriggerPlacement | `bottomLeft` | - |
| presets | 预设的颜色 | [PresetsItem](#presetsitem)[] | - | - |
| panelRender | 自定义渲染面板 | (params: &#123; panel: any, extra: &#123; components: &#123; Picker: any, Presets: any &#125; &#125; &#125;) => any | - | - |
| rootClass | 根容器 class | string | - | - |
| showText | 显示颜色文本 | boolean \| ((params: &#123; color: Color &#125;) => any) | false | - |
| size | 设置触发器大小 | SizeType | `middle` | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | ColorPickerStylesType | - | - |
| trigger | 颜色选择器的触发模式 | TriggerType | `click` | - |
| value | 颜色的值，支持 `v-model:value` | [ColorValueType](#colorvaluetype) | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 颜色变化的回调 | (value: Color, css: string) => void | - |
| clear | 清除的回调 | () => void | - |
| changeComplete | 颜色选择完成的回调 | (value: Color) => void | - |
| openChange | 当 `open` 被改变时的回调 | (open: boolean) => void | - |
| formatChange | 颜色格式变化的回调 | (format?: ColorFormatType) => void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| default | 触发器内容 | () => any | - |
| panelRender | 自定义渲染面板 | (params: &#123; panel: any, extra: &#123; components: &#123; Picker: any, Presets: any &#125; &#125; &#125;) => any | - |
| showText | 自定义文字渲染 | (params: &#123; color: Color &#125;) => any | - |

## 类型 {#types}

### ColorValueType

```ts
type ColorValueType
  = | string
    | Color
    | { color: string | Color, percent: number }[]
    | null
```

### PresetsItem

```ts
interface PresetsItem {
  label: VueNode
  colors: ColorValueType[]
  defaultOpen?: boolean
  key?: Key
}
```

### Color

| 参数 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| toCssString | 转换成 CSS 支持的格式 | () => string | - |
| toHex | 转换成 `hex` 格式字符，返回格式如：`1677ff` | () => string | - |
| toHexString | 转换成 `hex` 格式颜色字符串，返回格式如：`#1677ff` | () => string | - |
| toHsb | 转换成 `hsb` 对象 | () => &#123; h: number, s: number, b: number, a: number &#125; | - |
| toHsbString | 转换成 `hsb` 格式颜色字符串，返回格式如：`hsb(215, 91%, 100%)` | () => string | - |
| toRgb | 转换成 `rgb` 对象 | () => &#123; r: number, g: number, b: number, a: number &#125; | - |
| toRgbString | 转换成 `rgb` 格式颜色字符串，返回格式如：`rgb(22, 119, 255)` | () => string | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="ColorPicker"></ComponentTokenTable>

## FAQ

### 关于颜色赋值的问题 {#faq-color-assignment}

颜色选择器的值同时支持字符串色值和选择器生成的 `Color` 对象，但由于不同格式的颜色字符串互相转换会有精度误差问题，所以受控场景推荐使用选择器生成的 `Color` 对象来进行赋值操作，这样可以避免精度问题，保证取值是精准的，选择器也可以按照预期工作。
