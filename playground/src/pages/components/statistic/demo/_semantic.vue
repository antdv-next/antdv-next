<script setup lang="ts">
import { ArrowUpOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'header', desc: t('header'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'prefix', desc: t('prefix'), version: '1.0.0' },
  { name: 'content', desc: t('content'), version: '1.0.0' },
  { name: 'suffix', desc: t('suffix'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Statistic"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div :style="{ position: 'absolute' }">
        <a-statistic
          title="Active"
          :value="11.28"
          :precision="2"
          :styles="{ content: { color: '#3f8600' } }"
          suffix="%"
          :classes="classes"
        >
          <template #prefix>
            <ArrowUpOutlined />
          </template>
        </a-statistic>
      </div>
    </template>
  </SemanticPreview>
</template>
