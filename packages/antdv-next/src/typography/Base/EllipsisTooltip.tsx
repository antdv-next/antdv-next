import type { SlotsType } from 'vue'
import type { TooltipProps } from '../../tooltip'
import { defineComponent } from 'vue'

import Tooltip from '../../tooltip'

export interface EmptyEmitsProps {
}

export interface EllipsisTooltipProps extends
  /* @vue-ignore */
  EmptyEmitsProps {
  tooltipProps?: TooltipProps
  enableEllipsis: boolean
  isEllipsis?: boolean
  /**
   * Suppress the tooltip without taking control of its open state, so hover
   * handling stays inside Tooltip and it re-opens when moving from the actions
   * back to the text.
   */
  disabled: boolean
}

export interface EllipsisTooltipSlots {
  default?: () => any
}

const EllipsisTooltip = defineComponent<
  EllipsisTooltipProps,
  Record<string, never>,
  string,
  SlotsType<EllipsisTooltipSlots>
>({
  name: 'TypographyEllipsisTooltip',
  inheritAttrs: false,
  setup(props, { slots }) {
    return () => {
      if (!props.tooltipProps?.title || !props.enableEllipsis) {
        return slots.default?.()
      }

      return (
        <Tooltip {...props.tooltipProps} disabled={!props.isEllipsis || props.disabled}>
          {slots.default?.()}
        </Tooltip>
      )
    }
  },
})

export default EllipsisTooltip
