<docs lang="zh-CN">
设置 tooltip 属性，即可开启气泡卡片。
</docs>

<docs lang="en-US">
Setting the `tooltip` property shows the FloatButton with a tooltip.
</docs>

<template>
  <a-float-button
    style="inset-block-end: 108px;"
    :tooltip="{
      title: 'Tooltip',
      color: 'blue',
      placement: 'top',
    }"
  />
  <a-float-button>
    <template #tooltip>
      <div>Documents</div>
    </template>
  </a-float-button>
</template>
