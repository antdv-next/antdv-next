<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { computed } from 'vue'

defineOptions({ name: 'SourceCode' })
const props = defineProps<{ value?: string }>()

const { copied, copy } = useClipboard({
  source: computed(() => props.value ?? ''),
  legacy: true,
})
</script>

<template>
  <div class="language-bash">
    <button class="copy" :class="{ copied }" @click="copy()" />
    <span class="lang">bash</span>
    <pre><code>{{ props.value }}</code></pre>
  </div>
</template>
