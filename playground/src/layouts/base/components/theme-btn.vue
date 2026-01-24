<script setup lang="ts">
import type { MenuProps } from 'antdv-next'
import { BgColorsOutlined, CompressOutlined, LinkOutlined, MoonOutlined, ShopOutlined, SmileOutlined, SunOutlined, SyncOutlined } from '@antdv-next/icons'
import { computed, h } from 'vue'
import ThemeIcon from '@/components/icons/theme.vue'
import { themeModeStore } from '@/composables/local-store'
import { useTheme } from '@/composables/theme'

defineOptions({
  name: 'ThemeBtn',
})

const { setThemeMode } = useTheme()

const themeMode = themeModeStore

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
    label: '跟随系统',
    icon: h(SyncOutlined),
    extra: themeMode.value === 'system' ? BlueDot : undefined,
  },
  {
    key: 'light',
    label: '浅色主题',
    icon: h(SunOutlined),
    extra: themeMode.value === 'light' ? BlueDot : undefined,
  },
  {
    key: 'dark',
    label: '暗黑主题',
    icon: h(MoonOutlined),
    extra: themeMode.value === 'dark' ? BlueDot : undefined,
  },
  {
    type: 'divider',
  },
  {
    key: 'compact',
    label: '紧凑主题',
    icon: h(CompressOutlined),
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: 'happy',
    label: '快乐工作特效',
    icon: h(SmileOutlined),
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: 'ai-theme',
    label: 'AI 生成主题',
    icon: h(ShopOutlined),
    disabled: true,
  },
  {
    key: 'theme-editor',
    label: '主题编辑器',
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
}
</script>

<template>
  <a-dropdown
    :menu="{ items: themeMenuItems }"
    :trigger="['click']"
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
