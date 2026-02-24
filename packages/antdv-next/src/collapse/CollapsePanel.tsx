import type { VueNode } from '../_util/type.ts'
import { Panel as VcCollapsePanel } from '@v-c/collapse'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'
import { useBaseConfig } from '../config-provider/context.ts'

export type CollapsibleType = 'header' | 'icon' | 'disabled'

export interface CollapsePanelProps {
  key: string | number
  header: VueNode
  showArrow?: boolean
  prefixCls?: string
  forceRender?: boolean
  id?: string
  extra?: VueNode
  collapsible?: CollapsibleType
}

const defaults = {
  showArrow: true,
} as any

const CollapsePanel = defineComponent<CollapsePanelProps>(
  (props = defaults, { slots, attrs }) => {
    const { prefixCls } = useBaseConfig('collapse', props)
    return () => {
      const children = slots.default ? slots.default() : null
      const { showArrow = true } = props
      const collapsePanelClassName = classNames(
        {
          [`${prefixCls.value}-no-arrow`]: !showArrow,
        },
        (attrs as any).class,
      )
      return (
        <VcCollapsePanel
          {...omit(attrs, ['class'])}
          {...props}
          prefixCls={prefixCls.value}
          showArrow={showArrow}
          class={collapsePanelClassName}
          children={children}
        />
      )
    }
  },
)

export default CollapsePanel
