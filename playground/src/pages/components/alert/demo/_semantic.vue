<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'icon', desc: t('icon'), version: '1.0.0' },
  { name: 'section', desc: t('section'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'description', desc: t('description'), version: '1.0.0' },
  { name: 'actions', desc: t('actions'), version: '1.0.0' },
  { name: 'close', desc: t('close'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Alert"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-alert
        closable
        title="Info Text"
        show-icon
        description="Info Description Info Description Info Description Info Description"
        type="info"
        :classes="classes"
      >
        <template #action>
          <a-space direction="vertical">
            <a-button size="small" type="primary">
              Accept
            </a-button>
            <a-button size="small" danger ghost>
              Decline
            </a-button>
          </a-space>
        </template>
      </a-alert>
    </template>
  </SemanticPreview>
</template>
