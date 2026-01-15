<docs lang="zh-CN">
复杂的错误反馈。
</docs>

<docs lang="en-US">
Complex error feedback.
</docs>

<script lang="ts" setup>
import { CloseCircleOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-result
    status="error"
    title="Submission Failed"
    sub-title="Please check and modify the following information before resubmitting."
  >
    <template #extra>
      <a-button key="console" type="primary">
        Go Console
      </a-button>
      <a-button key="buy">
        Buy Again
      </a-button>
    </template>
    <div>
      <CloseCircleOutlined class="site-result-demo-error-icon" /> Your account is not yet
      eligible to apply. <a>Apply Unlock &gt;</a>
    </div>
  </a-result>
</template>

<style>
.site-result-demo-error-icon {
  color: red;
}
</style>
