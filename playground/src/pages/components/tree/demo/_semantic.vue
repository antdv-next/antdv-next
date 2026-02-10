<script setup lang="ts">
import { DownOutlined, FrownFilled, FrownOutlined, MehOutlined, SmileOutlined } from '@antdv-next/icons'
import { computed, h } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'item', desc: t('item'), version: '1.0.0' },
  { name: 'itemIcon', desc: t('itemIcon'), version: '1.0.0' },
  { name: 'itemTitle', desc: t('itemTitle'), version: '1.0.0' },
])

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    icon: h(SmileOutlined),
    children: [
      { title: 'leaf', key: '0-0-0', icon: h(MehOutlined) },
      { title: 'leaf', key: '0-0-1', icon: ({ selected }: { selected: boolean }) => selected ? h(FrownFilled) : h(FrownOutlined) },
    ],
  },
]
</script>

<template>
  <SemanticPreview
    component-name="Tree"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-tree
        show-icon
        default-expand-all
        :default-selected-keys="['0-0-0']"
        :tree-data="treeData"
        :classes="classes"
      >
        <template #switcherIcon>
          <DownOutlined />
        </template>
      </a-tree>
    </template>
  </SemanticPreview>
</template>
