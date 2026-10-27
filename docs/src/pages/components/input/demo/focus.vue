<docs lang="zh-CN">
聚焦额外配置属性。
</docs>

<docs lang="en-US">
Focus with additional option.
</docs>

<script setup lang="ts">
import type { InputRef, TextAreaRef } from 'antdv-next'
import { ref, useTemplateRef } from 'vue'

const value = ref('Ant Design love you!')
const isInput = ref(true)
const inputRef = useTemplateRef<InputRef | TextAreaRef>('input')
function handleFocus(options: Parameters<InputRef['focus']>[0]) {
  inputRef.value?.focus(options)
}
</script>

<template>
  <a-space vertical style="width: 100%;">
    <a-space wrap>
      <a-button @click="() => handleFocus({ cursor: 'start' })">
        Focus at first
      </a-button>
      <a-button @click="() => handleFocus({ cursor: 'end' })">
        Focus at last
      </a-button>
      <a-button @click="() => handleFocus({ cursor: 'all' })">
        Focus to select all
      </a-button>
      <a-button @click="() => handleFocus({ preventScroll: true })">
        Focus prevent scroll
      </a-button>
      <a-switch v-model:checked="isInput" checked-children="Input" un-checked-children="TextArea" />
    </a-space>
    <br>
    <a-input v-if="isInput" ref="input" v-model:value="value" style="width: 100%;" />
    <a-textarea v-else ref="input" v-model:value="value" style="width: 100%;" />
  </a-space>
</template>
