<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const editing = ref(false)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.3.0' },
  { name: 'actions', desc: t('actions'), version: '1.3.0' },
  { name: 'action', desc: t('action'), version: '1.3.0' },
  { name: 'textarea', desc: t('textarea'), version: '1.3.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Typography"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-flex
        vertical
        gap="middle"
        align="start"
        :style="{ width: '100%', alignSelf: 'flex-start' }"
      >
        <a-switch
          v-model:checked="editing"
          checked-children="Editing"
          un-checked-children="Editing"
        />
        <a-typography-paragraph
          copyable
          :editable="{ editing }"
          :ellipsis="{ rows: 2, expandable: true }"
          :style="{ width: '100%' }"
          :classes="classes"
        >
          Ant Design is a design language for background applications, refined by Ant UED Team.
          It aims to uniform the user interface specs for internal background projects, lower the
          unnecessary cost of design differences and implementation and liberate the resources of
          design and front-end development.
        </a-typography-paragraph>
      </a-flex>
    </template>
  </SemanticPreview>
</template>
