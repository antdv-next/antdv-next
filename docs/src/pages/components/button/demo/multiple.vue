<docs lang="zh-CN">
按钮组合使用时，推荐使用 1 个主操作 + n 个次操作，3 个以上操作时把更多操作放到 [Dropdown](/components/dropdown#dropdown-demo-dropdown-button) 中组合使用。
</docs>

<docs lang="en-US">
If you need several buttons, we recommend that you use 1 primary button + n secondary buttons. If there are more than three operations, you can group some of them into a [Dropdown](/components/dropdown#dropdown-demo-dropdown-button).
</docs>

<script setup lang="ts">
import type { MenuEmits } from 'antdv-next'
import { EllipsisOutlined } from '@antdv-next/icons'

const onMenuClick: MenuEmits['click'] = (e) => {
  console.log('click', e)
}

const items = [
  {
    key: '1',
    label: '1st item',
  },
  {
    key: '2',
    label: '2nd item',
  },
  {
    key: '3',
    label: '3rd item',
  },
]
</script>

<template>
  <a-flex align="flex-start" gap="small" vertical>
    <a-button type="primary">
      primary
    </a-button>
    <a-button>secondary</a-button>
    <a-space-compact>
      <a-button>Actions</a-button>
      <a-dropdown :menu="{ items, onClick: onMenuClick }" placement="bottomRight">
        <a-button>
          <template #icon>
            <EllipsisOutlined />
          </template>
        </a-button>
      </a-dropdown>
    </a-space-compact>
  </a-flex>
</template>
