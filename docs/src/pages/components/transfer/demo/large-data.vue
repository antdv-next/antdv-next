<docs lang="zh-CN">
大数据下使用分页。
</docs>

<docs lang="en-US">
Store a large amount of items with pagination.
</docs>

<script setup lang="ts">
import type { TransferEmits, TransferKey } from 'antdv-next'
import { onMounted, ref } from 'vue'

interface RecordType {
  key: string
  title: string
  description: string
  chosen: boolean
}

const oneWay = ref(false)
const mockData = ref<RecordType[]>([])
const targetKeys = ref<TransferKey[]>([])

onMounted(() => {
  const newTargetKeys: TransferKey[] = []
  const newMockData: RecordType[] = []
  for (let i = 0; i < 2000; i++) {
    const data = {
      key: i.toString(),
      title: `content${i + 1}`,
      description: `description of content${i + 1}`,
      chosen: i % 2 === 0,
    }
    if (data.chosen) {
      newTargetKeys.push(data.key)
    }
    newMockData.push(data)
  }
  targetKeys.value = newTargetKeys
  mockData.value = newMockData
})

const handleChange: TransferEmits['change'] = (newTargetKeys, direction, moveKeys) => {
  console.log(newTargetKeys, direction, moveKeys)
  targetKeys.value = newTargetKeys
}
</script>

<template>
  <div>
    <a-transfer
      v-model:target-keys="targetKeys"
      :data-source="mockData"
      :render="(item: RecordType) => item.title"
      :one-way="oneWay"
      pagination
      @change="handleChange"
    />
    <a-switch
      v-model:checked="oneWay"
      checked-children="one way"
      un-checked-children="one way"
      style="margin-top: 16px"
    />
  </div>
</template>
