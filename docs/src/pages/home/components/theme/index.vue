<script setup lang="ts">
import { CheckOutlined, CopyOutlined } from '@antdv-next/icons'
import { message, theme } from 'antdv-next'
import { createStyles } from 'antdv-style'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useMobile } from '@/composables/mobile'
import { useLocale } from '@/composables/use-locale'
import { useAppStore } from '@/stores/app'
import Group from '../group/index.vue'
import ComponentsBlock from './components-block.vue'
import { usePreviewThemes } from './preview-theme'
import { generateFullCopyFile } from './theme-code-utils'

const { t } = useLocale()
const { isMobile } = useMobile()
const appStore = useAppStore()
const { darkMode } = storeToRefs(appStore)

const previewThemes = usePreviewThemes()
const activeName = ref('')
const copiedName = ref<string | null>(null)
const hoveredName = ref<string | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const useStyles = createStyles(({ css, cssVar }) => ({
  container: css({
    width: '100%',
    color: cssVar.colorText,
    lineHeight: cssVar.lineHeight,
    fontSize: cssVar.fontSize,
    fontFamily: cssVar.fontFamily,
    alignItems: 'stretch',
    justifyContent: 'center',
  }),
  list: css({
    flex: 'auto',
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: cssVar.paddingSM,
  }),
  listItem: css({
    margin: 0,
    fontSize: cssVar.fontSizeLG,
    lineHeight: cssVar.lineHeightLG,
    paddingBlock: cssVar.padding,
    paddingInline: cssVar.paddingLG,
    border: `${cssVar.lineWidth} ${cssVar.lineType} ${cssVar.colorBorderSecondary}`,
    borderRadius: cssVar.borderRadius,
    borderColor: 'transparent',
    transition: `all ${cssVar.motionDurationMid} ${cssVar.motionEaseInOut}`,
    cursor: 'pointer',

    '&:hover:not(.active):not(.dark)': {
      borderColor: cssVar.colorPrimaryBorder,
      backgroundColor: cssVar.colorPrimaryBg,
    },

    '&:focus-visible': {
      outline: `2px solid ${cssVar.colorPrimary}`,
      outlineOffset: 2,
    },

    '&.active': {
      borderColor: cssVar.colorPrimary,
      backgroundColor: cssVar.colorPrimaryBg,
      color: cssVar.colorPrimary,
    },

    '&.dark': {
      color: cssVar.colorTextLightSolid,
      backgroundColor: 'transparent',
      borderColor: 'transparent',

      '&:hover, &.active': {
        borderColor: cssVar.colorTextLightSolid,
        backgroundColor: 'transparent',
        color: cssVar.colorTextLightSolid,
      },

      '&.active': {
        color: cssVar.colorTextLightSolid,
        borderColor: cssVar.colorTextLightSolid,
        backgroundColor: 'transparent',
      },
    },
  }),
  listItemContent: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: cssVar.paddingSM,
  }),
  copyButton: css({
    opacity: 0,
    flexShrink: 0,
    transition: `opacity ${cssVar.motionDurationMid} ${cssVar.motionEaseInOut}`,

    '&.visible': {
      opacity: 1,
    },

    '&.dark': {
      color: cssVar.colorTextLightSolid,

      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },

      '&:active': {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
      },
    },
  }),
  componentsBlock: css({
    flex: 'none',
    maxWidth: `calc(420px + ${cssVar.paddingXL} * 2)`,
  }),
  componentsBlockContainer: css({
    flex: 'auto',
    display: 'flex',
    padding: cssVar.paddingXL,
    justifyContent: 'center',
    border: `${cssVar.lineWidth} ${cssVar.lineType} ${cssVar.colorBorderSecondary}`,
    borderRadius: cssVar.borderRadius,
    boxShadow: cssVar.boxShadow,
  }),
  mobileContainer: css({
    width: '100%',
    boxSizing: 'border-box',
    paddingInline: cssVar.padding,
  }),
  mobileSelector: css({
    display: 'flex',
    width: '100%',
    gap: cssVar.paddingXS,
    overflowX: 'auto',
    paddingBlockEnd: cssVar.paddingSM,
    scrollbarWidth: 'none',

    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  mobileListItem: css({
    flex: '0 0 auto',
    minWidth: 112,
    whiteSpace: 'nowrap',
    fontSize: cssVar.fontSize,
    lineHeight: cssVar.lineHeight,
    paddingBlock: cssVar.paddingXS,
    paddingInline: cssVar.padding,
  }),
  mobileComponentsBlock: css({
    width: '100%',
    maxWidth: '100%',
  }),
  mobileComponentsBlockContainer: css({
    width: '100%',
    boxSizing: 'border-box',
    padding: cssVar.padding,
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

    if (previouslyFocusedElement)
    ;(previouslyFocusedElement as HTMLElement).focus()

    return copied
  }
}

async function handleCopyTheme(event: MouseEvent, name: string) {
  event.stopPropagation()

  const previewTheme = previewThemes.value.find(item => item.name === name)
  if (!previewTheme)
    return

  const code = generateFullCopyFile({
    themeConfig: previewTheme.props?.theme,
    copyCode: previewTheme.copyCode,
  })

  const copied = await copyToClipboard(code)
  if (!copied)
    return

  if (copyTimer)
    clearTimeout(copyTimer)

  copiedName.value = name
  message.success(t('homePage.theme.copySuccess'))
  copyTimer = setTimeout(() => {
    copiedName.value = null
    copyTimer = null
  }, 2000)
}

onBeforeUnmount(() => {
  if (copyTimer)
    clearTimeout(copyTimer)
})
</script>

<template>
  <a-config-provider :theme="{ algorithm: theme.defaultAlgorithm }">
    <Group
      id="flexible"
      :title="t('homePage.theme.themeTitle')"
      :description="t('homePage.theme.themeDesc')"
      :background="activeTheme?.bgImg"
      :background-prefetch-list="backgroundPrefetchList"
      :title-color="activeTheme?.bgImgDark ? '#fff' : undefined"
    >
      <a-flex v-if="!isMobile" :class="styles.container" gap="large">
        <div style="display: flex;">
          <div :class="styles.list" role="tablist" aria-label="Theme selection">
            <div
              v-for="item in previewThemes"
              :key="item.name"
              :class="[styles.listItem, {
                active: activeName === item.name,
                dark: isThemeListDark,
              }]"
              role="tab"
              :tabindex="activeName === item.name ? 0 : -1"
              :aria-selected="activeName === item.name"
              @click="handleThemeClick(item.name)"
              @keydown="(event) => handleThemeKeyDown(event, item.name)"
              @mouseenter="hoveredName = item.name"
              @mouseleave="hoveredName = null"
            >
              <div :class="styles.listItemContent">
                <span>{{ item.name }}</span>
                <a-tooltip :title="t('homePage.theme.copyTheme')">
                  <a-button
                    type="text"
                    size="small"
                    :class="[styles.copyButton, {
                      visible: hoveredName === item.name || copiedName === item.name,
                      dark: isThemeListDark,
                    }]"
                    :aria-label="t('homePage.theme.copyTheme')"
                    @click="(event) => handleCopyTheme(event, item.name)"
                  >
                    <template #icon>
                      <CheckOutlined v-if="copiedName === item.name" />
                      <CopyOutlined v-else />
                    </template>
                  </a-button>
                </a-tooltip>
              </div>
            </div>
          </div>
        </div>

        <ComponentsBlock
          :key="activeName"
          :config="activeTheme?.props"
          :class-name="styles.componentsBlock"
          :container-class-name="styles.componentsBlockContainer"
        />
      </a-flex>

      <div v-else :class="styles.mobileContainer">
        <div :class="styles.mobileSelector" role="tablist" aria-label="Theme selection">
          <div
            v-for="item in previewThemes"
            :key="item.name"
            :class="[styles.listItem, styles.mobileListItem, {
              active: activeName === item.name,
              dark: isThemeListDark,
            }]"
            role="tab"
            :tabindex="activeName === item.name ? 0 : -1"
            :aria-selected="activeName === item.name"
            @click="handleThemeClick(item.name)"
            @keydown="(event) => handleThemeKeyDown(event, item.name)"
          >
            {{ item.name }}
          </div>
        </div>

        <ComponentsBlock
          :key="activeName"
          :config="activeTheme?.props"
          :class-name="styles.mobileComponentsBlock"
          :container-class-name="styles.mobileComponentsBlockContainer"
          compact
        />
      </div>
    </Group>
  </a-config-provider>
</template>
