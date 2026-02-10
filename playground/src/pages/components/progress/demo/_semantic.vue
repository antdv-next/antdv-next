<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'body', desc: t('body') },
  { name: 'rail', desc: t('rail') },
  { name: 'track', desc: t('track') },
  { name: 'indicator', desc: t('indicator') },
])

const gradient = ref(false)
const type = ref('line')

const colorMap = {
  '0%': '#108ee9',
  '100%': '#87d068',
}
</script>

<template>
  <SemanticPreview
    component-name="Progress"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-flex vertical gap="middle" :style="{ width: '100%' }" align="center">
        <a-flex align="center" gap="middle">
          <a-segmented
            :options="['line', 'steps', 'circle', 'dashboard']"
            :value="type"
            @change="(val: string) => type = val"
          />
          <a-switch
            :checked="gradient"
            checked-children="Gradient"
            un-checked-children="Gradient"
            @change="(val: boolean) => gradient = val"
          />
        </a-flex>
        <a-flex vertical align="center" :style="{ height: '200px', width: '100%' }">
          <a-progress
            :percent="80"
            :type="type === 'steps' ? 'line' : type"
            :steps="type === 'steps' ? 5 : undefined"
            :stroke-color="gradient ? colorMap : undefined"
            :classes="classes"
          />
        </a-flex>
      </a-flex>
    </template>
  </SemanticPreview>
</template>
