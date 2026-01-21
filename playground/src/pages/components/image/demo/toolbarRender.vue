<docs lang="zh-CN">
可以自定义工具栏并添加下载原图或翻转旋转后图片的按钮。
</docs>

<docs lang="en-US">
You can customize the toolbar and add a button for downloading the original image or downloading the flipped and rotated image.
</docs>

<script setup lang="ts">
  import {
    DownloadOutlined,
    LeftOutlined,
    RightOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
    SwapOutlined,
    UndoOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
  } from '@antdv-next/icons'
  import { ref } from 'vue'

  const imageList = [
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
  ]
  const current = ref(0)
  function handlePreviewChange(val: number) {
    console.log('current', current.value, val)
    current.value = val
  }
  function onDownload() {
    const url = imageList[current.value];
    const suffix = url!.slice(url!.lastIndexOf('.'));
    const filename = Date.now() + suffix;

    fetch(url!)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(blobUrl);
        link.remove();
      });
  }
</script>

<template>
  <a-image-preview-group
    :preview="{
      onChange: handlePreviewChange,
    }"
  >
    <template v-for="(item, index) in imageList" :key="index">
      <a-image :alt="`image-${index}`" :src="item" :width="200" />
    </template>
    <template #actionsRender="_, { transform, actions }">
      <a-space :size="12" class="toolbar-wrapper">
        <LeftOutlined :disabled="current === 0" @click="actions.onActive(-1)" />
        <RightOutlined :disabled="current === imageList.length - 1" @click="actions.onActive(1)" />
        <DownloadOutlined @click="onDownload" />
        <SwapOutlined :rotate="90" @click="actions.onFlipX" />
        <SwapOutlined @click="actions.onFlipY" />
        <RotateLeftOutlined @click="actions.onRotateLeft" />
        <RotateRightOutlined @click="actions.onRotateRight" />
        <ZoomOutOutlined :disabled="transform.scale === 1" @click="actions.onZoomOut" />
        <ZoomInOutlined :disabled="transform.scale === 50" @click="actions.onZoomIn" />
        <UndoOutlined @click="actions.onReset" />
      </a-space>
    </template>
  </a-image-preview-group>
</template>

<style scoped>
  .toolbar-wrapper {
    padding: 0px 24px;
    color: #fff;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 100px;
  }

  .toolbar-wrapper .anticon {
    padding: 12px;
    cursor: pointer;
  }

  .toolbar-wrapper .anticon[disabled='true'] {
    cursor: not-allowed;
    opacity: 0.3;
  }

  .toolbar-wrapper .anticon:hover {
    opacity: 0.3;
  }
</style>
