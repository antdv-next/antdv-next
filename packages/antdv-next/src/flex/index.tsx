import type { App, CSSProperties, SlotsType } from 'vue'
import type { EmptyEmit } from '../_util/type.ts'
import type { FlexProps } from './interface.ts'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, createVNode, defineComponent } from 'vue'
import { isPresetSize } from '../_util/gapSize'
import { useConfig } from '../config-provider'
import useStyle from './style'
import createFlexClassNames from './utils'

const defaultFlexProps = {
  vertical: undefined,
}

export interface FlexSlots {
  default: () => any
}
const Flex = defineComponent<FlexProps, EmptyEmit, string, SlotsType<FlexSlots>>(
  (props = defaultFlexProps, { slots, attrs }) => {
    const configCtx = useConfig()
    const prefixCls = computed(() => configCtx.value.getPrefixCls('flex', props.prefixCls))
    const [hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const {
        rootClass,
        flex,
        gap,
        vertical,
        component = 'div',
      } = props
      const ctxFlex = configCtx.value?.flex
      const mergedVertical = vertical ?? ctxFlex?.vertical
      const ctxDirection = configCtx.value?.direction

      const mergedCls = classNames(
        rootClass,
        ctxFlex?.class,
        prefixCls.value,
        hashId.value,
        cssVarCls.value,
        createFlexClassNames(prefixCls.value, { ...props, vertical: mergedVertical }),
        {
          [`${prefixCls.value}-rtl`]: ctxDirection === 'rtl',
          [`${prefixCls.value}-gap-${gap}`]: isPresetSize(gap),
          [`${prefixCls.value}-vertical`]: mergedVertical,
        },
      )
      const mergedStyle: CSSProperties = {}
      if (flex) {
        mergedStyle.flex = flex
      }
      if (gap && !isPresetSize(gap)) {
        // 判断是否为数字
        mergedStyle.gap = /\d/.test(`${gap}`) ? `${gap}px` : gap
      }

      return createVNode(
        component,
        {
          class: [mergedCls, attrs.class],
          style: [mergedStyle, attrs.style],
          ...omit(attrs, ['class', 'style']),
        },
        {
          default: slots.default,
        },
      )
    }
  },
  {
    inheritAttrs: false,
    name: 'AFlex',
  },
)

;(Flex as any).install = (app: App) => {
  app.component(Flex.name, Flex)
}

export default Flex

export type { FlexProps }
