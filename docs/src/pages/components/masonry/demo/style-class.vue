<docs lang="zh-CN">
自定义语义化结构的样式和类名。支持对象和函数两种形式。
</docs>

<docs lang="en-US">
Customize semantic structure styles and class names. Supports both object and function forms.
</docs>

<script setup lang="ts">
import type { MasonryProps } from 'antdv-next'

interface MasonryItemType<T = any> {
  key: string
  data: T
}

const items = [120, 80, 100, 60, 140, 90, 110, 70].map<MasonryItemType<number>>(
  (height, index) => ({
    key: `item-${index}`,
    data: height,
  }),
)

const classes = {
  root: 'custom-masonry-root',
  item: 'custom-masonry-item',
}

const styles: MasonryProps['styles'] = {
  root: {
    borderRadius: '12px',
    padding: '20px',
    height: '260px',
    backgroundColor: 'rgba(250,250,250,0.5)',
  },
  item: {
    transform: 'scale(0.98)',
    transition: 'transform 0.2s ease',
    border: '1px solid #ccc',
  },
}

const stylesFn: MasonryProps['styles'] = (info) => {
  const { props } = info
  return {
    root: {
      border: `2px solid ${typeof props.columns === 'number' && props.columns > 2 ? '#1890ff' : '#52c41a'}`,
      padding: '20px',
      height: '280px',
      backgroundColor: 'rgba(240,248,255,.6)',
    },
    item: {
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #1890ff',
    },
  } satisfies MasonryProps['styles']
}
</script>

<template>
  <a-flex vertical :gap="24">
    <div>
      <a-typography-title :level="4">
        classes and styles Object
      </a-typography-title>
      <a-masonry
        :columns="4"
        :gutter="16"
        :items="items"
        :classes="classes"
        :styles="styles"
      >
        <template #itemRender="{ data, index }">
          <a-card size="small" :style="{ height: `${data}px` }">
            {{ index + 1 }}
          </a-card>
        </template>
      </a-masonry>
    </div>
    <a-divider />
    <div>
      <a-typography-title :level="4">
        classes and styles Function
      </a-typography-title>
      <a-masonry
        :columns="3"
        :gutter="12"
        :items="items.slice(0, 6)"
        :classes="classes"
        :styles="stylesFn"
      >
        <template #itemRender="{ data, index }">
          <a-card size="small" :style="{ height: `${data}px` }">
            {{ index + 1 }}
          </a-card>
        </template>
      </a-masonry>
    </div>
  </a-flex>
</template>

<style scoped>
:deep(.custom-masonry-root) {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 16px;
  height: 260px;
  background-color: #fafafa;
}

:deep(.custom-masonry-item) {
  transform: scale(0.98);
  transition: transform 0.2s ease;
  border-radius: 12px;
  border: 1px solid #ccc;
  overflow: hidden;
}
</style>
