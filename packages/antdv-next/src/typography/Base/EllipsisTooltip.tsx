import type { SlotsType } from 'vue'
import type { TooltipProps } from '../../tooltip'
import { filterEmpty } from '@v-c/util/dist/props-util'
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
        // Keep a single root vnode (no Fragment) so Vue can pass the parent's
        // scoped CSS id (`data-v-*`) down to the typography element.
        const children = filterEmpty(slots.default?.() ?? [])
        return children.length === 1 ? children[0] : children
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
