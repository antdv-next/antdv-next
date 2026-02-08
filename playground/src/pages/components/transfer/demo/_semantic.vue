<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'section', desc: t('section') },
  { name: 'header', desc: t('header') },
  { name: 'title', desc: t('title') },
  { name: 'body', desc: t('body') },
  { name: 'list', desc: t('list') },
  { name: 'item', desc: t('item') },
  { name: 'itemIcon', desc: t('itemIcon') },
  { name: 'itemContent', desc: t('itemContent') },
  { name: 'footer', desc: t('footer') },
  { name: 'actions', desc: t('actions') },
])

const mockData = Array.from({ length: 20 }).map((_, i) => ({
  key: i,
  title: `content ${i + 1}`,
}))
</script>

<template>
  <SemanticPreview
    component-name="Transfer"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-transfer
        show-search
        :titles="['Source', 'Target']"
        :data-source="mockData"
        :selected-keys="[]"
        :target-keys="[3, 9]"
        :render="(item: any) => item.title"
        :styles="{
          section: { height: '250px', width: '200px' },
        }"
        :classes="classes"
      >
        <template #footer>
          <div :style="{ padding: '8px' }">
            Custom Footer
          </div>
        </template>
      </a-transfer>
    </template>
  </SemanticPreview>
</template>
