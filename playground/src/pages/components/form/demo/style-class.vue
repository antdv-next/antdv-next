<docs lang="zh-CN">
自定义语义化结构的样式和类。
</docs>

<docs lang="en-US">
Custom semantic dom styling.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  name: '',
  email: '',
})

const classes = {
  root: 'form-demo-root',
  label: 'form-demo-label',
  content: 'form-demo-content',
}

const styles = {
  root: { background: '#f6f7fb', padding: '16px', borderRadius: '8px' },
}
</script>

<template>
  <a-form
    :model="model"
    layout="vertical"
    :classes="classes"
    :styles="styles"
    style="max-width: 600px"
  >
    <a-form-item label="Name" name="name" :rules="[{ required: true }]">
      <a-input v-model:value="model.name" />
    </a-form-item>
    <a-form-item label="Email" name="email" :rules="[{ type: 'email' }]">
      <a-input v-model:value="model.email" />
    </a-form-item>
    <a-form-item :label="null">
      <a-button type="primary">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>

<style scoped>
.form-demo-label {
  color: #1677ff;
}

.form-demo-content :deep(.ant-input) {
  border-color: #1677ff;
}
</style>
