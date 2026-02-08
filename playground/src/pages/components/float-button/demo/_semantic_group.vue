<script setup lang="ts">
import { AlertOutlined, BugOutlined, BulbOutlined } from '@antdv-next/icons'
import { FloatButton } from 'antdv-next'
import { computed, h } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const PurePanel = (FloatButton as any)._InternalPanelDoNotUseOrYouWillBeFired

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('group.root') },
  { name: 'list', desc: t('group.list') },
  { name: 'item', desc: t('group.item') },
  { name: 'itemIcon', desc: t('group.itemIcon') },
  { name: 'itemContent', desc: t('group.itemContent') },
  { name: 'trigger', desc: t('group.trigger') },
  { name: 'triggerIcon', desc: t('group.triggerIcon') },
  { name: 'triggerContent', desc: t('group.triggerContent') },
])

const items = [
  {
    icon: h(AlertOutlined),
    content: 'warn',
  },
  {
    icon: h(BugOutlined),
    content: 'bug',
  },
  {
    icon: h(BulbOutlined),
    content: 'idea',
  },
]
</script>

<template>
  <SemanticPreview
    component-name="FloatButton"
    :semantics="semantics"
    :style="{ paddingTop: '100px' }"
  >
    <template #default="{ classes }">
      <PurePanel
        type="primary"
        shape="square"
        :items="items"
        trigger="hover"
        :open="true"
        content="back"
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
