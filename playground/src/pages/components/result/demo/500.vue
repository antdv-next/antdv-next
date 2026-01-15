<docs lang="zh-CN">
服务器发生了错误。
</docs>

<docs lang="en-US">
Something went wrong on server.
</docs>

<template>
  <a-result
    status="500"
    title="500"
    sub-title="Sorry, something went wrong."
  >
    <template #extra>
      <a-button type="primary">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>
