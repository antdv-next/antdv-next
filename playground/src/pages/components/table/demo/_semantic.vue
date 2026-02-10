<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'title', desc: t('title') },
  { name: 'content', desc: t('content') },
  { name: 'header.wrapper', desc: t('header.wrapper') },
  { name: 'header.row', desc: t('header.row') },
  { name: 'header.cell', desc: t('header.cell') },
  { name: 'section', desc: t('section') },
  { name: 'body.wrapper', desc: t('body.wrapper') },
  { name: 'body.row', desc: t('body.row') },
  { name: 'body.cell', desc: t('body.cell') },
  { name: 'footer', desc: t('footer') },
  { name: 'pagination.root', desc: t('pagination.root') },
  { name: 'pagination.item', desc: t('pagination.item') },
])

const columns = [
  {
    title: 'Personal Info',
    children: [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age' },
    ],
  },
  { title: 'Address', dataIndex: 'address' },
]

const data = [
  { key: '1', name: 'thinkasany', age: 24, address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
  { key: '4', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
  { key: '5', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
  { key: '6', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
]
</script>

<template>
  <SemanticPreview
    component-name="Table"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-table
        bordered
        :style="{ width: '100%' }"
        :columns="columns"
        :data-source="data"
        size="middle"
        :pagination="{ pageSize: 3 }"
        :classes="classes"
      >
        <template #title>
          table title
        </template>
        <template #footer>
          table footer
        </template>
      </a-table>
    </template>
  </SemanticPreview>
</template>
