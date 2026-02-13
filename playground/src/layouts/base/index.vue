<script setup lang="ts">
import { HappyProvider } from '@antdv-next/happy-work-theme'
import { ConfigProvider, theme } from 'antdv-next'
import en from 'antdv-next/locale/en_US'
import cn from 'antdv-next/locale/zh_CN'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, getCurrentInstance, onMounted, shallowRef, watch } from 'vue'
import { themeModeStore } from '@/composables/local-store'
import { applyThemeToDOM, useTheme } from '@/composables/theme'
import { useAppStore } from '@/stores/app'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'

const appStore = useAppStore()
const { locale, darkMode, compactMode, happyMode, direction } = storeToRefs(appStore)
const { setThemeMode } = useTheme()

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
    })
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <a-style-provider layer>
    <HappyProvider v-slot="{ wave }" :enabled="happyMode">
      <a-config-provider
        :locale="antdLocale"
        :direction="direction"
        :theme="themeConfig"
        :wave="wave"
      >
        <a-app>
          <slot />
        </a-app>
      </a-config-provider>
    </HappyProvider>
  </a-style-provider>
</template>
