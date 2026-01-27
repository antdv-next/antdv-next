<docs lang="zh-CN">
在 Antdv Next 规范中，操作按钮建议放在抽屉的右上角，可以使用 `extra` 属性来实现。
</docs>

<docs lang="en-US">
Extra actions should be placed at corner of drawer in Antdv Next, you can use `extra` prop for that.
</docs>

<script setup lang="ts">
import type { DrawerProps } from 'antdv-next'
import { shallowRef } from 'vue'

const open = shallowRef(false)
const placement = shallowRef<DrawerProps['placement']>('right')

function showDrawer() {
  open.value = true
}

function onClose() {
  open.value = false
}
</script>

<template>
  <a-space>
    <a-radio-group v-model:value="placement">
      <a-radio value="top">
        top
      </a-radio>
      <a-radio value="right">
        right
      </a-radio>
      <a-radio value="bottom">
        bottom
      </a-radio>
      <a-radio value="left">
        left
      </a-radio>
    </a-radio-group>
    <a-button type="primary" @click="showDrawer">
      Open
    </a-button>
  </a-space>
  <a-drawer
    v-model:open="open"
    :size="500"
    title="Drawer with extra actions"
    :placement="placement"
    @close="onClose"
  >
    <template #extra>
      <a-space>
        <a-button @click="onClose">
          Cancel
        </a-button>
        <a-button type="primary" @click="onClose">
          OK
        </a-button>
      </a-space>
    </template>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>
