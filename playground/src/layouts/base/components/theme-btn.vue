<script setup lang="ts">
import type { MenuProps } from 'antdv-next'
import { BgColorsOutlined, CompressOutlined, LinkOutlined, MoonOutlined, ShopOutlined, SmileOutlined, SunOutlined, SyncOutlined } from '@antdv-next/icons'
import { storeToRefs } from 'pinia'
import { computed, h } from 'vue'
import ThemeIcon from '@/components/icons/theme.vue'
import { themeModeStore } from '@/composables/local-store'
import { useTheme } from '@/composables/theme'
import { useThemeBtnLocale } from '@/composables/use-theme-btn-locale'
import { useAppStore } from '@/stores/app'

defineOptions({
  name: 'ThemeBtn',
})

const { setThemeMode } = useTheme()

const appStore = useAppStore()
const { compactMode } = storeToRefs(appStore)

const themeMode = themeModeStore
const t = useThemeBtnLocale()

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
    label: t.value.system,
    icon: h(SyncOutlined),
    extra: themeMode.value === 'system' ? BlueDot : undefined,
  },
  {
    key: 'light',
    label: t.value.light,
    icon: h(SunOutlined),
    extra: themeMode.value === 'light' ? BlueDot : undefined,
  },
  {
    key: 'dark',
    label: t.value.dark,
    icon: h(MoonOutlined),
    extra: themeMode.value === 'dark' ? BlueDot : undefined,
  },
  {
    type: 'divider',
  },
  {
    key: 'compact',
    label: t.value.compact,
    icon: h(CompressOutlined),
    extra: compactMode.value ? BlueDot : undefined,
  },
  {
    type: 'divider',
  },
  {
    key: 'happy',
    label: t.value.happy,
    icon: h(SmileOutlined),
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: 'ai-theme',
    label: t.value.aiTheme,
    icon: h(ShopOutlined),
    disabled: true,
  },
  {
    key: 'theme-editor',
    label: t.value.themeEditor,
    icon: h(BgColorsOutlined),
    extra: h(LinkOutlined),
    disabled: true,
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
