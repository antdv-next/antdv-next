<docs lang="zh-CN">
相邻组件分隔符。
</docs>

<docs lang="en-US">
Separator between adjacent components.
</docs>

<template>
  <a-space>
    <template #separator>
      <a-divider type="vertical" />
    </template>

    <a-typography-link>
      Link
    </a-typography-link>
    <a-typography-link>
      Link
    </a-typography-link>
    <a-typography-link>
      Link
    </a-typography-link>
  </a-space>
</template>
