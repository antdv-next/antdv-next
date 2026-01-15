<script setup lang="ts">
import { h } from 'vue'
import BunLogo from './bun.vue'
import NpmLogo from './npm.vue'
import PnpmLogo from './pnpm.vue'
import SourceCode from './source-code.vue'
import YarnLogo from './yarn.vue'

interface InstallProps {
  npm?: string
  yarn?: string
  pnpm?: string
  bun?: string
}

defineOptions({ name: 'InstallDependencies' })
const { npm, yarn, pnpm, bun } = defineProps<InstallProps>()
const items = [
  {
    key: 'npm',
    label: 'npm',
    content: h(SourceCode, { value: npm }, {}),
    icon: h(NpmLogo),
  },
  {
    key: 'yarn',
    label: 'yarn',
    content: h(SourceCode, { value: yarn }, {}),
    icon: h(YarnLogo),
  },
  {
    key: 'pnpm',
    label: 'pnpm',
    content: h(SourceCode, { value: pnpm }, {}),
    icon: h(PnpmLogo),
  },
  {
    key: 'bun',
    label: 'Bun',
    content: h(SourceCode, { value: bun }, {}),
    icon: h(BunLogo),
  },
].filter(item => item.content)
</script>

<template>
  <a-tabs :items="items" size="small" default-active-key="npm" />
</template>

<style scoped></style>
