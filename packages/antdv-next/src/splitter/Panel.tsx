import type { InternalPanelProps, PanelProps } from './interface'
import { clsx } from '@v-c/util'
import { defineComponent } from 'vue'

export const InternalPanel = defineComponent<InternalPanelProps>(
  (props, { slots, attrs }) => {
    return () => {
      const { prefixCls, class: className, size, style = {}, destroyOnHidden } = props

      const isHidden = size === 0
      const panelClassName = clsx(
        `${prefixCls}-panel`,
        { [`${prefixCls}-panel-hidden`]: isHidden },
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
          {/* ant-design 6.4.0 #56772: optionally drop slot content when collapsed. */}
          {(isHidden && destroyOnHidden) ? null : slots?.default?.()}
        </div>
      )
    }
  },
  {
    name: 'ASplitterPanel',
    inheritAttrs: false,
  },
)

const Panel = defineComponent<PanelProps>(
  () => () => null,
  {
    name: 'ASplitterPanel',
  },
)

export default Panel
