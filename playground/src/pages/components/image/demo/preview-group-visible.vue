<docs lang="zh-CN">
从一张图片点开相册。
</docs>

<docs lang="en-US">
Preview a collection from one image. 
</docs>

<script setup lang="ts">

  const items = [
    'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
    'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
    'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
  ]
</script>

<template>
  <a-image-preview-group :items="items">
    <a-image alt="webp image" :width="200" src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" />
  </a-image-preview-group>
</template>
