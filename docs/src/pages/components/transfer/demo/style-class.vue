<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Transfers 的语义化结构样式。
</docs>

<docs lang="en-US">
You can customize the semantic dom style of Transfers by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { TransferProps } from 'antdv-next'
import { ref } from 'vue'

const mockData = Array.from({ length: 20 }).map<any>((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
}))

const initialTargetKeys = mockData.filter(item => Number(item.key) > 10).map(item => item.key)

const targetKeysError = ref(initialTargetKeys)
const targetKeysWarning = ref(initialTargetKeys)

const classes: TransferProps['classes'] = {
  section: 'transfer-demo-section',
  header: 'transfer-demo-header',
  actions: 'transfer-demo-actions',
}

const stylesObject: TransferProps['styles'] = {
  header: { fontWeight: 'bold' },
}

const stylesFn: TransferProps['styles'] = (info) => {
  if (info.props.status === 'warning') {
    return {
      section: { backgroundColor: 'rgba(246,255,237, 0.6)', borderColor: '#b7eb8f' },
      header: { color: '#8DBCC7', fontWeight: 'normal' },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="large" style="width: 100%">
    <a-transfer
      v-model:target-keys="targetKeysError"
      :data-source="mockData"
      :render="(item) => item.title"
      status="error"
      :classes="classes"
      :styles="stylesObject"
    />
    <a-transfer
      v-model:target-keys="targetKeysWarning"
      :data-source="mockData"
      :render="(item) => item.title"
      status="warning"
      :classes="classes"
      :styles="stylesFn"
    />
  </a-flex>
</template>

<style scoped>
.transfer-demo-section {
  background-color: rgba(250, 250, 250, 0.5);
}

.transfer-demo-header {
  color: var(--ant-color-primary);
}

.transfer-demo-actions button {
  background-color: rgba(255, 242, 232, 0.6);
}
</style>
