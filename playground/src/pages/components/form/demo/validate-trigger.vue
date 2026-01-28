<docs lang="zh-CN">
配置字段触发校验的时机。
</docs>

<docs lang="en-US">
Configure validate trigger timing for fields.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  blurInput: '',
  changeInput: '',
})
</script>

<template>
  <a-form layout="vertical" :model="model" style="max-width: 600px">
    <a-form-item
      name="blurInput"
      label="Validate on Blur"
      validate-trigger="blur"
      :rules="[{ required: true, message: 'Please input on blur.' }]"
    >
      <a-input v-model:value="model.blurInput" placeholder="blur to validate" />
    </a-form-item>
    <a-form-item
      name="changeInput"
      label="Validate on Change"
      validate-trigger="change"
      :rules="[{ required: true, message: 'Please input on change.' }]"
    >
      <a-input v-model:value="model.changeInput" placeholder="change to validate" />
    </a-form-item>
  </a-form>
</template>
