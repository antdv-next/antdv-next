---
category: Components
group: 数据录入
title: Radio
subtitle: 单选框
description: 用于在多个备选项中选中单个状态。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*mrPVRope68wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*xPfTSphsiA0AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

- 用于在多个备选项中选中单个状态。
- 和 Select 的区别是，Radio 所有选项默认可见，方便用户在比较中选择，因此选项不宜过多。

```vue
<script lang="ts" setup>
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <!-- 使用 Radio.Group 组件时，推荐的写法 ✅ -->
  <a-radio-group
    v-model:value="value"
    :options="[
      { value: 1, label: 'A' },
      { value: 2, label: 'B' },
      { value: 3, label: 'C' },
    ]"
  />
  <!-- 不推荐的写法 🙅🏻‍♀️ -->
  <a-radio-group v-model:value="value">
    <a-radio :value="1">
      A
    </a-radio>
    <a-radio :value="2">
      B
    </a-radio>
    <a-radio :value="3">
      C
    </a-radio>
  </a-radio-group>
</template>
```

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/disabled.vue">不可用</demo>
  <demo src="./demo/radiogroup.vue">单选组合</demo>
  <demo src="./demo/radiogroup-more.vue">Radio.Group 垂直</demo>
  <demo src="./demo/radiogroup-block.vue">Block 单选组合</demo>
  <demo src="./demo/radiogroup-options.vue">Radio.Group 组合 - 配置方式</demo>
  <demo src="./demo/radiobutton.vue">按钮样式</demo>
  <demo src="./demo/radiogroup-with-name.vue">单选组合 - 配合 name 使用</demo>
  <demo src="./demo/size.vue">大小</demo>
  <demo src="./demo/radiobutton-solid.vue">填底的按钮样式</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### Radio/RadioButton {#radio}

#### Props {#radio-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| checked | 指定当前是否选中，支持 `v-model:checked` | boolean | false | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| disabled | 禁用 Radio | boolean | false | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| value | 根据 value 进行比较，判断是否选中 | any | - | - |

#### 方法 {#radio-methods}

| 名称 | 说明 |
| --- | --- |
| blur() | 移除焦点 |
| focus() | 获取焦点 |

### RadioGroup {#radiogroup}

单选框组合，用于包裹一组 `Radio`。

#### Props {#radiogroup-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| block | 将 RadioGroup 宽度调整为其父宽度的选项 | boolean | false | - |
| buttonStyle | RadioButton 的风格样式，目前有描边和填色两种风格 | `outline` \| `solid` | `outline` | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| defaultValue | 默认选中的值 | any | - | - |
| disabled | 禁选所有子单选器 | boolean | false | - |
| name | RadioGroup 下所有 `input[type="radio"]` 的 `name` 属性。若未设置，则将回退到随机生成的名称 | string | - | - |
| options | 以配置形式设置子元素 | string\[] \| number\[] \| Array&lt;[CheckboxOptionType](#checkboxoptiontype)&gt; | - | - |
| optionType | 用于设置 Radio `options` 类型 | `default` \| `button` | `default` | - |
| orientation | 排列方向 | `horizontal` \| `vertical` | `horizontal` | - |
| size | 大小，只对按钮样式生效 | `large` \| `middle` \| `small` | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| value | 用于设置当前选中的值，支持 `v-model:value` | any | - | - |
| vertical | 值为 true，Radio Group 为垂直方向。与 `orientation` 同时存在，以 `orientation` 优先 | boolean | false | - |

#### Events {#radiogroup-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 选项变化时的回调函数 | (e: RadioChangeEvent) =&gt; void | - |

#### Slots {#radiogroup-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| labelRender | label 渲染插槽 | (params: &#123; item: CheckboxOptionType, index: number &#125;) =&gt; any | - |

## Types

### CheckboxOptionType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| label | 用于作为 Radio 选项展示的文本 | `string` | - | - |
| value | 关联 Radio 选项的值 | `string` \| `number` \| `boolean` | - | - |
| style | 应用到 Radio 选项的 style | `CSSProperties` | - | - |
| class | Radio 选项的类名 | `string` | - | - |
| disabled | 指定 Radio 选项是否要禁用 | `boolean` | `false` | - |
| title | 添加 Title 属性值 | `string` | - | - |
| id | 添加 Radio Id 属性值 | `string` | - | - |
| onChange | 当 Radio Group 的值发送改变时触发 | `(e: CheckboxChangeEvent) => void;` | - | - |
| required | 指定 Radio 选项是否必填 | `boolean` | `false` | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Radio"></ComponentTokenTable>
