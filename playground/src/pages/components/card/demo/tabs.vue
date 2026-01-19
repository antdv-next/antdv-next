<docs lang="zh-CN">
可承载更多内容。
</docs>

<docs lang="en-US">
More content can be hosted.
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue'

const tabList = [
  {
    key: 'tab1',
    tab: 'tab1',
  },
  {
    key: 'tab2',
    tab: 'tab2',
  },
]

const contentList: Record<string, string> = {
  tab1: 'content1',
  tab2: 'content2',
}

const tabListNoTitle = [
  {
    key: 'article',
    label: 'article',
  },
  {
    key: 'app',
    label: 'app',
  },
  {
    key: 'project',
    label: 'project',
  },
]

const contentListNoTitle: Record<string, string> = {
  article: 'article content',
  app: 'app content',
  project: 'project content',
}

const activeTabKey1 = ref('tab1')
const activeTabKey2 = ref('app')

function onTab1Change(key: string) {
  activeTabKey1.value = key
}

function onTab2Change(key: string) {
  activeTabKey2.value = key
}

const content1 = computed(() => contentList[activeTabKey1.value])
const content2 = computed(() => contentListNoTitle[activeTabKey2.value])
</script>

<template>
  <div>
    <a-card
      style="width: 100%"
      title="Card title"
      :tab-list="tabList"
      :active-tab-key="activeTabKey1"
      @tab-change="onTab1Change"
    >
      <template #extra>
        <a href="#">More</a>
      </template>
      <p>{{ content1 }}</p>
    </a-card>
    <br>
    <br>
    <a-card
      style="width: 100%"
      :tab-list="tabListNoTitle"
      :active-tab-key="activeTabKey2"
      :tab-props="{
        size: 'middle',
      }"
      @tab-change="onTab2Change"
    >
      <template #tabBarExtraContent>
        <a href="#">More</a>
      </template>
      <p>{{ content2 }}</p>
    </a-card>
  </div>
</template>
