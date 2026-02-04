---
category: Components
group: 数据录入
title: Slider
subtitle: 滑动输入条
description: 滑动型输入器，展示当前值和可选范围。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_4heQaUrFn4AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*XkgXTaudeosAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

当用户需要在数值区间/自定义区间内进行选择时，可为连续或离散值。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/input-number.vue">带输入框的滑块</demo>
  <demo src="./demo/icon-slider.vue">带 icon 的滑块</demo>
  <demo src="./demo/tip-formatter.vue">自定义提示</demo>
  <demo src="./demo/event.vue">事件</demo>
  <demo src="./demo/mark.vue">带标签的滑块</demo>
  <demo src="./demo/vertical.vue">垂直</demo>
  <demo src="./demo/show-tooltip.vue">控制 ToolTip 的显示</demo>
  <demo src="./demo/reverse.vue">反向</demo>
  <demo src="./demo/draggableTrack.vue">范围可拖拽</demo>
  <demo src="./demo/multiple.vue">多点组合</demo>
  <demo src="./demo/editable.vue">动态增减节点</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| defaultValue | 设置初始取值。当 `range` 为 false 时，使用 number，否则用 [number, number] | number \| [number, number] | 0 \| [0, 0] | - |
| disabled | 值为 true 时，滑块为禁用状态 | boolean | false | - |
| dots | 是否只能拖拽到刻度上 | boolean | false | - |
| included | `marks` 不为空对象时有效，值为 true 时表示值为包含关系，false 表示并列 | boolean | true | - |
| keyboard | 支持使用键盘操作 handler | boolean | true | 5.2.0+ |
| marks | 刻度标记，key 的类型必须为 `number` 且取值在闭区间 [min, max] 内，每个标签可以单独设置样式 | object | &#123; number: VueNode &#125; \| &#123; number: &#123; style: CSSProperties, label: VueNode &#125; &#125; | - |
| max | 最大值 | number | 100 | - |
| min | 最小值 | number | 0 | - |
| orientation | 排列方向 | `horizontal` \| `vertical` | `horizontal` | - |
| range | 双滑块模式 | boolean \| [RangeConfig](#rangeconfig) | false | - |
| reverse | 反向坐标轴 | boolean | false | - |
| step | 步长，取值必须大于 0，并且可被 (max - min) 整除。当 `marks` 不为空对象时，可以设置 `step` 为 null，此时 Slider 的可选值仅有 `marks`、`min` 和 `max` | number \| null | 1 | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| tooltip | 设置 Tooltip 相关属性 | [TooltipConfig](#tooltipconfig) | - | 4.23.0 |
| value | 设置当前取值。当 `range` 为 false 时，使用 number，否则用 [number, number]，支持 `v-model:value` | number \ | [number, number] | - | - |
| vertical | 值为 true 时，Slider 为垂直方向。与 `orientation` 同时存在，以 `orientation` 优先 | boolean | false | - |

### RangeConfig

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| draggableTrack | 范围刻度是否可被拖拽 | boolean | false | - |
| editable | 启动动态增减节点，不能和 `draggableTrack` 一同使用 | boolean | false | 5.20.0 |
| minCount | 配置 `editable` 时，最小节点数量 | number | 0 | 5.20.0 |
| maxCount | 配置 `editable` 时，最大节点数量 | number | - | 5.20.0 |

### TooltipConfig

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | 是否自动调整弹出位置 | boolean | true | 5.8.0 |
| formatter | Slider 会把当前值传给 `formatter`，并在 Tooltip 中显示 `formatter` 的返回值，若为 null，则隐藏 Tooltip | (value: number) =&gt; VueNode \| null | IDENTITY | 4.23.0 |
| getPopupContainer | Tooltip 渲染父节点，默认渲染到 body 上 | (triggerNode: HTMLElement) =&gt; HTMLElement | () =&gt; document.body | 4.23.0 |
| open | 值为 true 时，Tooltip 将会始终显示；否则始终不显示，哪怕在拖拽及移入时 | boolean | - | 4.23.0 |
| placement | 设置 Tooltip 展示位置。参考 [Tooltip](/components/tooltip/) | string | - | 4.23.0 |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 当 Slider 的值发生改变时，会触发 change 事件，并把改变后的值作为参数传入 | (value: number \| [number, number]) =&gt; void | - |
| changeComplete | 与 `mouseup` 和 `keyup` 触发时机一致，把当前值作为参数传入 | (value: number \| [number, number]) =&gt; void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| mark | 自定义刻度内容 | (mark: &#123; point: number; label?: any &#125;) =&gt; VueNode | - |

### 方法 {#methods}

| 名称 | 说明 | 版本 |
| --- | --- | --- |
| blur() | 移除焦点 | - |
| focus() | 获取焦点 | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Slider"></ComponentTokenTable>
