<docs lang="zh-CN">
自定义菜单，外置选择面板。
</docs>

<docs lang="en-US">
Custom menu, external selection panel.
</docs>

<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import type { Dayjs } from 'dayjs'
import { DownOutlined } from '@antdv-next/icons'
import dayjs from 'dayjs'
import { computed, h, ref, resolveComponent } from 'vue'

const dateDropdownOpen = ref(false)
const datePanelOpen = ref(false)
const dateValue = ref<Dayjs | null>(dayjs())

const rangeDropdownOpen = ref(false)
const rangePanelOpen = ref(false)
const rangeValue = ref<[Dayjs, Dayjs] | null>([dayjs(), dayjs().add(1, 'day')])

const DatePicker = resolveComponent('a-date-picker') as any
const RangePicker = resolveComponent('a-range-picker') as any

const dateMenuItems = computed<MenuItemType[]>(() => [
  {
    key: 'today',
    label: 'Today',
    onClick() {
      dateValue.value = dayjs()
      dateDropdownOpen.value = false
    },
  },
  {
    key: 'tomorrow',
    label: 'Tomorrow',
    onClick() {
      dateValue.value = dayjs().add(1, 'day')
      dateDropdownOpen.value = false
    },
  },
  {
    key: 'custom-date',
    label: h(
      'div',
      {
        style: { position: 'relative', overflow: 'hidden' },
        onClick: (event: MouseEvent) => {
          event.stopPropagation()
          datePanelOpen.value = true
        },
      },
      [
        h('div', 'Customize'),
        h(
          'div',
          {
            onClick: (event: MouseEvent) => {
              event.stopPropagation()
            },
          },
          [
            h(DatePicker, {
              open: datePanelOpen.value,
              styles: {
                root: {
                  pointerEvents: 'none',
                  opacity: 0,
                  position: 'absolute',
                  bottom: -12,
                  insetInlineStart: 0,
                },
              },
              onChange: (value: Dayjs | null) => {
                dateValue.value = value
                dateDropdownOpen.value = false
                datePanelOpen.value = false
              },
            }),
          ],
        ),
      ],
    ),
  },
])

const rangeMenuItems = computed<MenuItemType[]>(() => [
  {
    key: '7',
    label: '7 days',
    onClick() {
      rangeValue.value = [dayjs(), dayjs().add(7, 'day')]
      rangeDropdownOpen.value = false
    },
  },
  {
    key: '30',
    label: '30 days',
    onClick() {
      rangeValue.value = [dayjs(), dayjs().add(30, 'day')]
      rangeDropdownOpen.value = false
    },
  },
  {
    key: 'custom-date',
    label: h(
      'div',
      {
        style: { position: 'relative', overflow: 'hidden' },
        onClick: (event: MouseEvent) => {
          event.stopPropagation()
          rangePanelOpen.value = true
        },
      },
      [
        h('div', 'Customize'),
        h(
          'div',
          {
            onClick: (event: MouseEvent) => {
              event.stopPropagation()
            },
          },
          [
            h(RangePicker, {
              open: rangePanelOpen.value,
              styles: {
                root: {
                  pointerEvents: 'none',
                  opacity: 0,
                  position: 'absolute',
                  bottom: 0,
                  insetInlineStart: 0,
                },
              },
              onChange: (ranges: [Dayjs, Dayjs] | null) => {
                if (ranges?.[0] && ranges?.[1]) {
                  rangeValue.value = [ranges[0], ranges[1]]
                }
                else {
                  rangeValue.value = null
                }
                rangeDropdownOpen.value = false
                rangePanelOpen.value = false
              },
            }),
          ],
        ),
      ],
    ),
  },
])

const dateMenu = computed(() => ({ items: dateMenuItems.value }))
const rangeMenu = computed(() => ({ items: rangeMenuItems.value }))

function handleDateOpenChange(nextOpen: boolean) {
  dateDropdownOpen.value = nextOpen
  if (!nextOpen) {
    datePanelOpen.value = false
  }
}

function handleRangeOpenChange(nextOpen: boolean) {
  rangeDropdownOpen.value = nextOpen
  if (!nextOpen) {
    rangePanelOpen.value = false
  }
}
</script>

<template>
  <div style="display: flex; gap: 20%;">
    <div>
      <div style="margin-bottom: 12px;">
        DatePicker
      </div>
      <a-dropdown
        arrow
        :open="dateDropdownOpen"
        :menu="dateMenu"
        :trigger="['click']"
        destroy-on-hidden
        @open-change="handleDateOpenChange"
      >
        <a @click.prevent>
          <a-space>
            <span>{{ dateValue?.format('YYYY-MM-DD') }}</span>
            <DownOutlined />
          </a-space>
        </a>
      </a-dropdown>
    </div>

    <div>
      <div style="margin-bottom: 12px;">
        RangePicker
      </div>
      <a-dropdown
        arrow
        :open="rangeDropdownOpen"
        :menu="rangeMenu"
        :trigger="['click']"
        destroy-on-hidden
        @open-change="handleRangeOpenChange"
      >
        <a @click.prevent>
          <a-space>
            <span>
              {{
                rangeValue
                  ? `${rangeValue[0].format('YYYY-MM-DD')} ~ ${rangeValue[1].format('YYYY-MM-DD')}`
                  : 'Select range'
              }}
            </span>
            <DownOutlined />
          </a-space>
        </a>
      </a-dropdown>
    </div>
  </div>
</template>
