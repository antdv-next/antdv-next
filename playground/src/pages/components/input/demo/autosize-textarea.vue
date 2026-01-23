<docs lang="zh-CN">
`autoSize` 属性适用于 `textarea` 节点，并且只有高度会自动变化。另外 `autoSize` 可以设定为一个对象，指定最小行数和最大行数。
</docs>

<docs lang="en-US">
`autoSize` prop for a `textarea` type of `Input` makes the height to automatically adjust based on the content. An option object can be provided to `autoSize` to specify the minimum and maximum number of lines the textarea will automatically adjust.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <div>
    <a-textarea placeholder="Autosize height based on content lines" auto-size />
    <div style="margin: 24px 0;" />
    <a-textarea
      placeholder="Autosize height with minimum and maximum number of lines"
      :auto-size="{ minRows: 2, maxRows: 6 }"
    />
    <div style="margin: 24px 0;" />
    <a-textarea
      v-model:value="value"
      placeholder="Controlled autosize"
      :auto-size="{ minRows: 3, maxRows: 5 }"
    />
  </div>
</template>
