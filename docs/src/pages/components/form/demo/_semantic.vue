<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { computed, onMounted, shallowRef } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const formRef = shallowRef<FormInstance>()

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'label', desc: t('label'), version: '1.0.0' },
  { name: 'content', desc: t('content'), version: '1.0.0' },
  { name: 'help', desc: t('help'), version: '1.3.0' },
  { name: 'helpItem', desc: t('helpItem'), version: '1.3.0' },
  { name: 'extra', desc: t('extra'), version: '1.3.0' },
])

onMounted(() => {
  formRef.value?.setFields?.([
    {
      name: 'password',
      errors: ['Please input your password!', 'Use at least 8 characters.'],
    },
  ])
})
</script>

<template>
  <SemanticPreview
    component-name="Form"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-form
        ref="formRef"
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
          help="Use 4 to 16 characters."
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input />
        </a-form-item>
        <a-form-item
          label="Password"
          name="password"
          extra="Password must contain letters and numbers."
          :rules="[
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Use at least 8 characters.' },
          ]"
        >
          <a-input-password />
        </a-form-item>
      </a-form>
    </template>
  </SemanticPreview>
</template>
