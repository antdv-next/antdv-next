<docs lang="zh-CN">
  通过 `classes` 和 `styles` 自定义 Listy 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
  Customize the [semantic DOM](#semantic-dom) styles of Listy with `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { ListyProps } from 'antdv-next'

interface User {
  id: number
  name: string
  team: string
}

const users: User[] = [
  { id: 0, name: 'Olivia', team: 'Design' },
  { id: 1, name: 'Liam', team: 'Design' },
  { id: 2, name: 'Emma', team: 'Design' },
  { id: 3, name: 'Noah', team: 'Engineering' },
  { id: 4, name: 'Ava', team: 'Engineering' },
  { id: 5, name: 'Ethan', team: 'Engineering' },
  { id: 6, name: 'Sophia', team: 'Marketing' },
  { id: 7, name: 'Lucas', team: 'Marketing' },
]

const classNames: ListyProps['classes'] = {
  root: 'listy-custom-root',
  groupHeader: 'listy-custom-group-header',
}

const styles: ListyProps['styles'] = {
  item: { fontStyle: 'italic' },
}
</script>

<template>
  <a-listy
    :items="users"
    :row-key="(item: User) => item.id"
    :height="260"
    sticky
    :group="{ key: (user: User) => user.team, title: (team: unknown) => team }"
    :item-render="(user: User) => user.name"
    :classes="classNames"
    :styles="styles"
  />
</template>

<style scoped>
.listy-custom-root {
  border: 1px solid #91caff;
  border-radius: 8px;
  overflow: hidden;
}
:deep(.listy-custom-group-header) {
  color: #1677ff;
  background: #e6f4ff;
}
</style>
