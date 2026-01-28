<script setup lang="ts">
import type { THEME } from './types'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAppStore } from '@/stores/app.ts'

defineProps<{
  id?: string
  modelValue?: THEME
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: THEME): void
}>()

const THEMES: Record<THEME, string> = {
  default: 'https://gw.alipayobjects.com/zos/bmw-prod/ae669a89-0c65-46db-b14b-72d1c7dd46d6.svg',
  dark: 'https://gw.alipayobjects.com/zos/bmw-prod/0f93c777-5320-446b-9bb7-4d4b499f346d.svg',
  lark: 'https://gw.alipayobjects.com/zos/bmw-prod/3e899b2b-4eb4-4771-a7fc-14c7ff078aed.svg',
  comic: 'https://gw.alipayobjects.com/zos/bmw-prod/ed9b04e8-9b8d-4945-8f8a-c8fc025e846f.svg',
  v4: 'https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*bOiWT4-34jkAAAAAAAAAAAAADrJ8AQ/original',
}

const locales = {
  'zh-CN': {
    default: '默认',
    dark: '暗黑',
    lark: '知识协作',
    comic: '桃花缘',
    v4: 'V4 主题',
  },
  'en-US': {
    default: 'Default',
    dark: 'Dark',
    lark: 'Document',
    comic: 'Blossom',
    v4: 'V4 Theme',
  },
}

const appStore = useAppStore()
const { locale } = storeToRefs(appStore)

const currentLocale = computed(() => locales[locale.value])

function handleClick(themeKey: THEME) {
  emit('update:modelValue', themeKey)
}
</script>

<template>
  <a-flex gap="large" wrap>
    <a-flex
      v-for="(url, themeKey, index) in THEMES"
      :key="themeKey"
      vertical
      gap="small"
      justify="center"
      align="center"
    >
      <label
        class="antdv-theme-picker-card"
        :class="{ 'antdv-theme-picker-card-active': modelValue === themeKey }"
        @click="handleClick(themeKey as THEME)"
      >
        <input
          :id="index === 0 ? id : undefined"
          type="radio"
          name="theme"
        >
        <img draggable="false" :src="url" :alt="themeKey">
      </label>
      <span>{{ currentLocale[themeKey as THEME] }}</span>
    </a-flex>
  </a-flex>
</template>

<style>
.antdv-theme-picker-card {
  border-radius: var(--ant-border-radius);
  cursor: pointer;
  transition: all var(--ant-motion-duration-slow);
  overflow: hidden;
  display: inline-block;
}

.antdv-theme-picker-card > input[type='radio'] {
  width: 0;
  height: 0;
  opacity: 0;
  position: absolute;
}

.antdv-theme-picker-card img {
  vertical-align: top;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.antdv-theme-picker-card:focus-within,
.antdv-theme-picker-card:hover {
  transform: scale(1.04);
}

.antdv-theme-picker-card-active {
  box-shadow:
    0 0 0 1px var(--ant-color-bg-container),
    0 0 0 calc(var(--ant-control-outline-width) * 2 + 1px) var(--ant-color-primary);
}

.antdv-theme-picker-card-active,
.antdv-theme-picker-card-active:hover:not(:focus-within) {
  transform: scale(1);
}
</style>
