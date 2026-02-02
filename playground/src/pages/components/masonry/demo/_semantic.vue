<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，设置相对定位、flex布局和瀑布流容器样式',
    item: '条目元素，设置绝对定位、宽度计算、过渡动画和瀑布流项目样式',
  },
  en: {
    root: 'Root element, sets relative positioning, flex layout and masonry container styles',
    item: 'Item element, sets absolute positioning, width calculation, transition animation and masonry item styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'item', desc: locale.value.item },
])

const heights = [75, 50, 70, 60, 85, 75, 50].map((height, index) => ({
  key: `item-${index}`,
  data: height,
}))
</script>

<template>
  <SemanticPreview
    component-name="Masonry"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-masonry
        :columns="3"
        :gutter="16"
        :items="heights"
        style="width: 100%"
        :classes="classes"
      >
        <template #itemRender="{ data, index }">
          <a-card size="small" :style="{ height: data }">
            {{ index + 1 }}
          </a-card>
        </template>
      </a-masonry>
    </template>
  </SemanticPreview>
</template>
