<docs lang="zh-CN">
内联类型的步骤条，适用于列表内容场景中展示对象所在流程、当前状态的情况。
</docs>

<docs lang="en-US">
Inline type steps, suitable for displaying the process and current state of the object in the list content scene.
</docs>

<script setup lang="ts">
const items = [
  {
    title: 'Step 1',
    content: 'This is Step 1',
  },
  {
    title: 'Step 2',
    content: 'This is Step 2',
  },
  {
    title: 'Step 3',
    content: 'This is Step 3',
  },
]
const data = [
  {
    title: 'Antdv Next Title 1',
    current: 0,
  },
  {
    title: 'Antdv Next Title 2',
    current: 1,
    status: 'error',
  },
  {
    title: 'Antdv Next Title 3',
    current: 2,
  },
  {
    title: 'Antdv Next Title 4',
    current: 1,
  },
]
</script>

<template>
  <a-flex vertical>
    <div
      v-for="(item, index) in data"
      :key="index"
      class="flex items-start py-4 border-b border-[var(--ant-color-split)]"
    >
      <div class="flex flex-1 items-start">
        <div class="mr-4">
          <a-avatar :src="`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`" />
        </div>
        <div class="min-w-0">
          <div class="mb-1">
            <a href="https://antdv-next.com">{{ item.title }}</a>
          </div>
          <div class="text-[var(--ant-color-text-secondary)]">
            Antdv Next, a design language for background applications, is refined by Ant UED Team
          </div>
        </div>
      </div>
      <div class="ml-6">
        <a-steps
          type="inline"
          :current="item.current"
          :status="item.status as 'error'"
          :items="items"
        />
      </div>
    </div>
  </a-flex>
</template>
