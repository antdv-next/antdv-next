import type { Key } from '@v-c/util/dist/type'
import type { AppContext, CSSProperties, HTMLAttributes } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { ClosableType } from '../_util/hooks/useClosable'
import type { VueNode } from '../_util/type'

interface DivProps extends HTMLAttributes {
  'data-testid'?: string
}

export const NotificationPlacements = [
  'top',
  'topLeft',
  'topRight',
  'bottom',
  'bottomLeft',
  'bottomRight',
] as const

export type NotificationPlacement = (typeof NotificationPlacements)[number]

export type IconType = 'success' | 'info' | 'error' | 'warning'

export type NotificationSemanticName = keyof NotificationSemanticClassNames
  & keyof NotificationSemanticStyles

export interface NotificationSemanticClassNames {
  root?: string
  title?: string
  description?: string
  actions?: string
  icon?: string
}

export interface NotificationSemanticStyles {
  root?: CSSProperties
  title?: CSSProperties
  description?: CSSProperties
  actions?: CSSProperties
  icon?: CSSProperties
}

export type NotificationClassNamesType = SemanticClassNamesType<
  ArgsProps,
  NotificationSemanticClassNames
>

export type NotificationStylesType = SemanticStylesType<ArgsProps, NotificationSemanticStyles>

export interface ArgsProps {
  title?: VueNode
  description?: VueNode
  actions?: VueNode
  key?: Key
  onClose?: () => void
  duration?: number | false
  showProgress?: boolean
  pauseOnHover?: boolean
  icon?: VueNode
  placement?: NotificationPlacement
  style?: CSSProperties
  class?: string
  classes?: NotificationClassNamesType
  styles?: NotificationStylesType
  readonly type?: IconType
  onClick?: () => void
  closeIcon?: VueNode
  closable?:
    | boolean
    | (Exclude<ClosableType, boolean> & {
      onClose?: () => void
    })
  props?: DivProps
  role?: 'alert' | 'status'
}

export interface NotificationConfig {
  top?: number
  bottom?: number
  prefixCls?: string
  getContainer?: () => HTMLElement | ShadowRoot
  placement?: NotificationPlacement
  maxCount?: number
  rtl?: boolean
  stack?: boolean | { threshold?: number }
  duration?: number | false
  showProgress?: boolean
  pauseOnHover?: boolean
  closeIcon?: VueNode
  classes?: NotificationClassNamesType
  styles?: NotificationStylesType
}

type StaticFn = (args: ArgsProps) => void
export interface NotificationInstance {
  success: StaticFn
  error: StaticFn
  info: StaticFn
  warning: StaticFn
  open: StaticFn
  destroy: (key?: Key) => void
}

export interface GlobalConfigProps {
  top?: number
  bottom?: number
  duration?: number | false
  showProgress?: boolean
  pauseOnHover?: boolean
  prefixCls?: string
  getContainer?: () => HTMLElement | ShadowRoot
  placement?: NotificationPlacement
  closeIcon?: VueNode
  closable?: ClosableType
  rtl?: boolean
  maxCount?: number
  props?: DivProps
  appContext?: AppContext
}
