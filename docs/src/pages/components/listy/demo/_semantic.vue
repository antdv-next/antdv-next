<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

interface User {
  id: number
  name: string
  team: string
}

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'item', desc: t('item') },
  { name: 'groupHeader', desc: t('groupHeader') },
])

const users: User[] = [
  { id: 0, name: 'Olivia', team: 'Design' },
  { id: 1, name: 'Liam', team: 'Design' },
  { id: 2, name: 'Emma', team: 'Design' },
  { id: 3, name: 'Noah', team: 'Engineering' },
  { id: 4, name: 'Ava', team: 'Engineering' },
  { id: 5, name: 'Ethan', team: 'Engineering' },
]
</script>

<template>
  <SemanticPreview
    component-name="Listy"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-listy
        :items="users"
        :row-key="(item: User) => item.id"
        :height="260"
        sticky
        :group="{ key: (user: User) => user.team, title: (team: unknown) => team }"
        :item-render="(user: User) => user.name"
        :classes="classes"
        style="width: 100%"
      />
    </template>
  </SemanticPreview>
</template>
