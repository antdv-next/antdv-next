---
category: Components
group: 数据录入
title: Checkbox
subtitle: 多选框
description: 收集用户的多项选择。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*DzgiRbW3khIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G3MjTYXL6AIAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本用法</demo>
  <demo src="./demo/disabled.vue">失效</demo>
  <demo src="./demo/controller.vue">受控的 Checkbox</demo>
  <demo src="./demo/group.vue">Checkbox 组</demo>
  <demo src="./demo/check-all.vue">全选</demo>
  <demo src="./demo/layout.vue">布局</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### Checkbox

#### 属性 {#checkbox-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| checked | 指定当前是否选中，支持 `v-model:checked` | string \ | number \ | boolean \ | object | false | - |
| checkedValue | 选中时的值 | string \| number \| boolean \| object | true | - |
| defaultChecked | 初始是否选中 | string \| number \| boolean \| object | false | - |
| disabled | 失效状态 | boolean | false | - |
| indeterminate | 设置 indeterminate 状态，只负责样式控制 | boolean | false | - |
| unCheckedValue | 非选中时的值 | string \| number \| boolean \| object | false | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: \{ props \})=&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: \{ props \})=&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |

#### 事件 {#checkbox-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 变化时的回调函数 | (e: CheckboxChangeEvent) =&gt; void | - |
| focus | 获得焦点时的回调 | function() | - |
| blur | 失去焦点时的回调 | function() | - |

### CheckboxGroup

#### 属性 {#checkboxgroup-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| options | 指定可选项 | string\[] \| number\[] \| Option\[] | \[] | - |
| disabled | 整组失效 | boolean | false | - |
| name | CheckboxGroup 下所有 `input[type="checkbox"]` 的 `name` 属性 | string | - | - |
| value | 指定选中的选项，支持 `v-model:value` | (string \ | number \ | boolean)\[] | \[] | - |
| labelRender | - | (params: &#123; item: CheckboxOptionType, index: number &#125;) =&gt; any | - | - |

#### 事件 {#checkboxgroup-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 变化时的回调函数 | (checkedValue: T[]) =&gt; void | - |

#### 插槽 {#checkboxgroup-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| labelRender | - | (params: &#123; item: CheckboxOptionType, index: number &#125;) =&gt; any | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）

<ComponentTokenTable component="Checkbox" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
