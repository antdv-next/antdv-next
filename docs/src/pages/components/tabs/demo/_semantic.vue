<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'header', desc: t('header') },
  { name: 'item', desc: t('item') },
  { name: 'remove', desc: t('remove') },
  { name: 'indicator', desc: t('indicator') },
  { name: 'body', desc: t('body') },
  { name: 'content', desc: t('content') },
  { name: 'popup.root', desc: t('popup.root') },
])

const items = computed(() =>
  Array.from({ length: 30 }, (_, i) => {
    const id = String(i)
    return {
      label: `Tab-${id}`,
      key: id,
      disabled: i === 28,
      content: `Content of tab ${id}`,
    }
  }),
)

function getPopupContainer(triggerNode: HTMLElement): HTMLElement {
  return triggerNode.closest<HTMLElement>('.semantic-preview-container') ?? document.body
}
</script>

<template>
  <SemanticPreview
    component-name="Tabs"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-tabs
        default-active-key="1"
        type="editable-card"
        :style="{ height: '220px', width: '100%' }"
        :get-popup-container="getPopupContainer"
        :styles="{
          popup: {
            root: { background: '#fff' },
          },
          indicator: {
            visibility: 'visible',
          },
        }"
        :items="items"
        :classes="classes"
        :more="{
          visible: true,
          placement: 'bottom',
        }"
      />
    </template>
  </SemanticPreview>
</template>
