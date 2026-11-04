<docs lang="zh-CN">
设置 `closable` 可显示默认关闭按钮，也可通过对象配置 `aria-label` 等无障碍属性，并通过 `closeIcon` 自定义关闭图标。顶层 `closeIcon` 是简便配置方式，可设置自定义关闭图标或设为 `true` 显示默认关闭按钮。可关闭标签具有 `close` 事件，可通过 `e.preventDefault()` 阻止关闭。
</docs>

<docs lang="en-US">
Set `closable` to show the default close button, or use an object to configure accessibility attributes such as `aria-label`, with `closeIcon` customizing the close icon. The top-level `closeIcon` is a shorthand for setting a custom close icon or showing the default close button with `true`. Closable tags support the `close` event. Use `e.preventDefault()` to prevent closing.
</docs>

<script setup lang="ts">
import { CloseCircleOutlined, DeleteOutlined } from '@antdv-next/icons'
import { shallowRef } from 'vue'

function preventDefault(e: MouseEvent) {
  e.preventDefault()
  console.log('Clicked! But prevent default.')
}
const tag2 = shallowRef(true)
function handleCloseTag2() {
  tag2.value = false
}
const tag3 = shallowRef(true)
function handleCloseTag3() {
  tag3.value = false
}
function handleClick() {
  console.log('click')
}
</script>

<template>
  <a-flex gap="small" align="center" wrap>
    <a-tag @click="handleClick">
      Tag 1
    </a-tag>

    <a-tag>
      <a href="https://github.com/ant-design/ant-design/issues/1862" target="_blank" rel="noopener noreferrer">
        Link
      </a>
    </a-tag>
    <a-tag closable @close="preventDefault">
      Prevent Default
    </a-tag>
    <a-tag v-if="tag2" @close="handleCloseTag2">
      <template #closeIcon>
        <CloseCircleOutlined />
      </template>
      Tag 2
    </a-tag>

    <a-tag
      v-if="tag3"
      :closable="{
        'aria-label': 'Close Button',
      }"
      @close="handleCloseTag3"
    >
      <template #closeIcon>
        <DeleteOutlined />
      </template>
      Tag 3
    </a-tag>
  </a-flex>
</template>
