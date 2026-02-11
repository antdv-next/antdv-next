---
category: Components
group: 数据录入
title: Form
subtitle: 表单
description: 高性能表单控件，自带数据域管理。包含数据录入、校验以及对应样式。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-lcdS5Qm1bsAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ylFATY6w-ygAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

- 需要创建实例或收集信息时。
- 需要对字段进行规则校验时。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/control-hooks.vue">表单方法</demo>
  <demo src="./demo/layout.vue">表单布局</demo>
  <demo src="./demo/layout-multiple.vue">混合布局</demo>
  <demo src="./demo/disabled.vue">禁用表单</demo>
  <demo src="./demo/variant.vue" version="5.13.0">表单变体</demo>
  <demo src="./demo/required-mark.vue">必选样式</demo>
  <demo src="./demo/size.vue">表单尺寸</demo>
  <demo src="./demo/layout-can-wrap.vue">label 换行</demo>
  <demo src="./demo/warning-only.vue">非阻塞规则</demo>
  <demo src="./demo/useWatch.vue">监听字段</demo>
  <demo src="./demo/validate-trigger.vue">校验触发时机</demo>
  <demo src="./demo/validate-only.vue">仅校验</demo>
  <demo src="./demo/form-item-path.vue">路径前缀</demo>
  <demo src="./demo/dynamic-form-item.vue">动态表单项</demo>
  <demo src="./demo/dynamic-form-items.vue">动态嵌套表单项</demo>
  <demo src="./demo/dynamic-form-items-complex.vue">复杂动态表单项</demo>
  <demo src="./demo/nest-messages.vue">嵌套字段</demo>
  <demo src="./demo/complex-form-control.vue">复杂表单控件</demo>
  <demo src="./demo/customized-form-controls.vue">自定义表单控件</demo>
  <demo src="./demo/global-state.vue">外层状态联动</demo>
  <demo src="./demo/form-context.vue">多表单协作</demo>
  <demo src="./demo/inline-login.vue">内联登录</demo>
  <demo src="./demo/login.vue">登录表单</demo>
  <demo src="./demo/register.vue">注册表单</demo>
  <demo src="./demo/advanced-search.vue">高级搜索</demo>
  <demo src="./demo/form-in-modal.vue">弹窗表单</demo>
  <demo src="./demo/time-related-controls.vue">时间相关控件</demo>
  <demo src="./demo/without-form-create.vue">手动处理表单数据</demo>
  <demo src="./demo/validate-static.vue">自定义校验展示</demo>
  <demo src="./demo/dynamic-rule.vue">动态规则</demo>
  <demo src="./demo/form-dependencies.vue">字段依赖</demo>
  <demo src="./demo/getValueProps-normalize.vue">值转换</demo>
  <demo src="./demo/validate-scroll-to-field.vue" iframe="240">滑动到错误字段</demo>
  <demo src="./demo/validate-other.vue">其他表单控件</demo>
  <demo src="./demo/style-class.vue" version="6.0.0">自定义语义结构样式</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### Form

