import type { AggregationColor } from '../color'
import { getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { defineComponent } from 'vue'
import { generateColor } from '../util'

export interface ColorClearProps {
  prefixCls: string
  value?: AggregationColor
  onChange?: (value: AggregationColor) => void
  disabled?: boolean
}

export default defineComponent<ColorClearProps>(
  (props, { attrs }) => {
    const handleClick = () => {
      if (props.disabled || !props.onChange || !props.value || props.value.cleared) {
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
          aria-disabled={props.disabled ? 'true' : undefined}
          tabindex={props.disabled ? -1 : 0}
          class={[
            `${props.prefixCls}-clear`,
            className,
            { [`${props.prefixCls}-clear-disabled`]: props.disabled },
          ]}
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
