<docs lang="zh-CN">
通过贴附在 Sider 边缘的自定义触发器控制收起展开。展开后的 Sider 可以通过业务样式脱离文档流并覆盖内容，避免挤压内容区域。
</docs>

<docs lang="en-US">
Use a custom trigger attached to the Sider edge to collapse or expand it. The expanded Sider can leave the document flow and overlay the content with business styles to avoid squeezing the content area.
</docs>

<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import {
  DesktopOutlined,
  FileOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@antdv-next/icons'
import { theme } from 'antdv-next'
import { ref } from 'vue'

const { token } = theme.useToken()

const collapsed = ref(false)

const items: MenuItemType[] = [
  { key: '1', icon: PieChartOutlined, label: 'nav 1' },
  { key: '2', icon: DesktopOutlined, label: 'nav 2' },
  { key: '3', icon: TeamOutlined, label: 'nav 3' },
  { key: '4', icon: FileOutlined, label: 'nav 4' },
]

const currentYear = new Date().getFullYear()
</script>

<template>
  <a-layout class="overlay-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      collapsed-width="0"
      class="overlay-sider"
    >
      <template #trigger>
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </template>
      <div class="demo-logo-vertical" />
      <a-menu
        theme="dark"
        mode="inline"
        :default-selected-keys="['1']"
        :items="items"
      />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="overlay-header" :style="{ background: token.colorBgContainer }" />
      <a-layout-content class="overlay-content">
        <div
          class="overlay-content-inner"
          :style="{
            background: token.colorBgContainer,
            borderRadius: `${token.borderRadiusLG}px`,
          }"
        >
          Content keeps its full width when the sider overlays it.
        </div>
      </a-layout-content>
      <a-layout-footer class="overlay-footer">
        Antdv Next ©{{ currentYear }} Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.overlay-layout {
  position: relative;
  min-height: 360px;
}

.overlay-sider {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  z-index: 10;
}

.overlay-header {
  padding: 0;
}

.overlay-content {
  margin: 24px 16px 0;
}

.overlay-content-inner {
  padding: 24px;
  min-height: 240px;
}

.overlay-footer {
  text-align: center;
}

.demo-logo-vertical {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
