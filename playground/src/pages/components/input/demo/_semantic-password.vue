<script setup lang="ts">
import { EditOutlined, UserOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'prefix', desc: t('prefix') },
  { name: 'input', desc: t('input') },
  { name: 'suffix', desc: t('suffix') },
  { name: 'count', desc: t('count') },
])
</script>

<template>
  <SemanticPreview
    component-name="InputPassword"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div style="width: 100%">
        <a-input-password
          default-value="Hello, Antdv-Next"
          show-count
          :classes="classes"
        >
          <template #prefix>
            <UserOutlined />
          </template>
          <template #suffix>
            <EditOutlined />
          </template>
        </a-input-password>
      </div>
    </template>
  </SemanticPreview>
</template>
