import type { SlotsType } from 'vue'
import type { EmptyEmit } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context'
import { clsx } from '@v-c/util'
import { computed, defineComponent } from 'vue'
import { getAttrStyleAndClass } from '../_util/hooks'
import { devUseWarning, isDev } from '../_util/warning'
import { useConfig } from '../config-provider/context'
import { useFormItemInputContext, useFormItemInputContextProvider } from '../form/context.tsx'
import { SpaceCompact } from '../space'
import useStyle from './style'

export interface InputGroupProps extends ComponentBaseProps {
  size?: 'large' | 'small' | 'default'
  compact?: boolean
}

/** @deprecated Please use `Space.Compact` */
const InputGroup = defineComponent<
  InputGroupProps,
  EmptyEmit,
  string,
  SlotsType<{ default?: () => any }>
>(
  (props, { slots, attrs }) => {
    if (isDev) {
      const warning = devUseWarning('Input.Group')
      warning.deprecated(false, 'Input.Group', 'Space.Compact')
    }

    const configContext = useConfig()
    const prefixCls = computed(() => configContext.value.getPrefixCls('input-group', props.prefixCls))
    // Group styles live in the Input style, so register it with the input prefix (same as antd).
    const inputPrefixCls = computed(() => configContext.value.getPrefixCls('input'))
    const [hashId, cssVarCls] = useStyle(inputPrefixCls)

    const formItemContext = useFormItemInputContext()
    const groupFormContext = computed(() => ({
      ...formItemContext.value,
      isFormItemInput: false,
    }))
    useFormItemInputContextProvider(groupFormContext)

    return () => {
      const { size, compact, rootClass } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)

      const cls = clsx(
        prefixCls.value,
        cssVarCls.value,
        {
          [`${prefixCls.value}-lg`]: size === 'large',
          [`${prefixCls.value}-sm`]: size === 'small',
          [`${prefixCls.value}-compact`]: compact,
          [`${prefixCls.value}-rtl`]: configContext.value.direction === 'rtl',
        },
        hashId.value,
        rootClass,
        className,
      )

      return (
        <SpaceCompact {...restAttrs} class={cls} style={style}>
          {slots.default?.()}
        </SpaceCompact>
      )
    }
  },
  {
    name: 'AInputGroup',
    inheritAttrs: false,
  },
)

export default InputGroup
