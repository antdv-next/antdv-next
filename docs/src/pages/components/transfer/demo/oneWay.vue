<docs lang="zh-CN">
通过 `oneWay` 将 Transfer 转为单向样式。
</docs>

<docs lang="en-US">
Use `oneWay` to make Transfer the one way style.
</docs>

<script setup lang="ts">
import type { TransferEmits, TransferKey } from 'antdv-next'
import { ref } from 'vue'

interface RecordType {
  key: string
  title: string
  description: string
  disabled: boolean
}

const mockData = Array.from({ length: 20 }).map<RecordType>((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
  disabled: i % 3 < 1,
}))

const oriTargetKeys = mockData.filter(item => Number(item.key) % 3 > 1).map(item => item.key)

const targetKeys = ref<TransferKey[]>(oriTargetKeys)
const selectedKeys = ref<string[]>([])
const disabled = ref(false)

const handleChange: TransferEmits['change'] = (newTargetKeys, direction, moveKeys) => {
  targetKeys.value = newTargetKeys
  console.log('targetKeys: ', newTargetKeys)
  console.log('direction: ', direction)
  console.log('moveKeys: ', moveKeys)
}

const handleSelectChange: TransferEmits['selectChange'] = (sourceSelectedKeys, targetSelectedKeys) => {
  selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys] as string[]
  console.log('sourceSelectedKeys: ', sourceSelectedKeys)
  console.log('targetSelectedKeys: ', targetSelectedKeys)
}

const handleScroll: TransferEmits['scroll'] = (direction, e) => {
  console.log('direction:', direction)
  console.log('target:', (e.target as HTMLElement | null)?.className)
}
</script>

<template>
  <div>
    <a-transfer
      v-model:target-keys="targetKeys"
      v-model:selected-keys="selectedKeys"
      :data-source="mockData"
      :titles="['Source', 'Target']"
      :render="(item: RecordType) => item.title"
      :disabled="disabled"
      one-way
      @change="handleChange"
      @select-change="handleSelectChange"
      @scroll="handleScroll"
    />
    <a-switch
      v-model:checked="disabled"
      checked-children="disabled"
      un-checked-children="disabled"
      style="margin-top: 16px"
    />
  </div>
</template>
