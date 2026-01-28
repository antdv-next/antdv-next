<docs lang="zh-CN">
最简单的用法，在浮层中可以选择或者输入日期。
</docs>

<docs lang="en-US">
Basic use case. Users can select or input a date in a panel.
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
    label: 'Remark',
    content: 'empty',
  },
  {
    key: '5',
    label: 'Address',
    content: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
  },
]
</script>

<template>
  <a-descriptions title="User Info" :items="items" />
</template>
