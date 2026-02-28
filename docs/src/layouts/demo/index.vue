<script lang="ts" setup>
import { ConfigProvider, theme } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { applyThemeToDOM } from '@/composables/theme'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const { darkMode, compactMode, direction } = storeToRefs(appStore)

watch(
  darkMode,
  (val) => {
    applyThemeToDOM(val)
  },
  { immediate: true },
)

// 监听父页面的主题变化消息
function handleMessage(event: MessageEvent) {
  if (event.data?.type === 'theme-change') {
    const isDark = event.data.darkMode
    if (darkMode.value !== isDark) {
      appStore.toggleDarkMode(isDark)
    }
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})

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

const themeConfig = computed(() => ({
  algorithm: algorithm.value,
}))

watch(
  themeConfig,
  () => {
    ;(ConfigProvider as any).config({
      theme: themeConfig.value,
    })
  },
  { immediate: true },
)
</script>

<template>
  <a-style-provider>
    <a-config-provider :direction="direction" :theme="themeConfig">
      <a-app>
        <router-view />
      </a-app>
    </a-config-provider>
  </a-style-provider>
</template>
