<docs lang="zh-CN">
在 Modal 与 Drawer 中使用。
</docs>

<docs lang="en-US">
Use in Modal and Drawer.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const showModal = shallowRef(false)
const showDrawer = shallowRef(false)
const showDrawer2 = shallowRef(false)

const placeholderStyle = {
  height: '300px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(150, 150, 150, 0.2)',
}
</script>

<template>
  <a-flex gap="medium">
    <a-button type="primary" @click="showModal = true">
      Show in Modal
    </a-button>
    <a-button type="primary" @click="showDrawer = true">
      Show in Drawer
    </a-button>
    <a-button type="primary" @click="showDrawer2 = true">
      Not Show in Drawer
    </a-button>
  </a-flex>
  <a-watermark content="Antdv Next">
    <a-modal
      v-model:open="showModal"
      destroy-on-hidden
      title="Modal"
      @ok="showModal = false"
      @cancel="showModal = false"
    >
      <div :style="placeholderStyle">
        A mock height
      </div>
    </a-modal>
    <a-drawer
      v-model:open="showDrawer"
      destroy-on-hidden
      title="Drawer"
      @close="showDrawer = false"
    >
      <div :style="placeholderStyle">
        A mock height
      </div>
    </a-drawer>
  </a-watermark>
  <a-watermark content="Antdv Next" :inherit="false">
    <a-drawer
      v-model:open="showDrawer2"
      destroy-on-hidden
      title="Drawer"
      @close="showDrawer2 = false"
    >
      <div :style="placeholderStyle">
        A mock height
      </div>
    </a-drawer>
  </a-watermark>
</template>
