import type { InternalPanelProps } from './interface'
import { clsx } from '@v-c/util'
import { defineComponent } from 'vue'

export const InternalPanel = defineComponent<InternalPanelProps>(
  (props, { slots, attrs }) => {
    return () => {
      const { prefixCls, class: className, size, style = {} } = props

      const panelClassName = clsx(
        `${prefixCls}-panel`,
        { [`${prefixCls}-panel-hidden`]: size === 0 },
        className,
      )

      const hasSize = size !== undefined

      return (
        <div
          {...attrs}
          class={panelClassName}
          style={{
            ...style,
            // Use auto when start from ssr
            flexBasis: hasSize ? (typeof size === 'number' ? `${size}px` : size) : 'auto',
            flexGrow: hasSize ? 0 : 1,
          }}
        >
          {slots?.default?.()}
        </div>
      )
    }
  },
  {
    name: 'ASplitterPanel',
    inheritAttrs: false,
  },
)

export default InternalPanel
