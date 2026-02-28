<docs lang="zh-CN">
[查询模式: 确定类目](https://ant.design/docs/spec/reaction#lookup-patterns) 示例。
</docs>

<docs lang="en-US">
Demonstration of [Lookup Patterns: Certain Category](https://ant.design/docs/spec/reaction#lookup-patterns). Basic Usage, set options of autocomplete with `options` property.
</docs>

<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'
import { h } from 'vue'

function renderTitle(title: string) {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
    },
    [
      title,
      h(
        'a',
        {
          href: 'https://www.google.com/search?q=antd',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        'more',
      ),
    ],
  )
}

function renderItem(title: string, count: number) {
  return {
    value: title,
    label: h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      },
      [
        title,
        h(
          'span',
          {
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            },
          },
          [h(UserOutlined), String(count)],
        ),
      ],
    ),
  }
}

const options = [
  {
    label: renderTitle('Libraries'),
    options: [renderItem('AntDesign', 10000), renderItem('AntDesign UI', 10600)],
  },
  {
    label: renderTitle('Solutions'),
    options: [renderItem('AntDesign UI FAQ', 60100), renderItem('AntDesign FAQ', 30010)],
  },
  {
    label: renderTitle('Articles'),
    options: [renderItem('AntDesign design language', 100000)],
  },
]
</script>

<template>
  <a-auto-complete
    :classes="{ popup: { root: 'certain-category-search-dropdown' } }"
    :popup-match-select-width="500"
    style="width: 250px"
    placeholder="input here"
    :options="options"
  >
    <a-input-search size="large" placeholder="input here" />
  </a-auto-complete>
</template>

<style>
.certain-category-search-dropdown .ant-select-item-group {
  color: #666;
  font-weight: bold;
}

.certain-category-search-dropdown .ant-select-item-group:not(:last-child) {
  border-bottom: 1px solid #f6f6f6;
}

.certain-category-search-dropdown .ant-select-item-option-grouped {
  padding-inline-start: 16px;
}

.certain-category-search-dropdown .ant-select-item-option.show-all {
  text-align: center;
  cursor: default;
}

.certain-category-search-dropdown .rc-virtual-list-holder {
  max-height: 300px;
}
</style>
