import type { SlotsType } from 'vue'
import type { Breakpoint } from '../_util/responsiveObserver'
import type { ModalClassNamesType, ModalEmits, ModalProps, ModalSlots, ModalStylesType, MousePosition } from './interface'
import { CloseOutlined } from '@antdv-next/icons'
import Dialog from '@v-c/dialog'
import { clsx } from '@v-c/util'
import { getTransitionName } from '@v-c/util/dist/utils/transition'
import { omit } from 'es-toolkit'
import { computed, defineComponent } from 'vue'
import { ContextIsolator } from '../_util/ContextIsolator.tsx'
import { getAttrStyleAndClass, useMergedMask, useMergeSemantic, useToArr, useToProps, useZIndex } from '../_util/hooks'
import useClosable, { pickClosable } from '../_util/hooks/useClosable.tsx'
import { canUseDocElement } from '../_util/styleChecker'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import { ZIndexProvider } from '../_util/zindexContext.ts'
import { useBaseConfig, useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import useFocusable from '../drawer/useFocusable.ts'
import Skeleton from '../skeleton'
import { usePanelRef } from '../watermark/context.ts'
import { Footer, renderCloseIcon } from './shared.tsx'
import useStyle from './style'

let mousePosition: MousePosition

// ref: https://github.com/ant-design/ant-design/issues/15795
function getClickPosition(e: MouseEvent) {
  mousePosition = {
    x: e.pageX,
    y: e.pageY,
  }
  // 100ms 内发生过点击事件，则从点击位置动画展示
  // 否则直接 zoom 展示
  // 这样可以兼容非点击方式展开
  setTimeout(() => {
    mousePosition = null
  }, 100)
}

// 只有点击事件支持从鼠标位置动画展开
if (canUseDocElement()) {
  document.documentElement.addEventListener('click', getClickPosition, true)
}

const defaults = {
  focusTriggerAfterClose: true,
  width: 520,
} as any

const Modal = defineComponent<
  ModalProps,
  ModalEmits,
  string,
  SlotsType<ModalSlots>
>(
  (props = defaults, { slots, attrs, emit }) => {
    const {
      getPopupContainer: getContextPopupContainer,
      getPrefixCls,
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      centered: contextCentered,
      cancelButtonProps: contextCancelButtonProps,
      okButtonProps: contextOkButtonProps,
      mask: contextMask,
    } = useComponentBaseConfig('modal', props, [
      'centered',
      'cancelButtonProps',
      'okButtonProps',
      'mask',
    ])

    const {
      mask: modalMask,
      classes,
      styles,
      zIndex: customZIndex,
      width: widthRef,
      rootClass: rootClassRef,
      rootStyle: rootStyleRef,
      panelRef: panelRefRef,
      focusable,
      focusTriggerAfterClose,
      maskClosable,
    } = toPropsRefs(
      props,
      'mask',
      'classes',
      'styles',
      'zIndex',
      'width',
      'rootClass',
      'rootStyle',
      'panelRef',
      'focusable',
      'focusTriggerAfterClose',
      'maskClosable',
    )
    const { modal: modalContext } = useBaseConfig()
    const modalRenderRef = computed(() => slots.modalRender || props.modalRender)
    const rootPrefixCls = computed(() => getPrefixCls())
    const closableContext = computed(() => {
      const { closable } = props
      if (typeof closable === 'boolean') {
        return [undefined, undefined]
      }
      return [closable?.afterClose, closable?.onClose]
    })
    // ============================ Mask ============================
    const [mergedMask, maskBlurClassName, mergeMaskClosable] = useMergedMask(modalMask, contextMask, prefixCls, maskClosable)

    // ========================== Focusable =========================
    const mergedFocusable = useFocusable(focusable, mergedMask, focusTriggerAfterClose)

    const onClose = () => {
      closableContext.value?.[1]?.()
    }

    const handleCancel = (e: MouseEvent) => {
      if (props.confirmLoading) {
        return
      }
      emit('cancel', e)
      emit('update:open', false)
      onClose()
    }

    const handleOk = (e: MouseEvent) => {
      emit('ok', e)
      onClose()
    }

    if (isDev) {
      const warning = devUseWarning('Modal');
      [
        ['bodyStyle', 'styles.body'],
        ['maskStyle', 'styles.mask'],
        ['destroyOnClose', 'destroyOnHidden'],
      ].forEach(([deprecatedName, newName]) => {
        warning.deprecated(!((props as any)[deprecatedName!] !== undefined), deprecatedName!, newName!)
      })
    }

    // Style
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const closableProps = computed(() => ({
      ...props,
      closeIcon: getSlotPropsFnRun(slots, props, 'closeIcon', false),
    }))

    const closableIconContext = useClosable(
      pickClosable(closableProps as any) as any,
      pickClosable(modalContext as any) as any,
      computed(() => {
        return {
          closable: true,
          closeIcon: <CloseOutlined class={`${prefixCls.value}-close-icon`} />,
          closeIconRender: icon => renderCloseIcon(prefixCls.value, icon as any),
        }
      }),
    )

    const [zIndex, contextZIndex] = useZIndex('Modal', customZIndex)

    const mergedProps = computed(() => ({
      ...props,
      mask: mergedMask.value,
      zIndex: zIndex.value,
      focusTriggerAfterClose: mergedFocusable.value?.focusTriggerAfterClose,
      focusable: mergedFocusable.value,
      maskClosable: maskClosable.value,
    }) as ModalProps)

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ModalClassNamesType,
      ModalStylesType,
      ModalProps
    >(
      useToArr(contextClassNames, classes, maskBlurClassName),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    const numWidth = computed(() => {
      if (widthRef.value && typeof widthRef.value === 'object') {
        return undefined
      }
      return widthRef.value
    })

    const responsiveWidth = computed<Partial<Record<Breakpoint, string | number>> | undefined>(() => {
      if (widthRef.value && typeof widthRef.value === 'object') {
        return widthRef.value
      }
      return undefined
    })

    const responsiveWidthVars = computed(() => {
      const vars: Record<string, string> = {}
      if (responsiveWidth.value) {
        Object.keys(responsiveWidth.value).forEach((breakpoint) => {
          const breakpointWidth = responsiveWidth.value?.[breakpoint as Breakpoint]
          if (breakpointWidth !== undefined) {
            vars[`--${prefixCls.value}-${breakpoint}-width`] = typeof breakpointWidth === 'number'
              ? `${breakpointWidth}px`
              : breakpointWidth
          }
        })
      }
      return vars
    })

    const panelSelector = computed(() => `.${prefixCls.value}-${modalRenderRef.value ? 'render' : 'container'}`)
    const innerPanelRef = usePanelRef(panelSelector)
    const mergedPanelRef = (instance: any) => {
      innerPanelRef(instance)
      const panelRef = panelRefRef?.value
      if (typeof panelRef === 'function') {
        panelRef(instance)
      }
      else if (panelRef && typeof panelRef === 'object') {
        (panelRef as any).value = instance
      }
    }
    return () => {
      const {
        wrapClassName,
        centered,
        loading,
        confirmLoading,
        destroyOnHidden,
        destroyOnClose,
        getContainer: customizeGetContainer,
      } = props
      const { className, style: attrStyle, restAttrs } = getAttrStyleAndClass(attrs)
      const wrapClassNameExtended = clsx(wrapClassName, {
        [`${prefixCls.value}-centered`]: centered ?? contextCentered.value,
        [`${prefixCls.value}-wrap-rtl`]: direction.value === 'rtl',
      })
      const [rawClosable, mergedCloseIcon, closeBtnIsDisabled, ariaProps] = closableIconContext.value as any
      const [closableAfterClose] = closableContext.value

      const mergedClosable = rawClosable
        ? {
            disabled: closeBtnIsDisabled,
            closeIcon: mergedCloseIcon,
            afterClose: () => {
              closableAfterClose?.()
            },
            ...ariaProps,
          }
        : false

      const mergedModalRender = modalRenderRef.value
        ? (node: any) => (
            <div class={`${prefixCls.value}-render`}>
              {getSlotPropsFnRun(slots, { modalRender: modalRenderRef.value }, 'modalRender', true, node)}
            </div>
          )
        : undefined

      const mergedOkButtonProps = { ...contextOkButtonProps.value, ...props.okButtonProps }
      const mergedCancelButtonProps = { ...contextCancelButtonProps.value, ...props.cancelButtonProps }

      const footer = slots?.footer ?? props?.footer
      const okText = slots?.okText ?? props?.okText
      const cancelText = slots?.cancelText ?? props?.cancelText

      const dialogFooter = props.footer !== null && !loading
        ? (
            <Footer
              confirmLoading={confirmLoading}
              okType={props.okType}
              okText={okText}
              cancelText={cancelText}
              okButtonProps={mergedOkButtonProps}
              cancelButtonProps={mergedCancelButtonProps}
              footer={footer}
              onOk={handleOk}
              onCancel={handleCancel}
            />
          )
        : null

      const restProps = omit(props as any, [
        'open',
        'prefixCls',
        'rootClass',
        'rootStyle',
        'wrapClassName',
        'centered',
        'width',
        'footer',
        'class',
        'style',
        'classes',
        'styles',
        'loading',
        'confirmLoading',
        'okButtonProps',
        'cancelButtonProps',
        'mask',
        'zIndex',
        'modalRender',
        'closeIcon',
        'destroyOnHidden',
        'destroyOnClose',
        'mousePosition',
        'focusTriggerAfterClose',
        'panelRef',
        'focusable',
      ] as any)

      const titleNode = getSlotPropsFnRun(slots, props, 'title')
      const mergedClassName = clsx(hashId.value, contextClassName.value, className)
      const mergedRootClassName = clsx(
        hashId.value,
        rootClassRef.value,
        cssVarCls.value,
        rootCls.value,
        mergedClassNames.value.root,
      )

      const getContainer
      // 有可能为 false，所以不能直接判断
        = customizeGetContainer === undefined
          ? getContextPopupContainer
          : customizeGetContainer
      return (
        <ContextIsolator form space>
          <ZIndexProvider value={contextZIndex.value}>
            <Dialog
              {...omit(restAttrs, ['content']) as any}
              {...restProps as any}
              width={numWidth.value}
              zIndex={zIndex.value}
              getContainer={getContainer}
              prefixCls={prefixCls.value}
              rootClassName={mergedRootClassName}
              rootStyle={{ ...rootStyleRef.value, ...mergedStyles.value.root }}
              footer={dialogFooter}
              title={titleNode}
              visible={props.open}
              mousePosition={props.mousePosition ?? mousePosition}
              onClose={handleCancel as any}
              closable={mergedClosable as any}
              closeIcon={mergedCloseIcon}
              focusTriggerAfterClose={mergedFocusable.value?.focusTriggerAfterClose}
              focusTrap={mergedFocusable.value?.trap}
              transitionName={getTransitionName(rootPrefixCls.value, 'zoom', props.transitionName)}
              maskTransitionName={getTransitionName(rootPrefixCls.value, 'fade', props.maskTransitionName)}
              mask={mergedMask.value}
              maskClosable={mergeMaskClosable.value}
              className={mergedClassName}
              style={{ ...contextStyle.value, ...responsiveWidthVars.value, ...attrStyle }}
              classNames={{
                ...mergedClassNames.value,
                wrapper: clsx(mergedClassNames.value.wrapper, wrapClassNameExtended),
              }}
              styles={mergedStyles.value}
              panelRef={mergedPanelRef}
              destroyOnHidden={destroyOnHidden ?? destroyOnClose}
              modalRender={mergedModalRender}
            >
              {loading
                ? (
                    <Skeleton
                      active
                      title={false}
                      paragraph={{ rows: 4 }}
                      class={`${prefixCls.value}-body-skeleton`}
                    />
                  )
                : slots.default?.()}
            </Dialog>
          </ZIndexProvider>
        </ContextIsolator>
      )
    }
  },
  {
    name: 'AModal',
    inheritAttrs: false,
  },
)

export default Modal
