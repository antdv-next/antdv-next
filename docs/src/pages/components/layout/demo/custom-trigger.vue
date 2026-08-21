<docs lang="zh-CN">
要使用自定义触发器，可以隐藏默认触发器。
</docs>

<docs lang="en-US">
If you want to use a customized trigger, you can hide the default one.
</docs>

<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@antdv-next/icons'
import { theme } from 'antdv-next'
import { ref } from 'vue'

const { token } = theme.useToken()

const collapsed = ref(false)

const items: MenuItemType[] = [
  { key: '1', icon: UserOutlined, label: 'nav 1' },
  { key: '2', icon: VideoCameraOutlined, label: 'nav 2' },
  { key: '3', icon: UploadOutlined, label: 'nav 3' },
]

function toggleCollapsed() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" collapsible :trigger="null">
      <div class="demo-logo-vertical" />
      <a-menu
        theme="dark"
        mode="inline"
        :default-selected-keys="['1']"
        :items="items"
      />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="custom-header" :style="{ background: token.colorBgContainer }">
        <a-button type="text" class="trigger-button" @click="toggleCollapsed">
          <template #icon>
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
          </template>
        </a-button>
      </a-layout-header>
      <a-layout-content
        class="custom-content"
        :style="{
          background: token.colorBgContainer,
          borderRadius: `${token.borderRadiusLG}px`,
        }"
      >
        Content
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.custom-header {
  padding: 0;
}

.custom-content {
  margin: 24px 16px;
  padding: 24px;
  min-height: 280px;
}

.trigger-button {
  width: 64px;
  height: 64px;
  font-size: 16px;
}

.demo-logo-vertical {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
