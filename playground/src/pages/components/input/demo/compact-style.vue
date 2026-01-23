<docs lang="zh-CN">
使用 Space.Compact 创建紧凑模式，更多请查看 [Space.Compact](/components/space-cn#spacecompact) 文档。
</docs>

<docs lang="en-US">
Use Space.Compact create compact style, See the [Space.Compact](/components/space#spacecompact) documentation for more.
</docs>

<script setup lang="ts">
import { SearchOutlined } from '@antdv-next/icons'

// const options = [
//   {
//     value: 'zhejiang',
//     label: 'Zhejiang',
//   },
//   {
//     value: 'jiangsu',
//     label: 'Jiangsu',
//   },
// ]
</script>

<template>
  <a-space direction="vertical" size="middle">
    <a-space-compact>
      <a-input default-value="26888888" />
    </a-space-compact>
    <a-space-compact>
      <a-input style="width: 20%;" default-value="0571" />
      <a-input style="width: 80%;" default-value="26888888" />
    </a-space-compact>
    <a-space-compact>
      <a-space-addon>https://</a-space-addon>
      <a-input-search placeholder="input search text" allow-clear />
    </a-space-compact>
    <a-space-compact style="width: 100%;">
      <a-input default-value="Combine input and button" />
      <a-button type="primary">
        Submit
      </a-button>
    </a-space-compact>
    <!-- <a-space-compact>
      <a-select default-value="Zhejiang" :options="options" />
      <a-input default-value="Xihu District, Hangzhou" />
    </a-space-compact> -->
    <a-space-compact size="large">
      <a-space-addon>
        <SearchOutlined />
      </a-space-addon>
      <a-input placeholder="large size" />
      <a-input placeholder="another input" />
    </a-space-compact>
  </a-space>
</template>
