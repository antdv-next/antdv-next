<docs lang="zh-CN">
通过 `lineWidth` 调整单个 BorderBeam 的流光线宽，默认值为 `1px`，数字类型按像素处理。
</docs>

<docs lang="en-US">
Use `lineWidth` to adjust the beam width of an individual BorderBeam. The default value is `1px`, and numbers are treated as pixels.
</docs>

<template>
  <div :style="{ width: '360px' }">
    <a-border-beam :line-width="2">
      <a-card title="Custom line width" :style="{ borderWidth: '2px' }">
        Set lineWidth to match the border width of this container.
      </a-card>
    </a-border-beam>
  </div>
</template>
