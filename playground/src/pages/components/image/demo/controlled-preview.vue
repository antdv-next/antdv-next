<docs lang="zh-CN">
可以使预览受控。
</docs>

<docs lang="en-US">
You can make preview controlled.
</docs>

<script setup lang="ts">
  import { ref } from 'vue'

  const open = ref(false)
  const scaleStep = ref(0.5)
</script>

<template>
  <div>
    scaleStep: {{ scaleStep }}
    <a-input-number v-model:value="scaleStep" min="0.1" max="5" step="0.1" />
  </div>
  <br>
  <a-button type="primary" @click="open = true">show image preview</a-button>
  <a-image
    alt="basic image"
    :width="200"
    style="display: none;"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
    :preview="{
      open,
      scaleStep,
      src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      onOpenChange(val: boolean) {
        open = val
      },
    }"
  ></a-image>
</template>

<style scoped></style>
