<docs lang="zh-CN">
自定义穿梭框全选按钮的文字。
</docs>

<docs lang="en-US">
Custom the labels for select all checkboxes.
</docs>

<script setup lang="ts">
import type { TransferEmits, TransferKey, TransferProps } from 'antdv-next'
import { ref } from 'vue'

interface RecordType {
  key: string
  title: string
  description: string
}

const mockData = Array.from({ length: 10 }).map<RecordType>((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
}))

const oriTargetKeys = mockData.filter(item => Number(item.key) % 3 > 1).map(item => item.key)

const selectAllLabels: TransferProps['selectAllLabels'] = [
  'Select All',
  ({ selectedCount, totalCount }: { selectedCount: number, totalCount: number }) => `${selectedCount}/${totalCount}`,
]

const targetKeys = ref<TransferKey[]>(oriTargetKeys)

const handleChange: TransferEmits['change'] = (newTargetKeys) => {
  targetKeys.value = newTargetKeys
}
</script>

<template>
  <a-transfer
    v-model:target-keys="targetKeys"
    :data-source="mockData"
    :render="(item: RecordType) => item.title"
    :select-all-labels="selectAllLabels"
    @change="handleChange"
  />
</template>
