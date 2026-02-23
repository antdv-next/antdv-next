<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useLocale } from '@/composables/use-locale'
import { useAppStore } from '@/stores/app.ts'
import Group from '../group/index.vue'
import BackgroundImage from './background-image.vue'
import ComponentsBlock from './components-block.vue'
import { usePreviewThemes } from './preview-theme'

const { t } = useLocale()
const appStore = useAppStore()
const { darkMode } = storeToRefs(appStore)

const previewThemes = usePreviewThemes()
const activeName = ref('')

function getModeDefaultTheme(themes = previewThemes.value) {
  if (!themes.length)
    return undefined

  const defaultThemeKey = darkMode.value ? 'dark' : 'light'
  return themes.find(item => item.key === defaultThemeKey) ?? themes[0]
}

const activeTheme = computed(() => {
  return previewThemes.value.find(item => item.name === activeName.value) ?? previewThemes.value[0]
})

const backgroundPrefetchList = computed(() => {
  return previewThemes.value
    .map(item => item.bgImg)
    .filter((img): img is string => !!img)
})

watch(
  darkMode,
  () => {
    const themes = previewThemes.value
    if (!themes.length) {
      activeName.value = ''
      return
    }

    activeName.value = getModeDefaultTheme(themes)?.name ?? themes[0]!.name
  },
  { immediate: true },
)

watch(
  previewThemes,
  (themes) => {
    if (!themes.length) {
      activeName.value = ''
      return
    }

    if (!themes.some(item => item.name === activeName.value)) {
      activeName.value = getModeDefaultTheme(themes)?.name ?? themes[0]!.name
    }
  },
  { immediate: true },
)

watch(
  backgroundPrefetchList,
  (images) => {
    images.forEach((url) => {
      if (url && url.startsWith('https')) {
        const img = new Image()
        img.src = url
      }
    })
  },
  { immediate: true },
)

function handleThemeClick(name: string) {
  activeName.value = name
}

function handleThemeKeyDown(event: KeyboardEvent, name: string) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleThemeClick(name)
  }
}
</script>

<template>
  <Group
    id="flexible"
    :title="t('homePage.theme.themeTitle')"
    :description="t('homePage.theme.themeDesc')"
    :title-color="activeTheme?.bgImgDark ? '#fff' : undefined"
  >
    <a-flex class="theme-container" gap="large">
      <div class="theme-list" role="tablist" aria-label="Theme selection">
        <div
          v-for="item in previewThemes"
          :key="item.name"
          class="theme-list-item"
          :class="{
            active: activeName === item.name,
            dark: activeTheme?.bgImgDark,
          }"
          role="tab"
          :tabindex="activeName === item.name ? 0 : -1"
          :aria-selected="activeName === item.name"
          @click="handleThemeClick(item.name)"
          @keydown="(event) => handleThemeKeyDown(event, item.name)"
        >
          {{ item.name }}
        </div>
      </div>

      <BackgroundImage
        :src="activeTheme?.bgImg"
        :is-light="!activeTheme?.bgImgDark"
      />

      <ComponentsBlock
        :key="activeName"
        :config="activeTheme?.props"
        class-name="components-block"
        container-class-name="components-block-container"
      />
    </a-flex>
  </Group>
</template>

<style>
.theme-container {
  width: 100%;
  align-items: stretch;
  justify-content: center;
}

.theme-list {
  flex: auto;
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: var(--ant-padding-md);
}

.theme-list-item {
  margin: 0;
  font-size: var(--ant-font-size-lg);
  line-height: var(--ant-line-height-lg);
  padding-block: var(--ant-padding);
  padding-inline: var(--ant-padding-lg);
  border: var(--ant-line-width) var(--ant-line-type) var(--ant-color-border-secondary);
  border-radius: var(--ant-border-radius);
  border-color: transparent;
  transition: all var(--ant-motion-duration-mid) var(--ant-motion-ease-in-out);
}

.theme-list-item:hover:not(.active) {
  border-color: var(--ant-color-primary-border);
  background-color: var(--ant-color-primary-bg);
  cursor: pointer;
}

.theme-list-item:focus-visible {
  outline: 2px solid var(--ant-color-primary);
  outline-offset: 2px;
}

.theme-list-item.active {
  border-color: var(--ant-color-primary);
  background-color: var(--ant-color-primary-bg);
  color: var(--ant-color-primary);
}

.theme-list-item.dark {
  color: var(--ant-color-text-light-solid);
  background-color: transparent;
}

.theme-list-item.dark:hover,
.theme-list-item.dark.active {
  border-color: var(--ant-color-text-light-solid);
  background-color: transparent;
}

.components-block {
  flex: none;
  max-width: calc(420px + var(--ant-padding-xl) * 2);
}

.components-block-container {
  flex: auto;
  display: flex;
  padding: var(--ant-padding-xl);
  justify-content: center;
  border: var(--ant-line-width) var(--ant-line-type) var(--ant-color-border-secondary);
  border-radius: var(--ant-border-radius);
  box-shadow: var(--ant-box-shadow);
}
</style>
