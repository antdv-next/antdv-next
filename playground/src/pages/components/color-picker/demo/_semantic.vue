<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    'root': '触发器容器，包含边框样式、过渡动画、尺寸控制等样式，显示颜色块和文本内容',
    'popup.root': '弹出面板根容器，包含背景色、阴影效果、色彩选择面板、滑块控制和预设颜色等样式',
  },
  en: {
    'root': 'Trigger container with border styles, transition animations, size controls, displaying color block and text content',
    'popup.root': 'Popup panel root container with background color, shadow effects, color selection panel, slider controls and preset colors',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'popup.root', desc: locale.value['popup.root'] },
])

const divRef = ref<HTMLDivElement | null>(null)
const body = document?.body
</script>

<template>
  <SemanticPreview
    component-name="ColorPicker"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ height: '300px' }">
        <a-color-picker
          default-value="#1677ff"
          open
          :get-popup-container="() => divRef || body"
          :styles="{ popup: { root: { zIndex: 1 } } }"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
