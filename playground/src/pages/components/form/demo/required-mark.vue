<docs lang="zh-CN">
必选样式展示。
</docs>

<docs lang="en-US">
Display required mark styles.
</docs>

<script setup lang="ts">
import type { FormProps } from 'antdv-next'
import { InfoCircleOutlined } from '@antdv-next/icons'
import { h, reactive } from 'vue'

const model = reactive({
  requiredMarkValue: 'optional',
  fieldA: '',
  fieldB: '',
})

const requiredMarkOptions = [
  { label: 'Default', value: true },
  { label: 'Optional', value: 'optional' },
  { label: 'Hidden', value: false },
  { label: 'Customize', value: 'customize' },
]

const customizeRequiredMark: NonNullable<FormProps['requiredMark']> = (labelNode, { required }) => {
  return h(
    'span',
    {},
    [
      h(
        'span',
        {
          style: {
            display: 'inline-block',
            marginRight: '8px',
            padding: '0 6px',
            borderRadius: '4px',
            color: required ? '#cf1322' : '#faad14',
            border: `1px solid ${required ? '#cf1322' : '#faad14'}`,
          },
        },
        required ? 'Required' : 'Optional',
      ),
      labelNode,
    ],
  )
}

function formRequiredMark(value: string | boolean) {
  return value === 'customize' ? customizeRequiredMark : value
}
</script>

<template>
  <a-form
    layout="vertical"
    :model="model"
    :required-mark="formRequiredMark(model.requiredMarkValue as any)"
    style="max-width: 600px"
  >
    <a-form-item label="Required Mark" name="requiredMarkValue">
      <a-radio-group v-model:value="model.requiredMarkValue">
        <a-radio-button v-for="item in requiredMarkOptions" :key="String(item.value)" :value="item.value">
          {{ item.label }}
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Field A" required tooltip="This is a required field">
      <a-input v-model:value="model.fieldA" placeholder="input placeholder" />
    </a-form-item>
    <a-form-item
      label="Field B"
      :tooltip="{ title: 'Tooltip with customize icon', icon: InfoCircleOutlined }"
    >
      <a-input v-model:value="model.fieldB" placeholder="input placeholder" />
    </a-form-item>
    <a-form-item :label="null">
      <a-button type="primary">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
