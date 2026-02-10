import type { AggregationColor } from '../color'
import { getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { defineComponent } from 'vue'
import { generateColor } from '../util'

export interface ColorClearProps {
  prefixCls: string
  value?: AggregationColor
  onChange?: (value: AggregationColor) => void
}

export default defineComponent<ColorClearProps>(
  (props, { attrs }) => {
    const handleClick = () => {
      if (!props.onChange || !props.value || props.value.cleared) {
        return
      }
      const hsba = props.value.toHsb()
      hsba.a = 0
      const genColor = generateColor(hsba)
      genColor.cleared = true
      props.onChange(genColor)
    }

    return () => {
      const { className, style } = getAttrStyleAndClass(attrs)
      return <div class={[`${props.prefixCls}-clear`, className]} style={style} onClick={handleClick} />
    }
  },
  {
    name: 'ColorClear',
    inheritAttrs: false,
  },
)
