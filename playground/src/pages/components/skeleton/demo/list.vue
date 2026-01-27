<docs lang="zh-CN">
在列表组件中使用加载占位符。
</docs>

<docs lang="en-US">
Use skeleton in list component.
</docs>

<script setup lang="ts">
import { LikeOutlined, MessageOutlined, StarOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

interface ListItem {
  href: string
  title: string
  avatar: string
  description: string
  content: string
}

const listData: ListItem[] = Array.from({ length: 3 }).map((_, i) => ({
  href: 'https://ant.design',
  title: `antdv-next part ${i + 1}`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  description:
      'Antdv Next, a design language for background applications, is refined by Ant UED Team.',
  content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
}))

const loading = ref(false)
</script>

<template>
  <div>
    <a-switch
      v-model:value="loading"
      style="margin-bottom: 16px"
    />
    <a-list
      item-layout="vertical"
      size="large"
      :data-source="listData"
    >
      <template #renderItem="{ item }">
        <a-list-item :key="item.title">
          <template v-if="!loading" #actions>
            <span class="icon-text">
              <StarOutlined style="margin-inline-end: 8px" />
              156
            </span>
            <span class="icon-text">
              <LikeOutlined style="margin-inline-end: 8px" />
              156
            </span>
            <span class="icon-text">
              <MessageOutlined style="margin-inline-end: 8px" />
              2
            </span>
          </template>
          <template
            v-if="!loading"
            #extra
          >
            <img
              draggable="false"
              width="272"
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            >
          </template>
          <a-skeleton
            :loading="loading"
            active
            avatar
          >
            <a-list-item-meta>
              <template #avatar>
                <a-avatar :src="item.avatar" />
              </template>
              <template #title>
                <a :href="item.href">
                  {{ item.title }}
                </a>
              </template>
              <template #description>
                {{ item.description }}
              </template>
            </a-list-item-meta>
            {{ item.content }}
          </a-skeleton>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
.icon-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
