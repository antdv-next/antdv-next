<docs lang="zh-CN">
快速跳转到某一页。
</docs>

<docs lang="en-US">
Jump to a page directly.
</docs>

<script setup lang="ts">
import type { PaginationEmits } from 'antdv-next'

const handleChange: PaginationEmits['change'] = (pageNumber) => {
  console.log('Page: ', pageNumber)
}
</script>

<template>
  <a-space direction="vertical" size="medium" style="width: 100%">
    <a-pagination
      show-quick-jumper
      :default-current="2"
      :total="500"
      @change="handleChange"
    />
    <a-pagination
      show-quick-jumper
      :default-current="2"
      :total="500"
      disabled
      @change="handleChange"
    />
  </a-space>
</template>
