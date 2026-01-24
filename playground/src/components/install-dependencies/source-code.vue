<script setup lang="ts">
defineOptions({ name: 'SourceCode' })
const props = defineProps<{ value?: string }>()
</script>

<template>
  <a-alert :styles="{ root: { backgroundColor: 'var(--ant-color-fill-tertiary)', border: 'none' } }" type="info" :show-icon="false" :title="props.value" />
</template>
