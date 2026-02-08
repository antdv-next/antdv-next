<script setup lang="ts">
import { notification } from 'antdv-next'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { _InternalPanelDoNotUseOrYouWillBeFired: InternalPanel } = notification

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'icon', desc: t('icon'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'description', desc: t('description'), version: '1.0.0' },
  { name: 'actions', desc: t('actions'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Notification"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <InternalPanel
        title="Hello World!"
        description="Hello World?"
        type="success"
        :classes="classes"
      >
        <template #actions>
          <a-button type="primary" size="small">
            My Button
          </a-button>
        </template>
      </InternalPanel>
    </template>
  </SemanticPreview>
</template>
