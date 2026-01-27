<docs lang="zh-CN">
面包屑支持下拉菜单。
</docs>

<docs lang="en-US">
Breadcrumbs support drop down menu.
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

const items = [
  {
    title: 'Antdv Next',
  },
  {
    title: 'Component',
    href: '',
  },
  {
    title: 'General',
    href: '',
    menu: { items: menuItems },
  },
  {
    title: 'Button',
  },
]
</script>

<template>
  <a-breadcrumb :items="items" />
</template>
