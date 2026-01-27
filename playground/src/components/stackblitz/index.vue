<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import { iframeStackBlitz } from '@/components/code-demo/utils/stackblitz'

defineOptions({
  name: 'StackBlitz',
})

const props = defineProps<{
  code: string
  title?: string
}>()

const containerRef = ref<HTMLElement>()
const loading = shallowRef(true)
const decodedCode = decodeURIComponent(props.code)
const displayTitle = props.title || 'Ant Design Vue Demo'

onMounted(async () => {
  if (containerRef.value) {
    await iframeStackBlitz(containerRef.value, displayTitle, decodedCode)
    loading.value = false
  }
})
</script>

<template>
  <div ref="containerRef" class="stackblitz-embed-container" />
</template>

<style>
.stackblitz-embed-container {
  min-height: 500px;
}

.stackblitz-embed-container {
  width: 100%;
  min-height: 500px;
  border: none !important;
}
</style>
