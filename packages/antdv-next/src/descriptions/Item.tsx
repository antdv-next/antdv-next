import type { CSSProperties, SlotsType } from 'vue'
import type { Breakpoint } from '../_util/responsiveObserver.ts'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { CellSemanticClassNames, CellSemanticStyles } from './DescriptionsContext.ts'
import { defineComponent } from 'vue'

export const DESCRIPTIONS_ITEM_MARK = '_ANTDV_NEXT_DESCRIPTIONS_ITEM'

export interface DescriptionsItemProps extends ComponentBaseProps {
  class?: string
  style?: CSSProperties
  label?: VueNode
  classes?: CellSemanticClassNames
  styles?: CellSemanticStyles
  content?: VueNode
  span?: number | 'filled' | { [key in Breakpoint]?: number }
}

export interface DescriptionsItemSlots {
  default?: () => any
  label?: () => any
  content?: () => any
}

const DescriptionsItem = defineComponent<
  DescriptionsItemProps,
  EmptyEmit,
  string,
  SlotsType<DescriptionsItemSlots>
>(
  () => {
    return () => null
  },
  {
    name: 'ADescriptionsItem',
    inheritAttrs: false,
  },
)

;(DescriptionsItem as any)[DESCRIPTIONS_ITEM_MARK] = true

export default DescriptionsItem
