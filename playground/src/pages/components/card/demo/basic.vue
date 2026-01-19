<docs lang="zh-CN">
包含标题、内容、操作区域。
</docs>

<docs lang="en-US">
A basic card containing a title, content and an extra corner content. Supports two sizes: `default` and `small`.
</docs>

<template>
  <a-space vertical :size="16">
    <a-card title="Default size card" style="width: 300px">
      <template #extra>
        <a href="#">More</a>
      </template>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </a-card>
    <a-card size="small" title="Small size card" style="width: 300px">
      <template #extra>
        <a href="#">More</a>
      </template>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </a-card>
  </a-space>
</template>
