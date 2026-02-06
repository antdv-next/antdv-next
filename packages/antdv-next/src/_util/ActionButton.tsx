import type { SlotsType } from 'vue'
import type { ButtonProps, LegacyButtonType } from '../button'
import type { EmptyEmit } from './type'
import { defineComponent, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import Button, { convertLegacyProps } from '../button'

function isThenable<T>(value?: PromiseLike<T>): value is PromiseLike<T> {
  return typeof value?.then === 'function'
}

export interface ActionButtonProps {
  type?: LegacyButtonType
  actionFn?: (...args: any[]) => any | PromiseLike<any>
  close?: (...args: any[]) => void
  autoFocus?: boolean
  prefixCls: string
  buttonProps?: ButtonProps
  emitEvent?: boolean
  quitOnNullishReturnValue?: boolean
  children?: any
  isSilent?: () => boolean
}

export interface ActionButtonSlots {
  default?: () => any
}

const ActionButton = defineComponent<
  ActionButtonProps,
  EmptyEmit,
  string,
  SlotsType<ActionButtonSlots>
>(
  (props, { slots }) => {
    const clicked = shallowRef(false)
    const loading = shallowRef<ButtonProps['loading']>(false)
    const buttonRef = shallowRef<any>()
    let autoFocusTimeout: ReturnType<typeof setTimeout> | null = null

    const focusButton = () => {
      const instance = buttonRef.value
      const element = instance?.$el ?? instance
      element?.focus?.({ preventScroll: true })
    }

    onMounted(() => {
      if (props.autoFocus) {
        autoFocusTimeout = setTimeout(() => {
          focusButton()
        })
      }
    })

    onBeforeUnmount(() => {
      if (autoFocusTimeout) {
        clearTimeout(autoFocusTimeout)
        autoFocusTimeout = null
      }
    })

    const onInternalClose = (...args: any[]) => {
      props.close?.(...args)
    }

    const handlePromiseOnOk = (returnValueOfOnOk?: PromiseLike<any>) => {
      if (!isThenable(returnValueOfOnOk)) {
        return
      }
      loading.value = true
      returnValueOfOnOk.then(
        (...args: any[]) => {
          loading.value = false
          clicked.value = false
          onInternalClose(...args)
        },
        (error: Error) => {
          loading.value = false
          clicked.value = false
          if (props.isSilent?.()) {
            return
          }
          return Promise.reject(error)
        },
      )
    }

    const onClick = (e: MouseEvent) => {
      if (clicked.value) {
        return
      }
      clicked.value = true

      const { actionFn } = props
      if (!actionFn) {
        onInternalClose()
        return
      }

      let returnValueOfOnOk: PromiseLike<any>
      if (props.emitEvent) {
        returnValueOfOnOk = actionFn(e)
        if (props.quitOnNullishReturnValue && !isThenable(returnValueOfOnOk)) {
          clicked.value = false
          onInternalClose(e)
          return
        }
      }
      else if (actionFn.length) {
        returnValueOfOnOk = actionFn(onInternalClose)
        clicked.value = false
      }
      else {
        returnValueOfOnOk = actionFn()
        if (!isThenable(returnValueOfOnOk)) {
          onInternalClose()
          return
        }
      }

      handlePromiseOnOk(returnValueOfOnOk)
    }

    return () => {
      const buttonAttrs = props.buttonProps ?? {}
      return (
        <Button
          {...convertLegacyProps(props.type)}
          prefixCls={props.prefixCls}
          loading={loading.value}
          ref={buttonRef}
          onClick={onClick}
          {...buttonAttrs}
        >
          {slots.default?.()}
        </Button>
      )
    }
  },
  {
    name: 'AActionButton',
    inheritAttrs: false,
  },
)

export default ActionButton
