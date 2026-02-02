<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含边框顶部样式、分隔线样式等分割线容器的基础样式',
    content: '内容元素，包含行内块显示、内边距等分割线文本内容的样式',
    rail: '背景条元素，包含边框顶部样式等分割线连接条的样式',
  },
  en: {
    root: 'Root element with border-top style, divider styling and other basic divider container styles',
    content: 'Content element with inline-block display, padding and other divider text content styles',
    rail: 'Background rail element with border-top style and other divider connection line styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'rail', desc: locale.value.rail },
  { name: 'content', desc: locale.value.content },
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
