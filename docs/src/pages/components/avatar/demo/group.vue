<docs lang="zh-CN">
头像组合展现。
</docs>

<docs lang="en-US">
Avatar group display.
</docs>

<script setup lang="ts">
import { AntDesignOutlined, UserOutlined } from '@antdv-next/icons'
</script>

<template>
  <div>
    <a-avatar-group>
      <a-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
      <a href="https://ant.design">
        <a-avatar style="background-color: #f56a00;">
          K
        </a-avatar>
      </a>
      <a-tooltip title="Ant User" placement="top">
        <a-avatar style="background-color: #87d068;">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
      </a-tooltip>
      <a-avatar style="background-color: #1677ff;">
        <template #icon>
          <AntDesignOutlined />
        </template>
      </a-avatar>
    </a-avatar-group>
    <a-divider />
    <a-avatar-group
      :max="{
        count: 2,
        style: { color: '#f56a00', backgroundColor: '#fde3cf' },
      }"
    >
      <a-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
      <a-avatar style="background-color: #f56a00;">
        K
      </a-avatar>
      <a-tooltip title="Ant User" placement="top">
        <a-avatar style="background-color: #87d068;">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
      </a-tooltip>
      <a-avatar style="background-color: #1677ff;">
        <template #icon>
          <AntDesignOutlined />
        </template>
      </a-avatar>
    </a-avatar-group>
    <a-divider />
    <a-avatar-group
      size="large"
      :max="{
        count: 2,
        style: { color: '#f56a00', backgroundColor: '#fde3cf' },
      }"
    >
      <a-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=3" />
      <a-avatar style="background-color: #f56a00;">
        K
      </a-avatar>
      <a-tooltip title="Ant User" placement="top">
        <a-avatar style="background-color: #87d068;">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
      </a-tooltip>
      <a-avatar style="background-color: #1677ff;">
        <template #icon>
          <AntDesignOutlined />
        </template>
      </a-avatar>
    </a-avatar-group>
    <a-divider />
    <a-avatar-group
      size="large"
      :max="{
        count: 2,
        style: { color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' },
        popover: { trigger: 'click' },
      }"
    >
      <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <a-avatar style="background-color: #f56a00;">
        K
      </a-avatar>
      <a-tooltip title="Ant User" placement="top">
        <a-avatar style="background-color: #87d068;">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
      </a-tooltip>
      <a-avatar style="background-color: #1677ff;">
        <template #icon>
          <AntDesignOutlined />
        </template>
      </a-avatar>
    </a-avatar-group>
    <a-divider />
    <a-avatar-group shape="square">
      <a-avatar style="background-color: #fde3cf;">
        A
      </a-avatar>
      <a-avatar style="background-color: #f56a00;">
        K
      </a-avatar>
      <a-avatar style="background-color: #87d068;">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <a-avatar style="background-color: #1677ff;">
        <template #icon>
          <AntDesignOutlined />
        </template>
      </a-avatar>
    </a-avatar-group>
  </div>
</template>
