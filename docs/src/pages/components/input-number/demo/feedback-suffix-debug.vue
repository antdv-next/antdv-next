<docs lang="zh-CN">
带反馈图标时展示后缀 Debug。
</docs>

<docs lang="en-US">
Suffix with form feedback debug.
</docs>

<script setup lang="ts">
</script>

<template>
  <a-form layout="vertical" :style="{ maxWidth: '320px' }">
    <a-form-item label="Suffix with feedback" validate-status="success" has-feedback>
      <a-input-number :default-value="100" suffix="RMB" :style="{ width: '100%' }" />
    </a-form-item>
  </a-form>
</template>
