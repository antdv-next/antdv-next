<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，设置flex布局、宽度高度、对齐方式和拉伸样式',
    panel: '面板元素，设置flex基础值、增长比例和面板容器样式',
    dragger: '拖拽控制元素，设置绝对定位、用户选择、层级、居中对齐、背景色、悬停态和激活态样式',
  },
  en: {
    root: 'Root element with flex layout, width and height, alignment and stretch styles',
    panel: 'Panel element with flex basis, grow ratio and panel container styles',
    dragger: 'Drag control element with absolute positioning, user selection, z-index, center alignment, background color, hover and active states styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'panel', desc: locale.value.panel, version: '1.0.0' },
  { name: 'dragger', desc: locale.value.dragger, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Splitter"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-splitter
        :style="{ height: '200px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }"
        :classes="classes"
      >
        <a-splitter-panel>
          <div :style="{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }">
            First
          </div>
        </a-splitter-panel>
        <a-splitter-panel>
          <div :style="{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }">
            Second
          </div>
        </a-splitter-panel>
      </a-splitter>
    </template>
  </SemanticPreview>
</template>
