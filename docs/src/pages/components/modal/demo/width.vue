<docs lang="zh-CN">
使用 `width` 来设置模态对话框的宽度。
</docs>

<docs lang="en-US">
Use `width` to set the width of the modal dialog.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const openResponsive = ref(false)
</script>

<template>
  <a-flex vertical gap="medium" align="flex-start">
    <a-button type="primary" @click="open = true">
      Open Modal of 1000px width
    </a-button>
    <a-modal
      v-model:open="open"
      title="Modal 1000px width"
      centered
      :width="1000"
      @ok="open = false"
      @cancel="open = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>

    <a-button type="primary" @click="openResponsive = true">
      Open Modal of responsive width
    </a-button>
    <a-modal
      v-model:open="openResponsive"
      title="Modal responsive width"
      centered
      :width="{
        xs: '90%',
        sm: '80%',
        md: '70%',
        lg: '60%',
        xl: '50%',
        xxl: '40%',
      }"
      @ok="openResponsive = false"
      @cancel="openResponsive = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
  </a-flex>
</template>
