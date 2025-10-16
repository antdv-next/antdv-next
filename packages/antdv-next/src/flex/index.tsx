import type { App, CSSProperties, SlotsType } from 'vue'
import type { FlexProps } from './interface.ts'
import { classNames } from '@v-c/util'
import { computed, createVNode, defineComponent } from 'vue'
import { isPresetSize } from '../_util/gapSize.ts'
import { useConfig } from '../config-provider/context.ts'
import useStyle from './style'
import createFlexClassNames from './utils.ts'

const defaultFlexProps = {
  vertical: undefined,
}

export interface FlexSlots {
  default: () => any
}
const Flex = defineComponent<FlexProps, Record<string, any>, string, SlotsType<FlexSlots>>(
  (props = defaultFlexProps, { slots, attrs }) => {
    const configCtx = useConfig()
    const prefixCls = computed(() => configCtx.value.getPrefixCls('flex', props.prefixCls))
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls.value)

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
        hashId,
        cssVarCls,
        createFlexClassNames(prefixCls.value, props),
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
        mergedStyle.gap = gap
      }

      return wrapCSSVar(createVNode(
        component,
        {
          class: mergedCls,
          ...attrs,
        },
        {
          default: slots.default,
        },
      ))
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
