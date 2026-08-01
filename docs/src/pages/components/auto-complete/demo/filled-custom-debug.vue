<docs lang="zh-CN">
填充形态自定义输入组件 Debug。
</docs>

<docs lang="en-US">
Filled custom input debug.
</docs>

<script setup lang="ts">
const options = [{ value: 'Burnaby' }, { value: 'Seattle' }, { value: 'Los Angeles' }]
</script>

<template>
  <a-flex :gap="24" wrap>
    <a-form layout="vertical" variant="filled" :style="{ width: '280px' }">
      <a-form-item label="AutoComplete TextArea">
        <a-auto-complete :options="options">
          <a-textarea placeholder="Custom TextArea" />
        </a-auto-complete>
      </a-form-item>
      <a-form-item label="Input TextArea">
        <a-textarea placeholder="Compare TextArea" />
      </a-form-item>
    </a-form>
  </a-flex>
</template>
