<docs lang="zh-CN">
通过 `scrollPosition` 控制切换标签时激活标签的滚动对齐方式。
</docs>

<docs lang="en-US">
Use `scrollPosition` to control the scroll alignment of the active tab when switching.
</docs>

<script setup lang="ts">
import type { RadioGroupProps, SegmentedProps, TabsProps } from 'antdv-next'
import { computed, ref } from 'vue'

type ScrollPosition = NonNullable<TabsProps['scrollPosition']>
type TabPlacement = NonNullable<TabsProps['tabPlacement']>
type ScrollPositionOption = ScrollPosition | 'custom'

const items: TabsProps['items'] = Array.from({ length: 30 }, (_, i) => {
  const id = String(i)
  return {
    key: id,
    label: `Tab ${id}`,
    content: `Content of Tab ${id}`,
  }
})

const scrollPositionOptions: SegmentedProps<ScrollPositionOption>['options'] = [
  { label: 'auto', value: 'auto' },
  { label: 'start', value: 'start' },
  { label: 'center', value: 'center' },
  { label: 'end', value: 'end' },
  { label: 'custom', value: 'custom' },
]

const tabPlacementOptions: RadioGroupProps['options'] = [
  { label: 'Horizontal', value: 'top' },
  { label: 'Vertical', value: 'start' },
]

const scrollPositionMode = ref<ScrollPositionOption>('center')
const ratio = ref(0.25)
const scrollPosition = computed<ScrollPosition>(() => scrollPositionMode.value === 'custom' ? ratio.value : scrollPositionMode.value)
const mode = ref<TabPlacement>('top')
</script>

<template>
  <a-flex vertical gap="large">
    <a-radio-group
      v-model:value="mode"
      :options="tabPlacementOptions"
      option-type="button"
    />
    <a-flex
      align="center"
      gap="small"
    >
      <a-segmented
        v-model:value="scrollPositionMode"
        :options="scrollPositionOptions"
      />
      <template v-if="scrollPositionMode === 'custom'">
        <span>ratio:</span>
        <a-input-number
          v-model:value="ratio"
          :min="0"
          :max="2"
          :step="0.05"
        />
      </template>
    </a-flex>
  </a-flex>
  <a-tabs
    default-active-key="6"
    :scroll-position="scrollPosition"
    :tab-placement="mode"
    :style="{ height: '180px', marginTop: '15px' }"
    :items="items"
  />
</template>
