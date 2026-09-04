<docs lang="zh-CN">
给评分组件加上文案展示。
</docs>

<docs lang="en-US">
Add copywriting in rate components.
</docs>

<script setup lang="ts">
import type { RateProps } from 'antdv-next'
import { ref } from 'vue'

function getDescTitle(value: number, desc: RateProps['tooltips']) {
  const item = desc?.[value - 1]
  return typeof item === 'object' ? item.title : item
}
const desc: RateProps['tooltips'] = [
  'terrible',
  { placement: 'top', title: 'bad', trigger: 'hover' },
  'normal',
  'good',
  'wonderful',
]
const value = ref(3)
</script>

<template>
  <a-flex gap="medium" vertical>
    <a-rate v-model:value="value" :tooltips="desc" />
    <template v-if="value">
      <span>{{ getDescTitle(value, desc) }}</span>
    </template>
  </a-flex>
</template>
