---
category: Components
group: 数据展示
title: Segmented
subtitle: 分段控制器
description: 用于展示多个选项并允许用户选择其中单个选项。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*XJR2TbS1aaQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-9tSSoO_MkIAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

- 用于展示多个选项并允许用户选择其中单个选项；
- 当切换选中选项时，关联区域的内容会发生变化

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/vertical.vue">垂直方向</demo>
  <demo src="./demo/block.vue">block 分段选择器</demo>
  <demo src="./demo/shape.vue">胶囊形状</demo>
  <demo src="./demo/custom.vue">自定义渲染</demo>
  <demo src="./demo/dynamic.vue">动态数据</demo>
  <demo src="./demo/disabled.vue">不可用</demo>
  <demo src="./demo/size.vue">三种大小</demo>
  <demo src="./demo/with-icon.vue">设置图标</demo>
  <demo src="./demo/icon-only.vue">只设置图标</demo>
  <demo src="./demo/with-name.vue">配合name使用</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### Props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| block | 将宽度调整为父元素宽度的选项 | boolean | false | - |
| classes | 用于自定义 Segmented 组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| defaultValue | 默认选中的值 | string \| number | - | - |
| disabled | 是否禁用 | boolean | false | - |
| options | 数据化配置选项内容 | string\[] \| number\[] \| SegmentedItemType\[] | [] | - |
| orientation | 排列方向 | `horizontal` \| `vertical` | `horizontal` | - |
| size | 控件尺寸 | `large` \| `middle` \| `small` | `middle` | - |
| styles | 用于自定义 Segmented 组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| vertical | 排列方向，与 `orientation` 同时存在，以 `orientation` 优先 | boolean | `false` | - |
| value | 当前选中的值，支持 `v-model:value` | string \ | number | - | - |
| shape | 形状 | `default` \| `round` | `default` | - |
| name | Segmented 下所有 `input[type="radio"]` 的 `name` 属性。若未设置，则将回退到随机生成的名称 | string | - | - |

### Events

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 选项变化时的回调函数 | function(value: string \| number) | - |

### Slots

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| iconRender | icon 渲染插槽 | (option: SegmentedLabeledOption) =&gt; any | - |
| labelRender | label 渲染插槽 | (option: SegmentedLabeledOption) =&gt; any | - |

## Types

### SegmentedItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| disabled | 分段项的禁用状态 | boolean | false | - |
| class | 自定义类名 | string | - | - |
| icon | 分段项的显示图标 | VueNode | - | - |
| label | 分段项的显示文本 | VueNode | - | - |
| tooltip | 分段项的工具提示 | string \| [TooltipProps](../tooltip#api) | - | - |
| value | 分段项的值 | string \| number | - | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Segmented"></ComponentTokenTable>
