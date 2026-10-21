import type { VueNode } from '../../_util/type.ts'
import { classNames } from '@v-c/util'
import { createVNode, defineComponent, isVNode } from 'vue'
import { getAttrStyleAndClass } from '../../_util/hooks'
import { getSlotPropsFnRun } from '../../_util/tools.ts'
import { Looper } from './Looper.tsx'

export interface IndicatorProps {
  prefixCls: string
  indicator?: VueNode
  percent?: number
}

const defaultProps = {
  indicator: undefined,
} as any

const Indicator = defineComponent<IndicatorProps>(
  (props = defaultProps, { slots, attrs }) => {
    return () => {
      const { prefixCls, percent } = props
      const dotClassName = `${prefixCls}-dot`
      const indicator = getSlotPropsFnRun(slots, props, 'indicator')
      const { style, className } = getAttrStyleAndClass(attrs)

      if (indicator && isVNode(indicator)) {
        return createVNode(indicator, {
          class: classNames(dotClassName, className),
          style,
          percent,
        })
      }

      return <Looper {...attrs} prefixCls={prefixCls} percent={percent} />
    }
  },
  {
    inheritAttrs: false,
  },
)

export default Indicator
