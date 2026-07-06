<script setup lang="ts">
import { AntDesignOutlined, BgColorsOutlined, CopyOutlined } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { App, ConfigProvider, message, Modal, Segmented, theme, Tooltip } from 'antdv-next'
import { createStyles } from 'antdv-style'
import { storeToRefs } from 'pinia'
import { computed, h, onBeforeUnmount, ref, watch } from 'vue'
import ThemeIcon from '@/components/icons/theme.vue'
import { useLocale } from '@/composables/use-locale'
import { useAppStore } from '@/stores/app'
import Group from '../group/index.vue'
import { usePreviewThemes } from './preview-theme'
import ComponentsBlock from './PreviewPane/Components.vue'
import { generateFullCopyFile } from './theme-code-utils'
import ThemeDashboard from './ThemeDashboard.vue'

const { t } = useLocale()
const appStore = useAppStore()
const { darkMode } = storeToRefs(appStore)

const previewThemes = usePreviewThemes()
const activeName = ref('')
const activePane = ref<'components' | 'dashboard'>('components')
let copyTimer: ReturnType<typeof setTimeout> | null = null

const useStyles = createStyles(({ css, cssVar }) => ({
  container: css({
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  }),

  wrapper: css({
    width: '100%',
    maxWidth: 1320,
    flexDirection: 'column',
    alignItems: 'stretch',
  }),

  // ======= Component preview area =======
  componentsBlockContainer: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }),

  componentsBlock: css({
    width: '100%',
    maxWidth: 1320,
    margin: '0 auto',
  }),

  dashboardBlock: css({
    width: '100%',
    maxWidth: 1320,
    margin: '0 auto',
  }),

  previewTabs: css({
    padding: 3,
    borderRadius: 100,
    background: cssVar.colorFillQuaternary,
    '.ant-segmented-group': {
      gap: 2,
    },
    '.ant-segmented-item': {
      borderRadius: 100,
    },
    '.ant-segmented-thumb': {
      borderRadius: 100,
      background: cssVar.colorBgElevated,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    '@media (max-width: 768px)': {
      width: '60%',
    },
  }),

  previewTabsDark: css({
    background: 'rgba(255, 255, 255, 0.14)',
    backdropFilter: 'blur(16px)',
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.16)',
    '.ant-segmented-thumb': {
      background: cssVar.colorBgElevated,
      boxShadow: '0 6px 18px rgba(0,0,0,0.24)',
    },
  }),

  previewTabsItem: css({
    minWidth: 112,
    borderRadius: 100,
    color: cssVar.colorTextTertiary,
    '&.ant-segmented-item-selected': {
      color: cssVar.colorText,
    },
    '@media (max-width: 768px)': {
      flex: 1,
      minWidth: 0,
      paddingInline: 12,
      fontSize: 16,
    },
  }),

  previewTabsItemDark: css({
    color: 'rgba(255, 255, 255, 0.78)',
    '&:not(.ant-segmented-item-selected):not(.ant-segmented-item-disabled):hover': {
      color: '#fff',
      background: 'rgba(255, 255, 255, 0.08)',
    },
    '&.ant-segmented-item-selected': {
      color: cssVar.colorText,
    },
  }),

  previewTabsLabel: css({
    minHeight: 30,
    lineHeight: '30px',
  }),

  switch: css({
    alignItems: 'center',
    gap: 16,
    '@media (max-width: 1200px)': {
      justifyContent: 'center',
      flexDirection: 'column',
    },
  }),

  themeBlock: css({
    height: 20,
    width: 20,
    fontSize: 20,
    borderRadius: '50%',
    cursor: 'pointer',
    backgroundSize: '75%',
    boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    outline: `2px solid ${cssVar.colorBgLayout}`,
    transition: `transform ${cssVar.motionDurationFast}, opacity ${cssVar.motionDurationSlow}`,
    '&:hover, &:focus-within': {
      outline: `2px solid ${cssVar.colorPrimaryBorder}`,
      transform: 'scale(1.1)',
    },
  }),

  active: css({
    outline: `2px solid ${cssVar.colorPrimaryBorder}`,
  }),

  buttonBlock: css({
    height: 28,
    width: 28,
    borderRadius: '50%',
    fontSize: 15,
    color: cssVar.colorPrimaryBorder,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: cssVar.colorBgLayout,
    },
    '@media (max-width: 1200px)': {
      display: 'none',
    },
  }),
}))

const { styles } = useStyles()

function getModeDefaultTheme(themes = previewThemes.value) {
  if (!themes.length)
    return undefined

  const defaultThemeKey = darkMode.value ? 'dark' : 'light'
  return themes.find(item => item.key === defaultThemeKey) ?? themes[0]
}

const activeTheme = computed(() => {
  return previewThemes.value.find(item => item.name === activeName.value) ?? previewThemes.value[0]
})

const isThemeListDark = computed(() => !!activeTheme.value?.bgImgDark)

const segmentedClasses = computed(() => ({
  root: clsx(styles.previewTabs, isThemeListDark.value && styles.previewTabsDark),
  item: clsx(styles.previewTabsItem, isThemeListDark.value && styles.previewTabsItemDark),
  label: styles.previewTabsLabel,
}))

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

