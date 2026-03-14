import type { CSSProperties, SlotsType } from 'vue'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { CollapseSemanticClassNames, CollapseSemanticStyles } from './Collapse.tsx'
import { defineComponent } from 'vue'

export type CollapsibleType = 'header' | 'icon' | 'disabled'

export const COLLAPSE_PANEL_MARK = '_ANTDV_NEXT_COLLAPSE_PANEL'

export interface CollapsePanelProps {
  key: string | number
  class?: string
  style?: CSSProperties
  header?: VueNode
  showArrow?: boolean
  prefixCls?: string
  forceRender?: boolean
  id?: string
  extra?: VueNode
  collapsible?: CollapsibleType
  classes?: Partial<CollapseSemanticClassNames>
  styles?: Partial<CollapseSemanticStyles>
}

export interface CollapsePanelSlots {
  default?: () => any
  header?: () => any
  extra?: () => any
}

const CollapsePanel = defineComponent<
  CollapsePanelProps,
  EmptyEmit,
  string,
  SlotsType<CollapsePanelSlots>
>(
  () => {
    return () => null
  },
  {
    name: 'ACollapsePanel',
    inheritAttrs: false,
  },
)

;(CollapsePanel as any)[COLLAPSE_PANEL_MARK] = true

export default CollapsePanel
