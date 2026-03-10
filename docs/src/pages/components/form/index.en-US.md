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
| validateTrigger | Config field validate trigger. When set to `false`, all interaction-driven validation is disabled even if a rule declares `trigger` or `validateTrigger`; `validateFields` and submit validation still run | string \| string[] \| false | `change` | - |
| preserve | Keep field value even when field removed. You can get the preserve field value by `getFieldsValue(true)` | boolean | true | - |
| clearOnDestroy | Clear form values when the form is uninstalled | boolean | false | - |
| validateOnRuleChange | Automatically revalidates the form when `Form.rules` changes | boolean | false | - |
| rootClass | Root container class | string | - | - |
| prefixCls | Prefix class name | string | - | - |

### Events {#form-events}

Vue event names omit the React `on` prefix. For example, React `onValuesChange` maps to Vue `@valuesChange`.

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| finish | Trigger after submitting the form and verifying data successfully | (values: Record&lt;string, any&gt;) =&gt; void | - |
| finishFailed | Trigger after submitting the form and verifying data failed | (errorInfo: ValidateErrorEntity) =&gt; void | - |
| submit | Triggered on native form submit before internal validation starts | (e: Event) =&gt; void | - |
| reset | Triggered on native form reset | (e: Event) =&gt; void | - |
| validate | Triggered when a single field finishes validation. Returns the field path, pass status, and error messages | (name: InternalNamePath, status: boolean, errors: any[] \| null) =&gt; void | - |
| valuesChange | Trigger when value updated | (changedValues: Record&lt;string, any&gt;, values: Record&lt;string, any&gt;) =&gt; void | - |
| fieldsChange | Trigger when field updated | (changedFields: FieldData[], allFields: FieldData[]) =&gt; void | - |

### Methods {#form-methods}

```ts
import { FormInstance } from 'antdv-next'

const formRef = ref<FormInstance>()
```

| Method | Description | Type | Version |
| --- | --- | --- | --- |
| getFieldValue | Get the value of a single field | (name: NamePath) =&gt; StoreValue | - |
| getFieldsValue | Get values of a group of fields. Pass `true` to return values of all currently collected fields | (nameList?: NamePath[] \| true) =&gt; Record&lt;string, any&gt; | - |
| getFieldError | Get error messages of a single field | (name: NamePath) =&gt; string[] | - |
| getFieldsError | Get field error info list, including `errors` and `warnings` | (nameList?: NamePath[]) =&gt; FieldError[] | - |
| getFieldWarning | Get warning messages of a single field | (name: NamePath) =&gt; string[] | - |
| isFieldsTouched | Check whether fields have been operated on. When `allFieldsTouched` is `true`, all fields must be touched | (nameList?: NamePath[] \| boolean, allFieldsTouched?: boolean) =&gt; boolean | - |
| isFieldTouched | Check whether a single field has been operated on | (name: NamePath) =&gt; boolean | - |
| isFieldsValidating | Check whether fields are validating | (nameList?: NamePath[]) =&gt; boolean | - |
| isFieldValidating | Check whether a single field is validating | (name: NamePath) =&gt; boolean | - |
| resetFields | Reset field values, status, and validation results. Resets all fields when omitted | (nameList?: NamePath[]) =&gt; void | - |
| clearValidate | Clear validation results without changing field values | (nameList?: NamePath[]) =&gt; void | - |
| setFields | Set field state and values directly. Useful for writing `errors`, `warnings`, `touched`, and similar meta manually | (data: FieldData[]) =&gt; void | - |
| setFieldValue | Set the value of a single field | (name: NamePath, value: any) =&gt; void | - |
| setFieldsValue | Set values of multiple fields in batch | (values: Record&lt;string, any&gt;) =&gt; void | - |
| validateFields | Validate fields and return the corresponding field values | (nameList?: NamePath[], options?: ValidateOptions) =&gt; Promise&lt;Record&lt;string, any&gt;&gt; | - |
| validate | Alias of `validateFields()` for validating the whole form | () =&gt; Promise&lt;Record&lt;string, any&gt;&gt; | - |
| submit | Submit the form. Equivalent to triggering form `submit` | () =&gt; void | - |
| nativeElement | Root `form` element | HTMLFormElement \| undefined | - |
| scrollToField | Scroll to the specified field. By default it will also try to focus the field | (name: NamePath, options?: ScrollFocusOptions \| boolean) =&gt; void | - |
| focusField | Focus the DOM element of the specified field | (name: NamePath) =&gt; void | - |
| getFieldInstance | Get the registered field instance | (name: NamePath) =&gt; any | - |

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
| validateTrigger | When to validate the value of children node. When set to `false`, all interaction-driven validation for the field is disabled even if a rule declares `trigger` or `validateTrigger`; explicit `validateFields` and submit validation still run | string \| string[] \| false | `change` | - |
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

#### Slots {#form-item-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Form control content | () =&gt; any | - |
| label | Custom label content (higher priority than `label` prop) | () =&gt; any | - |
| tooltip | Custom label tooltip content. The slot arg is the current `tooltip` config; when `tooltip` is an options object, returning an object from slot will be merged into it | (tooltip?: VueNode \| TooltipProps & &#123; icon: VueNode &#125;) =&gt; any | - |
| extra | Custom extra message (higher priority than `extra` prop) | () =&gt; any | - |
| help | Custom help/error message (higher priority than `help` prop) | () =&gt; any | - |

## Types

### Rule {#rule}

`rules` can be declared on `Form` for multiple fields or on `Form.Item` for a single field. The main supported types are:

```ts
type RuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'hex'
  | 'email'
  | 'tel'

type TriggerType = 'change' | 'blur' | 'focus'

type Validator = (
  rule: RuleObject,
  value: any,
  callback: (error?: string) => void,
) => Promise<void | any> | void

interface RuleObject {
  warningOnly?: boolean
  enum?: any[]
  len?: number
  max?: number
  message?: string | Component
  min?: number
  pattern?: RegExp
  required?: boolean
  transform?: (value: any) => any
  type?: RuleType | 'array'
  whitespace?: boolean
  trigger?: TriggerType | TriggerType[]
  validateTrigger?: TriggerType | TriggerType[]
  validator?: Validator
  defaultField?: RuleObject
}

type RuleRender = (form: FormInstance) => RuleObject
type Rule = RuleObject | RuleRender
```

Notes:

- `Form.rules` is typed as `Record<string, Rule[]>`
- `Form.Item.rules` is typed as `Rule[]`
- `validateTrigger` has higher priority than `trigger`
- When `type: 'array'` is used, `defaultField` can define rules for array items

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
