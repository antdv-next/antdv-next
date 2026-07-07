<docs lang="zh-CN">
带有文字和图标。
</docs>

<docs lang="en-US">
With text and icon.
</docs>

<script setup lang="ts">
import { CheckOutlined, CloseOutlined } from '@antdv-next/icons'
import { shallowRef } from 'vue'

const checked = shallowRef(true)
const checked1 = shallowRef(false)
const checked2 = shallowRef(true)
</script>

<template>
  <a-space vertical>
    <a-switch v-model:checked="checked" checked-children="On" un-checked-children="Off" />
    <a-switch v-model:checked="checked1" checked-children="1" un-checked-children="0" />
    <a-switch v-model:checked="checked2">
      <template #checkedChildren>
        <CheckOutlined />
      </template>
      <template #unCheckedChildren>
        <CloseOutlined />
      </template>
    </a-switch>
  </a-space>
</template>
