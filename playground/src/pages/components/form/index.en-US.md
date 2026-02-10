---
category: Components
group: Data Entry
title: Form
description: High-performance form component with data domain management. Includes data entry, validation, and corresponding styles.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-lcdS5Qm1bsAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ylFATY6w-ygAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use {#when-to-use}

- When you need to create an instance or collect information.
- When you need to validate fields in certain rules.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic Usage</demo>
  <demo src="./demo/control-hooks.vue">Form methods</demo>
  <demo src="./demo/layout.vue">Form Layout</demo>
  <demo src="./demo/layout-multiple.vue">Form mix layout</demo>
  <demo src="./demo/disabled.vue">Form disabled</demo>
  <demo src="./demo/variant.vue" version="5.13.0">Form variants</demo>
  <demo src="./demo/required-mark.vue">Required style</demo>
  <demo src="./demo/size.vue">Form size</demo>
  <demo src="./demo/layout-can-wrap.vue">label can wrap</demo>
  <demo src="./demo/warning-only.vue">No block rule</demo>
  <demo src="./demo/useWatch.vue">Watch Hooks</demo>
  <demo src="./demo/validate-trigger.vue">Validate Trigger</demo>
  <demo src="./demo/validate-only.vue">Validate Only</demo>
  <demo src="./demo/form-item-path.vue">Path Prefix</demo>
  <demo src="./demo/dynamic-form-item.vue">Dynamic Form Item</demo>
  <demo src="./demo/dynamic-form-items.vue">Dynamic Form nest Items</demo>
  <demo src="./demo/dynamic-form-items-complex.vue">Complex Dynamic Form Item</demo>
  <demo src="./demo/nest-messages.vue">Nest</demo>
  <demo src="./demo/complex-form-control.vue">complex form control</demo>
  <demo src="./demo/customized-form-controls.vue">Customized Form Controls</demo>
  <demo src="./demo/global-state.vue">Store Form Data into Upper Component</demo>
  <demo src="./demo/form-context.vue">Control between forms</demo>
  <demo src="./demo/inline-login.vue">Inline Login Form</demo>
  <demo src="./demo/login.vue">Login Form</demo>
  <demo src="./demo/register.vue">Registration</demo>
  <demo src="./demo/advanced-search.vue">Advanced search</demo>
  <demo src="./demo/form-in-modal.vue">Form in Modal to Create</demo>
  <demo src="./demo/time-related-controls.vue">Time-related Controls</demo>
  <demo src="./demo/without-form-create.vue">Handle Form Data Manually</demo>
  <demo src="./demo/validate-static.vue">Customized Validation</demo>
  <demo src="./demo/dynamic-rule.vue">Dynamic Rules</demo>
  <demo src="./demo/form-dependencies.vue">Dependencies</demo>
  <demo src="./demo/getValueProps-normalize.vue">getValueProps + normalize</demo>
  <demo src="./demo/validate-scroll-to-field.vue" iframe="240">Slide to error field</demo>
  <demo src="./demo/validate-other.vue">Other Form Controls</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Form

### Props {#form-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | FormClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | FormStylesType | - | - |
| colon | Configure the default value of `colon` for Form.Item. Indicates whether the colon after the label is displayed (only effective when prop layout is horizontal) | boolean | true | - |
| name | Form name. Will be the prefix of Field `id` | string | - | - |
| layout | Form layout | FormLayout | `horizontal` | - |
| labelAlign | The text align of label of all items | FormLabelAlign | `right` | - |
| labelWrap | whether label can be wrap | boolean | false | - |
| labelCol | Label layout, like `Col` component. Set `span` `offset` value like `{span: 3, offset: 12}` or `sm: {span: 3, offset: 12}` | ColProps | - | - |
| wrapperCol | The layout for input controls, same as `labelCol` | ColProps | - | - |
| feedbackIcons | Can be passed custom icons while `Form.Item` element has `hasFeedback` | FeedbackIcons | - | - |
| size | Set field component size (antd components only) | SizeType | - | - |
| disabled | Set form component disable, only available for antd components | boolean | false | - |
| scrollToFirstError | Auto scroll to first failed field when submit | ScrollFocusOptions \| boolean | false | - |
| requiredMark | Required mark style. Can use required mark or optional mark. You can not config to single Form.Item since this is a Form level config | RequiredMark | true | - |
| variant | Variant of components inside form | Variant | `outlined` | - |
| validateMessages | Validation prompt template, description [see below](#validatemessages) | ValidateMessages | - | - |
| model | Form model | Record&lt;string, any&gt; | - | - |
| rules | Form rules | Record&lt;string, Rule[]&gt; | - | - |
| validateTrigger | Config field validate trigger | string \| string[] \| false | `change` | - |
| preserve | Keep field value even when field removed. You can get the preserve field value by `getFieldsValue(true)` | boolean | true | - |
| clearOnDestroy | Clear form values when the form is uninstalled | boolean | false | - |
| validateOnRuleChange | - | boolean | - | - |
| rootClass | Root container class | string | - | - |
| prefixCls | Prefix class name | string | - | - |

### Events {#form-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| finish | Trigger after submitting the form and verifying data successfully | (values: Record&lt;string, any&gt;) =&gt; void | - |
| finishFailed | Trigger after submitting the form and verifying data failed | (errorInfo: ValidateErrorEntity) =&gt; void | - |
| submit | - | (e: Event) =&gt; void | - |
| reset | - | (e: Event) =&gt; void | - |
| validate | - | (name: InternalNamePath, status: boolean, errors: any[] \| null) =&gt; void | - |
| valuesChange | Trigger when value updated | (changedValues: Record&lt;string, any&gt;, values: Record&lt;string, any&gt;) =&gt; void | - |
| fieldsChange | Trigger when field updated | (changedFields: FieldData[], allFields: FieldData[]) =&gt; void | - |

### Methods {#form-methods}

```ts
import { FormInstance } from 'antdv-next'

const formRef = ref<FormInstance>()
```

| Method | Description | Type | Version |
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

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| name | Field name | NamePath | - | - |
| label | Label text | VueNode | - | - |
| labelAlign | The text align of label | FormLabelAlign | `right` | - |
| labelCol | The layout of label. If both Form and Form.Item exists, use Item first | ColProps | - | - |
| wrapperCol | The layout for input controls, same as `labelCol` | ColProps | - | - |
| colon | Used with `label`, whether to display `:` after label text | boolean | true | - |
| extra | The extra prompt message | VueNode | - | - |
| help | The prompt message. If not provided, the prompt message will be generated by the validation rule | VueNode | - | - |
| hasFeedback | Display validation status icon | boolean \| \{ icons: FeedbackIcons \} | false | - |
| validateStatus | The validation status | ValidateStatus | - | - |
| required | Display required style. It will be generated by the validation rule | boolean | false | - |
| rules | Rules for field validation | Rule[] | - | - |
| validateTrigger | When to validate the value of children node | string \| string[] \| false | `change` | - |
| validateDebounce | Delay milliseconds to start validation | number | - | - |
| validateFirst | Whether stop validate on first rule of error for this field. Will parallel validate when `parallel` configured | boolean \| `parallel` | false | - |
| noStyle | No style for `true`, used as a pure field control | boolean | false | - |
| id | Set sub label `htmlFor` | string | - | - |
| hidden | Whether to hide Form.Item (still collect and validate value) | boolean | false | - |
| messageVariables | The default validate field info | Record&lt;string, string&gt; | - | - |
| tooltip | Config tooltip info | VueNode \| TooltipProps & \{ icon: VueNode \} | - | - |
| layout | Form item layout | `horizontal` \| `vertical` | - | - |
| rootClass | Root container class | string | - | - |
| prefixCls | Prefix class name | string | - | - |

## Types

### validateMessages

Form provides default validation error messages. You can modify the template by configuring `validateMessages` property:

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

ConfigProvider also provides a global configuration scheme that allows for uniform configuration error notification templates.

```vue
<template>
  <a-config-provider :form="{ validateMessages }">
    <a-form />
  </a-config-provider>
</template>
```

> Note: Vue version does not provide `Form.List`. You can use `v-for` with reactive arrays to build dynamic form items.

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>


## Design Token {#design-token}

<ComponentTokenTable component="Form"></ComponentTokenTable>

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
