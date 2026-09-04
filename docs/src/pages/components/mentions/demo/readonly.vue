<docs lang="zh-CN">
通过 `disabled` 属性设置是否生效。通过 `readOnly` 属性设置是否只读。
</docs>

<docs lang="en-US">
Configure `disabled` and `readOnly`.
</docs>

<script setup lang="ts">
import type { MentionsProps } from 'antdv-next'

const options: MentionsProps['options'] = ['afc163', 'zombiej', 'yesmeck'].map(value => ({
  value,
  key: value,
  label: value,
}))
</script>

<template>
  <a-flex vertical gap="medium">
    <a-mentions
      style="width: 100%"
      placeholder="this is disabled Mentions"
      disabled
      :options="options"
    />
    <a-mentions
      style="width: 100%"
      placeholder="this is readOnly Mentions"
      readonly
      :options="options"
    />
  </a-flex>
</template>
