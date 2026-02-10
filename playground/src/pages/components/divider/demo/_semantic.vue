<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'rail', desc: t('rail') },
  { name: 'content', desc: t('content') },
])
</script>

<template>
  <SemanticPreview
    component-name="Divider"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
          ista probare, quae sunt a te dicta? Refert tamen, quo modo.
        </p>
        <a-divider :classes="classes" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
          ista probare, quae sunt a te dicta? Refert tamen, quo modo.
        </p>
        <a-divider :classes="classes">
          Solid
        </a-divider>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
          ista probare, quae sunt a te dicta? Refert tamen, quo modo.
        </p>
        <a-divider title-placement="left" variant="dotted" :classes="classes">
          Dotted
        </a-divider>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
          ista probare, quae sunt a te dicta? Refert tamen, quo modo.
        </p>
        <a-divider title-placement="right" variant="dashed" :classes="classes">
          Dashed
        </a-divider>
        These
        <a-divider orientation="vertical" :classes="classes" />
        are
        <a-divider orientation="vertical" :classes="classes" />
        vertical
        <a-divider orientation="vertical" :classes="classes" />
        Dividers
      </div>
    </template>
  </SemanticPreview>
</template>
