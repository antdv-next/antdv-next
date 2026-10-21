<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'section', desc: t('section'), version: '1.0.3' },
  { name: 'indicator', desc: t('indicator'), version: '1.0.0' },
  { name: 'description', desc: t('description'), version: '1.0.3' },
  { name: 'container', desc: t('container'), version: '1.0.3' },
])

const sharedStyles = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '1 1 30%',
  borderInlineEnd: '1px solid rgba(150,150,150,0.2)',
}
</script>

<template>
  <SemanticPreview
    component-name="Spin"
    :padding="false"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div :style="{ display: 'flex', width: '100%', minHeight: '100%', alignItems: 'stretch' }">
        <div :style="sharedStyles">
          <a-spin :percent="0" :classes="classes" />
        </div>
        <div :style="sharedStyles">
          <a-spin :percent="0" description="Loading" :classes="classes">
            <div :style="{ width: '100px', height: '100px', background: 'rgba(150,150,150,0.2)', borderRadius: '8px' }" />
          </a-spin>
        </div>
        <div :style="sharedStyles">
          <a-spin
            :percent="0"
            fullscreen
            description="Loading"
            :classes="classes"
            :style="{ position: 'absolute' }"
          />
        </div>
      </div>
    </template>
  </SemanticPreview>
</template>
