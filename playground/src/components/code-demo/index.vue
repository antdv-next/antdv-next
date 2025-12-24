<script setup lang="ts">
import demos from 'virtual:demos'
import { computed, defineAsyncComponent } from 'vue'

defineOptions({
  name: 'Demo',
})
const { src } = defineProps<{
  src: string
}>()
const demo = computed(() => demos[src])
const component = computed(() => typeof demo.value?.component === 'function' ? defineAsyncComponent(demo.value.component) : demo.value.component)
const id = computed(() => {
  if (!src)
    return ''
  let _src = src
  if (_src.startsWith('/')) {
    _src = _src.slice(1)
  }
  if (_src.endsWith('.vue')) {
    _src = _src.slice(0, -4)
  }
  return _src.replace(/[/\\.]/g, '-')
})
</script>

<template>
  <div :id="id">
    <component :is="component" v-if="demo?.component" />
    <slot />
    <div v-html="demo?.html" />
  </div>
</template>
