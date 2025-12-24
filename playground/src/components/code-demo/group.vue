<script setup lang="ts">
import type { DocPage } from '@/composables/doc-page.ts'
import { computed, inject } from 'vue'

defineOptions({
  name: 'DemoGroup',
})
defineProps<{
  cols?: number
}>()
const pageInfo = inject<DocPage | null>('__pageInfo__', null)
const cols = computed(() => pageInfo?.frontmatter?.demo?.cols || 2)
console.log(pageInfo)
</script>

<template>
  <div>
    group
    <slot />
  </div>
</template>
