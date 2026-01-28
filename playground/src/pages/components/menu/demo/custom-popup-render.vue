<docs lang="zh-CN">
使用 `popupRender` 属性自定义弹出菜单的渲染。
</docs>

<docs lang="en-US">
Use the `popupRender` prop to customize submenu popup rendering.
</docs>

<script setup lang="ts">
import type { MenuItemType, MenuProps } from 'antdv-next'
import { theme } from 'antdv-next'
import { computed, h } from 'vue'

const { token } = theme.useToken()

const popupStyle = computed(() => ({
  padding: `${token.value.padding}px`,
  minWidth: '480px',
  background: token.value.colorBgElevated,
  borderRadius: `${token.value.borderRadiusLG}px`,
  boxShadow: token.value.boxShadowSecondary,
}))

const headerStyle = computed(() => ({
  margin: 0,
  paddingBottom: `${token.value.paddingXS}px`,
  borderBottom: `1px solid ${token.value.colorSplit}`,
}))

const cardStyle = computed(() => ({
  padding: `${token.value.paddingSM}px`,
}))

const cardItemStyle = computed(() => ({
  borderRadius: `${token.value.borderRadius}px`,
  transition: `all ${token.value.motionDurationSlow}`,
  cursor: 'pointer',
}))

function renderMenuCard(title: string, description: string) {
  return h('div', { class: 'menu-card', style: cardStyle.value }, [
    h('div', { class: 'menu-card-title' }, title),
    h('div', { class: 'menu-card-desc' }, description),
  ])
}

const menuItems = computed<MenuItemType[]>(() => [
  {
    key: 'home',
    label: 'Home',
  },
  {
    key: 'features',
    label: 'Features',
    children: [
      {
        key: 'getting-started',
        label: renderMenuCard('Getting Started', 'Quick start guide and learn the basics.'),
        class: 'menu-card-item',
        style: cardItemStyle.value,
      },
      {
        key: 'components',
        label: renderMenuCard('Components', 'Explore our component library.'),
        class: 'menu-card-item',
        style: cardItemStyle.value,
      },
      {
        key: 'templates',
        label: renderMenuCard('Templates', 'Ready-to-use template designs.'),
        class: 'menu-card-item',
        style: cardItemStyle.value,
      },
    ],
  },
  {
    key: 'resources',
    label: 'Resources',
    children: [
      {
        key: 'blog',
        label: renderMenuCard('Blog', 'Latest updates and articles.'),
        class: 'menu-card-item',
        style: cardItemStyle.value,
      },
      {
        key: 'community',
        label: renderMenuCard('Community', 'Join our developer community.'),
        class: 'menu-card-item',
        style: cardItemStyle.value,
      },
    ],
  },
])

const popupRender: MenuProps['popupRender'] = (node, info) => {
  const title = info.item.title || info.item.key
  return h('div', { class: 'menu-popup', style: popupStyle.value }, [
    h('div', { class: 'menu-popup-title', style: headerStyle.value }, title),
    node,
  ])
}

const themeConfig = {
  components: {
    Menu: {
      popupBg: '#fff',
      horizontalItemSelectedColor: '#1677ff',
      horizontalItemHoverColor: '#1677ff',
    },
  },
}
</script>

<template>
  <a-config-provider :theme="themeConfig">
    <a-menu mode="horizontal" :items="menuItems" :popup-render="popupRender" />
  </a-config-provider>
</template>

<style scoped>
.menu-popup :deep(.ant-menu) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 16px;
  row-gap: 8px;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.menu-popup :deep(.ant-menu-item) {
  height: auto;
  line-height: 1.4;
}

.menu-popup :deep(.menu-card-item) {
  padding: 0;
}

.menu-popup :deep(.menu-card-item:hover) {
  background: rgba(0, 0, 0, 0.02);
}

.menu-popup :deep(.ant-menu-title-content) {
  display: block;
}

.menu-card-title {
  font-weight: 600;
  line-height: 1.4;
}

.menu-card-desc {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}
</style>
