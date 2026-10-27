<docs lang="zh-CN">
Disabled 子元素。
</docs>

<docs lang="en-US">
Disabled wrapper.
</docs>

<script setup lang="ts">
const selectOptions = [
  { value: 'option', label: 'Option' },
]
</script>

<template>
  <a-space>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-button disabled>
        Disabled
      </a-button>
    </a-tooltip>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-input disabled placeholder="disabled" />
    </a-tooltip>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-input-number disabled :value="1" />
    </a-tooltip>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-checkbox disabled />
    </a-tooltip>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-select disabled :options="selectOptions" :value="selectOptions[0]!.value" />
    </a-tooltip>
  </a-space>
</template>
