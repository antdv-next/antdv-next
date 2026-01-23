<docs lang="zh-CN">
我们为 `<Input />` 输入框定义了三种尺寸（大、默认、小），高度分别为 `40px`、`32px` 和 `24px`。
</docs>

<docs lang="en-US">
There are three sizes of an Input box: `large` (40px), `default` (32px) and `small` (24px).
</docs>

<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <a-flex vertical gap="middle">
    <a-input v-model:value="value" size="large" placeholder="large size">
      <template #prefix>
        <UserOutlined />
      </template>
    </a-input>
    <a-input v-model:value="value" placeholder="default size">
      <template #prefix>
        <UserOutlined />
      </template>
    </a-input>
    <a-input v-model:value="value" size="small" placeholder="small size">
      <template #prefix>
        <UserOutlined />
      </template>
    </a-input>
  </a-flex>
</template>
