<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('group.root'), version: '1.7.0' },
  { name: 'item', desc: t('group.item'), version: '1.7.0' },
  { name: 'itemIcon', desc: t('group.itemIcon'), version: '1.7.0' },
  { name: 'itemLabel', desc: t('group.itemLabel'), version: '1.7.0' },
])

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'pear', label: 'Pear' },
]
</script>

<template>
  <SemanticPreview
    component-name="Radio.Group"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-radio-group
        default-value="apple"
        :options="options"
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
