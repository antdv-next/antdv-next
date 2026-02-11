import type { SlotsType } from 'vue'
import type { EmptyEmit } from '../_util/type.ts'
import type { ThemeConfig } from '../config-provider/context'
import type { ModalFuncProps, ModalLocale } from './interface'
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, InfoCircleFilled } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { getTransitionName } from '@v-c/util/dist/utils/transition'
import { computed, defineComponent } from 'vue'
import { CONTAINER_MAX_OFFSET, normalizeMaskConfig } from '../_util/hooks'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context'
import ConfigProvider from '../config-provider/index'
import useLocale from '../locale/useLocale'
import { useToken } from '../theme/internal'
import ConfirmCancelBtn from './components/ConfirmCancelBtn'
import ConfirmOkBtn from './components/ConfirmOkBtn'
import { useModalProvider } from './context'
import { getConfirmLocale } from './locale'
import Modal from './Modal'
import Confirm from './style/confirm'

export interface ConfirmDialogProps extends ModalFuncProps {
  prefixCls: string
  afterClose?: () => void
  close?: (...args: any[]) => void
  /**
   * `close` prop support `...args` that pass to the developer
   * that we can not break this.
   * Provider `onClose` for internal usage
   */
  onConfirm?: (confirmed: boolean) => void
  autoFocusButton?: null | 'ok' | 'cancel'
  rootPrefixCls?: string
  iconPrefixCls?: string

  /**
   * Only passed by static method
   */
  theme?: ThemeConfig

  /** @private Internal Usage. Do not override this */
  locale?: ModalLocale

  /**
   * Do not throw if is await mode
   */
  isSilent?: () => boolean
}

export const ConfirmContent = defineComponent<
  ConfirmDialogProps & { confirmPrefixCls: string },
  EmptyEmit,
  string,
  SlotsType<{ default?: () => any }>
>(
  (props) => {
    if (isDev) {
      const { icon } = props
      const warning = devUseWarning('Modal')
      warning(
        !(typeof icon === 'string' && (icon as any)?.length > 2),
        'breaking',
        `\`icon\` is using VueNode instead of string naming in v4. Please check \`${icon as any}\` at https://ant.design/components/icon`,
      )
    }

    const mergedType = computed(() => {
      const { type } = props
      return type || 'confirm'
    })

    const mergedOkCancel = computed(() => {
      const okCancel = props.okCancel
      return okCancel ?? mergedType.value === 'confirm'
    })
    const autoFocusButton = props.autoFocusButton === null ? false : props.autoFocusButton || 'ok'

    const [locale] = useLocale('Modal', getConfirmLocale())
    const mergedLocale = computed(() => props.locale || locale?.value)
    const okTextLocale = computed(() => props?.okText ?? (mergedOkCancel ? mergedLocale.value?.okText : mergedLocale.value?.justOkText))
    const cancelTextLocale = computed(() => props?.cancelText ?? mergedLocale.value?.cancelText)

    const { closable } = props
    const { onClose } = closable && typeof closable === 'object' ? closable : {}

    const memoizedValue = computed(() => ({
      autoFocusButton,
      cancelTextLocale: cancelTextLocale.value,
      okTextLocale: okTextLocale.value,
      mergedOkCancel,
      onClose,
      ...props,
    }))

    useModalProvider(memoizedValue as any)

    return () => {
      const {
        confirmPrefixCls,
        footer,
      } = props
      const content = getSlotPropsFnRun({}, props, 'content', false)
      const icon = getSlotPropsFnRun({}, props, 'icon', false)
      const title = getSlotPropsFnRun({}, props, 'title', false)
      let mergedIcon = icon as any
      if (!icon && icon !== null) {
        switch (mergedType.value) {
          case 'info':
            mergedIcon = <InfoCircleFilled />
            break
          case 'success':
            mergedIcon = <CheckCircleFilled />
            break
          case 'error':
            mergedIcon = <CloseCircleFilled />
            break
          default:
            mergedIcon = <ExclamationCircleFilled />
        }
      }

      const hasTitle = title !== undefined && title !== null
      const bodyCls = `${confirmPrefixCls}-body`

      const footerOriginNode = (
        <>
          <ConfirmCancelBtn />
          <ConfirmOkBtn />
        </>
      )
      return (
        <div class={`${confirmPrefixCls}-body-wrapper`}>
          <div class={clsx(bodyCls, { [`${bodyCls}-has-title`]: hasTitle })}>
            {mergedIcon}
            <div class={`${confirmPrefixCls}-paragraph`}>
              {hasTitle && <span class={`${confirmPrefixCls}-title`}>{title}</span>}
              <div class={`${confirmPrefixCls}-content`}>{content}</div>
            </div>
          </div>
          {footer === undefined || typeof footer === 'function'
            ? (
                <div class={`${confirmPrefixCls}-btns`}>
                  {typeof footer === 'function'
                    ? footer({ originNode: footerOriginNode, extra: { OkBtn: ConfirmOkBtn, CancelBtn: ConfirmCancelBtn } })
                    : footerOriginNode}
                </div>
              )
            : footer}
          <Confirm prefixCls={props.prefixCls} />
        </div>
      )
    }
  },
  {
    name: 'ConfirmContent',
    inheritAttrs: false,
  },
)

