<docs lang="zh-CN">
设置 `scrollWidth` 后，内容宽度超出容器时可以横向滚动，仅在开启 `virtual` 时生效。
</docs>

<docs lang="en-US">
Set `scrollWidth` to scroll horizontally when the content is wider than the container. Only works when `virtual` is enabled.
</docs>

<script setup lang="ts">
interface Item {
  id: number
  name: string
  email: string
  address: string
  status: string
}

const items = Array.from<any, Item>({ length: 1000 }, (_, index) => ({
  id: index,
  name: `User ${index}`,
  email: `user.${index}@ant.design`,
  address: `No. ${index} Zhongshan Road, Xihu District, Hangzhou, Zhejiang`,
  status: index % 2 ? 'Active' : 'Inactive',
}))
</script>

<template>
  <a-listy
    virtual
    :items="items"
    :height="400"
    :scroll-width="1000"
    row-key="id"
    sticky
    :group="{
      key: (item: Item) => Math.floor(item.id / 50),
      title: (groupKey: number) => `User ${groupKey * 50} - ${groupKey * 50 + 49}`,
    }"
  >
    <template #itemRender="item">
      <a-flex gap="middle" align="center">
        <span :style="{ flex: '0 0 100px' }">{{ item.name }}</span>
        <span :style="{ flex: '0 0 220px' }">{{ item.email }}</span>
        <span :style="{ flex: '0 0 480px' }">{{ item.address }}</span>
        <a-tag :color="item.status === 'Active' ? 'green' : 'default'">
          {{ item.status }}
        </a-tag>
      </a-flex>
    </template>
  </a-listy>
</template>
