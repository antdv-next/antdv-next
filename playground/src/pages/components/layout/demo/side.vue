<docs lang="zh-CN">
侧边两列式布局。页面横向空间有限时，侧边导航可收起。

侧边导航在页面布局上采用的是左右的结构，一般主导航放置于页面的左侧固定位置，辅助菜单放置于工作区顶部。内容根据浏览器终端进行自适应，能提高横向空间的使用率，但是整个页面排版不稳定。侧边导航的模式层级扩展性强，一、二、三级导航项目可以更为顺畅且具关联性的被展示，同时侧边导航可以固定，使得用户在操作和浏览中可以快速的定位和切换当前位置，有很高的操作效率。但这类导航横向页面内容的空间会被牺牲一部分。
</docs>

<docs lang="en-US">
Two-columns layout. The sider menu can be collapsed when horizontal space is limited.

Generally, the mainnav is placed on the left side of the page, and the secondary menu is placed on the top of the working area. Contents will adapt the layout to the viewing area to improve the horizontal space usage, while the layout of the whole page is not stable.

The level of the aside navigation is scalable. The first, second, and third level navigations could be present more fluently and relevantly, and aside navigation can be fixed, allowing the user to quickly switch and spot the current position, improving the user experience. However, this navigation occupies some horizontal space of the contents.
</docs>

<script setup lang="ts">
import type { BreadcrumbItemType, MenuItemType } from 'antdv-next'
import {
  DesktopOutlined,
  FileOutlined,
  LeftOutlined,
  PieChartOutlined,
  RightOutlined,
  TeamOutlined,
  UserOutlined,
} from '@antdv-next/icons'
import { theme } from 'antdv-next'
import { ref } from 'vue'

const { token } = theme.useToken()
const year = new Date().getFullYear()

const collapsed = ref(false)

const items: MenuItemType[] = [
  { key: '1', icon: PieChartOutlined, label: 'Option 1' },
  { key: '2', icon: DesktopOutlined, label: 'Option 2' },
  {
    key: 'sub1',
    icon: UserOutlined,
    label: 'User',
    children: [
      { key: '3', label: 'Tom' },
      { key: '4', label: 'Bill' },
      { key: '5', label: 'Alex' },
    ],
  },
  {
    key: 'sub2',
    icon: TeamOutlined,
    label: 'Team',
    children: [
      { key: '6', label: 'Team 1' },
      { key: '8', label: 'Team 2' },
    ],
  },
  { key: '9', icon: FileOutlined, label: 'Files' },
]

const breadcrumbItems: BreadcrumbItemType[] = [
  { title: 'User' },
  { title: 'Bill' },
]
</script>

<template>
  <a-layout class="side-layout">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <template #trigger>
        <RightOutlined v-if="collapsed" />
        <LeftOutlined v-else />
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
      <a-layout-header class="side-header" :style="{ background: token.colorBgContainer }" />
      <a-layout-content class="side-content">
        <a-breadcrumb class="side-breadcrumb" :items="breadcrumbItems" />
        <div
          class="side-content-box"
          :style="{
            background: token.colorBgContainer,
            borderRadius: `${token.borderRadiusLG}px`,
          }"
        >
          Bill is a cat.
        </div>
      </a-layout-content>
      <a-layout-footer class="side-footer">
        Antdv Next ©{{ year }} Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.side-layout {
  min-height: 100vh;
}

.side-header {
  padding: 0;
}

.side-content {
  margin: 0 16px;
}

.side-breadcrumb {
  margin: 16px 0;
}

.side-content-box {
  padding: 24px;
  min-height: 360px;
}

.side-footer {
  text-align: center;
}

.demo-logo-vertical {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
