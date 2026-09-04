<docs lang="zh-CN">
使用 `status` 为 Mentions 添加状态。可选 `error` 或者 `warning`。
</docs>

<docs lang="en-US">
Add status to Mentions with `status`, which could be `error` or `warning`.
</docs>

<script setup lang="ts">
import type { MentionsEmits, MentionsProps } from 'antdv-next'

const options: MentionsProps['options'] = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
]

const handleChange: MentionsEmits['change'] = (value) => {
  console.log('Change:', value)
}

const handleSelect: MentionsEmits['select'] = (option) => {
  console.log('select', option)
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-mentions
      default-value="@afc163"
      status="error"
      :options="options"
      @change="handleChange"
      @select="handleSelect"
    />
    <a-mentions
      default-value="@afc163"
      status="warning"
      :options="options"
      @change="handleChange"
      @select="handleSelect"
    />
  </a-flex>
</template>
