<script setup lang="ts">
import Icon from '@antdv-next/icons'

defineOptions({ name: 'OutlinedIcon' })
</script>

<template>
  <Icon>
    <template #component>
      <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 1024 1024">
        <title>Outlined Icon</title>
        <path
          d="M864 64H160C107 64 64 107 64 160v704c0 53 43 96 96 96h704c53 0 96-43 96-96V160c0-53-43-96-96-96z m-12 800H172c-6.6 0-12-5.4-12-12V172c0-6.6 5.4-12 12-12h680c6.6 0 12 5.4 12 12v680c0 6.6-5.4 12-12 12z"
        />
      </svg>
    </template>
  </Icon>
</template>

<style scoped></style>
