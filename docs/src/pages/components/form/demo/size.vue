<docs lang="zh-CN">
表单尺寸联动展示。
</docs>

<docs lang="en-US">
Change form size for built-in controls.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  size: 'medium',
  input: '',
  select: undefined as string | undefined,
  switch: true,
})

const selectOptions = [{ label: 'Demo', value: 'demo' }]
</script>

<template>
  <a-form
    :model="model"
    layout="horizontal"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 14 }"
    :size="model.size as any"
    style="max-width: 600px"
  >
    <a-form-item label="Form Size" name="size">
      <a-radio-group v-model:value="model.size">
        <a-radio-button value="small">
          Small
        </a-radio-button>
        <a-radio-button value="medium">
          Medium
        </a-radio-button>
        <a-radio-button value="large">
          Large
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Input" name="input">
      <a-input v-model:value="model.input" />
    </a-form-item>
    <a-form-item label="Select" name="select">
      <a-select v-model:value="model.select" :options="selectOptions" />
    </a-form-item>
    <a-form-item label="InputNumber" name="number">
      <a-input-number style="width: 100%" />
    </a-form-item>
    <a-form-item label="Switch" name="switch">
      <a-switch v-model:checked="model.switch" />
    </a-form-item>
    <a-form-item label="Button">
      <a-button>Button</a-button>
    </a-form-item>
  </a-form>
</template>
