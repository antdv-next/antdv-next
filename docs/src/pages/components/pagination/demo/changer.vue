<docs lang="zh-CN">
改变每页显示条目数。
</docs>

<docs lang="en-US">
Change `pageSize`.
</docs>

<script setup lang="ts">
import type { PaginationEmits } from 'antdv-next'

const handleShowSizeChange: PaginationEmits['showSizeChange'] = (current, pageSize) => {
  console.log(current, pageSize)
}
</script>

<template>
  <a-space direction="vertical" size="medium" style="width: 100%">
    <a-pagination
      show-size-changer
      :default-current="3"
      :total="500"
      @show-size-change="handleShowSizeChange"
    />
    <a-pagination
      show-size-changer
      :default-current="3"
      :total="500"
      disabled
      @show-size-change="handleShowSizeChange"
    />
  </a-space>
</template>