const defaults = {
  closable: false,
} as any

const ConfirmDialog = defineComponent<ConfirmDialogProps>(
  (props = defaults) => {
    const {
      cancelButtonProps: contextCancelButtonProps,
      okButtonProps: contextOkButtonProps,
    } = useComponentBaseConfig('modal', props, ['okButtonProps', 'cancelButtonProps'])

    if (isDev) {
      const warning = devUseWarning('Modal')
      ;[
        ['bodyStyle', 'styles.body'],
        ['maskStyle', 'styles.mask'],
      ].forEach(([deprecatedName, newName]) => {
        warning.deprecated(!((props as any)[deprecatedName!] !== undefined), deprecatedName!, newName!)
      })
    }
    const [, token] = useToken()
    const mergedZIndex = computed(() => props.zIndex ?? token.value.zIndexPopupBase + CONTAINER_MAX_OFFSET)

    return () => {
      const {
        close,
        maskStyle,
        direction,
        prefixCls,
        wrapClassName,
        rootPrefixCls,
        bodyStyle,
        closable = false,
        styles,
        title,
        class: className,
        style,
        width = 416,
        type,
        maskClosable: customMaskClosable,
        mask,
        ...restProps
      } = props

      const confirmPrefixCls = `${prefixCls}-confirm`

      const mergedMaskFn = () => {
        const nextMaskConfig = normalizeMaskConfig(mask, customMaskClosable)
        nextMaskConfig.closable ??= false
        return nextMaskConfig
      }

      const mergedMask = mergedMaskFn()

      const mergedType = type || 'confirm'
      const classString = clsx(
        confirmPrefixCls,
        `${confirmPrefixCls}-${mergedType}`,
        { [`${confirmPrefixCls}-rtl`]: direction === 'rtl' },
        className,
      )

      return (
        <Modal
          {...restProps as any}
          class={classString}
          wrapClassName={clsx({ [`${confirmPrefixCls}-centered`]: !!props.centered }, wrapClassName)}
          onCancel={() => {
            close?.({ triggerCancel: true })
            props.onConfirm?.(false)
          }}
          title={title}
          footer={null}
          transitionName={getTransitionName(rootPrefixCls || '', 'zoom', props.transitionName)}
          maskTransitionName={getTransitionName(rootPrefixCls || '', 'fade', props.maskTransitionName)}
          mask={mergedMask}
          style={style as any}
          styles={{ body: bodyStyle, mask: maskStyle, ...styles }}
          width={width}
          zIndex={mergedZIndex.value}
          closable={closable}
        >
          <ConfirmContent
            {...props}
            confirmPrefixCls={confirmPrefixCls}
            okButtonProps={{ ...contextOkButtonProps.value, ...props.okButtonProps }}
            cancelButtonProps={{ ...contextCancelButtonProps.value, ...props.cancelButtonProps }}
          />
        </Modal>
      )
    }
  },
  {
    name: 'ConfirmDialog',
    inheritAttrs: false,
  },
)

const ConfirmDialogWrapper = defineComponent<ConfirmDialogProps>(
  (props) => {
    return () => {
      const { rootPrefixCls, iconPrefixCls, direction, theme } = props
      return (
        <ConfigProvider
          prefixCls={rootPrefixCls}
          iconPrefixCls={iconPrefixCls}
          direction={direction}
          theme={theme}
        >
          <ConfirmDialog {...props} />
        </ConfigProvider>
      )
    }
  },
  {
    name: 'ConfirmDialogWrapper',
    inheritAttrs: false,
  },
)

export default ConfirmDialogWrapper
