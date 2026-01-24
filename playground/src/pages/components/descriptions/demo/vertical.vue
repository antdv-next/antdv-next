<docs lang="zh-CN">
垂直的列表。
</docs>

<docs lang="en-US">
Simplest Usage.
</docs>

<script setup lang="ts">
  const items = [
    {
      key: '1',
      label: 'UserName',
      content: 'Zhou Maomao',
    },
    {
      key: '2',
      label: 'Telephone',
      content: '1810000000',
    },
    {
      key: '3',
      label: 'Live',
      content: 'Hangzhou, Zhejiang',
    },
    {
      key: '4',
      label: 'Address',
      span: 2,
      content: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
    },
    {
      key: '5',
      label: 'Remark',
      content: 'empty',
    },
  ]
</script>

<template>
  <a-descriptions title="User Info" :items="items" layout="vertical" />
</template>
