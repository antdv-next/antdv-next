<script setup lang="ts">
import type { TabsProps } from 'antdv-next'

const items: TabsProps['items'] = Array.from({ length: 3 }).map((_, i) => {
  const id = String(i + 1)
  return {
    key: id,
    label: `Tab Title ${id}`,
  }
})
</script>

<template>
  <div class="card-top-tabs">
    <a-tabs type="card" :items="items">
      <template #contentRender="{ item }">
        <p>Content of Tab Pane {{ item.key }}</p>
        <p>Content of Tab Pane {{ item.key }}</p>
        <p>Content of Tab Pane {{ item.key }}</p>
      </template>
    </a-tabs>
  </div>
</template>

<style scoped>
.card-top-tabs :deep(.ant-tabs.ant-tabs-card) {
  .ant-tabs-body {
    padding: 16px;
    background: var(--ant-color-bg-container);
  }

  .ant-tabs-nav {
    margin: 0;

    .ant-tabs-nav-wrap > .ant-tabs-nav-list > .ant-tabs-tab {
      background: transparent;
      border-color: transparent;

      &.ant-tabs-tab-active {
        border-color: var(--ant-color-border-bg);
        background: var(--ant-color-bg-container);
      }
    }

    &::before {
      display: none;
    }
  }
}
</style>
