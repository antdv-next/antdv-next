<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，设置相对定位和基础容器样式',
    body: '主体元素，设置进度条的布局和尺寸样式',
    rail: '导轨元素，设置背景轨道的颜色和圆角样式，steps 模式下没有该元素',
    track: '轨迹元素，设置进度填充部分的颜色和过渡动画样式',
    indicator: '指示器元素，设置百分比文本或图标的位置和字体样式',
  },
  en: {
    root: 'Root element, set relative positioning and basic container styles',
    body: 'Body element, set progress bar layout and size styles',
    rail: 'Rail element, set background track color and border radius styles. Not exist in steps mode',
    track: 'Track element, set progress fill color and transition animation styles',
    indicator: 'Indicator element, set percentage text or icon position and font styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'body', desc: locale.value.body },
  { name: 'rail', desc: locale.value.rail },
  { name: 'track', desc: locale.value.track },
  { name: 'indicator', desc: locale.value.indicator },
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
