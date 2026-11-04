<docs lang="zh-CN">
label 可换行展示。
</docs>

<docs lang="en-US">
Allow label text to wrap.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  username: '',
  password: '',
  password1: '',
})
</script>

<template>
  <a-form
    name="wrap"
    :model="model"
    :label-col="{ flex: '110px' }"
    label-align="start"
    label-wrap
    :wrapper-col="{ flex: 1 }"
    :colon="false"
    style="max-width: 600px"
  >
    <a-form-item label="Normal label" name="username" :rules="[{ required: true }]">
      <a-input v-model:value="model.username" />
    </a-form-item>

    <a-form-item label="A super long label text" name="password" :rules="[{ required: true }]">
      <a-input v-model:value="model.password" />
    </a-form-item>

    <a-form-item label="A super long label text" name="password1">
      <a-input v-model:value="model.password1" />
    </a-form-item>

    <a-form-item label=" ">
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
