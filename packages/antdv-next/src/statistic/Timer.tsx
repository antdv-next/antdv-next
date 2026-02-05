import type { SlotsType } from 'vue'
import type { StatisticProps, StatisticSlots } from './Statistic.tsx'
import type { FormatConfig, valueType } from './utils.ts'
import raf from '@v-c/util/dist/raf'
import { omit } from 'es-toolkit'
import { computed, defineComponent, onMounted, shallowRef, watch } from 'vue'
import { cloneElement } from '../_util/vueNode.ts'
import Statistic from './Statistic.tsx'
import { formatCounter } from './utils.ts'

export type TimerType = 'countdown' | 'countup'

export type StatisticTimerProps = FormatConfig & StatisticProps & {
  type: TimerType
  format?: string
}

export interface StatisticTimeEmits {
  /**
   * Only to be called when the type is `countdown`.
   */
  finish: () => void
  change: (value?: valueType) => void
}

function getTime(value?: valueType) {
  return new Date(value as valueType).getTime()
}

const defaults = {
  value: 0,
  decimalSeparator: '.',
  groupSeparator: ',',
  loading: false,
  format: 'HH:mm:ss',
  title: undefined,
  suffix: undefined,
  prefix: undefined,
} as any
const StatisticTimer = defineComponent<
  StatisticTimerProps,
  StatisticTimeEmits,
  string,
  SlotsType<StatisticSlots>
>(
  (props = defaults, { slots, attrs, emit }) => {
    const down = computed(() => props.type === 'countdown')
    // We reuse state here to do same as `forceUpdate`
    const showTime = shallowRef<null | object>(null)
    // ======================== Update ========================
    const update = () => {
      const { value } = props
      const now = Date.now()
      const timestamp = getTime(value)
      showTime.value = {}
      const timeDiff = !down.value ? now - timestamp : timestamp - now
      emit('change', timeDiff)
      // Only countdown will trigger `onFinish`
      if (down.value && timestamp < now) {
        emit('finish')
        return false
      }
      return true
    }
    watch(
      [() => props.value, down],
      (_n, _o, onCleanup) => {
        let refId: number
        const clear = () => raf.cancel(refId!)
        const rafUpdate = () => {
          refId = raf(() => {
            if (update()) {
              rafUpdate()
            }
          })
        }
        rafUpdate()
        onCleanup(clear)
      },
      {
        immediate: true,
      },
    )
    onMounted(() => {
      showTime.value = {}
    })
    // ======================== Format ========================
    const formatter: StatisticProps['formatter'] = (formatValue, config) =>
      showTime.value ? formatCounter(formatValue, { ...config, format: props.format }, down.value) : '-'
    const valueRender: StatisticProps['valueRender'] = node =>
      cloneElement(node, { title: undefined })
    return () => {
      // ======================== Render ========================
      return (
        <Statistic
          {...attrs}
          {...omit(props, ['value', 'format', 'type'])}
          value={props.value}
          valueRender={valueRender}
          formatter={formatter}
          v-slots={slots}
        />
      )
    }
  },
  {
    name: 'AStatisticTimer',
    inheritAttrs: false,
  },
)

export default StatisticTimer
