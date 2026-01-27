<docs lang="zh-CN">
当内容较长时，使用固定侧边栏可以提供更好的体验。
</docs>

<docs lang="en-US">
When dealing with long content, a sticky sider can provide a better user experience.
</docs>

<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import type { CSSProperties } from 'vue'
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@antdv-next/icons'
import { theme } from 'antdv-next'

const { token } = theme.useToken()
const year = new Date().getFullYear()

const siderStyle: CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
}

const items: MenuItemType[] = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon,
  label: `nav ${index + 1}`,
}))
</script>

<template>
  <a-layout :has-sider="true">
    <a-layout-sider :style="siderStyle">
      <div class="demo-logo-vertical" />
      <a-menu
        theme="dark"
        mode="inline"
        :default-selected-keys="['4']"
        :items="items"
      />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="fixed-header" :style="{ background: token.colorBgContainer }" />
      <a-layout-content class="fixed-content">
        <div
          class="fixed-content-box"
          :style="{
            background: token.colorBgContainer,
            borderRadius: `${token.borderRadiusLG}px`,
          }"
        >
          <p>long content</p>
          <template v-for="index in 100" :key="index">
            {{ index % 20 === 0 && index !== 0 ? 'more' : '...' }}
            <br>
          </template>
        </div>
      </a-layout-content>
      <a-layout-footer class="fixed-footer">
        Antdv Next ©{{ year }} Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.fixed-header {
  padding: 0;
}

.fixed-content {
  margin: 24px 16px 0;
  overflow: initial;
}

.fixed-content-box {
  padding: 24px;
  text-align: center;
}

.fixed-footer {
  text-align: center;
}

.demo-logo-vertical {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
