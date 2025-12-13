import type { DialogProps } from '@v-c/dialog'
import type { CSSProperties } from 'vue'
import type { MaskType, SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { ClosableType } from '../_util/hooks/useClosable'
import type { Breakpoint } from '../_util/responsiveObserver'
import type { VueNode } from '../_util/type'
import type { ButtonProps, LegacyButtonType } from '../button'
import type { DirectionType } from '../config-provider/context'

export type SemanticName
  = | 'root'
    | 'header'
    | 'body'
    | 'footer'
    | 'container'
    | 'title'
    | 'wrapper'
    | 'mask'

export type ModalClassNamesType = SemanticClassNamesType<ModalProps, SemanticName>

export type ModalStylesType = SemanticStylesType<ModalProps, SemanticName>

interface ModalCommonProps
  extends Omit<
    DialogProps,
    'footer'
    | 'width'
    | 'onClose'
    | 'animation'
    | 'maskAnimation'
    | 'transitionName'
    | 'maskTransitionName'
    | 'mask'
    | 'classNames'
    | 'styles'
    | 'modalRender'
    | 'rootStyle'
    | 'style'
  >
{
  footer?: VueNode | ((params: { originNode: VueNode, extra: { OkBtn: any, CancelBtn: any } }) => any)
  closable?: boolean | (Exclude<ClosableType, boolean> & { onClose?: () => void, afterClose?: () => void })
  classes?: ModalClassNamesType
  styles?: ModalStylesType
}

type getContainerFunc = () => HTMLElement

export interface ModalProps extends ModalCommonProps {
  /** Whether the modal dialog is visible or not */
  open?: boolean
  /** Whether to apply loading visual effect for OK button or not */
  confirmLoading?: boolean
  /** The modal dialog's title */
  title?: VueNode
  afterClose?: () => void
  /** Callback when the animation ends when Modal is turned on and off */
  afterOpenChange?: (open: boolean) => void
  /** Centered Modal */
  centered?: boolean
  /** Width of the modal dialog */
  width?: string | number | Partial<Record<Breakpoint, string | number>>
  /** Text of the OK button */
  okText?: VueNode
  /** Button `type` of the OK button */
  okType?: LegacyButtonType
  /** Text of the Cancel button */
  cancelText?: VueNode
  /** Whether to close the modal dialog when the mask (area outside the modal) is clicked */
  maskClosable?: boolean
  /** Force render Modal */
  forceRender?: boolean
  okButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
  /** @deprecated Please use `destroyOnHidden` instead */
  destroyOnClose?: boolean
  /**
   * @since 5.25.0
   */
  destroyOnHidden?: boolean
  wrapClassName?: string
  maskTransitionName?: string
  transitionName?: string
  rootClass?: string
  rootStyle?: CSSProperties
  getContainer?: string | HTMLElement | getContainerFunc | false
  zIndex?: number
  /** @deprecated Please use `styles.body` instead */
  bodyStyle?: CSSProperties
  /** @deprecated Please use `styles.mask` instead */
  maskStyle?: CSSProperties
  mask?: MaskType
  keyboard?: boolean
  wrapProps?: any
  prefixCls?: string
  closeIcon?: VueNode
  modalRender?: (node: any) => any
  focusTriggerAfterClose?: boolean
  mousePosition?: MousePosition
  /**
   * @since 5.18.0
   */
  loading?: boolean
}

export interface ModalEmits {
  /** Specify a function that will be called when a user clicks the OK button */
  'ok': (e: MouseEvent) => void
  /** Specify a function that will be called when a user clicks mask, close button on top right or Cancel button */
  'cancel': (e: MouseEvent) => void
  'update:open': (open: boolean) => void
  [key: string]: (...args: any[]) => void
}

export interface ModalSlots {
  title?: () => any
  okText?: () => any
  cancelText?: () => any
  closeIcon?: () => any
  modalRender?: (node: any) => any
  footer?: (params: { originNode: VueNode, extra: { OkBtn: any, CancelBtn: any } }) => any
  default?: () => any
}

export interface ModalFuncProps extends ModalCommonProps {
  prefixCls?: string
  class?: string
  rootClass?: string
  open?: boolean
  title?: VueNode
  content?: VueNode
  // TODO: find out exact types
  onOk?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
  onClose?: DialogProps['onClose']
  afterClose?: () => void
  okButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
  centered?: boolean
  width?: string | number
  okText?: VueNode
  okType?: LegacyButtonType
  cancelText?: VueNode
  icon?: VueNode
  mask?: MaskType
  maskClosable?: boolean
  zIndex?: number
  okCancel?: boolean
  style?: CSSProperties
  wrapClassName?: string
  /** @deprecated Please use `styles.mask` instead */
  maskStyle?: CSSProperties
  type?: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm'
  keyboard?: boolean
  getContainer?: string | HTMLElement | getContainerFunc | false
  autoFocusButton?: null | 'ok' | 'cancel'
  transitionName?: string
  maskTransitionName?: string
  direction?: DirectionType
  /** @deprecated Please use `styles.body` instead */
  bodyStyle?: CSSProperties
  closeIcon?: VueNode
  footer?: ModalProps['footer']
  modalRender?: ModalProps['modalRender']
  focusTriggerAfterClose?: boolean
}
export interface ModalLocale {
  okText: string
  cancelText: string
  justOkText: string
}
export type MousePosition = { x: number, y: number } | null
