<script setup lang="ts">
import { theme } from 'antdv-next'
import en from 'antdv-next/locale/en_US'
import cn from 'antdv-next/locale/zh_CN'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, shallowRef, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'

const appStore = useAppStore()
const { locale, darkMode, compactMode } = storeToRefs(appStore)

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
</script>

<template>
  <a-style-provider>
    <a-config-provider
      :locale="antdLocale"
      :theme="{
        algorithm,
        zeroRuntime: true,
      }"
    >
      <a-app>
        <slot />
      </a-app>
    </a-config-provider>
  </a-style-provider>
</template>
