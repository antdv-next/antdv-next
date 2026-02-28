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
  open: boolean
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

      const mergedOpen = props.open && props.isEllipsis
      return (
        <Tooltip open={mergedOpen} {...props.tooltipProps}>
          {slots.default?.()}
        </Tooltip>
      )
    }
  },
})

export default EllipsisTooltip
