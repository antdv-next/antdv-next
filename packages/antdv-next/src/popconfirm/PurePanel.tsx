import type { CSSProperties } from 'vue'
import type { PopconfirmProps } from '.'
import type { ButtonProps } from '../button'
import type { PopoverSemanticClassNames, PopoverSemanticStyles } from '../popover'
import { ExclamationCircleFilled } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { computed, defineComponent } from 'vue'
import ActionButton from '../_util/ActionButton'
import Button from '../button'
import { useComponentBaseConfig, useConfig } from '../config-provider/context'
import defaultLocale from '../locale/en_US'
import useLocale from '../locale/useLocale'
import PopoverPurePanel from '../popover/PurePanel'
import useStyle from './style'

export interface PopconfirmLocale {
  okText: string
  cancelText: string
}

export interface OverlayProps
  extends Pick<
    PopconfirmProps,
    | 'icon'
    | 'okButtonProps'
    | 'cancelButtonProps'
    | 'cancelText'
    | 'okText'
    | 'okType'
    | 'showCancel'
    | 'title'
    | 'description'
  > {
  prefixCls: string
  close?: (...args: any[]) => void
  onConfirm?: (e?: MouseEvent) => void
  onCancel?: (e?: MouseEvent) => void
  onPopupClick?: (e: MouseEvent) => void
  classes?: PopoverSemanticClassNames
  styles?: PopoverSemanticStyles
}

export const Overlay = defineComponent<OverlayProps>(
  (props) => {
    const config = useConfig()
    const btnPrefixCls = computed(() => config.value?.getPrefixCls?.('btn') ?? 'ant-btn')
    const [contextLocale] = useLocale('Popconfirm', defaultLocale.Popconfirm)

    return () => {
      const {
        prefixCls,
        icon = <ExclamationCircleFilled />,
        title,
        description,
        cancelText,
        okText,
        okType = 'primary',
        okButtonProps,
        cancelButtonProps,
        showCancel = true,
        close,
        onConfirm,
        onCancel,
        onPopupClick,
        classes,
        styles,
      } = props
      const cancelButtonAttrs: ButtonProps = {
        size: 'small',
        ...(cancelButtonProps ?? {}),
      }
      const okButtonAttrs: ButtonProps = {
        size: 'small',
        ...(okButtonProps ?? {}),
      }
      const mergedCancelText = cancelText ?? contextLocale?.value?.cancelText
      const mergedOkText = okText ?? contextLocale?.value?.okText
      const mergedShowCancel = showCancel !== false

      const handlePopupClick = (e: MouseEvent) => {
        onPopupClick?.(e)
      }

      return (
        <div class={`${prefixCls}-inner-content`} onClick={handlePopupClick}>
          <div class={`${prefixCls}-message`}>
            {icon && <span class={`${prefixCls}-message-icon`}>{icon}</span>}
            <div class={`${prefixCls}-message-text`}>
              {title && (
                <div class={clsx(`${prefixCls}-title`, classes?.title)} style={styles?.title}>
                  {title}
                </div>
              )}
              {description && (
                <div class={clsx(`${prefixCls}-description`, classes?.content)} style={styles?.content}>
                  {description}
                </div>
              )}
            </div>
          </div>
          <div class={`${prefixCls}-buttons`}>
            {mergedShowCancel && (
              <Button onClick={onCancel} {...cancelButtonAttrs}>
                {mergedCancelText}
              </Button>
            )}
            <ActionButton
              type={okType}
              actionFn={onConfirm}
              close={close}
              prefixCls={btnPrefixCls.value}
              buttonProps={okButtonAttrs}
              emitEvent
              quitOnNullishReturnValue
            >
              {mergedOkText}
            </ActionButton>
          </div>
        </div>
      )
    }
  },
  {
    name: 'APopconfirmOverlay',
    inheritAttrs: false,
  },
)

export interface PurePanelProps
  extends Omit<OverlayProps, 'prefixCls'>,
  Pick<PopconfirmProps, 'placement'> {
  class?: string
  style?: CSSProperties
}

const PurePanel = defineComponent<PurePanelProps>(
  (props) => {
    const { prefixCls } = useComponentBaseConfig('popconfirm', props as any)
    const [hashId, cssVarCls] = useStyle(prefixCls)

    return () => (
      <PopoverPurePanel
        placement={props.placement}
        class={clsx(prefixCls.value, hashId.value, cssVarCls.value, props.class)}
        style={props.style}
        content={<Overlay prefixCls={prefixCls.value} {...props} />}
      />
    )
  },
  {
    name: 'PopconfirmPurePanel',
    inheritAttrs: false,
  },
)

export default PurePanel
