<docs lang="zh-CN">
大号页签用在页头区域，小号用在弹出框等较狭窄的容器内。
</docs>

<docs lang="en-US">
Large size tabs are usually used in page header, and small size could be used in Modal.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

type TabSize = 'small' | 'medium' | 'large'

interface TabItem {
  key: string
  label: string
  content: string
}

const size = ref<TabSize>('small')
const activeKey = ref('1')
const items = ref<TabItem[]>([
  { key: '1', label: 'Tab 1', content: 'Content of editable tab 1' },
  { key: '2', label: 'Tab 2', content: 'Content of editable tab 2' },
  { key: '3', label: 'Tab 3', content: 'Content of editable tab 3' },
])

const staticItems: TabItem[] = Array.from({ length: 3 }).map((_, i) => {
  const id = String(i + 1)
  return {
    key: id,
    label: `Tab ${id}`,
    content: `Content of tab ${id}`,
  }
})

const cardItems: TabItem[] = Array.from({ length: 3 }).map((_, i) => {
  const id = String(i + 1)
  return {
    key: id,
    label: `Card Tab ${id}`,
    content: `Content of card tab ${id}`,
  }
})

function add() {
  const newKey = String(items.value.length + 1)
  items.value.push({
    key: newKey,
    label: `Tab ${newKey}`,
    content: `Content of editable tab ${newKey}`,
  })
  activeKey.value = newKey
}

function remove(targetKey: string) {
  const targetIndex = items.value.findIndex(item => item.key === targetKey)
  const newItems = items.value.filter(item => item.key !== targetKey)

  if (newItems.length && targetKey === activeKey.value) {
    const newIndex = targetIndex === newItems.length ? targetIndex - 1 : targetIndex
    activeKey.value = newItems[newIndex]?.key ?? newItems[0]?.key ?? '1'
  }

  items.value = newItems
}

function onEdit(targetKey: string | MouseEvent | KeyboardEvent, action: 'add' | 'remove') {
  if (action === 'add') {
    add()
  }
  else if (typeof targetKey === 'string') {
    remove(targetKey)
  }
}
</script>

<template>
  <div>
    <a-radio-group v-model:value="size" style="margin-bottom: 16px;">
      <a-radio-button value="small">
        Small
      </a-radio-button>
      <a-radio-button value="medium">
        Medium
      </a-radio-button>
      <a-radio-button value="large">
        Large
      </a-radio-button>
    </a-radio-group>
    <a-tabs
      default-active-key="1"
      :size="size"
      style="margin-bottom: 32px;"
      :items="staticItems"
    />
    <a-tabs
      default-active-key="1"
      type="card"
      :size="size"
      style="margin-bottom: 32px;"
      :items="cardItems"
    />
    <a-tabs
      v-model:active-key="activeKey"
      type="editable-card"
      :size="size"
      :items="items"
      @edit="onEdit"
    />
  </div>
</template>
