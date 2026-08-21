<docs lang="zh-CN">
通过 `count` 设置流光数量，多条流光会均匀分布在容器边框上，只接收正整数，默认值为 1。
</docs>

<docs lang="en-US">
Use `count` to set the number of beams. Multiple beams are evenly distributed around the container border. It should be a positive integer, and the default value is `1`.
</docs>

<template>
  <a-flex vertical :gap="16">
    <a-border-beam :count="3">
      <a-card title="Multiple beams">
        Set count to distribute multiple beams evenly around the container border.
      </a-card>
    </a-border-beam>
    <a-border-beam :count="2">
      <a-card title="Multiple beams">
        Set count to distribute multiple beams evenly around the container border.
      </a-card>
    </a-border-beam>
  </a-flex>
</template>
