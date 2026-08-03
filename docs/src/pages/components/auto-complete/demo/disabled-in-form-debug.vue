<docs lang="zh-CN">
禁用文字颜色在 Form 中 Debug。校验 `Form disabled` 与组件自身 `disabled` 两种来源下，
输入框文字都使用禁用色。
</docs>

<docs lang="en-US">
Disabled text colour inside a Form, debug. Checks that the input text uses the disabled
colour both when the Form is disabled and when the component itself is.
</docs>

<script setup lang="ts">
const options = [{ value: 'Disabled Value' }]
</script>

<template>
  <a-flex vertical :gap="12" :style="{ width: '240px' }">
    <a-form disabled>
      <a-form-item label="Form disabled" :style="{ marginBottom: 0 }">
        <a-auto-complete value="Disabled Value" :options="options" />
      </a-form-item>
    </a-form>
    <a-auto-complete disabled value="Disabled Value" :options="options" />
  </a-flex>
</template>
