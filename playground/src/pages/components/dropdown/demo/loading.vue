<docs lang="zh-CN">
添加 `loading` 属性即可让按钮处于加载状态，最后两个按钮演示点击后进入加载状态。
</docs>

<docs lang="en-US">
A loading indicator can be added to a button by setting the `loading` property.
</docs>

<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { DownOutlined, EllipsisOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const items: MenuItemType[] = [
  {
    label: 'Submit and continue',
    key: '1',
  },
]

const loadings = ref<boolean[]>([])

function enterLoading(index: number) {
  const nextLoadings = [...loadings.value]
  nextLoadings[index] = true
  loadings.value = nextLoadings
  setTimeout(() => {
    const resetLoadings = [...loadings.value]
    resetLoadings[index] = false
    loadings.value = resetLoadings
  }, 6000)
}
</script>

<template>
  <a-space direction="vertical">
    <a-space-compact>
      <a-button type="primary" loading>
        Submit
      </a-button>
      <a-dropdown :menu="{ items }">
        <a-button type="primary">
          <template #icon>
            <EllipsisOutlined />
          </template>
        </a-button>
      </a-dropdown>
    </a-space-compact>
    <a-space-compact size="small">
      <a-button type="primary" loading>
        Submit
      </a-button>
      <a-dropdown :menu="{ items }">
        <a-button type="primary">
          <template #icon>
            <EllipsisOutlined />
          </template>
        </a-button>
      </a-dropdown>
    </a-space-compact>
    <a-space-compact>
      <a-button type="primary" :loading="loadings[0]" @click="enterLoading(0)">
        Submit
      </a-button>
      <a-dropdown :menu="{ items }">
        <a-button type="primary">
          <template #icon>
            <EllipsisOutlined />
          </template>
        </a-button>
      </a-dropdown>
    </a-space-compact>
    <a-space-compact>
      <a-button :loading="loadings[1]" @click="enterLoading(1)">
        Submit
      </a-button>
      <a-dropdown :menu="{ items }">
        <a-button>
          <template #icon>
            <DownOutlined />
          </template>
        </a-button>
      </a-dropdown>
    </a-space-compact>
  </a-space>
</template>
