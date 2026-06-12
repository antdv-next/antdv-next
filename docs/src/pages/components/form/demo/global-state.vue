<docs lang="zh-CN">
将表单数据同步到外层状态。

`fieldsChange` 事件返回扁平的 `FieldData[]`。当字段名为数组路径时（如 `['profile', 'email']`），`FieldData.name` 会保留该路径，而不是转换为嵌套对象，便于在外部状态中逐项处理字段。
</docs>

<docs lang="en-US">
Store form data in outer reactive state.

The `fieldsChange` event returns a flat `FieldData[]`. When a field uses an array name path (e.g. `['profile', 'email']`), `FieldData.name` keeps that path instead of converting it into a nested object, making it easier to process each field entry in the external state.
</docs>

<script setup lang="ts">
import { reactive, shallowRef } from 'vue'

interface FieldData {
  name: string | number | (string | number)[]
  value?: unknown
  touched?: boolean
  validating?: boolean
  errors?: string[]
}

const model = reactive({
  username: 'Antdv Next',
  profile: {
    email: 'antdv@example.com',
  },
})

const fields = shallowRef<FieldData[]>([])

function onFieldsChange(_: FieldData[], allFields: FieldData[]) {
  fields.value = allFields
}
</script>

<template>
  <a-form name="global_state" layout="inline" :model="model" @fields-change="onFieldsChange">
    <a-form-item
      name="username"
      label="Username"
      :rules="[{ required: true, message: 'Username is required!' }]"
    >
      <a-input v-model:value="model.username" />
    </a-form-item>
    <a-form-item :name="['profile', 'email']" label="Email">
      <a-input v-model:value="model.profile.email" />
    </a-form-item>
  </a-form>
  <a-typography-paragraph style="max-width: 440px; margin-top: 24px">
    <pre style="border: none">{{ JSON.stringify(fields.length ? fields : model, null, 2) }}</pre>
  </a-typography-paragraph>
</template>
