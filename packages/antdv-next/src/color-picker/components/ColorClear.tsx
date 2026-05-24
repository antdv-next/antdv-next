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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
    }

    return () => {
      const { className, style } = getAttrStyleAndClass(attrs)
      return (
        <div
          role="button"
          aria-label="Clear color"
          tabindex={0}
          class={[`${props.prefixCls}-clear`, className]}
          style={style}
          onClick={handleClick}
          onKeydown={handleKeyDown}
        />
      )
    }
  },
  {
    name: 'ColorClear',
    inheritAttrs: false,
  },
)
