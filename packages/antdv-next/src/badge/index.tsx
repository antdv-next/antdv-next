import type { LiteralUnion } from '@v-c/util/dist/type'
import type { App, CSSProperties, SlotsType, VNode } from 'vue'
import type { PresetStatusColorType } from '../_util/colors.ts'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { PresetColorKey } from '../theme/interface'
import type { RibbonProps } from './Ribbon.tsx'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { getTransitionProps } from '@v-c/util/dist/utils/transition'
import { cloneVNode, computed, defineComponent, shallowRef, Transition, watchEffect } from 'vue'
import { isPresetColor } from '../_util/colors.ts'

import {
  useMergeSemantic,
  useToArr,
  useToProps,
} from '../_util/hooks'
import { formatUnit } from '../_util/styleUtils.ts'
import { clsx, getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'

import Ribbon from './Ribbon.tsx'
import ScrollNumber from './ScrollNumber.tsx'
import useStyle from './style'

export type BadgeSemanticName = keyof BadgeSemanticClassNames & keyof BadgeSemanticStyles

export interface BadgeSemanticClassNames {
  root?: string
  indicator?: string
}

export interface BadgeSemanticStyles {
  root?: CSSProperties
  indicator?: CSSProperties
}

export type BadgeClassNamesType = SemanticClassNamesType<BadgeProps, BadgeSemanticClassNames>

export type BadgeStylesType = SemanticStylesType<BadgeProps, BadgeSemanticStyles>

export interface BadgeProps extends ComponentBaseProps {
  /** Number to show in badge */
  count?: VueNode
  showZero?: boolean
  /** Max count to show */
  overflowCount?: number
  /** Whether to show red dot without number */
  dot?: boolean
  scrollNumberPrefixCls?: string
  status?: PresetStatusColorType
  color?: LiteralUnion<PresetColorKey>
  text?: VueNode
  size?: 'default' | 'small'
  offset?: [number | string, number | string]
  title?: string
  classes?: BadgeClassNamesType
  styles?: BadgeStylesType
}

export interface BadgeSlots {
  default?: () => any
  count?: () => any
  text?: () => any
}

const defaultProps = {
  count: null,
  overflowCount: 99,
  size: 'default',
} as BadgeProps

const InternalBadge = defineComponent<
  BadgeProps,
  EmptyEmit,
  string,
  SlotsType<BadgeSlots>
>(
  (props = defaultProps, { slots, attrs, expose }) => {
    const {
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      prefixCls,
      direction,
      getPrefixCls,
    } = useComponentBaseConfig('badge', props)
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')

    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => props)
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      BadgeClassNamesType,
      BadgeStylesType,
      BadgeProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    const badgeRef = shallowRef<HTMLSpanElement>()
    expose({ badgeRef })
    const [hashId, cssVarCls] = useStyle(prefixCls)

    const numberedDisplayCount = computed(() => {
      const { count, overflowCount } = props
      return ((count as number) > (overflowCount as number) ? `${overflowCount}+` : count) as string | number | null
    })

    const isZero = computed(() => numberedDisplayCount.value === '0' || numberedDisplayCount.value === 0 || props.text === '0' || props.text === 0)
    const countNodes = computed(() => {
      const result = getSlotPropsFnRun(slots, props, 'count')
      if (!result) {
        return [] as VueNode[]
      }
      return Array.isArray(result) ? result : [result]
    })
    const textNodes = computed(() => {
      const result = getSlotPropsFnRun(slots, props, 'text')
      if (!result) {
        return [] as VueNode[]
      }
      return Array.isArray(result) ? result : [result]
    })
    const ignoreCount = computed(() => props.count === null || (isZero.value && !props.showZero))
    const hasStatus = computed(() => {
      const { status, color } = props
      return ((status !== null && status !== undefined) || (color !== null && color !== undefined)) && ignoreCount.value
    })
    const hasStatusValue = computed(() => (props.status !== null && props.status !== undefined) || !isZero.value)
    const showAsDot = computed(() => props.dot && !isZero.value)

    const mergedCount = computed(() => (showAsDot.value ? '' : numberedDisplayCount.value))
    const isHidden = computed(() => {
      const textEmpty = textNodes.value.length === 0 && (props.text === undefined || props.text === null || props.text === '')
      const isEmptyCount = (mergedCount.value === null || mergedCount.value === undefined || mergedCount.value === '') && countNodes.value.length === 0
      return (isEmptyCount || (isZero.value && !props.showZero)) && !showAsDot.value && textEmpty
    })

    const displayCountRef = shallowRef(mergedCount.value)
    const countCacheRef = shallowRef<VueNode | null>(props.count ?? null)
    const isDotRef = shallowRef(showAsDot.value)

    watchEffect(() => {
      if (!isHidden.value) {
        displayCountRef.value = mergedCount.value
      }
    })

    watchEffect(() => {
      if (!isHidden.value) {
        countCacheRef.value = countNodes.value[0] ?? null
      }
    })

    watchEffect(() => {
      if (!isHidden.value) {
        isDotRef.value = showAsDot.value
      }
    })

    // =============================== Styles ===============================
    const mergedStyle = computed(() => {
      if (!props.offset) {
        return { ...contextStyle.value, ...(attrs.style as CSSProperties) }
      }

      const horizontalOffset = Number.parseInt(props.offset[0] as string, 10)
      const insetInlineEnd = direction.value === 'rtl' ? horizontalOffset : -horizontalOffset
      const insetInlineEndUnit = formatUnit(insetInlineEnd)!

      const offsetStyle: CSSProperties = {
        marginTop: formatUnit(props.offset[1]),
        insetInlineEnd: insetInlineEndUnit,
      }
      return { ...contextStyle.value, ...offsetStyle, ...(attrs.style as CSSProperties) }
    })

    const displayCount = computed(() => displayCountRef.value)
    const isInternalColor = computed(() => isPresetColor(props.color, false))

    return () => {
      const { class: attrClass, style: attrStyle, ...restAttrs } = attrs
      const children = filterEmpty(slots.default?.() ?? [])
      let livingCount: any = countCacheRef.value
      if (typeof livingCount === 'function') {
        livingCount = livingCount()
      }
      const titleNode = props.title ?? (typeof livingCount === 'string' || typeof livingCount === 'number' ? livingCount : undefined)
      const hasTextSlot = textNodes.value.length > 0
      const showStatusTextNode = !isHidden.value && (hasTextSlot ? true : (props.text === 0 ? props.showZero : !!props.text && props.text !== true))

      const statusCls = clsx(
        mergedClassNames.value.indicator,
        {
          [`${prefixCls.value}-status-dot`]: hasStatus.value,
          [`${prefixCls.value}-status-${props.status}`]: !!props.status,
          [`${prefixCls.value}-color-${props.color}`]: isInternalColor.value,
        },
      )

      const badgeClassName = classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-status`]: hasStatus.value,
          [`${prefixCls.value}-not-a-wrapper`]: children.length === 0,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        (attrs as any).class,
        props.rootClass,
        contextClassName.value,
        mergedClassNames.value?.root,
        hashId.value,
        cssVarCls.value,
      )

      const statusStyle: CSSProperties = {}
      if (props.color && !isInternalColor.value) {
        statusStyle.background = props.color
        statusStyle.color = props.color
      }

      const renderStatusText = (style?: CSSProperties) => {
        if (!showStatusTextNode) {
          return null
        }
        return (
          <span class={`${prefixCls.value}-status-text`} style={style}>
            {hasTextSlot ? textNodes.value : props.text}
          </span>
        )
      }

      if (!children.length && hasStatus.value && (showStatusTextNode || hasStatusValue.value || !ignoreCount.value)) {
        const statusTextColor = mergedStyle.value?.color
        return (
          <span
            {...restAttrs}
            ref={badgeRef}
            class={badgeClassName}
            style={[mergedStyles.value.root, mergedStyle.value]}
          >
            <span
              class={statusCls}
              style={[mergedStyles.value.indicator, statusStyle]}
            />
            {renderStatusText({ color: statusTextColor })}
          </span>
        )
      }

      const scrollNumberCls = classNames(
        mergedClassNames.value.indicator,
        {
          [`${prefixCls.value}-dot`]: isDotRef.value,
          [`${prefixCls.value}-count`]: !isDotRef.value,
          [`${prefixCls.value}-count-sm`]: props.size === 'small',
          [`${prefixCls.value}-multiple-words`]: !isDotRef.value && displayCount.value && displayCount.value.toString().length > 1,
          [`${prefixCls.value}-status-${props.status}`]: !!props.status,
          [`${prefixCls.value}-color-${props.color}`]: isInternalColor.value,
        },
      )

      const scrollNumberPrefixCls = getPrefixCls('scroll-number', props.scrollNumberPrefixCls)

      const livingVNode = (livingCount && typeof livingCount === 'object') ? livingCount as VNode : null
      const clonedNode = livingVNode
        ? cloneVNode(livingVNode, {
            style: mergedStyle.value,
          })
        : undefined
      const scrollNumberStyle: CSSProperties = {}
      if (props.color && !isInternalColor.value) {
        scrollNumberStyle.background = props.color
      }

      return (
        <span
          {...restAttrs}
          ref={badgeRef}
          class={badgeClassName}
          style={mergedStyles.value.root}
        >
          {children}
          <Transition
            {
              ...getTransitionProps(`${prefixCls.value}-zoom`, { appear: false })
            }
          >
            {{
              default: () => (!isHidden.value
                ? (
                    <ScrollNumber
                      key="scrollNumber"
                      prefixCls={scrollNumberPrefixCls}
                      show={!isHidden.value}
                      class={scrollNumberCls}
                      count={displayCount.value}
                      title={titleNode}
                      style={[mergedStyles.value?.indicator, mergedStyle.value, scrollNumberStyle]}
                    >
                      {clonedNode}
                    </ScrollNumber>
                  )
                : null),
            }}
          </Transition>
          {renderStatusText()}
        </span>
      )
    }
  },
  {
    name: 'ABadge',
    inheritAttrs: false,
  },
)

const Badge = InternalBadge as typeof InternalBadge & {
  Ribbon: typeof Ribbon
}

Badge.Ribbon = Ribbon

export const BadgeRibbon = Ribbon

;(Badge as any).install = (app: App) => {
  app.component(InternalBadge.name, Badge)
  app.component(Ribbon.name, Ribbon)
}

export default Badge

export type BadgeRibbonProps = RibbonProps
