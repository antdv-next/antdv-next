<docs lang="zh-CN">
通过设置 `showTotal` 展示总共有多少数据。
</docs>

<docs lang="en-US">
You can show the total number of data by setting `showTotal`.
</docs>

<script setup lang="ts">
import type { PaginationProps } from 'antdv-next'

const showTotal: PaginationProps['showTotal'] = total => `Total ${total} items`
const showRangeTotal: PaginationProps['showTotal'] = (total, range) => `${range[0]}-${range[1]} of ${total} items`
</script>

<template>
  <a-space direction="vertical" size="medium" style="width: 100%">
    <a-pagination
      :total="85"
      :show-total="showTotal"
      :default-page-size="20"
      :default-current="1"
    />
    <a-pagination
      :total="85"
      :show-total="showRangeTotal"
      :default-page-size="20"
      :default-current="1"
    />
  </a-space>
</template>
