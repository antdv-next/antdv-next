<docs lang="zh-CN">
点击菜单，收起其他展开的所有菜单，保持菜单聚焦简洁。
</docs>

<docs lang="en-US">
Click the menu and you will see that all the other menus gets collapsed to keep the entire menu compact.
</docs>

<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const items: MenuItemType[] = [
  {
    key: '1',
    icon: MailOutlined,
    label: 'Navigation One',
    children: [
      { key: '11', label: 'Option 1' },
      { key: '12', label: 'Option 2' },
      { key: '13', label: 'Option 3' },
      { key: '14', label: 'Option 4' },
    ],
  },
  {
    key: '2',
    icon: AppstoreOutlined,
    label: 'Navigation Two',
    children: [
      { key: '21', label: 'Option 1' },
      { key: '22', label: 'Option 2' },
      {
        key: '23',
        label: 'Submenu',
        children: [
          { key: '231', label: 'Option 1' },
          { key: '232', label: 'Option 2' },
          { key: '233', label: 'Option 3' },
        ],
      },
      {
        key: '24',
        label: 'Submenu 2',
        children: [
          { key: '241', label: 'Option 1' },
          { key: '242', label: 'Option 2' },
          { key: '243', label: 'Option 3' },
        ],
      },
    ],
  },
  {
    key: '3',
    icon: SettingOutlined,
    label: 'Navigation Three',
    children: [
      { key: '31', label: 'Option 1' },
      { key: '32', label: 'Option 2' },
      { key: '33', label: 'Option 3' },
      { key: '34', label: 'Option 4' },
    ],
  },
]

interface LevelKeysProps {
  key?: string
  children?: LevelKeysProps[]
}

function getLevelKeys(itemList: LevelKeysProps[]) {
  const keyLevelMap: Record<string, number> = {}
  const func = (list: LevelKeysProps[], level = 1) => {
    list.forEach((item) => {
      if (item.key) {
        keyLevelMap[item.key] = level
      }
      if (item.children) {
        func(item.children, level + 1)
      }
    })
  }
  func(itemList)
  return keyLevelMap
}

const levelKeys = getLevelKeys(items as LevelKeysProps[])
const stateOpenKeys = ref<string[]>(['2', '23'])

function onOpenChange(openKeys: string[]) {
  const currentOpenKey = openKeys.find(key => !stateOpenKeys.value.includes(key))
  if (currentOpenKey !== undefined) {
    const repeatIndex = openKeys
      .filter(key => key !== currentOpenKey)
      .findIndex(key => levelKeys[key] === levelKeys[currentOpenKey])

    stateOpenKeys.value = openKeys
      .filter((_, index) => index !== repeatIndex)
      .filter(key => levelKeys[key]! <= levelKeys[currentOpenKey]!)
  }
  else {
    stateOpenKeys.value = openKeys
  }
}
</script>

<template>
  <a-menu
    mode="inline"
    style="width: 256px"
    :default-selected-keys="['231']"
    :open-keys="stateOpenKeys"
    :items="items"
    @open-change="onOpenChange"
  />
</template>
