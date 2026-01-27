import type { CSSProperties } from 'vue'
import type { Breakpoint } from '../_util/responsiveObserver.ts'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { CellSemanticClassNames, CellSemanticStyles } from './DescriptionsContext.ts'

export interface DescriptionsItemProps extends ComponentBaseProps {
  class?: string
  style?: CSSProperties
  label?: VueNode
  classes?: CellSemanticClassNames
  styles?: CellSemanticStyles
  content?: VueNode
  span?: number | 'filled' | { [key in Breakpoint]?: number }
}
