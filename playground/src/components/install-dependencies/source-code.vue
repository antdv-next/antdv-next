<script setup lang="ts">
defineOptions({ name: 'SourceCode' })
const props = defineProps<{ value?: string }>()
</script>

<template>
  <a-alert :styles="{ root: { backgroundColor: '#f0f0f0', border: 'none' } }" type="info" :show-icon="false" :title="props.value" />
</template>

<style scoped></style>
