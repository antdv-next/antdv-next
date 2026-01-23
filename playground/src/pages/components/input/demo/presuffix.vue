<docs lang="zh-CN">
在输入框上添加前缀或后缀图标。
</docs>

<docs lang="en-US">
Add a prefix or suffix icons inside input.
</docs>

<script setup lang="ts">
import { InfoCircleOutlined, LockOutlined, UserOutlined } from '@antdv-next/icons'
</script>

<template>
  <div>
    <a-input placeholder="Enter your username">
      <template #prefix>
        <UserOutlined style="color: rgba(0, 0, 0, 0.25);" />
      </template>
      <template #suffix>
        <a-tooltip title="Extra information">
          <InfoCircleOutlined style="color: rgba(0, 0, 0, 0.45);" />
        </a-tooltip>
      </template>
    </a-input>
    <br>
    <br>
    <a-input prefix="￥" suffix="RMB" />
    <br>
    <br>
    <a-input prefix="￥" suffix="RMB" disabled />
    <br>
    <br>
    <a-input-password placeholder="input password support suffix">
      <template #suffix>
        <LockOutlined />
      </template>
    </a-input-password>
  </div>
</template>
