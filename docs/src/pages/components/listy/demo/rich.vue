<docs lang="zh-CN">
`itemRender` 可以渲染任意复杂的内容。行高不必相同，虚拟滚动会实测每一行的实际高度。
</docs>

<docs lang="en-US">
`itemRender` can render arbitrarily rich content. Rows do not need the same height — virtual scrolling measures the actual height of each row.
</docs>

<script setup lang="ts">
interface Notification {
  id: number
  user: string
  message: string
  time: string
}

const users = ['Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Lucas']

const messages = [
  'commented on your merge request',
  'invited you to the quarterly planning review. Please confirm your availability before Friday so the agenda can be finalized in time.',
  'mentioned you in the design review thread',
  'assigned you a task that is due next Monday. It covers the remaining accessibility issues found in the latest audit.',
  'starred the report you shared yesterday',
  'requested changes on your pull request. Most of the comments are about naming and the test coverage of the new cache layer.',
]

const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']

const colorOf = (user: string) => colors[users.indexOf(user) % colors.length]

const pad = (value: number) => String(value).padStart(2, '0')

const notifications: Notification[] = Array.from({ length: 5000 }, (_, index) => ({
  id: index,
  user: users[index % users.length],
  message: messages[index % messages.length],
  time: `${pad((8 + index) % 24)}:${pad((index * 17) % 60)}`,
}))
</script>

<template>
  <a-listy
    :items="notifications"
    :row-key="id"
    :height="400"
  >
    <template #itemRender="item">
      <a-flex gap="middle" align="flex-start">
        <a-avatar :style="{ backgroundColor: colorOf(item.user), flex: 'none' }">
          {item.user[0]}
        </a-avatar>
        <a-flex vertical flex="auto" style="min-width: 0px">
          <a-flex justify="space-between" gap="small">
            <a-typography-text strong>
              {{ item.user }}
            </a-typography-text>
            <a-typography-text type="secondary">
              {{ item.time }}
            </a-typography-text>
          </a-flex>
          <a-typography-text type="secondary">
            {{ item.message }}
          </a-typography-text>
        </a-flex>
      </a-flex>
    </template>
  </a-listy>
</template>
