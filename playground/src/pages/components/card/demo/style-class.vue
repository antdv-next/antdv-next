<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Card 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Card by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { CardProps } from 'antdv-next'
import { EditOutlined, HeartOutlined, ShareAltOutlined } from '@antdv-next/icons'
import { theme } from 'antdv-next'
import { computed } from 'vue'

const { token } = theme.useToken()

const classes = computed(() => ({
  root: 'custom-card-root',
  header: 'custom-card-header',
  body: 'custom-card-body',
}))

const stylesCard = computed(() => ({
  root: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderRadius: '8px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 500,
  },
}))

const stylesCardFn = computed(() => {
  return (info: { props: CardProps }) => {
    if (info.props.variant === 'outlined') {
      return {
        root: {
          borderColor: '#696FC7',
          boxShadow: '0 2px 8px #A7AAE1',
          borderRadius: '8px',
        },
        extra: {
          color: '#696FC7',
        },
        title: {
          fontSize: '16px',
          fontWeight: 500,
          color: '#A7AAE1',
        },
      }
    }
    return {}
  }
})

const stylesCardMeta = {
  title: {
    color: '#A7AAE1',
  },
  description: {
    color: '#A7AAE1',
  },
}
</script>

<template>
  <a-flex gap="middle">
    <a-card
      title="Object Card"
      :classes="classes"
      :styles="stylesCard"
      variant="borderless"
    >
      <template #extra>
        <a-button type="link">
          More
        </a-button>
      </template>
      <template #actions>
        <HeartOutlined key="heart" style="color: #ff6b6b" />
        <ShareAltOutlined key="share" style="color: #4ecdc4" />
        <EditOutlined key="edit" style="color: #45b7d1" />
      </template>
      <a-card-meta title="Object Card Meta title" description="This is the description">
        <template #avatar>
          <a-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        </template>
      </a-card-meta>
    </a-card>
    <a-card
      title="Function Card"
      :classes="classes"
      :styles="stylesCardFn"
    >
      <template #extra>
        <a-button type="link" :styles="{ root: { color: '#A7AAE1' } }">
          More
        </a-button>
      </template>
      <template #actions>
        <HeartOutlined key="heart" style="color: #ff6b6b" />
        <ShareAltOutlined key="share" style="color: #4ecdc4" />
        <EditOutlined key="edit" style="color: #45b7d1" />
      </template>
      <a-card-meta
        title="Function Card Meta title"
        description="This is the description"
        :styles="stylesCardMeta"
      >
        <template #avatar>
          <a-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        </template>
      </a-card-meta>
    </a-card>
  </a-flex>
</template>

<style scoped>
.custom-card-root {
  width: 300px;
  background-color: v-bind('token.colorBgContainer');
  border-radius: v-bind('`${token.borderRadiusLG}px`');
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid v-bind('token.colorBorderSecondary');
}

.custom-card-header {
  border-bottom: none;
  padding-bottom: 8px;
}

.custom-card-body {
  padding-top: 0;
}
</style>
