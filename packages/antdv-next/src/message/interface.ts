import type { Key } from '@v-c/util/dist/type'
import type { AppContext, CSSProperties } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type'

export type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading'

export type MessageSemanticName = keyof MessageSemanticClassNames & keyof MessageSemanticStyles

export interface MessageSemanticClassNames {
  root?: string
  icon?: string
  content?: string
}

export interface MessageSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  content?: CSSProperties
}

export type ArgsClassNamesType = SemanticClassNamesType<ArgsProps, MessageSemanticClassNames>

export type ArgsStylesType = SemanticStylesType<ArgsProps, MessageSemanticStyles>

export interface ConfigOptions {
  top?: string | number
  duration?: number
  prefixCls?: string
  getContainer?: () => HTMLElement | ShadowRoot
  transitionName?: string
  maxCount?: number
  rtl?: boolean
  /**
   * @descCN 悬停时是否暂停计时器
   * @descEN keep the timer running or not on hover
   */
  pauseOnHover?: boolean
  classes?: ArgsClassNamesType
  styles?: ArgsStylesType
  appContext?: AppContext
}

export interface ArgsProps {
  /**
   * @descCN 消息通知的内容，接收组件或者字符串
   * @descEN The content of the message notification, receiving component or string
   */
  content: VueNode
  /**
   * @descCN 消息通知持续显示的时间
   * @descEN How long the message notification remains displayed
   */
  duration?: number
  /**
   * @descCN 消息通知的类型，可以是 'info'、'success'、'error'、'warning' 或 'loading'
   * @descEN The type of message notification, which can be 'info', 'success', 'error', 'warning' or 'loading'
   */
  type?: NoticeType
  /**
   * @descCN 消息通知关闭时进行调用的回调函数
   * @descEN The callback function called when the message notification is closed
   */
  onClose?: () => void
  icon?: VueNode
  key?: Key
  style?: CSSProperties
  class?: string
  classes?: ArgsClassNamesType
  styles?: ArgsStylesType
  /**
   * @descCN 消息通知点击时的回调函数
   * @descEN Callback function when message notification is clicked
   */
  onClick?: (e: MouseEvent) => void
  /**
   * @descCN 悬停时是否暂停计时器
   * @descEN keep the timer running or not on hover
   */
  pauseOnHover?: boolean
  /**
   * @descCN 消息通知的应用上下文
   * @descEN The application context of the message notification
   */
  appContext?: any
}

export type JointContent = VueNode | ArgsProps

export interface MessageType extends PromiseLike<boolean> {
  (): void
}

export type TypeOpen = (
  content: JointContent,
  /**
   * @descCN 消息通知持续显示的时间，也可以直接使用 onClose。
   * @descEN You can also use onClose directly to determine how long the message notification continues to be displayed.
   */
  duration?: number | VoidFunction,
  /**
   * @descCN 消息通知关闭时进行调用的回调函数
   * @descEN The callback function called when the message notification is closed
   */
  onClose?: VoidFunction,
) => MessageType

export interface MessageInstance {
  info: TypeOpen
  success: TypeOpen
  error: TypeOpen
  warning: TypeOpen
  loading: TypeOpen
  open: (args: ArgsProps) => MessageType
  destroy: (key?: Key) => void
}
