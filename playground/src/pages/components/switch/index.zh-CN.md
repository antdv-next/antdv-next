---
category: Components
group: 数据录入
title: Switch
subtitle: 开关
description: 使用开关切换两种状态之间。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*rtArRpBNDZcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*al07RK8SGf4AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

- 需要表示开关状态/两种状态之间的切换时；
- 和 `checkbox` 的区别是，切换 `switch` 会直接触发状态改变，而 `checkbox` 一般用于状态标记，需要和提交操作配合。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/disabled.vue">不可用</demo>
  <demo src="./demo/text.vue">文字和图标</demo>
  <demo src="./demo/size.vue">两种大小</demo>
  <demo src="./demo/loading.vue">加载中</demo>
  <demo src="./demo/component-token.vue" debug>自定义组件 Token</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoFocus | 组件挂载时自动获取焦点 | boolean | false | - |
| checked | 指定当前是否选中，支持 `v-model:checked` | string \ | number \ | boolean \ | object | false | - |
| checkedChildren | 选中时的内容 | VueNode | - | - |
| checkedValue | 选中时的值 | string \| number \| boolean \| object | true | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | SwitchClassNamesType | - | - |
| defaultChecked | 初始是否选中 | string \| number \| boolean \| object | false | - |
| defaultValue | `defaultChecked` 的别名 | string \| number \| boolean \| object | - | 5.12.0 |
| disabled | 是否禁用 | boolean | false | - |
| loading | 加载中的开关 | boolean | false | - |
| size | 开关大小，可选值：`default` `small` | `default` \| `small` | `default` | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | SwitchStylesType | - | - |
| unCheckedChildren | 非选中时的内容 | VueNode | - | - |
| unCheckedValue | 非选中时的值 | string \| number \| boolean \| object | false | - |
| value | `checked` 的别名，支持 `v-model:value` | string \ | number \ | boolean \ | object | - | 5.12.0 |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 变化时的回调函数 | (checked: boolean, event: Event) =&gt; void | - |
| click | 点击时的回调函数 | (checked: boolean, event: Event) =&gt; void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| checkedChildren | 选中时的内容 | () =&gt; VueNode | - |
| unCheckedChildren | 非选中时的内容 | () =&gt; VueNode | - |

### 方法 {#methods}

| 名称 | 说明 | 版本 |
| --- | --- | --- |
| blur() | 移除焦点 | - |
| focus() | 获取焦点 | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Switch"></ComponentTokenTable>

## FAQ

### 为什么在 Form.Item 下不能绑定数据？ {#faq-binding-data}

Form.Item 默认绑定值属性到 `value` 上，而 Switch 的值属性为 `checked`。你可以通过 `v-model:checked` 来修改绑定的值属性。

```vue
<a-form-item name="fieldA">
  <a-switch v-model:checked="form.fieldA" />
</a-form-item>
```
