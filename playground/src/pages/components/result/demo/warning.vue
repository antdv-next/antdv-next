<docs lang="zh-CN">
警告类型的结果。
</docs>

<docs lang="en-US">
The result of the warning.
</docs>

<template>
  <a-result
    status="warning"
    title="There are some problems with your operation."
  >
    <template #extra>
      <a-button key="console" type="primary">
        Go Console
      </a-button>
    </template>
  </a-result>
</template>