### 属性 {#form-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | FormClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | FormStylesType | - | - |
| colon | 配置 Form.Item 的 `colon` 的默认值。表示是否显示 label 后面的冒号 (只有在属性 layout 为 horizontal 时有效) | boolean | true | - |
| name | 表单名称，会作为表单字段 `id` 前缀使用 | string | - | - |
| layout | 表单布局 | FormLayout | `horizontal` | - |
| labelAlign | label 标签的文本对齐方式 | FormLabelAlign | `right` | - |
| labelWrap | label 标签的文本换行方式 | boolean | false | - |
| labelCol | label 标签布局，同 `Col` 组件，设置 `span` `offset` 值，如 `{span: 3, offset: 12}` 或 `sm: {span: 3, offset: 12}` | ColProps | - | - |
| wrapperCol | 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol | ColProps | - | - |
| feedbackIcons | 当 `Form.Item` 有 `hasFeedback` 属性时可以自定义图标 | FeedbackIcons | - | - |
| size | 设置字段组件的尺寸（仅限 antd 组件） | SizeType | - | - |
| disabled | 设置表单组件禁用，仅对 antd 组件有效 | boolean | false | - |
| scrollToFirstError | 提交失败自动滚动到第一个错误字段 | ScrollFocusOptions \| boolean | false | - |
| requiredMark | 必选样式，可以切换为必选或者可选展示样式。此为 Form 配置，Form.Item 无法单独配置 | RequiredMark | true | - |
| variant | 表单内控件变体 | Variant | `outlined` | - |
| validateMessages | 验证提示模板，说明[见下](#validatemessages) | ValidateMessages | - | - |
| model | 表单数据 | Record&lt;string, any&gt; | - | - |
| rules | 表单规则 | Record&lt;string, Rule[]&gt; | - | - |
| validateTrigger | 统一设置字段触发验证的时机 | string \| string[] \| false | `change` | - |
| preserve | 当字段被删除时保留字段值。你可以通过 `getFieldsValue(true)` 来获取保留字段值 | boolean | true | - |
| clearOnDestroy | 当表单被卸载时清空表单值 | boolean | false | - |
| validateOnRuleChange | - | boolean | - | - |
| rootClass | 根容器类名 | string | - | - |
| prefixCls | 组件前缀类名 | string | - | - |

### 事件 {#form-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| finish | 提交表单且数据验证成功后回调事件 | (values: Record&lt;string, any&gt;) =&gt; void | - |
| finishFailed | 提交表单且数据验证失败后回调事件 | (errorInfo: ValidateErrorEntity) =&gt; void | - |
| submit | - | (e: Event) =&gt; void | - |
| reset | - | (e: Event) =&gt; void | - |
| validate | - | (name: InternalNamePath, status: boolean, errors: any[] \| null) =&gt; void | - |
| valuesChange | 字段值更新时触发回调事件 | (changedValues: Record&lt;string, any&gt;, values: Record&lt;string, any&gt;) =&gt; void | - |
| fieldsChange | 字段更新时触发回调事件 | (changedFields: FieldData[], allFields: FieldData[]) =&gt; void | - |

### 方法 {#form-methods}

```ts
import { FormInstance } from 'antdv-next'

const formRef = ref<FormInstance>()
```

| 方法 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| getFieldValue | - | (name: NamePath) =&gt; StoreValue | - |
| getFieldsValue | - | (nameList?: NamePath[] \| true) =&gt; Record&lt;string, any&gt; | - |
| getFieldError | - | (name: NamePath) =&gt; string[] | - |
| getFieldsError | - | (nameList?: NamePath[]) =&gt; FieldError[] | - |
| getFieldWarning | - | (name: NamePath) =&gt; string[] | - |
| isFieldsTouched | - | (nameList?: NamePath[] \| boolean, allFieldsTouched?: boolean) =&gt; boolean | - |
| isFieldTouched | - | (name: NamePath) =&gt; boolean | - |
| isFieldsValidating | - | (nameList?: NamePath[]) =&gt; boolean | - |
| isFieldValidating | - | (name: NamePath) =&gt; boolean | - |
| resetFields | - | (nameList?: NamePath[]) =&gt; void | - |
| clearValidate | - | (nameList?: NamePath[]) =&gt; void | - |
| setFields | - | (data: FieldData[]) =&gt; void | - |
| setFieldValue | - | (name: NamePath, value: any) =&gt; void | - |
| setFieldsValue | - | (values: Record&lt;string, any&gt;) =&gt; void | - |
| validateFields | - | (nameList?: NamePath[], options?: ValidateOptions) =&gt; Promise&lt;Record&lt;string, any&gt;&gt; | - |
| validate | - | () =&gt; Promise&lt;Record&lt;string, any&gt;&gt; | - |
| submit | - | () =&gt; void | - |
| nativeElement | - | HTMLFormElement \| undefined | - |

### FormItem {#form-item}

#### Props {#form-item-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| name | 字段名 | NamePath | - | - |
| label | 标签文本 | VueNode | - | - |
| labelAlign | label 标签的文本对齐方式 | FormLabelAlign | `right` | - |
| labelCol | label 标签布局，同 `Col` 组件 | ColProps | - | - |
| wrapperCol | 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol | ColProps | - | - |
| colon | 配合 `label` 使用，是否显示 `:` | boolean | true | - |
| extra | 额外提示信息 | VueNode | - | - |
| help | 提示信息，不配置则按校验规则生成 | VueNode | - | - |
| hasFeedback | 配合 `validateStatus` 展示状态图标 | boolean \| \{ icons: FeedbackIcons \} | false | - |
| validateStatus | 校验状态 | ValidateStatus | - | - |
| required | 是否显示必选样式 | boolean | false | - |
| rules | 校验规则 | Rule[] | - | - |
| validateTrigger | 触发校验的时机 | string \| string[] \| false | `change` | - |
| validateDebounce | 延迟校验时间（毫秒） | number | - | - |
| validateFirst | 是否在第一个规则失败后停止 | boolean \| `parallel` | false | - |
| noStyle | 为 `true` 时不带样式，仅作为字段控制 | boolean | false | - |
| id | 设置 `label` 的 `htmlFor` | string | - | - |
| hidden | 是否隐藏 Form.Item（依然收集与校验） | boolean | false | - |
| messageVariables | 校验文案变量 | Record&lt;string, string&gt; | - | - |
| tooltip | 配置提示信息 | VueNode \| TooltipProps & \{ icon: VueNode \} | - | - |
| layout | 表单项布局 | `horizontal` \| `vertical` | - | - |
| rootClass | 根容器类名 | string | - | - |
| prefixCls | 组件前缀类名 | string | - | - |

### Types

#### validateMessages {#validatemessages}

Form 提供默认校验提示文案，你可以通过 `validateMessages` 自定义模板：

```ts
const validateMessages = {
  required: '\'${name}\' is required!',
}
```

```vue
<template>
  <a-form :validate-messages="validateMessages">
    ...
  </a-form>
</template>
```

ConfigProvider 也支持统一配置校验文案：

```vue
<template>
  <a-config-provider :form="{ validateMessages }">
    <a-form />
  </a-config-provider>
</template>
```

> 注意：Vue 版本没有 `Form.List`，可以使用 `v-for` + 响应式数组实现动态表单项。

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>


## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Form"></ComponentTokenTable>

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
