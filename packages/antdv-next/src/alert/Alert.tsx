import type { AriaAttributes, CSSProperties, SlotsType } from 'vue'
import type { SemanticType } from '../_util/hooks'
import type { ClosableType } from '../_util/hooks/useClosable'
import type { SlotsDefineType, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context'
import { CheckCircleFilled, CloseCircleFilled, CloseOutlined, ExclamationCircleFilled, InfoCircleFilled } from '@antdv-next/icons'
import { classNames, clsx } from '@v-c/util'
import { filterEmpty, getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { computed, defineComponent, shallowRef, Transition } from 'vue'
import { pureAttrs, useMergeSemanticNoRef } from '../_util/hooks'
import { getSlotPropFn, getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { useComponentBaseConfig } from '../config-provider/context'
import useStyle from './style'

export interface AlertSemanticType {
  classes: {
    root?: string
    icon?: string
    section?: string
    title?: string
    description?: string
    actions?: string
    close?: string
  }
  styles: {
    root?: CSSProperties
    icon?: CSSProperties
    section?: CSSProperties
    title?: CSSProperties
    description?: CSSProperties
    actions?: CSSProperties
    close?: CSSProperties
  }
}
export type AlertClassNamesType = SemanticType<AlertProps, AlertSemanticType['classes']>
export type AlertStylesType = SemanticType<AlertProps, AlertSemanticType['styles']>

export interface AlertProps extends ComponentBaseProps {
  /** Type of Alert styles, options:`success`, `info`, `warning`, `error` */
  type?: 'success' | 'info' | 'warning' | 'error'
  /** Whether Alert can be closed */
  closable?: ClosableType
  /** Content of Alert */
  title?: VueNode
  /**
   * @deprecated please use `title` instead.
   */
  message?: VueNode
  /** Additional content of Alert */
  description?: VueNode
  /** Trigger when animation ending of Alert */
  afterClose?: () => void
  /** Whether to show icon */
  showIcon?: boolean
  /** https://www.w3.org/TR/2014/REC-html5-20141028/dom.html#aria-role-attribute */
  role?: string
  classes?: AlertClassNamesType
  styles?: AlertStylesType
  banner?: boolean
  icon?: VueNode
  closeIcon?: VueNode
  action?: VueNode

  id?: string
}

export type AlertSlots = SlotsDefineType<{
  message?: () => any
  description?: () => any
  icon?: () => any
  closeIcon?: () => any
  action?: () => any
  title?: () => any
}>

export interface AlertEmits {
  /** Callback when close Alert */
  close: (e: any) => any
  mouseenter: (e: any) => any
  mouseleave: (e: any) => any
  click: (e: any) => any
}
interface IconNodeProps {
  type: AlertProps['type']
  icon?: AlertProps['icon']
  prefixCls: AlertProps['prefixCls']
  description: AlertProps['description']
  successIcon?: VueNode
  infoIcon?: VueNode
  warningIcon?: VueNode
  errorIcon?: VueNode
}
const alertDefaultProps = {
  showIcon: undefined,
} as any

const IconNode = defineComponent<IconNodeProps>(
  (props, { attrs }) => {
    return () => {
      const { type } = props
      const successIcon = getSlotPropsFnRun({}, props, 'successIcon')
      const icon = getSlotPropsFnRun({}, props, 'icon')
      const infoIcon = getSlotPropsFnRun({}, props, 'infoIcon')
      const warningIcon = getSlotPropsFnRun({}, props, 'warningIcon')
      const errorIcon = getSlotPropsFnRun({}, props, 'errorIcon')
      const { className, style } = getAttrStyleAndClass(attrs)
      const iconMapFilled = {
        success: successIcon ?? <CheckCircleFilled />,
        info: infoIcon ?? <InfoCircleFilled />,
        error: errorIcon ?? <CloseCircleFilled />,
        warning: warningIcon ?? <ExclamationCircleFilled />,
      }
      return (
        <span class={clsx(`${props.prefixCls}-icon`, className)} style={style}>
          {icon ?? iconMapFilled[type!]}
        </span>
      )
    }
  },
)

interface CloseIconProps {
  isClosable: boolean
  prefixCls: AlertProps['prefixCls']
  closeIcon: AlertProps['closeIcon']
  handleClose: (e: MouseEvent) => void
  ariaProps: AriaAttributes
}

const CloseIconNode = defineComponent<CloseIconProps>(
  (props, { slots, attrs }) => {
    return () => {
      const { isClosable, prefixCls, handleClose, ariaProps } = props
      const { className, style } = getAttrStyleAndClass(attrs)
      const closeIcon = getSlotPropsFnRun(slots, props, 'closeIcon')
      const mergedCloseIcon = !closeIcon ? <CloseOutlined /> : closeIcon
      return isClosable
        ? (
            <button
              type="button"
              onClick={handleClose}
              class={clsx(`${prefixCls}-close-icon`, className)}
              tabindex={0}
              style={style}
              {...ariaProps}
            >
              {mergedCloseIcon}
            </button>
          )
        : null
    }
  },
)
const Alert = defineComponent<
  AlertProps,
  AlertEmits,
  string,
  SlotsType<AlertSlots>
>(
  (props = alertDefaultProps, { slots, emit, attrs }) => {
    const {
      closable: contextClosable,
      closeIcon: contextCloseIcon,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      direction,
      prefixCls,
      successIcon,
      errorIcon,
      infoIcon,
      warningIcon,
    } = useComponentBaseConfig('alert', props, ['closable', 'closeIcon', 'successIcon', 'errorIcon', 'infoIcon', 'warningIcon'])
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')
    const closed = shallowRef(false)
    const internalRef = shallowRef<HTMLDivElement>()
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const handleClose = (e?: MouseEvent) => {
      closed.value = true
      emit('close', e)
    }

    const type = computed(() => {
      if (props.type) {
        return props.type
      }
      // banner mode defaults to 'warning'
      return props?.banner ? 'warning' : 'info'
    })
    const handleBeforeLeave = (el: Element) => {
      if (el) {
        const _el = el as HTMLDivElement
        _el.style.maxHeight = `${_el.offsetHeight}px`
      }
    }
    return () => {
      const { closable, banner, showIcon, rootClass } = props
      const { className, style } = getAttrStyleAndClass(attrs)
      // closeable when closeText or closeIcon is assigned
      const isClosableFn = () => {
        const closeIcon = getSlotPropsFnRun(slots, props, 'closeIcon')
        if (typeof closable === 'object' && closable.closeIcon)
          return true
        if (typeof closable === 'boolean') {
          return closable
        }

        const closeIconNode = typeof closeIcon === 'function' ? filterEmpty(closeIcon()) : closeIcon
        if (Array.isArray(closeIconNode) && closeIconNode.length > 0) {
          return true
        }
        if (closeIconNode) {
          return true
        }
        // should be true when closeIcon is 0 or ''
        if (closeIcon !== false && closeIcon !== null && closeIcon !== undefined) {
          return true
        }
        return !!contextClosable.value
      }
      const isClosable = isClosableFn()
      let message = getSlotPropsFnRun(slots, props, 'message')
      const title = getSlotPropsFnRun(slots, props, 'title')
      if (title) {
        message = title
      }
      const description = getSlotPropsFnRun(slots, props, 'description')
      const action = getSlotPropsFnRun(slots, props, 'action')
      // banner mode defaults to Icon
      const isShowIcon = banner && showIcon === undefined ? true : showIcon

      // =========== Merged Props for Semantic ==========
      const mergedProps: AlertProps = {
        ...props,
        prefixCls: prefixCls.value,
        type: type.value,
        showIcon: isShowIcon,
        closable: isClosable,
      }
      const [mergedClassNames, mergedStyles] = useMergeSemanticNoRef<
        AlertClassNamesType,
        AlertStylesType,
        AlertProps
      >([contextClassNames.value, classes.value], [contextStyles.value, styles.value], {
        props: mergedProps,
      })

      const alertCls = classNames(
        prefixCls.value,
        `${prefixCls.value}-${type.value}`,
        {
          [`${prefixCls.value}-with-description`]: !!description,
          [`${prefixCls.value}-no-icon`]: !isShowIcon,
          [`${prefixCls.value}-banner`]: !!banner,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        contextClassName.value,
        className,
        rootClass,
        mergedClassNames.root,
        cssVarCls.value,
        hashId.value,
      )
      const mergedCloseIconFn = () => {
        if (typeof closable === 'object' && closable.closeIcon) {
          return closable.closeIcon
        }
        const closeIcon = getSlotPropFn(slots, props, 'closeIcon')
        if (closeIcon) {
          return closeIcon
        }
        if (typeof contextClosable.value === 'object' && contextClosable.value) {
          return contextClosable.value
        }
        return contextCloseIcon.value
      }
      const mergedCloseIcon = mergedCloseIconFn()

      const mergedAriaPropsFn = () => {
        const merged = closable ?? contextClosable.value
        if (typeof merged === 'object') {
          const { closeIcon: _, ...ariaProps } = merged
          return ariaProps
        }
        return {}
      }
      const mergedAriaProps = mergedAriaPropsFn()

      return (
        <Transition
          name={`${prefixCls.value}-motion`}
          appear={false}
          leaveFromClass="ant-alert-motion-leave"
          leaveActiveClass="ant-alert-motion-leave ant-alert-motion-leave-active"
          leaveToClass="ant-alert-motion-leave ant-alert-motion-leave-active"
          onBeforeLeave={handleBeforeLeave}
          onAfterLeave={() => props?.afterClose?.()}
        >
          {!closed.value
            ? (
                <div
                  id={props.id}
                  ref={internalRef}
                  data-show={!closed.value}
                  role={props.role || 'alert'}
                  class={alertCls}
                  style={[
                    mergedStyles.root,
                    contextStyle.value,
                    style,
                  ]}
                  {...pureAttrs(attrs)}
                >
                  {isShowIcon
                    ? (
                        <IconNode
                          class={mergedClassNames.icon}
                          style={mergedStyles.icon}
                          description={description}
                          icon={props.icon}
                          prefixCls={prefixCls.value}
                          type={type.value}
                          successIcon={successIcon.value}
                          infoIcon={infoIcon.value}
                          warningIcon={warningIcon.value}
                          errorIcon={errorIcon.value}
                        />
                      )
                    : null}
                  <div
                    class={[`${prefixCls.value}-section`, mergedClassNames.section]}
                    style={mergedStyles.section}
                  >
                    {message
                      ? (
                          <div
                            class={[`${prefixCls.value}-title`, mergedClassNames.title]}
                            style={mergedStyles.title}
                          >
                            {message}
                          </div>
                        )
                      : null}
                    {description
                      ? (
                          <div
                            class={[`${prefixCls.value}-description`, mergedClassNames.description]}
                            style={mergedStyles.description}
                          >
                            {description}
                          </div>
                        )
                      : null}
                  </div>
                  {action
                    ? (
                        <div
                          class={[`${prefixCls.value}-actions`, mergedClassNames.actions]}
                          style={mergedStyles.actions}
                        >
                          {action}
                        </div>
                      )
                    : null}
                  <CloseIconNode
                    class={mergedClassNames.close}
                    style={mergedStyles.close}
                    isClosable={isClosable}
                    prefixCls={prefixCls.value}
                    ariaProps={mergedAriaProps}
                    handleClose={handleClose}
                    closeIcon={mergedCloseIcon}
                  />
                </div>
              )
            : null }
        </Transition>

      )
    }
  },
  {
    name: 'AAlert',
    inheritAttrs: false,
  },
)
;(Alert as any).install = (app: any) => {
  app.component(Alert.name, Alert)
}
export default Alert
