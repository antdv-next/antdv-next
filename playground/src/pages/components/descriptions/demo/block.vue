<docs lang="zh-CN">
整行的展示。
</docs>

<docs lang="en-US">
Display of the entire line.
</docs>

<script setup lang="ts">
  import type { DescriptionsItemType } from 'antdv-next'

  const items: DescriptionsItemType[] = [
    {
      label: 'UserName',
      content: 'Zhou Maomao',
    },
    {
      label: 'Live',
      span: 'filled', // span = 2
      content: 'Hangzhou, Zhejiang',
    },
    {
      label: 'Remark',
      span: 'filled', // span = 3
      content: 'empty',
    },
    {
      label: 'Address',
      span: 1, // span will be 3 and warning for span is not align to the end
      content: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
    },
  ]
</script>

<template>
  <a-descriptions title="User Info" :items="items" bordered />
</template>
