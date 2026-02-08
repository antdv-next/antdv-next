<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'cover', desc: t('cover') },
])
</script>

<template>
  <SemanticPreview
    component-name="QRCode"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-qrcode value="https://ant.design" status="loading" :classes="classes" />
    </template>
  </SemanticPreview>
</template>
