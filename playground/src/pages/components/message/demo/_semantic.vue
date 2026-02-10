<script setup lang="ts">
import { message } from 'antdv-next'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { _InternalPanelDoNotUseOrYouWillBeFired: InternalPanel } = message

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'icon', desc: t('icon'), version: '1.0.0' },
  { name: 'content', desc: t('content'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Message"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <InternalPanel
        type="success"
        content="Hello, Ant Design!"
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
