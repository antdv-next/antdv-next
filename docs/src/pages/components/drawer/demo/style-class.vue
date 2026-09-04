<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象或者函数可以自定义 Drawer 组件的 [语义化结构](#semantic-dom) 样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Drawer by passing objects or functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { DrawerProps } from 'antdv-next'
import { theme } from 'antdv-next'
import { ref } from 'vue'

const { token } = theme.useToken()
const open = ref(false)
const openFn = ref(false)

const classes: DrawerProps['classes'] = {
  header: 'demo-drawer-header',
  body: 'demo-drawer-body',
}

const stylesObject: DrawerProps['styles'] = {
  body: {
    backgroundColor: '#f5f5f5',
  },
  footer: {
    backgroundColor: '#fafafa',
  },
}

const stylesFn: DrawerProps['styles'] = (info) => {
  if (info?.props?.placement === 'right') {
    return {
      mask: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
      wrapper: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex gap="medium">
    <a-button @click="open = true">
      Object Style
    </a-button>
    <a-button type="primary" @click="openFn = true">
      Function Style
    </a-button>
  </a-flex>

  <a-drawer
    v-model:open="open"
    title="Custom Style Drawer"
    :classes="classes"
    :styles="stylesObject"
    @close="open = false"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>

  <a-drawer
    v-model:open="openFn"
    title="Custom Function Drawer"
    :classes="classes"
    :styles="stylesFn"
    @close="openFn = false"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>

<style scoped>
.demo-drawer-header {
  border-bottom: 1px dashed v-bind('token.colorBorder');
}

.demo-drawer-body {
  border-top: 1px dashed v-bind('token.colorBorder');
}
</style>
