<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Image 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Image by passing objects/functions through `classes` and `styles`. 
</docs>

<script setup lang="ts">

const sharedProps = {
  src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  width: 160,
  alt: '示例图片',
};

const imageStyles = {
  root: {
    padding: '4px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  image: {
    borderRadius: '4px',
  },
};

const previewImageStyles = {
  root: {
    border: '2px solid #A594F9',
    borderRadius: '8px',
    padding: '4px',
    transition: 'all 0.3s ease',
  },
  image: {
    borderRadius: '4px',
    filter: 'grayscale(50%)',
  },
};
</script>

<template>
  <a-flex gap="middle">
    <a-image v-bind="sharedProps" :styles="imageStyles" />
    <a-image v-bind="sharedProps" :styles="previewImageStyles" :preview="{ open: false }" />
  </a-flex>
</template>
