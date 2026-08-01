<docs lang="zh-CN">
通过 `dotRender` 插槽（或同名函数 prop）按 item 统一自定义时间轴点；插槽未渲染内容时，回退到 item 自身的 `icon` 或默认圆点。`labelRender` / `contentRender` 用法相同。
</docs>

<docs lang="en-US">
Customize timeline dots per item with the `dotRender` slot (or the prop of the same name). When the slot renders nothing for an item, it falls back to the item `icon` or the default dot. `labelRender` / `contentRender` work the same way.
</docs>

<script setup lang="ts">
import { CheckCircleOutlined, CloseCircleOutlined } from '@antdv-next/icons'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const items = [
  { content: 'Create a services site 2015-09-01', state: 'done' },
  { content: 'Solve initial network problems 2015-09-01', state: 'done' },
  { content: 'Technical testing 2015-09-01', color: 'red', state: 'failed' },
  { content: 'Network problems being solved 2015-09-01' },
]
</script>

<template>
  <a-timeline :items="items">
    <template #dotRender="{ item }">
      <CheckCircleOutlined
        v-if="item.state === 'done'"
        class="dot-icon"
        :style="{ background: token.colorBgContainer }"
      />
      <CloseCircleOutlined
        v-else-if="item.state === 'failed'"
        class="dot-icon"
        :style="{ background: token.colorBgContainer }"
      />
    </template>
  </a-timeline>
</template>

<style scoped>
.dot-icon {
  font-size: 16px;
}
</style>
