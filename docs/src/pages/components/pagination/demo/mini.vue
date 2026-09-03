<docs lang="zh-CN">
迷你版本。
</docs>

<docs lang="en-US">
Mini size pagination.
</docs>

<script setup lang="ts">
import type { PaginationProps } from 'antdv-next'

const showTotal: PaginationProps['showTotal'] = total => `Total ${total} items`
</script>

<template>
  <a-space direction="vertical" size="medium" style="width: 100%">
    <a-pagination size="small" :total="50" />
    <a-pagination size="small" :total="50" show-size-changer show-quick-jumper />
    <a-pagination size="small" :total="50" :show-total="showTotal" />
    <a-pagination
      size="small"
      :total="50"
      disabled
      :show-total="showTotal"
      show-size-changer
      show-quick-jumper
    />
  </a-space>
</template>
