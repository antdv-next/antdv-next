<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'label', desc: t('label'), version: '1.0.0' },
  { name: 'content', desc: t('content'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Form"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-form
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        :style="{ maxWidth: '600px' }"
        :initial-values="{ remember: true }"
        autocomplete="off"
        :classes="classes"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input />
        </a-form-item>
        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password />
        </a-form-item>
      </a-form>
    </template>
  </SemanticPreview>
</template>
