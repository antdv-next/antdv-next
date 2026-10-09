<docs lang="zh-CN">
折叠状态下可配置 `tooltip`，也可以关闭。
</docs>

<docs lang="en-US">
Configure `tooltip` in inline collapsed mode, or disable it.
</docs>

<script setup lang="ts">
import type { MenuItemType, TooltipProps } from 'antdv-next'
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@antdv-next/icons'
import { computed, ref } from 'vue'

const collapsed = ref(false)
const tooltipEnabled = ref(true)

function toggleCollapsed() {
  collapsed.value = !collapsed.value
}

const items: MenuItemType[] = [
  { key: '1', icon: PieChartOutlined, label: 'Option 1' },
  { key: '2', icon: DesktopOutlined, label: 'Option 2' },
  { key: '3', icon: ContainerOutlined, label: 'Option 3' },
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: MailOutlined,
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      { key: '7', label: 'Option 7' },
      { key: '8', label: 'Option 8' },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    icon: AppstoreOutlined,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '11', label: 'Option 11' },
          { key: '12', label: 'Option 12' },
        ],
      },
    ],
  },
]

const tooltip = computed<false | TooltipProps>(() =>
  tooltipEnabled.value ? { placement: 'left' } : false,
)
</script>

<template>
  <div style="width: 256px">
    <a-space style="margin-bottom: 16px">
      <a-button type="primary" @click="toggleCollapsed">
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </a-button>
      <a-switch
        v-model:checked="tooltipEnabled"
        checked-children="Tooltip On"
        un-checked-children="Tooltip Off"
      />
    </a-space>
    <a-menu
      :default-selected-keys="['1']"
      :default-open-keys="['sub1']"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
      :items="items"
      :tooltip="tooltip"
    />
  </div>
</template>
