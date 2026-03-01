<docs lang="zh-CN">
支持三种类型：图片、Icon 以及字符，其中 Icon 和字符型可以自定义图标颜色及背景色。
</docs>

<docs lang="en-US">
Image, Icon and letter are supported, and the latter two kinds of avatar can have custom colors and background colors.
</docs>

<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'

const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
</script>

<template>
  <a-space :size="16" wrap>
    <a-avatar>
      <template #icon>
        <UserOutlined />
      </template>
    </a-avatar>
    <a-avatar>U</a-avatar>
    <a-avatar :size="40">
      USER
    </a-avatar>
    <a-avatar :src="url" />
    <a-avatar>
      <template #src>
        <img :src="url" alt="avatar" :draggable="false">
      </template>
    </a-avatar>
    <a-avatar style="background-color: #fde3cf; color: #f56a00;">
      U
    </a-avatar>
    <a-avatar style="background-color: #87d068;">
      <template #icon>
        <UserOutlined />
      </template>
    </a-avatar>
  </a-space>
</template>
