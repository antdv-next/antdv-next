<docs lang="zh-CN">
通过 `labelRender`、`extraRender` 与 `iconRender` 插槽自定义菜单项渲染。
</docs>

<docs lang="en-US">
Customize menu item rendering with `labelRender`, `extraRender`, and `iconRender` slots.
</docs>

<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { ClockCircleFilled } from '@antdv-next/icons'

const items: MenuItemType[] = [
  {
    key: 'sub1',
    label: 'Navigation One',
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' },
        ],
      },
      {
        key: 'g2',
        label: 'Item 2',
        type: 'group',
        children: [
          { key: '3', label: 'Option 3' },
          { key: '4', label: 'Option 4' },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '7', label: 'Option 7' },
          { key: '8', label: 'Option 8' },
        ],
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    key: 'sub4',
    label: 'Navigation Three',
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
  {
    key: 'grp',
    label: 'Group',
    type: 'group',
    children: [
      { key: '13', label: 'Option 13' },
      { key: '14', label: 'Option 14' },
    ],
  },
]
</script>

<template>
  <a-menu
    style="width: 320px"
    :default-open-keys="['sub1']"
    :default-selected-keys="['1']"
    mode="inline"
    :items="items"
  >
    <template #labelRender="item">
      <span class="menu-slot-label">
        {{ item.label }}
      </span>
    </template>

    <template #extraRender="item">
      <span
        v-if="item?.key && !item?.children && item?.type !== 'group'"
        class="menu-slot-extra"
      >
        #{{ item.key }}
      </span>
    </template>

    <template #iconRender="item">
      <span v-if="item?.key" class="menu-slot-icon">
        <ClockCircleFilled />
      </span>
    </template>
  </a-menu>
</template>

<style scoped>
.menu-slot-label {
  font-weight: 500;
}

.menu-slot-extra {
  color: #1677ff;
  font-size: 12px;
}

.menu-slot-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  color: #fff;
  background: #1677ff;
}
</style>
