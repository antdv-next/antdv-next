<docs lang="zh-CN">
禁用状态样式调试。
</docs>

<docs lang="en-US">
Disabled state debug.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  username: 'Antdv Next',
  level: 'normal',
  count: 2,
})

const levelOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Admin', value: 'admin' },
]
</script>

<template>
  <a-form
    :model="model"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 14 }"
    disabled
    style="max-width: 600px"
  >
    <a-form-item label="Username" name="username">
      <a-input v-model:value="model.username" />
    </a-form-item>
    <a-form-item label="Level" name="level">
      <a-select v-model:value="model.level" :options="levelOptions" />
    </a-form-item>
    <a-form-item label="Count" name="count">
      <a-input-number v-model:value="model.count" style="width: 100%" />
    </a-form-item>
    <a-form-item label="Button">
      <a-button>Button</a-button>
    </a-form-item>
  </a-form>
</template>
