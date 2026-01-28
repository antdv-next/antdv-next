<docs lang="zh-CN">
组件 Token 示例。
</docs>

<docs lang="en-US">
Component token demo.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  username: '',
  password: '',
})
</script>

<template>
  <a-config-provider
    :theme="{
      components: {
        Form: {
          labelColor: '#cf1322',
          itemMarginBottom: 20,
        },
      },
    }"
  >
    <a-form :model="model" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="max-width: 600px">
      <a-form-item label="Username" name="username" :rules="[{ required: true }]">
        <a-input v-model:value="model.username" />
      </a-form-item>
      <a-form-item label="Password" name="password" :rules="[{ required: true }]">
        <a-input-password v-model:value="model.password" />
      </a-form-item>
      <a-form-item :label="null">
        <a-button type="primary">
          Submit
        </a-button>
      </a-form-item>
    </a-form>
  </a-config-provider>
</template>
