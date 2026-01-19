<docs lang="zh-CN">
数据读入前会有文本块样式。
</docs>

<docs lang="en-US">
Shows a loading indicator while the contents of the card is being fetched.
</docs>

<script setup lang="ts">
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <a-flex gap="middle" align="start" vertical>
    <a-switch :checked="!loading" @change="(checked: boolean) => loading = !checked" />
    <a-card :loading="loading" style="min-width: 300px">
      <template #actions>
        <EditOutlined key="edit" />
        <SettingOutlined key="setting" />
        <EllipsisOutlined key="ellipsis" />
      </template>
      <a-card-meta title="Card title">
        <template #avatar>
          <a-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        </template>
        <template #description>
          <p>This is the description</p>
          <p>This is the description</p>
        </template>
      </a-card-meta>
    </a-card>
    <a-card :loading="loading" style="min-width: 300px">
      <template #actions>
        <EditOutlined key="edit" />
        <SettingOutlined key="setting" />
        <EllipsisOutlined key="ellipsis" />
      </template>
      <a-card-meta title="Card title">
        <template #avatar>
          <a-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
        </template>
        <template #description>
          <p>This is the description</p>
          <p>This is the description</p>
        </template>
      </a-card-meta>
    </a-card>
  </a-flex>
</template>

<style scoped>
p {
  margin: 0;
  padding: 0;
}
</style>
