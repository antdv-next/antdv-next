<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Dropdown 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of the Dropdown by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { DropdownProps, MenuItemType } from 'antdv-next'
import { DownOutlined, LogoutOutlined, SettingOutlined } from '@antdv-next/icons'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const items: MenuItemType[] = [
  {
    key: '1',
    label: 'Profile',
  },
  {
    key: '2',
    label: 'Settings',
    icon: SettingOutlined,
  },
  {
    type: 'divider',
  },
  {
    key: '3',
    label: 'Logout',
    icon: LogoutOutlined,
    danger: true,
  },
]

const classes: DropdownProps['classes'] = {
  root: 'demo-dropdown-root',
}

const objectStyles: DropdownProps['styles'] = {
  root: {
    backgroundColor: '#ffffff',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
  },
  item: {
    padding: '8px 12px',
    fontSize: '14px',
  },
  itemTitle: {
    fontWeight: '500',
  },
  itemIcon: {
    color: '#1890ff',
    marginRight: '8px',
  },
  itemContent: {
    backgroundColor: 'transparent',
  },
}

const functionStyles: DropdownProps['styles'] = (info) => {
  const isClick = info.props.trigger?.includes('click')
  if (isClick) {
    return {
      root: {
        borderColor: '#1890ff',
        borderRadius: '8px',
      },
    }
  }
  return {}
}

const sharedProps: DropdownProps = {
  menu: { items },
  placement: 'bottomLeft',
  classes,
}
</script>

<template>
  <a-flex gap="medium" wrap="wrap">
    <a-space direction="vertical" size="large">
      <a-dropdown v-bind="sharedProps" :styles="objectStyles">
        <a-button>
          <a-space>
            Object Style
            <DownOutlined />
          </a-space>
        </a-button>
      </a-dropdown>

      <a-dropdown v-bind="sharedProps" :styles="functionStyles" :trigger="['click']">
        <a-button type="primary">
          <a-space>
            Function Style
            <DownOutlined />
          </a-space>
        </a-button>
      </a-dropdown>
    </a-space>
  </a-flex>
</template>

<style>
.demo-dropdown-root {
  background-color: v-bind('token.colorFillAlter');
  border: 1px solid v-bind('token.colorBorder');
  border-radius: v-bind('`${token.borderRadius}px`');
}
</style>
