<script setup lang="ts">
import { ConfigProvider, theme } from 'antdv-next'
import en from 'antdv-next/locale/en_US'
import cn from 'antdv-next/locale/zh_CN'
import dayjs from 'dayjs'
import { isFunction } from 'es-toolkit'
import { storeToRefs } from 'pinia'
import { computed, getCurrentInstance, h, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { themeModeStore } from '@/composables/local-store'
import { applyThemeToDOM, useTheme } from '@/composables/theme'
import { useAppStore } from '@/stores/app'
import DocsAppShell from './app-shell.vue'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'

const appStore = useAppStore()
const { locale, darkMode, compactMode, happyMode, direction } = storeToRefs(appStore)
const { setThemeMode } = useTheme()
let systemDarkMediaQuery: MediaQueryList | null = null

function handleSystemThemeChange() {
  if (themeModeStore.value === 'system') {
    setThemeMode('system')
  }
}

watch(
  darkMode,
  (val) => {
    applyThemeToDOM(val)
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  setThemeMode(themeModeStore.value)

  systemDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  if (isFunction(systemDarkMediaQuery.addEventListener)) {
    systemDarkMediaQuery.addEventListener('change', handleSystemThemeChange)
  }
  else {
    systemDarkMediaQuery.addListener(handleSystemThemeChange)
  }
})

onBeforeUnmount(() => {
  if (!systemDarkMediaQuery) {
    return
  }

  if (isFunction(systemDarkMediaQuery.removeEventListener)) {
    systemDarkMediaQuery.removeEventListener('change', handleSystemThemeChange)
  }
  else {
    systemDarkMediaQuery.removeListener(handleSystemThemeChange)
  }
})

const antdLocale = shallowRef(cn)
watch(
  locale,
  () => {
    antdLocale.value = locale.value === 'zh-CN' ? cn : en
    dayjs.locale(locale.value === 'zh-CN' ? 'zh-cn' : 'en')
  },
  {
    immediate: true,
  },
)

const algorithm = computed(() => {
  const { darkAlgorithm, compactAlgorithm, defaultAlgorithm } = theme
  const algorithms = [defaultAlgorithm]
  if (darkMode.value) {
    algorithms.push(darkAlgorithm)
  }
  if (compactMode.value) {
    algorithms.push(compactAlgorithm)
  }
  return algorithms
})

const zeroRuntime = import.meta.env.PROD || import.meta.env.ANTDV_VIRTUAL_CSS_ENABLED

const themeConfig = computed(() => {
  return {
    algorithm: algorithm.value,
    zeroRuntime,
  } as any
})
const instance = getCurrentInstance()

watch(
  themeConfig,
  () => {
    ConfigProvider.config({
      theme: themeConfig.value,
      appContext: instance?.appContext,
      holderRender: children => h(DocsAppShell, {
        happy: happyMode.value,
        direction: direction.value,
        locale: antdLocale.value,
        theme: themeConfig.value,
      }, {
        default: () => children,
      }),
    })
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <DocsAppShell
    :happy="happyMode"
    :direction="direction"
    :locale="antdLocale"
    :theme="themeConfig"
  >
    <slot />
  </DocsAppShell>
</template>
