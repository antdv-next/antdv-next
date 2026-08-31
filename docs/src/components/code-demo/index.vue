<script setup lang="ts">
import { provideDemoContext } from '@antdv-next/docs-plugins/component/code-demo/context'
import CodeDemo from '@antdv-next/docs-plugins/component/code-demo/index.vue'
import { h } from 'vue'
import { useLocale } from '@/composables/use-locale'
import { useAppStore } from '@/stores/app.ts'
import antdvPkg from '../../../../packages/antdv-next/package.json'
import CodeIframe from './iframe.vue'
import { loadPlaygroundUrl } from './utils/playground.ts'
import { openStackBlitz } from './utils/stackblitz'

defineOptions({
  name: 'Demo',
})

const props = defineProps<{
  src: string
  iframe?: string
  compact?: boolean
  background?: string
  simplify?: boolean
  debug?: boolean
}>()

const appStore = useAppStore()
const { t } = useLocale()

provideDemoContext({
  locale: () => appStore.locale,
  isDark: () => appStore.darkMode,
  t: key => t(`ui.codeDemo.${key}`),
  modules: {
    'antdv-next': () => import('antdv-next'),
    '@antdv-next/icons': () => import('@antdv-next/icons'),
    dayjs: () => import('dayjs'),
  },
  openPlayground: (code) => {
    const url = loadPlaygroundUrl(code)
    if (url)
      window.open(url, '_blank', 'noopener,noreferrer')
  },
  openStackBlitz: ({ title, code }) =>
    openStackBlitz(`${title || 'Antdv Next Demo'} - antdv-next@${antdvPkg.version}`, code),
  demoPageUrl: id => `/~demos/${id}`,
  iframeRenderer: (id, height) => h(CodeIframe, { src: id, height }),
  preferredCodeType: {
    get: () => appStore.demoCodeType,
    set: value => appStore.setDemoCodeType(value),
  },
})
</script>

<template>
  <CodeDemo v-bind="props">
    <slot />
  </CodeDemo>
</template>
