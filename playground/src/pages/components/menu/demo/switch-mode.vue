<docs lang="zh-CN">
展示动态切换模式。
</docs>

<docs lang="en-US">
Show the dynamic switching mode (between `inline` and `vertical`).
</docs>

<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import {
  AppstoreOutlined,
  CalendarOutlined,
  LinkOutlined,
  MailOutlined,
  SettingOutlined,
} from '@antdv-next/icons'
import { h, ref } from 'vue'

const mode = ref<'vertical' | 'inline'>('inline')
const theme = ref<'dark' | 'light'>('light')

const items: MenuItemType[] = [
  {
    key: '1',
    icon: MailOutlined,
    label: 'Navigation One',
  },
  {
    key: '2',
    icon: CalendarOutlined,
    label: 'Navigation Two',
  },
  {
    key: 'sub1',
    label: 'Navigation Two',
    icon: AppstoreOutlined,
    children: [
      { key: '3', label: 'Option 3' },
      { key: '4', label: 'Option 4' },
      {
        key: 'sub1-2',
        label: 'Submenu',
        children: [
          { key: '5', label: 'Option 5' },
          { key: '6', label: 'Option 6' },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Three',
    icon: SettingOutlined,
    children: [
      { key: '7', label: 'Option 7' },
      { key: '8', label: 'Option 8' },
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
    ],
  },
  {
    key: 'link',
    icon: LinkOutlined,
    label: h(
      'a',
      {
        href: 'https://ant.design',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      'Antdv Next',
    ),
  },
]

function changeMode(value: boolean) {
  mode.value = value ? 'vertical' : 'inline'
}

function changeTheme(value: boolean) {
  theme.value = value ? 'dark' : 'light'
}
</script>

<template>
  <a-switch :checked="mode === 'vertical'" @change="changeMode" />
  Change Mode
  <a-divider type="vertical" />
  <a-switch :checked="theme === 'dark'" @change="changeTheme" />
  Change Style
  <br>
  <br>
  <a-menu
    style="width: 256px"
    :default-selected-keys="['1']"
    :default-open-keys="['sub1']"
    :mode="mode"
    :theme="theme"
    :items="items"
  />
</template>
