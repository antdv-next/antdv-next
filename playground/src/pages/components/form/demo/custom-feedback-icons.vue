<docs lang="zh-CN">
自定义校验反馈图标。
</docs>

<docs lang="en-US">
Custom validation feedback icons.
</docs>

<script setup lang="ts">
import type { FormProps } from 'antdv-next'
import { AlertFilled, CloseSquareFilled } from '@antdv-next/icons'
import { Tooltip } from 'antdv-next'
import { h, reactive } from 'vue'

const model = reactive({
  test1: '',
  test2: '',
  test3: '@mention1',
})

function renderErrors(errors?: string[]) {
  return (errors || []).map((error, index) => h('div', { key: index }, error))
}

const feedbackIcons: FormProps['feedbackIcons'] = ({ errors }) => ({
  error: h(
    Tooltip,
    {
      color: 'red',
      title: renderErrors(errors),
    },
    {
      default: () => h(CloseSquareFilled),
    },
  ),
})

function customItemIcons({ errors }: { errors?: string[] }) {
  return {
    error: h(
      Tooltip,
      {
        color: 'pink',
        title: renderErrors(errors),
      },
      {
        default: () => h(AlertFilled),
      },
    ),
    success: false,
  }
}
</script>

<template>
  <a-form
    name="custom-feedback-icons"
    :model="model"
    style="max-width: 600px"
    :feedback-icons="feedbackIcons"
  >
    <a-form-item
      name="test1"
      label="Test"
      :rules="[{ required: true, type: 'email' }, { min: 10 }]"
      help=""
      has-feedback
    >
      <a-input v-model:value="model.test1" />
    </a-form-item>
    <a-form-item
      name="test2"
      label="Test"
      :rules="[{ required: true, type: 'email' }, { min: 10 }]"
      help=""
      :has-feedback="{ icons: customItemIcons }"
    >
      <a-input v-model:value="model.test2" />
    </a-form-item>
    <a-form-item
      name="test3"
      label="Test"
      has-feedback
      validate-status="success"
    >
      <a-mentions
        v-model:value="model.test3"
        allow-clear
        :options="[
          { value: 'mention1', label: 'mention1' },
          { value: 'mention2', label: 'mention2' },
        ]"
      />
    </a-form-item>
    <a-form-item>
      <a-button html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
