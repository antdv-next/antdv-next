<docs lang="zh-CN">
带有文字和图标。
</docs>

<docs lang="en-US">
With text and icon.
</docs>

<script setup lang="ts">
import { CheckOutlined, CloseOutlined, FrownOutlined, SmileOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-flex gap="medium" align="flex-start" justify="flex-start" vertical>
    <a-switch checked-children="On" un-checked-children="Off" :default-checked="true" />
    <a-switch :checked-children="1" :un-checked-children="0" :default-checked="true" />
    <a-switch :default-checked="true">
      <template #checkedChildren>
        <CheckOutlined />
      </template>
      <template #unCheckedChildren>
        <CloseOutlined />
      </template>
    </a-switch>
    <a-switch :default-checked="true">
      <template #checkedChildren>
        <a-flex :gap="4" justify="flex-start" align="center">
          <SmileOutlined />
          Happy
        </a-flex>
      </template>
      <template #unCheckedChildren>
        <a-flex :gap="4" justify="flex-start" align="center">
          <FrownOutlined />
          Sad
        </a-flex>
      </template>
    </a-switch>
  </a-flex>
</template>
