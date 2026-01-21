<docs lang="zh-CN">
可以自定义预览内容。
</docs>

<docs lang="en-US">
You can customize the preview content.
</docs>

<script setup lang="ts">
  import { h } from 'vue'

  const imageRender = h('video', {
    muted: true,
    width: '100%',
    controls: true,
    src: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*uYT7SZwhJnUAAAAAAAAAAAAADgCCAQ',
  })
</script>

<template>
  <a-image :width="200" alt="slot image" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" :preview="{ actionsRender: () => null }">
    <template #imageRender>
      <video
        muted
        width="100%"
        controls
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*uYT7SZwhJnUAAAAAAAAAAAAADgCCAQ"
      />
    </template>
  </a-image>
  <br>
  <a-image
    :width="200"
    alt="preview image"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    :preview="{
      imageRender: () => imageRender,
      actionsRender: () => null
    }"
  />
</template>

<style scoped></style>
