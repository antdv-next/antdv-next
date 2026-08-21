<docs lang="zh-CN">
通过 `more.popupRender` 自定义 Tabs 折叠菜单，这里加上了搜索能力。
</docs>

<docs lang="en-US">
Customize the Tabs more dropdown menu via `more.popupRender`, here with a search box.
</docs>

<script setup lang="ts">
import type { TabsProps } from 'antdv-next'
import { SearchOutlined } from '@antdv-next/icons'
import { Input, Menu, theme } from 'antdv-next'
import { computed, h, ref } from 'vue'

interface RestTab {
  key: string
  label?: any
  disabled?: boolean
}

const items: TabsProps['items'] = Array.from({ length: 30 }, (_, i) => {
  const id = String(i)
  return {
    key: id,
    label: `Tab-${id}`,
    disabled: i === 28,
    children: `Content of tab ${id}`,
  }
})

const { token } = theme.useToken()

const activeKey = ref('0')
const searchTerm = ref('')

function renderPopup(restTabs: RestTab[], onClose: () => void) {
  const keyword = searchTerm.value.toLowerCase()
  const filterTabs = keyword
    ? restTabs.filter(tab => String(tab.label).toLowerCase().includes(keyword))
    : restTabs

  return h(
    'div',
    {
      style: {
        width: '200px',
        background: token.value.colorBgContainer,
        boxShadow: token.value.boxShadow,
        borderRadius: `${token.value.borderRadiusLG}px`,
        overflow: 'hidden',
      },
    },
    [
      h(
        'div',
        {
          style: {
            padding: `${token.value.paddingXS}px ${token.value.paddingSM}px`,
            borderBottom: `${token.value.lineWidth}px ${token.value.lineType} ${token.value.colorBorder}`,
          },
        },
        [
          h(Input, {
            'placeholder': 'Search tabs...',
            'prefix': h(SearchOutlined),
            'value': searchTerm.value,
            'allowClear': true,
            'onUpdate:value': (value: any) => {
              searchTerm.value = value ?? ''
            },
          }),
        ],
      ),
      filterTabs.length
        ? h('div', { style: { maxHeight: '300px', overflowY: 'auto' } }, [
            h(Menu, {
              selectedKeys: [activeKey.value],
              items: filterTabs.map(tab => ({
                key: tab.key,
                label: tab.label,
                disabled: tab.disabled,
              })),
              onClick: ({ key }) => {
                searchTerm.value = ''
                activeKey.value = key as string
                onClose()
              },
            }),
          ])
        : h(
            'div',
            {
              style: {
                padding: `${token.value.paddingSM}px`,
                color: token.value.colorTextDisabled,
                textAlign: 'center',
              },
            },
            'No matching tabs',
          ),
    ],
  )
}

const more = computed<TabsProps['more']>(() => ({
  trigger: 'click',
  placement: 'bottomLeft',
  popupRender: (_, { restTabs, onClose }) => renderPopup(restTabs as RestTab[], onClose),
}))
</script>

<template>
  <a-tabs v-model:active-key="activeKey" :items="items" :more="more" />
</template>
