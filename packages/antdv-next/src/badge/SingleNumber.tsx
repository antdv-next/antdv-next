import type { CSSProperties } from 'vue'
import { classNames } from '@v-c/util'
import { computed, defineComponent, onBeforeUnmount, shallowRef, watch } from 'vue'

export interface SingleNumberProps {
  prefixCls: string
  value: string
  count: number
}

function getOffset(start: number, end: number, unit: -1 | 1) {
  let index = start
  let offset = 0

  while ((index + 10) % 10 !== end) {
    index += unit
    offset += unit
  }

  return offset
}

export default defineComponent<SingleNumberProps>(
  (props) => {
    const valueNumber = computed(() => Number(props.value))
    const countNumber = computed(() => Math.abs(props.count))
    const prevValue = shallowRef(valueNumber.value)
    const prevCount = shallowRef(countNumber.value)
    const fallbackTimer = shallowRef<ReturnType<typeof setTimeout> | null>(null)

    const onTransitionEnd = () => {
      prevValue.value = valueNumber.value
      prevCount.value = countNumber.value
    }

    watch(
      [valueNumber, countNumber],
      () => {
        if (fallbackTimer.value) {
          clearTimeout(fallbackTimer.value)
          fallbackTimer.value = null
        }
        fallbackTimer.value = setTimeout(onTransitionEnd, 1000)
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      if (fallbackTimer.value) {
        clearTimeout(fallbackTimer.value)
        fallbackTimer.value = null
      }
    })

    return () => {
      const prefixCls = props.prefixCls
      const value = valueNumber.value
      const count = countNumber.value
      const previousValue = prevValue.value
      const previousCount = prevCount.value

      const renderUnit = (unitValue: number | string, offset = 0, current = false, key?: number | string) => {
        const style = offset
          ? ({
              position: 'absolute',
              top: `${offset}00%`,
              left: 0,
            } as CSSProperties)
          : undefined

        const spanKey = Number.isNaN(key) ? unitValue : key ?? unitValue
        return (
          <span
            key={spanKey}
            class={classNames(`${prefixCls}-only-unit`, { current })}
            style={style}
          >
            {unitValue}
          </span>
        )
      }

      let unitNodes
      let offsetStyle: CSSProperties | undefined

      if (previousValue === value || Number.isNaN(value) || Number.isNaN(previousValue)) {
        unitNodes = [renderUnit(props.value, 0, true, value)]
        offsetStyle = { transition: 'none' }
      }
      else {
        const unitNumberList: number[] = []
        for (let index = value; index <= value + 10; index += 1) {
          unitNumberList.push(index)
        }

        const unit: -1 | 1 = previousCount < count ? 1 : -1
        const prevIndex = unitNumberList.findIndex((n: number) => n % 10 === previousValue)
        const cutList = unit < 0 ? unitNumberList.slice(0, prevIndex + 1) : unitNumberList.slice(prevIndex)

        unitNodes = cutList.map((n, index) => {
          const singleUnit = n % 10
          return renderUnit(
            singleUnit,
            unit < 0 ? index - prevIndex : index,
            index === prevIndex,
            n,
          )
        })

        offsetStyle = {
          transform: `translateY(${-getOffset(previousValue, value, unit)}00%)`,
        }
      }

      return (
        <span
          class={`${prefixCls}-only`}
          style={offsetStyle}
          onTransitionend={onTransitionEnd}
        >
          {unitNodes}
        </span>
      )
    }
  },
  {
    name: 'ASingleNumber',
    inheritAttrs: false,
  },
)
