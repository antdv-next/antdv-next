<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'icon', desc: t('icon'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'subTitle', desc: t('subTitle'), version: '1.0.0' },
  { name: 'extra', desc: t('extra'), version: '1.0.0' },
  { name: 'body', desc: t('body'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Result"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-result
        title="title"
        sub-title="subTitle"
        :classes="classes"
      >
        <template #extra>
          <a-button type="primary">
            extra
          </a-button>
        </template>
        <div :style="{ textAlign: 'center' }">
          The Content of Result
        </div>
      </a-result>
    </template>
  </SemanticPreview>
</template>
