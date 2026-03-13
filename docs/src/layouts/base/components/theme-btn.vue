<script setup lang="ts">
import type { MenuProps } from 'antdv-next'
import { AntDesignOutlined, BgColorsOutlined, CompressOutlined, LinkOutlined, MoonOutlined, ShopOutlined, SmileOutlined, SunOutlined, SyncOutlined } from '@antdv-next/icons'
import { Modal } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { computed, h } from 'vue'
import ThemeIcon from '@/components/icons/theme.vue'
import { themeModeStore } from '@/composables/local-store'
import { useTheme } from '@/composables/theme'
import { useLocale } from '@/composables/use-locale'
import { useAppStore } from '@/stores/app'

defineOptions({
  name: 'ThemeBtn',
})

const { setThemeMode } = useTheme()
const local = localStorage.getItem('locale')
const confirm = Modal.confirm
const appStore = useAppStore()
const { compactMode, happyMode } = storeToRefs(appStore)

const themeMode = themeModeStore
const { t } = useLocale()

const BlueDot = h('span', {
  style: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#1677ff',
  },
})

const themeMenuItems = computed<MenuProps['items']>(() => [
  {
    key: 'system',
    label: t('ui.themeBtn.system'),
    icon: h(SyncOutlined),
    extra: themeMode.value === 'system' ? BlueDot : undefined,
  },
  {
    key: 'light',
    label: t('ui.themeBtn.light'),
    icon: h(SunOutlined),
    extra: themeMode.value === 'light' ? BlueDot : undefined,
  },
  {
    key: 'dark',
    label: t('ui.themeBtn.dark'),
    icon: h(MoonOutlined),
    extra: themeMode.value === 'dark' ? BlueDot : undefined,
  },
  {
    type: 'divider',
  },
  {
    key: 'compact',
    label: t('ui.themeBtn.compact'),
    icon: h(CompressOutlined),
    extra: compactMode.value ? BlueDot : undefined,
  },
  {
    type: 'divider',
  },
  {
    key: 'happy',
    label: t('ui.themeBtn.happy'),
    icon: h(SmileOutlined),
    extra: happyMode.value ? BlueDot : undefined,
  },
  {
    type: 'divider',
  },
  {
    key: 'ai-theme',
    label: t('ui.themeBtn.aiTheme'),
    icon: h(ShopOutlined),
  },
  {
    key: 'theme-editor',
    label: t('ui.themeBtn.themeEditor'),
    icon: h(BgColorsOutlined),
    extra: h(LinkOutlined),
  },
])

function handleMenuClick(info: { key: string, domEvent: MouseEvent }) {
  const { key, domEvent } = info
  if (key === 'system' || key === 'light' || key === 'dark') {
    themeMode.value = key
    setThemeMode(key, domEvent)
  }
  else if (key === 'compact') {
    appStore.toggleCompactMode()
  }
  else if (key === 'happy') {
    appStore.toggleHappyMode()
  }
  else if (key === 'ai-theme') {
    confirm({
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
  else if (key === 'theme-editor') {
    if (local === 'zh-CN')
      window.open('https://ant.design/theme-editor-cn', '_blank')
    else
      window.open('https://ant.design/theme-editor', '_blank')
  }
}
</script>

<template>
  <a-dropdown
    :menu="{ items: themeMenuItems }"
    :trigger="['hover']"
    placement="bottomRight"
    @menu-click="handleMenuClick"
  >
    <a-button type="text" class="text-16px">
      <template #icon>
        <ThemeIcon />
      </template>
    </a-button>
  </a-dropdown>
</template>
