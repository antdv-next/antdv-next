<docs lang="zh-CN">
基础表单用法。
</docs>

<docs lang="en-US">
Basic form usage.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  username: '',
  password: '',
  remember: true,
})
function handleFinished(values: any) {
  console.log('Success:', values)
}
function handleFinishFailed(errorInfo: any) {
  console.log('Failed:', errorInfo)
}
</script>

<template>
  <a-form
    :model="model"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
    auto-complete="off"
    @finish="handleFinished"
    @finish-failed="handleFinishFailed"
  >
    <a-form-item name="username" label="Username" :rules="[{ required: true, message: 'Please input your username!' }]">
      <a-input v-model:value="model.username" />
    </a-form-item>
    <a-form-item name="password" label="Password" :rules="[{ required: true, message: 'Please input your password!' }]">
      <a-input-password v-model:value="model.password" />
    </a-form-item>
    <a-form-item name="remember" :label="null">
      <a-checkbox v-model:checked="model.remember">
        Remember me!
      </a-checkbox>
    </a-form-item>
    <a-form-item :label="null">
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
