<docs lang="zh-CN">
一般用于固定顶部导航，方便页面切换。
</docs>

<docs lang="en-US">
Sticky Header is generally used to fix the top navigation to facilitate page switching.
</docs>

<script setup lang="ts">
import type { BreadcrumbItemType, MenuItemType } from 'antdv-next'
import { theme } from 'antdv-next'

const { token } = theme.useToken()
const year = new Date().getFullYear()

const items: MenuItemType[] = Array.from({ length: 3 }).map((_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}))

const breadcrumbItems: BreadcrumbItemType[] = [
  { title: 'Home' },
  { title: 'List' },
  { title: 'App' },
]
</script>

<template>
  <a-layout>
    <a-layout-header class="demo-header">
      <div class="demo-logo" />
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['2']"
        :items="items"
        class="demo-menu"
      />
    </a-layout-header>
    <a-layout-content class="demo-content">
      <a-breadcrumb class="demo-breadcrumb" :items="breadcrumbItems" />
      <div
        class="demo-content-box"
        :style="{
          background: token.colorBgContainer,
          borderRadius: `${token.borderRadiusLG}px`,
        }"
      >
        Content
      </div>
    </a-layout-content>
    <a-layout-footer class="demo-footer">
      Antdv Next ©{{ year }} Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>

<style scoped>
.demo-header {
  position: sticky;
  top: 0;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
}

.demo-menu {
  flex: 1;
  min-width: 0;
}

.demo-content {
  padding: 0 48px;
}

.demo-breadcrumb {
  margin: 16px 0;
}

.demo-content-box {
  padding: 24px;
  min-height: 380px;
}

.demo-footer {
  text-align: center;
}

.demo-logo {
  width: 120px;
  height: 32px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
