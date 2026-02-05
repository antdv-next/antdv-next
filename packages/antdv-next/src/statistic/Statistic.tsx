import type { CSSProperties, SlotsType, VNodeChild } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { FormatConfig, valueType } from './utils.ts'
import { classNames } from '@v-c/util'
import pickAttrs from '@v-c/util/dist/pickAttrs'
import { computed, defineComponent, shallowRef } from 'vue'
import {

  useMergeSemantic,
  useToArr,
  useToProps,
} from '../_util/hooks'
import { clsx, getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import Skeleton from '../skeleton'
import StatisticNumber from './Number.tsx'
import useStyle from './style'

export type StatisticSemanticName = keyof StatisticSemanticClassNames
  & keyof StatisticSemanticStyles

export interface StatisticSemanticClassNames {
  root?: string
  content?: string
  title?: string
  header?: string
  prefix?: string
  suffix?: string
}

export interface StatisticSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
  title?: CSSProperties
  header?: CSSProperties
  prefix?: CSSProperties
  suffix?: CSSProperties
}

export type StatisticClassNamesType = SemanticClassNamesType<
  StatisticProps,
  StatisticSemanticClassNames
>

export type StatisticStylesType = SemanticStylesType<StatisticProps, StatisticSemanticStyles>

type StatisticRectProps = FormatConfig & ComponentBaseProps & {
  value?: valueType
  valueStyle?: CSSProperties
  valueRender?: (node: any) => VNodeChild
  title?: VueNode
  prefix?: VueNode
  suffix?: VueNode
  loading?: boolean
  classes?: StatisticClassNamesType
  styles?: StatisticStylesType
}

export type StatisticProps = StatisticRectProps

export interface StatisticEmits {
  mouseenter: (e: MouseEvent) => void
  mouseleave: (e: MouseEvent) => void
}

export interface StatisticSlots {
  default: () => any
  title: () => any
  prefix: () => any
  suffix: () => any
}

const defaults = {
  value: 0,
  decimalSeparator: '.',
  groupSeparator: ',',
  loading: false,
  title: undefined,
  suffix: undefined,
  prefix: undefined,
} as any

const Statistic = defineComponent<
  StatisticProps,
  StatisticEmits,
  string,
  SlotsType<StatisticSlots>
>(
  (props = defaults, { slots, attrs, emit, expose }) => {
    const {
      direction,
      prefixCls,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('statistic', props)
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const internalRef = shallowRef<HTMLDivElement>()
    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => props)
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      StatisticClassNamesType,
      StatisticStylesType,
      StatisticProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )
    expose({
      nativeElement: internalRef,
    })
    const handleMouseEnter = (e: MouseEvent) => {
      emit('mouseenter', e)
    }
    const handleMouseLeave = (e: MouseEvent) => {
      emit('mouseleave', e)
    }
    return () => {
      const {
        decimalSeparator,
        groupSeparator,
        formatter,
        precision,
        value,
        rootClass,
        loading,
        valueStyle,
        valueRender,
      } = props
      const title = getSlotPropsFnRun(slots, props, 'title')
      const prefix = getSlotPropsFnRun(slots, props, 'prefix')
      const suffix = getSlotPropsFnRun(slots, props, 'suffix')
      const valueNode = (
        <StatisticNumber
          decimalSeparator={decimalSeparator}
          groupSeparator={groupSeparator}
          prefixCls={prefixCls.value}
          formatter={formatter}
          precision={precision}
          value={value!}
        />
      )

      const cls = classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        contextClassName.value,
        (attrs as any).class,
        rootClass,
        mergedClassNames.value.root,
        hashId.value,
        cssVarCls.value,
      )
      const restProps = pickAttrs(attrs, { data: true, aria: true })

      const headerClassNames = clsx(`${prefixCls.value}-header`, mergedClassNames.value.header)

      const titleClassNames = clsx(`${prefixCls.value}-title`, mergedClassNames.value.title)

      const contentClassNames = clsx(`${prefixCls.value}-content`, mergedClassNames.value.content)

      const prefixClassNames = clsx(`${prefixCls.value}-content-prefix`, mergedClassNames.value.prefix)

      const suffixClassNames = clsx(`${prefixCls.value}-content-suffix`, mergedClassNames.value.suffix)
      return (
        <div
          {...restProps}
          ref={internalRef}
          class={cls}
          style={[mergedStyles.value.root, contextStyle.value, (attrs as any).style]}
          onMouseenter={handleMouseEnter}
          onMouseleave={handleMouseLeave}
        >
          {!!title && (
            <div class={headerClassNames} style={mergedStyles.value.header}>
              <div class={titleClassNames} style={mergedStyles.value.title}>{title}</div>
            </div>
          )}
          <Skeleton paragraph={false} loading={loading} class={`${prefixCls.value}-skeleton`} active>
            <div
              style={[valueStyle, mergedStyles.value.content]}
              class={contentClassNames}
            >
              {!!prefix && (
                <span
                  class={prefixClassNames}
                  style={mergedStyles.value.prefix}
                >
                  {prefix}
                </span>
              )}
              {valueRender ? valueRender(valueNode) : valueNode}
              {!!suffix && (
                <span
                  class={suffixClassNames}
                  style={mergedStyles.value.suffix}
                >
                  {suffix}
                </span>
              )}
            </div>
          </Skeleton>
        </div>
      )
    }
  },
  {
    name: 'AStatistic',
    inheritAttrs: false,
  },
)

export default Statistic
