<script setup lang="ts">
import type { VNode } from 'vue'
import {
  CustomerServiceOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
} from '@antdv-next/icons'
import {
  Card,
  DatePicker,
  Flex,
  FloatButton,
  Masonry,
  Splitter,
  SplitterPanel,
  Tour,
  TypographyTitle,
} from 'antdv-next'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, h } from 'vue'
import { useMobile } from '@/composables/mobile'
import { useLocale } from '@/composables/use-locale'
import { useAppStore } from '@/stores/app.ts'
import ComponentItem from './component-item.vue'

const { _InternalPanelDoNotUseOrYouWillBeFired: DatePickerPanel } = DatePicker as any
const { _InternalPanelDoNotUseOrYouWillBeFired: TourPanel } = Tour as any
const { _InternalPanelDoNotUseOrYouWillBeFired: FloatButtonPanel } = FloatButton as any

const { t } = useLocale()
const { isMobile } = useMobile()

const appStore = useAppStore()
const { darkMode } = storeToRefs(appStore)

const datePickerPresets = computed(() => [
  { label: t('homePage.componentsList.yesterday'), value: dayjs().add(-1, 'd') },
  { label: t('homePage.componentsList.lastWeek'), value: dayjs().add(-7, 'd') },
  { label: t('homePage.componentsList.lastMonth'), value: dayjs().add(-1, 'month') },
  { label: t('homePage.componentsList.lastYear'), value: dayjs().add(-1, 'year') },
])

const floatButtonItems = computed(() => [
  { icon: () => h(QuestionCircleOutlined) },
  { icon: () => h(CustomerServiceOutlined) },
  { icon: () => h(SyncOutlined) },
])

const masonryItems = [
  { key: '1', data: 80 },
  { key: '2', data: 60 },
  { key: '3', data: 40 },
  { key: '4', data: 120 },
  { key: '5', data: 90 },
  { key: '6', data: 40 },
  { key: '7', data: 60 },
  { key: '8', data: 70 },
  { key: '9', data: 120 },
]

const splitterBackground = computed(() => darkMode.value ? '#1f1f1f' : '#ffffff')

interface HomeComponentItem {
  title: string
  type: 'new' | 'update'
  node: () => VNode
}

function datePickerNode() {
  return h(DatePickerPanel, {
    value: dayjs('2025-11-22 00:00:00'),
    showToday: false,
    presets: isMobile.value ? [] : datePickerPresets.value,
  })
}

function tourNode() {
  return h(TourPanel, {
    title: 'Antdv Next',
    description: t('homePage.componentsList.tour'),
    style: { width: isMobile.value ? 'auto' : '350px' },
    current: 3,
    total: 9,
  })
}

function floatButtonNode() {
  return h(Flex, { align: 'center', gap: 'large' }, () => [
    h(FloatButtonPanel, { shape: 'square', items: floatButtonItems.value }),
    h(FloatButtonPanel, { backTop: true }),
    h(FloatButtonPanel, { items: floatButtonItems.value }),
  ])
}

function splitterNode() {
  return h(
    Splitter,
    {
      orientation: 'vertical',
      style: {
        height: '320px',
        width: '200px',
        background: splitterBackground.value,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      },
    },
    () => [
      h(
        SplitterPanel,
        { defaultSize: '40%', min: '20%', max: '70%' },
        () =>
          h(
            Flex,
            { justify: 'center', align: 'center', style: { height: '100%' } },
            () =>
              h(
                TypographyTitle,
                { type: 'secondary', level: 5, style: { whiteSpace: 'nowrap' } },
                () => 'First',
              ),
          ),
      ),
      h(
        SplitterPanel,
        () =>
          h(
            Flex,
            { justify: 'center', align: 'center', style: { height: '100%' } },
            () =>
              h(
                TypographyTitle,
                { type: 'secondary', level: 5, style: { whiteSpace: 'nowrap' } },
                () => 'Second',
              ),
          ),
      ),
    ],
  )
}

function masonryNode() {
  return h(Masonry, {
    columns: 2,
    gutter: 8,
    style: { width: '300px', height: '320px' },
    items: masonryItems,
    itemRender: ({ data, index }) =>
      h(Card, { size: 'small', style: { height: `${data}px` } }, () => String(index + 1)),
  })
}

const componentItems: HomeComponentItem[] = [
  // DatePicker
  { title: 'DatePicker', type: 'new', node: datePickerNode },

  // Tour
  { title: 'Tour', type: 'new', node: tourNode },

  // FloatButton
  { title: 'FloatButton', type: 'new', node: floatButtonNode },

  // Splitter
  { title: 'Splitter', type: 'new', node: splitterNode },

  // Masonry
  { title: 'Masonry', type: 'new', node: masonryNode },
]
</script>

<template>
  <div v-if="isMobile" class="antdv-components-list-mobile">
    <a-carousel
      class="antdv-components-list-carousel"
      :infinite="false"
    >
      <div v-for="(item, index) in componentItems" :key="item.title">
        <ComponentItem
          :title="item.title"
          :type="item.type"
          :index="index"
          class="antdv-components-list-mobile-card"
        >
          <component :is="item.node" />
        </ComponentItem>
      </div>
    </a-carousel>
  </div>

  <a-flex v-else justify="center" class="antdv-components-list">
    <a-flex align="stretch" gap="large">
      <ComponentItem
        v-for="(item, index) in componentItems"
        :key="item.title"
        :title="item.title"
        :type="item.type"
        :index="index"
      >
        <component :is="item.node" />
      </ComponentItem>
    </a-flex>
  </a-flex>
</template>

<style>
.antdv-components-list {
  width: 100%;
  overflow: hidden;
}

.antdv-components-list-mobile {
  margin: 0 var(--ant-margin);
}

.antdv-components-list-mobile-card {
  height: 395px;
}

.antdv-components-list-carousel .slick-dots.slick-dots-bottom {
  bottom: -22px;
}

.antdv-components-list-carousel .slick-dots.slick-dots-bottom li {
  width: 6px;
  height: 6px;
  background: #e1eeff;
  border-radius: 50%;
}

.antdv-components-list-carousel .slick-dots.slick-dots-bottom li button {
  height: 6px;
  background: #e1eeff;
  border-radius: 50%;
}

.antdv-components-list-carousel .slick-dots.slick-dots-bottom li.slick-active,
.antdv-components-list-carousel .slick-dots.slick-dots-bottom li.slick-active button {
  background: #4b9cff;
}
</style>
