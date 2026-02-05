import type { RateProps as VcRateProps } from '@v-c/rate'
import type { App } from 'vue'
import type { TooltipProps } from '../tooltip'
import { StarFilled } from '@antdv-next/icons'
import VcRate from '@v-c/rate'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { defineComponent, shallowRef } from 'vue'
import { getAttrStyleAndClass } from '../_util/hooks'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'
import Tooltip from '../tooltip'
import useStyle from './style'

function isTooltipProps(item: TooltipProps | string): item is TooltipProps {
  return typeof item === 'object' && item !== null
}

const defaults = {
  size: 'middle',
  character: <StarFilled />,
} as any
export interface RateProps extends Omit<
  VcRateProps,
'onChange' | 'onHoverChange' | 'onFocus' | 'onBlur' | 'onKeyDown' | 'onMouseLeave' | 'onUpdate:value'
> {
  rootClass?: string
  size?: 'small' | 'middle' | 'large'
  tooltips?: (TooltipProps | string)[]
}

export interface RateEmits {
  'update:value': (value: number) => void
  'change': (value: number) => void
  'hoverChange': (value: number) => void
  'focus': () => void
  'blur': () => void
  'keydown': (e: KeyboardEvent) => void
  'mouseleave': (e: FocusEvent) => void
}

const Rate = defineComponent<
  RateProps,
  RateEmits,
  string
>(
  (props = defaults, { attrs, emit, expose }) => {
    const rateRef = shallowRef()
    const characterRender: VcRateProps['characterRender'] = (node, { index }) => {
      const { tooltips } = props
      if (!tooltips) {
        return node
      }

      const tooltipsItem = tooltips[index as number]!

      if (isTooltipProps(tooltipsItem)) {
        return <Tooltip {...tooltipsItem}>{node}</Tooltip>
      }
      return <Tooltip title={tooltipsItem as string}>{node}</Tooltip>
    }
    const {
      prefixCls: ratePrefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
    } = useComponentBaseConfig('rate', props)

    // Style
    const [hashId, cssVarCls] = useStyle(ratePrefixCls)

    const disabled = useDisabledContext()
    expose({
      focus: () => {
        rateRef.value?.focus?.()
      },
      blur: () => {
        rateRef.value?.blur?.()
      },
    })
    return () => {
      const {
        character,
        disabled: customDisabled,
        size,
        rootClass,
        ...restProps
      } = props
      const mergedDisabled = customDisabled ?? disabled.value
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      return (
        <VcRate
          ref={rateRef}
          character={character}
          disabled={mergedDisabled}
          characterRender={characterRender}
          {...restAttrs}
          {...omit(restProps, ['characterRender'])}
          class={clsx(
            `${ratePrefixCls.value}-${size}`,
            className,
            rootClass,
            hashId.value,
            cssVarCls.value,
            contextClassName.value,
          )}
          style={{
            ...contextStyle.value,
            ...style,
          }}
          prefixCls={ratePrefixCls.value}
          direction={direction.value}
          onFocus={() => {
            emit('focus')
          }}
          onBlur={() => {
            emit('blur')
          }}
          onChange={(...args) => {
            emit('change', ...args)
            emit('update:value', ...args)
          }}
          onKeyDown={(e) => {
            emit('keydown', e)
          }}
          onMouseLeave={(e) => {
            emit('mouseleave', e)
          }}
          onHoverChange={(...args) => {
            emit('hoverChange', ...args)
          }}
        >
        </VcRate>
      )
    }
  },
  {
    name: 'ARate',
    inheritAttrs: false,
  },
)
;(Rate as any).install = (app: App) => {
  app.component(Rate.name, Rate)
}

export default Rate
