<docs lang="zh-CN">
debug demo
</docs>

<docs lang="en-US">
debug demo
</docs>

<script setup lang="ts">
const sizes = ['small', 'medium', 'large'] as const
</script>

<template>
  <a-flex vertical gap="medium">
    <a-flex v-for="size in sizes" :key="size" gap="small">
      <a-select
        value="centered"
        :options="[{ value: 'centered' }]"
        :size="size"
        style="width: 200px"
      />
      <a-auto-complete value="centered" :size="size" style="width: 200px" />
    </a-flex>
  </a-flex>
</template>
