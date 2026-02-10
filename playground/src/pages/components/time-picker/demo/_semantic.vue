<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'prefix', desc: t('prefix') },
  { name: 'input', desc: t('input') },
  { name: 'suffix', desc: t('suffix') },
  { name: 'popup.root', desc: t('popup') },
  { name: 'popup.container', desc: t('popup.container') },
  { name: 'popup.content', desc: t('popup.content') },
  { name: 'popup.item', desc: t('popup.item') },
  { name: 'popup.footer', desc: t('popup.footer') },
])

const type = ref<'Single' | 'Multiple'>('Single')
const divRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <SemanticPreview
    :component-name="type === 'Single' ? 'TimePicker' : 'TimePicker.RangePicker'"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-flex ref="divRef" vertical :style="{ alignSelf: 'flex-start' }" gap="middle" align="center">
        <a-segmented
          :options="['Single', 'Multiple']"
          :value="type"
          @change="(val: 'Single' | 'Multiple') => type = val"
        />
        <a-time-picker
          v-if="type === 'Single'"
          :z-index="1"
          open
          :get-popup-container="() => divRef!"
          need-confirm
          :classes="classes"
        >
          <template #prefix>
            <SmileOutlined />
          </template>
        </a-time-picker>
        <a-time-range-picker
          v-else
          :z-index="1"
          open
          :get-popup-container="() => divRef!"
          need-confirm
          :classes="classes"
        >
          <template #prefix>
            <SmileOutlined />
          </template>
        </a-time-range-picker>
      </a-flex>
    </template>
  </SemanticPreview>
</template>
