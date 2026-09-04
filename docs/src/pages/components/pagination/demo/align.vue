<docs lang="zh-CN">
通过 `align` 设置分页对齐方式。
</docs>

<docs lang="en-US">
Set pagination alignment with `align`.
</docs>

<template>
  <a-space direction="vertical" size="medium" style="width: 100%">
    <a-pagination align="start" :default-current="1" :total="50" />
    <a-pagination align="center" :default-current="1" :total="50" />
    <a-pagination align="end" :default-current="1" :total="50" />
  </a-space>
</template>
