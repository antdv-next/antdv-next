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
  { name: 'button.root', desc: t('button.root') },
  { name: 'button.icon', desc: t('button.icon') },
  { name: 'button.content', desc: t('button.content') },
])
</script>

<template>
  <SemanticPreview
    component-name="InputSearch"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div style="width: 100%">
        <a-input-search
          default-value="Hello, Antdv-Next"
          enter-button="Searching..."
          loading
          show-count
          :classes="classes"
        >
          <template #prefix>
            <UserOutlined />
          </template>
          <template #suffix>
            <EditOutlined />
          </template>
        </a-input-search>
      </div>
    </template>
  </SemanticPreview>
</template>
