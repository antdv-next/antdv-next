import type { TextAreaProps as VcTextAreaProps } from '@v-c/textarea'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type'
import type { ComponentBaseProps, DirectionType } from '../config-provider/context'
import type { TooltipProps } from '../tooltip'

export type BaseType = 'secondary' | 'success' | 'warning' | 'danger'

export interface CopyConfig {
  text?: string | (() => string | Promise<string>)
  onCopy?: (event?: MouseEvent) => void
  icon?: VueNode | VueNode[]
  tooltips?: VueNode | VueNode[] | false
  format?: 'text/plain' | 'text/html'
  tabIndex?: number
}

export interface EditConfig {
  text?: string
  editing?: boolean
  icon?: VueNode
  tooltip?: VueNode
  onStart?: () => void
  onChange?: (value: string) => void
  onCancel?: () => void
  onEnd?: () => void
  maxLength?: number
  autoSize?: boolean | VcTextAreaProps['autoSize']
  triggerType?: ('icon' | 'text')[]
  enterIcon?: VueNode
  tabIndex?: number
}

export interface EllipsisConfig {
  rows?: number
  expandable?: boolean | 'collapsible'
  suffix?: string
  symbol?: VueNode | ((expanded: boolean) => VueNode)
  defaultExpanded?: boolean
  expanded?: boolean
  onExpand?: (e: MouseEvent, info: { expanded: boolean }) => void
  onEllipsis?: (ellipsis: boolean) => void
  tooltip?: VueNode | TooltipProps
}

export type TypographySemantic = 'root' | 'copy' | 'edit' | 'expand' | 'content'

export type TypographyClassNamesType = SemanticClassNamesType<BlockProps, TypographySemantic>
export type TypographyStylesType = SemanticStylesType<BlockProps, TypographySemantic>

export interface BlockProps extends ComponentBaseProps {
  title?: string
  editable?: boolean | EditConfig
  copyable?: boolean | CopyConfig
  type?: BaseType
  disabled?: boolean
  ellipsis?: boolean | EllipsisConfig
  code?: boolean
  mark?: boolean
  underline?: boolean
  delete?: boolean
  strong?: boolean
  keyboard?: boolean
  italic?: boolean
  component?: keyof HTMLElementTagNameMap | string
  direction?: DirectionType
  classes?: TypographyClassNamesType
  styles?: TypographyStylesType
  id?: string
  [key: `data-${string}`]: string | number | undefined
}

export interface TypographySlots {
  default?: () => any
}

export interface TypographyBaseEmits {
  'click': (e: MouseEvent) => void
  'expand': (expanded: boolean, e: MouseEvent) => void
  'copy': (e?: MouseEvent) => void
  'edit:start': () => void
  'edit:change': (value: string) => void
  'edit:cancel': () => void
  'edit:end': () => void
  'update:expanded': (expanded: boolean) => void
  'update:editing': (editing: boolean) => void
  [key: string]: (...args: any[]) => any
}

export interface TypographyBaseProps extends ComponentBaseProps {
  prefixCls?: string
  rootClass?: string
  component?: keyof HTMLElementTagNameMap | string
  direction?: DirectionType
  // classes?: TypographyClassNamesType
  // styles?: TypographyStylesType
  title?: string
}
