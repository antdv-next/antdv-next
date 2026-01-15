<script setup lang="ts">
import Icon from '@antdv-next/icons'

defineOptions({ name: 'FilledIcon' })
</script>

<template>
  <Icon>
    <template #component>
      <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 1024 1024">
        <title>Filled Icon</title>
        <path d="M864 64H160C107 64 64 107 64 160v704c0 53 43 96 96 96h704c53 0 96-43 96-96V160c0-53-43-96-96-96z" />
      </svg>
    </template>
  </Icon>
</template>

<style scoped></style>
