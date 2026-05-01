<script setup lang="ts">
import { SandpackCodeEditor, useActiveCode, useSandpack } from 'sandpack-vue3'
import { watch } from 'vue'

defineProps<{
  readOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:code', code: string): void
}>()

const { code } = useActiveCode()
const { sandpack } = useSandpack()

function resetCode(newCode: string) {
  sandpack.updateCurrentFile(newCode)
}

defineExpose({ resetCode })

watch(code, (val) => {
  if (val !== undefined) {
    emit('update:code', val)
  }
})
</script>

<template>
  <SandpackCodeEditor
    :show-tabs="false"
    :show-line-numbers="false"
    :read-only="readOnly"
    style="min-height: 100px;"
  />
</template>
