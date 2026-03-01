<docs lang="zh-CN">
头像有三种尺寸，两种形状可选。
</docs>

<docs lang="en-US">
Three sizes and two shapes are available.
</docs>

<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-space direction="vertical" :size="16">
    <a-space wrap :size="16">
      <a-avatar :size="64">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <a-avatar size="large">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <a-avatar>
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <a-avatar size="small">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <a-avatar :size="14">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
    </a-space>
    <a-space wrap :size="16">
      <a-avatar shape="square" :size="64">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <a-avatar shape="square" size="large">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <a-avatar shape="square">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <a-avatar shape="square" size="small">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <a-avatar shape="square" :size="14">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
    </a-space>
  </a-space>
</template>
