<docs lang="zh-CN">
通过 `components` 替换对应面板。
</docs>

<docs lang="en-US">
Replace panel with `components`.
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import type { PropType } from 'vue'
import dayjs from 'dayjs'
import { computed, defineComponent, h, ref, resolveComponent, watch } from 'vue'

const MyDatePanel = defineComponent({
  name: 'MyDatePanel',
  // The picker passes panel props (e.g. `prefixCls="ant-picker"`) to the custom
  // component; without this they would fall through to the root `<a-flex>` and make
  // Flex generate styles under the `ant-picker` prefix, clobbering the picker styles.
  inheritAttrs: false,
  props: {
    value: Object as PropType<Dayjs>,
    onSelect: Function as PropType<(value: Dayjs) => void>,
    onHover: Function as PropType<(value: Dayjs) => void>,
  },
  setup(props) {
    const startDate = dayjs().date(1).month(0)
    const innerValue = ref(props.value || startDate)

    watch(
      () => props.value,
      (value) => {
        if (value) {
          innerValue.value = value
        }
      },
    )

    const dateCount = computed(() => {
      const endDate = startDate.add(1, 'year').add(-1, 'day')
      return endDate.diff(startDate, 'day')
    })

    const sliderValue = computed(() => {
      const diff = innerValue.value.diff(startDate, 'day')
      return Math.min(Math.max(0, diff), dateCount.value)
    })

    const handleChange = (nextValue: number) => {
      const nextDate = startDate.add(nextValue, 'day')
      innerValue.value = nextDate
      props.onHover?.(nextDate)
    }

    const handleSelect = () => {
      props.onSelect?.(innerValue.value)
    }

    return () => {
      const Flex = resolveComponent('a-flex') as any
      const Slider = resolveComponent('a-slider') as any
      const Title = resolveComponent('a-typography-title') as any
      const Button = resolveComponent('a-button') as any

      return h(
        Flex,
        { vertical: true, gap: 'small', style: { padding: '16px' } },
        {
          default: () => [
            h(Title, { level: 4, style: { margin: 0 }, title: 'no, it\'s not' }, () => 'The BEST Picker Panel'),
            h(Slider, {
              min: 0,
              max: dateCount.value,
              value: sliderValue.value,
              onChange: handleChange,
              tooltip: {
                formatter: (nextValue?: number) =>
                  startDate.add(nextValue || 0, 'day').format('YYYY-MM-DD'),
              },
            }),
            h(Button, { type: 'primary', onClick: handleSelect }, () => 'That\'s It!'),
          ],
        },
      )
    }
  },
})

function handleChange(date: any, dateString: string | string[]) {
  console.log(date, dateString)
}
</script>

<template>
  <a-space vertical>
    <a-date-picker
      :show-now="false"
      :components="{ date: MyDatePanel }"
      @change="handleChange"
    />
  </a-space>
</template>
