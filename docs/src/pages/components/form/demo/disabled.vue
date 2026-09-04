<docs lang="zh-CN">
表单整体禁用。
</docs>

<docs lang="en-US">
Disable all controls in a form.
</docs>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const componentDisabled = ref(true)
const model = reactive({
  checkbox: true,
  radio: 'apple',
  input: '',
  select: undefined as string | undefined,
  switch: false,
})

const selectOptions = [{ label: 'Demo', value: 'demo' }]
</script>

<template>
  <a-space direction="vertical" size="medium" style="width: 100%">
    <a-checkbox v-model:checked="componentDisabled">
      Form disabled
    </a-checkbox>
    <a-form
      :model="model"
      layout="horizontal"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
      :disabled="componentDisabled"
      style="max-width: 600px"
    >
      <a-form-item label="Checkbox" name="checkbox">
        <a-checkbox v-model:checked="model.checkbox">
          Checkbox
        </a-checkbox>
      </a-form-item>
      <a-form-item label="Radio" name="radio">
        <a-radio-group v-model:value="model.radio">
          <a-radio value="apple">
            Apple
          </a-radio>
          <a-radio value="pear">
            Pear
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="Input" name="input">
        <a-input v-model:value="model.input" />
      </a-form-item>
      <a-form-item label="Select" name="select">
        <a-select v-model:value="model.select" :options="selectOptions" />
      </a-form-item>
      <a-form-item label="Switch" name="switch">
        <a-switch v-model:checked="model.switch" />
      </a-form-item>
      <a-form-item label="Button">
        <a-button>Button</a-button>
      </a-form-item>
    </a-form>
  </a-space>
</template>
