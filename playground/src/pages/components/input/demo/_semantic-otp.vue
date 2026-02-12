<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'input', desc: t('input') },
  { name: 'separator', desc: t('OTPSeparator') },
])
</script>

<template>
  <SemanticPreview
    component-name="InputOTP"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-input-otp
        :length="6"
        separator="-"
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