function handleKeyDown(event: KeyboardEvent, name: string) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleThemeClick(name)
  }
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  }
  catch {
    const element = document.createElement('textarea')
    const previouslyFocusedElement = document.activeElement

    element.value = text
    element.setAttribute('readonly', '')
    element.style.contain = 'strict'
    element.style.position = 'absolute'
    element.style.left = '-9999px'
    element.style.fontSize = '12pt'

    const selection = document.getSelection()
    const originalRange = selection?.rangeCount ? selection.getRangeAt(0) : null

    document.body.appendChild(element)
    element.select()
    element.selectionStart = 0
    element.selectionEnd = text.length

    const copied = document.execCommand('copy')
    document.body.removeChild(element)

    if (originalRange) {
      selection?.removeAllRanges()
      selection?.addRange(originalRange)
    }

    if (previouslyFocusedElement) {
      (previouslyFocusedElement as HTMLElement).focus()
    }

    return copied
  }
}

async function handleCopyTheme(event: MouseEvent) {
  event.stopPropagation()
  const code = generateFullCopyFile({
    themeConfig: activeTheme.value!.props!.theme,
    copyCode: activeTheme.value!.copyCode,
  })

  const copied = await copyToClipboard(code)
  if (!copied)
    return

  if (copyTimer)
    clearTimeout(copyTimer)

  message.success(t('homePage.theme.copySuccess'))
  copyTimer = setTimeout(() => {
    copyTimer = null
  }, 2000)
}

// Theme-editor link (external to ant.design, matching ant-design behavior)
const editThemeUrl = 'https://ant.design/theme-editor'

function handleOpenThemeEditor() {
  window.open(editThemeUrl, '_blank')
}

function handleAIGenerate() {
  const local = localStorage.getItem('locale')
  Modal.confirm({
    title: t('ui.themeBtn.aiThemeModal.title'),
    icon: h(AntDesignOutlined),
    content: t('ui.themeBtn.aiThemeModal.content'),
    okText: t('ui.themeBtn.aiThemeModal.okText'),
    cancelText: t('ui.themeBtn.aiThemeModal.cancelText'),
    onOk() {
      if (local === 'zh-CN')
        window.open('https://ant.design/index-cn', '_blank')
      else
        window.open('https://ant.design', '_blank')
    },
  })
}

onBeforeUnmount(() => {
  if (copyTimer)
    clearTimeout(copyTimer)
})

const background = computed(() => {
  if (activeTheme.value?.bgImg)
    return activeTheme.value.bgImg
  return 'linear-gradient(180deg, #ffffff 0%, #F5F8FF 100%)'
})
</script>

<template>
  <ConfigProvider :theme="{ algorithm: theme.defaultAlgorithm }">
    <App>
      <Group
        id="flexible"
        :title="t('homePage.theme.themeTitle')"
        :description="t('homePage.theme.themeDesc')"
        :collapse="true"
        :title-color="activeTheme?.bgImgDark ? '#fff' : undefined"
        :background="background"
        :background-prefetch-list="backgroundPrefetchList"
      >
        <a-flex :class="styles.container">
          <a-flex :class="styles.wrapper" :gap="16">
            <!-- Theme switcher row -->
            <a-flex :class="styles.switch" justify="space-between">
              <Segmented
                :classes="segmentedClasses"
                :options="[
                  { label: 'Components', value: 'components' },
                  { label: 'Dashboard', value: 'dashboard' },
                ]"
                :value="activePane"
                @change="(value) => activePane = value as 'components' | 'dashboard'"
              />
              <a-flex align="center" :gap="12">
                <Tooltip
                  v-for="item in previewThemes"
                  :key="item.name"
                  placement="top"
                  :title="item.name"
                >
                  <div
                    :class="[styles.themeBlock, activeName === item.name && styles.active]"
                    role="tab"
                    :tabindex="activeName === item.name ? 0 : -1"
                    :aria-selected="activeName === item.name"
                    :style="{
                      backgroundImage: item.icon ? `url(${item.icon})` : undefined,
                      backgroundColor: 'rgba(229, 229, 229, 0.7)',
                    }"
                    @click="handleThemeClick(item.name)"
                    @keydown="(event: KeyboardEvent) => handleKeyDown(event, item.name)"
                  />
                </Tooltip>

                <!-- Copy button -->
                <Tooltip placement="top" :title="t('homePage.theme.copyTheme')">
                  <div :class="styles.buttonBlock" @click="handleCopyTheme">
                    <CopyOutlined />
                  </div>
                </Tooltip>

                <!-- Edit button -->
                <Tooltip placement="top" :title="t('homePage.theme.customizeTheme')">
                  <div :class="styles.buttonBlock" @click="handleOpenThemeEditor">
                    <BgColorsOutlined />
                  </div>
                </Tooltip>

                <!-- AI Generate button -->
                <Tooltip placement="top" :title="t('homePage.theme.aiGenerate')">
                  <div :class="styles.buttonBlock" @click="handleAIGenerate">
                    <ThemeIcon />
                  </div>
                </Tooltip>
              </a-flex>
            </a-flex>

            <!-- Preview area -->
            <ComponentsBlock
              v-if="activePane === 'components'"
              :key="`components-${activeName}`"
              :is-dark="isThemeListDark"
              :config="activeTheme?.props"
              :class-name="styles.componentsBlock"
              :container-class-name="styles.componentsBlockContainer"
            />
            <ThemeDashboard
              v-else
              :key="`dashboard-${activeName}`"
              :config="activeTheme?.props"
              :active-theme="activeTheme"
              :class="styles.dashboardBlock"
              :style="{ borderRadius: '16px' }"
            />
          </a-flex>
        </a-flex>
      </Group>
    </App>
  </ConfigProvider>
</template>
