<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Statistic 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of the Statistic by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { StatisticProps } from 'antdv-next'
import { ArrowDownOutlined, ArrowUpOutlined } from '@antdv-next/icons'

const classes = {
  root: 'custom-statistic-root',
}
const styleFn: StatisticProps['styles'] = ({ props }) => {
  const numValue = Number(props.value ?? 0)
  const isNegative = Number.isFinite(numValue) && numValue < 0
  if (isNegative) {
    return {
      title: {
        color: '#ff4d4f',
      },
      content: {
        color: '#ff7875',
      },
    } satisfies StatisticProps['styles']
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-statistic
      :value="93241"
      title="Monthly Active Users"
      :classes="classes"
      :styles="{ title: { color: '#1890ff', fontWeight: '600px' }, content: { fontSize: '24px' } }"
      suffix="users"
    >
      <template #prefix>
        <ArrowUpOutlined />
      </template>
    </a-statistic>

    <a-statistic
      :value="-18.7"
      title="Yearly Loss"
      :precision="1"
      :classes="classes"
      :styles="styleFn"
      suffix="%"
    >
      <template #prefix>
        <ArrowDownOutlined />
      </template>
    </a-statistic>
  </a-flex>
</template>

<style scoped>
.custom-statistic-root {
  border: 2px dashed #ccc;
  padding: 16px;
  border-radius: 8px;
}
</style>
