<docs lang="zh-CN">
简单的翻页。
</docs>

<docs lang="en-US">
Simple mode.
</docs>

<template>
  <a-space direction="vertical" size="medium" style="width: 100%">
    <a-pagination simple :default-current="2" :total="50" />
    <a-pagination :simple="{ readOnly: true }" :default-current="2" :total="50" />
    <a-pagination simple :default-current="2" :total="50" disabled />
  </a-space>
</template>
