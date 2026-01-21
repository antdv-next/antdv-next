<docs lang="zh-CN">
遮罩效果，默认 `blur`。
</docs>

<docs lang="en-US">
mask effect, default `blur`.
</docs>

<template>
  <a-image
   :width="100"
   alt="Default blur"
   src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
   :preview="{
     mask: true
   }"
  >
   <template #cover>
     <a-space vertical align="center">Default blur</a-space>
   </template>
  </a-image>
  <a-image
   :width="100"
   alt="Dimmed mask"
   src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
   :preview="{
      mask: { blur: false }
    }"
  >
    <template #cover>
      <a-space vertical align="center">Dimmed mask</a-space>
    </template></a-image>
  <a-image
   :width="100"
   alt="No mask"
   src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
    :preview="{
      mask: false
    }"
  >
    <template #cover>
      <a-space vertical align="center">No mask</a-space>
    </template>
    </a-image>
</template>

<style scoped></style>
