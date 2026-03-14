<docs lang="zh-CN">
使用声明式 `a-menu-item`、`a-sub-menu` 编写与 `items` 结构等价的 SFC 菜单。
</docs>

<docs lang="en-US">
Build an SFC menu with declarative `a-menu-item` and `a-sub-menu`, equivalent to the `items` structure.
</docs>

<script setup lang="ts">
import {
  AppstoreOutlined,
  CalendarOutlined,
  LinkOutlined,
  MailOutlined,
  SettingOutlined,
} from '@antdv-next/icons'
import { computed, ref, shallowRef, watch } from 'vue'

const mode = ref<'vertical' | 'inline'>('inline')
const theme = ref<'dark' | 'light'>('light')
const collapsed = ref(false)
const openKeys = ref<string[]>(['sub1'])
const cachedOpenKeys = ref<string[]>(['sub1'])
const inlineCollapsed = computed(() => mode.value === 'inline' && collapsed.value)
const expandAllChecked = computed(() => !collapsed.value && openKeys.value.length > 0)

watch(openKeys, (keys) => {
  if (!collapsed.value) {
    cachedOpenKeys.value = [...keys]
  }
}, { deep: true })

function changeExpanded(value: boolean) {
  if (collapsed.value) {
    return
  }

  openKeys.value = value ? ['sub1', 'sub1-2', 'sub2'] : []
}

function changeCollapsed(value: boolean) {
  collapsed.value = value
  if (value) {
    openKeys.value = []
  }
  else {
    openKeys.value = [...cachedOpenKeys.value]
  }
}

function changeMode(value: boolean) {
  mode.value = value ? 'vertical' : 'inline'
}

function changeTheme(value: boolean) {
  theme.value = value ? 'dark' : 'light'
}
const selectedKeys = shallowRef(['1'])
</script>

<template>
  <a-switch :checked="mode === 'vertical'" @change="changeMode" />
  Change Mode
  <a-divider type="vertical" />
  <a-switch :checked="collapsed" @change="changeCollapsed" />
  Inline Collapsed
  <a-divider type="vertical" />
  <a-switch :checked="expandAllChecked" :disabled="collapsed" @change="changeExpanded" />
  Expand All
  <a-divider type="vertical" />
  <a-switch :checked="theme === 'dark'" @change="changeTheme" />
  Change Style
  <br>
  <br>
  <div style="width: 256px">
    <a-menu
      v-model:selected-keys="selectedKeys"
      v-model:open-keys="openKeys"
      :inline-collapsed="inlineCollapsed"
      :mode="mode"
      :theme="theme"
    >
      <a-menu-item key="1">
        <template #icon>
          <MailOutlined />
        </template>
        Navigation One
      </a-menu-item>

      <a-menu-item key="2">
        <template #icon>
          <CalendarOutlined />
        </template>
        Navigation Two
      </a-menu-item>

      <a-sub-menu key="sub1">
        <template #icon>
          <AppstoreOutlined />
        </template>
        <template #title>
          Navigation Two
        </template>

        <a-menu-item key="3">
          Option 3
        </a-menu-item>
        <a-menu-item key="4">
          Option 4
        </a-menu-item>

        <a-sub-menu key="sub1-2">
          <template #title>
            Submenu
          </template>

          <a-menu-item key="5">
            Option 5
          </a-menu-item>
          <a-menu-item key="6">
            Option 6
          </a-menu-item>
        </a-sub-menu>
      </a-sub-menu>

      <a-sub-menu key="sub2">
        <template #icon>
          <SettingOutlined />
        </template>
        <template #title>
          Navigation Three
        </template>

        <a-menu-item key="7">
          Option 7
        </a-menu-item>
        <a-menu-item key="8">
          Option 8
        </a-menu-item>
        <a-menu-item key="9">
          Option 9
        </a-menu-item>
        <a-menu-item key="10">
          Option 10
        </a-menu-item>
      </a-sub-menu>

      <a-menu-item key="link">
        <template #icon>
          <LinkOutlined />
        </template>
        <a
          href="https://ant.design"
          target="_blank"
          rel="noopener noreferrer"
        >
          Antdv Next
        </a>
      </a-menu-item>
    </a-menu>
  </div>
</template>
