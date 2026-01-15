<script setup lang="ts">
import type { CategoriesKeys } from './field'
import { message } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import CopyableIcon from './CopyableIcon.vue'

export type ThemeType = 'Filled' | 'Outlined' | 'TwoTone'

const props = defineProps<{
  title: CategoriesKeys
  icons: string[]
  theme: ThemeType
  newIcons: string[]
}>()

const { locale } = storeToRefs(useAppStore())
const justCopied = ref<string | null>(null)
const copyId = ref<ReturnType<typeof setTimeout> | null>(null)

function onCopied(type: string, text: string) {
  message.success(`${text} copied 🎉`)
  justCopied.value = type
  copyId.value = setTimeout(() => {
    justCopied.value = null
  }, 2000)
};

onBeforeUnmount(() => {
  if (copyId.value) {
    clearTimeout(copyId.value)
  }
})

const CategoriesLocales = {
  direction: { 'zh-CN': '方向性图标', 'en-US': 'Directional Icons' },
  suggestion: { 'zh-CN': '提示建议性图标', 'en-US': 'Suggested Icons' },
  editor: { 'zh-CN': '编辑类图标', 'en-US': 'Editor Icons' },
  data: { 'zh-CN': '数据类图标', 'en-US': 'Data Icons' },
  logo: { 'zh-CN': '品牌和标识', 'en-US': 'Brand and Logos' },
  other: { 'zh-CN': '网站通用图标', 'en-US': 'Application Icons' },
}

const t = computed(() => CategoriesLocales[props.title]?.[locale.value])
</script>

<template>
  <div>
    <h3>{{ t }}</h3>
    <ul class="anticonsList">
      <CopyableIcon
        v-for="name in icons"
        :key="name"
        :name="name"
        :theme="theme"
        :is-new="newIcons.includes(name)"
        :just-copied="justCopied"
        @copied="onCopied"
      />
    </ul>
  </div>
</template>

<style scoped>
.anticonsList {
  margin: 16px;
  overflow: hidden;
  direction: ltr;
  list-style: none;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  padding: 0;
}
.copiedCode {
  padding: 0;
  font-size: 1px;
  background-color: transparent;
  border-radius: 8px;
}
</style>
