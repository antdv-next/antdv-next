<docs lang="zh-CN">
支持 SFC 模式，使用 `a-breadcrumb-item` 与 `a-breadcrumb-separator` 组合并支持下拉菜单。
</docs>

<docs lang="en-US">
Support SFC mode using `a-breadcrumb-item` and `a-breadcrumb-separator` with dropdown menu.
</docs>

<script setup lang="ts">
import { h } from 'vue'

const menuItems = [
  {
    key: '1',
    label: h('a', { target: '_blank', rel: 'noopener noreferrer', href: 'http://www.alipay.com/' }, 'General'),
  },
  {
    key: '2',
    label: h('a', { target: '_blank', rel: 'noopener noreferrer', href: 'http://www.taobao.com/' }, 'Layout'),
  },
  {
    key: '3',
    label: h('a', { target: '_blank', rel: 'noopener noreferrer', href: 'http://www.tmall.com/' }, 'Navigation'),
  },
]
</script>

<template>
  <a-breadcrumb separator="">
    <a-breadcrumb-item>
      Antdv Next
    </a-breadcrumb-item>
    <a-breadcrumb-separator>
      >
    </a-breadcrumb-separator>
    <a-breadcrumb-item href="">
      Component
    </a-breadcrumb-item>
    <a-breadcrumb-separator />
    <a-breadcrumb-item href="" :menu="{ items: menuItems }">
      General
    </a-breadcrumb-item>
    <a-breadcrumb-separator />
    <a-breadcrumb-item>
      Button
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>
