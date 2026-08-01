import type { TooltipClassNamesType, TooltipProps, TooltipStylesType } from '.'
import { Popup } from '@v-c/tooltip'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit/compat'
import { computed, defineComponent } from 'vue'
import { useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import useStyle from './style'
import { parseColor } from './util.ts'

export interface PurePanelProps extends TooltipProps {
}

const defaults = {
  placement: 'top',
} as any

/** @private Internal Component. Do not use in your production. */
const PurePanel = defineComponent<PurePanelProps>(
  (props = defaults, { attrs, slots }) => {
    const { prefixCls, rootPrefixCls } = useComponentBaseConfig('tooltip', props)
    const rootCls = useCSSVarCls(prefixCls)
    const { placement, classes, styles } = toPropsRefs(props, 'placement', 'classes', 'styles')
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const mergedProps = computed(() => ({
      ...props,
      placement: placement.value,
    }))
    const colorInfo = computed(() => parseColor(rootPrefixCls.value, prefixCls.value, props.color))

    const innerStyles = computed(() => {
      const mergedStyle = {
        ...colorInfo.value.overlayStyle,
      }
      return { container: mergedStyle }
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TooltipClassNamesType,
      TooltipStylesType,
      TooltipProps
    >(useToArr(classes), useToArr(innerStyles, styles as any), useToProps(mergedProps))

    return () => {
      const arrowContentStyle = colorInfo.value.arrowStyle
      const title = getSlotPropsFnRun(slots, props, 'title')
      const rootClassName = clsx(
        rootCls.value,
        hashId.value,
        cssVarCls.value,
        prefixCls.value,
        `${prefixCls.value}-pure`,
        `${prefixCls.value}-placement-${placement.value}`,
        (attrs as any).class,
        colorInfo.value.className,
      )
      return (
        <div class={rootClassName} style={arrowContentStyle}>
          <div class={`${prefixCls.value}-arrow`} />
          <Popup
            {...omit(props, ['class'])}
            className={hashId.value}
            prefixCls={prefixCls.value}
            classNames={mergedClassNames.value}
            styles={mergedStyles.value}
          >
            {title}
          </Popup>
        </div>
      )
    }
  },
  {
    name: 'TooltipPurePanel',
    inheritAttrs: false,
  },
)
export default PurePanel
