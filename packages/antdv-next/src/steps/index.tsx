import type { StepsProps as VcStepsProps } from '@v-c/steps'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type'
import { CheckOutlined } from '@antdv-next/icons'
import VcSteps from '@v-c/steps'
import { clsx } from '@v-c/util'
import { getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { computed, defineComponent } from 'vue'
import { useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import Wave from '../_util/wave'
import { TARGET_CLS } from '../_util/wave/interface'
import { useComponentBaseConfig } from '../config-provider/context'
import { useSize } from '../config-provider/hooks/useSize'
import useBreakpoint from '../grid/hooks/useBreakpoint'
import { genCssVar } from '../theme/util/genStyleUtils'
import Tooltip from '../tooltip'
import { useInternalContext } from './context'
import PanelArrow from './PanelArrow'
import ProgressIcon from './ProgressIcon'
import useStyle from './style'

type RcIconRenderTypeInfo = Parameters<NonNullable<VcStepsProps['iconRender']>>[1]

export type IconRenderType = (params: { oriNode: any, info: Pick<RcIconRenderTypeInfo, 'index' | 'active' | 'item' | 'components'> }) => any

export type StepsSemanticName = keyof StepsSemanticClassNames & keyof StepsSemanticStyles

export interface StepsSemanticClassNames {
  root?: string
  item?: string
  itemWrapper?: string
  itemIcon?: string
  itemSection?: string
  itemHeader?: string
  itemTitle?: string
  itemSubtitle?: string
  itemContent?: string
  itemRail?: string
}

export interface StepsSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  itemWrapper?: CSSProperties
  itemIcon?: CSSProperties
  itemSection?: CSSProperties
  itemHeader?: CSSProperties
  itemTitle?: CSSProperties
  itemSubtitle?: CSSProperties
  itemContent?: CSSProperties
  itemRail?: CSSProperties
}

export type StepsClassNamesType = SemanticClassNamesType<StepsProps, StepsSemanticClassNames>

export type StepsStylesType = SemanticStylesType<StepsProps, StepsSemanticStyles>

export interface StepItem {
  class?: string
  style?: CSSProperties
  classes?: NonNullable<VcStepsProps['items']>[number]['classNames']
  styles?: NonNullable<VcStepsProps['items']>[number]['styles']

  /** @deprecated Please use `content` instead */
  description?: VueNode
  content?: VueNode
  icon?: VueNode
  onClick?: (e: MouseEvent) => void
  status?: 'wait' | 'process' | 'finish' | 'error'
  disabled?: boolean
  title?: VueNode
  subTitle?: VueNode
}

export type ProgressDotRender = (
  params: {
    iconDot: any
    info: {
      index: number
      status: NonNullable<VcStepsProps['status']>
      title: any
      /** @deprecated Please use `content` instead. */
      description: any
      content: any
    }
  },
) => any

export interface BaseStepsProps {
  // Style
  rootClass?: string
  classes?: StepsClassNamesType
  styles?: StepsStylesType
  variant?: 'filled' | 'outlined'
  size?: 'default' | 'small'

  // Layout
  type?: 'default' | 'navigation' | 'inline' | 'panel' | 'dot'
  /** @deprecated Please use `orientation` instead. */
  direction?: 'horizontal' | 'vertical'
  orientation?: 'horizontal' | 'vertical'
  /** @deprecated Please use `titlePlacement` instead. */
  labelPlacement?: 'horizontal' | 'vertical'
  titlePlacement?: 'horizontal' | 'vertical'
  /** @deprecated Please use `type` and `iconRender` instead. */
  progressDot?: boolean | ProgressDotRender
  responsive?: boolean
  ellipsis?: boolean

  /**
   * Set offset cell, only work when `type` is `inline`.
   */
  offset?: number

  // Data
  current?: number
  initial?: number
  items?: StepItem[]
  percent?: number
  status?: 'wait' | 'process' | 'finish' | 'error'

  // Render
  iconRender?: IconRenderType
  onChange?: (current: number) => void
}

export interface StepsProps extends BaseStepsProps {
  prefixCls?: string
}

export interface StepsEmits {
  'update:current': (current: number) => void
}

const waveEffectClassNames: StepsProps['classes'] = {
  itemIcon: TARGET_CLS,
}

export interface StepsSlots {
  default: () => any
  iconRender?: IconRenderType
}

const defaults = {
  variant: 'filled',
  responsive: true,
  offset: 0,
  current: 0,
} as any

const Steps = defineComponent<
  StepsProps,
  StepsEmits,
  string,
  SlotsType<StepsSlots>
>(
  (props = defaults, { slots, attrs, emit }) => {
    const internalContent = useInternalContext()
    const {
      direction: rtlDirection,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      prefixCls,
      rootPrefixCls,
    } = useComponentBaseConfig('steps', props)
    const { size, items, responsive, type, classes, styles } = toPropsRefs(props, 'size', 'items', 'responsive', 'type', 'classes', 'styles')
    const components = computed(() => {
      return {
        root: internalContent.value?.rootComponent,
        item: internalContent.value?.itemComponent,
      }
    })

    const itemIconCls = computed(() => `${prefixCls.value}-item-icon`)
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const [varName] = genCssVar(rootPrefixCls.value, 'cmp-steps')
    // ============================= Size =============================
    const mergedSize = useSize(size)

    // ============================= Item =============================
    const mergedItems = computed(() => (items.value || []).filter(Boolean))

    // ============================ Layout ============================
    const breakpoint = useBreakpoint(responsive as any)
    const xs = computed(() => breakpoint.value?.xs)

    const mergedType = computed(() => {
      if (type.value && type.value !== 'default') {
        return type.value
      }
      if (props.progressDot) {
        return 'dot'
      }
      return type.value
    })
    const isInline = computed(() => mergedType.value === 'inline')
    const isDot = computed(() => mergedType.value === 'dot' || mergedType.value === 'inline')

    const mergedOrientation = computed(() => {
      const nextOrientation = props.orientation || props.direction
      if (mergedType.value === 'panel') {
        return 'horizontal'
      }
      return (responsive.value && xs.value) || nextOrientation === 'vertical' ? 'vertical' : 'horizontal'
    })

    const mergedTitlePlacement = computed(() => {
      if (isDot.value || mergedOrientation.value === 'vertical') {
        return mergedOrientation.value === 'vertical' ? 'horizontal' : 'vertical'
      }
      if (type.value === 'navigation') {
        return 'horizontal'
      }
      return props.titlePlacement || props.labelPlacement || 'horizontal'
    })

    // ========================== Percentage ==========================
    const mergedPercent = computed(() => isInline.value ? undefined : props?.percent)

    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return {
        ...props,
        size: mergedSize.value,
        type: mergedType.value,
        orientation: mergedOrientation.value,
        titlePlacement: mergedTitlePlacement.value,
        percent: mergedPercent.value,
      } as StepsProps
    })

    // ============================ Styles ============================
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      StepsClassNamesType,
      StepsStylesType,
      StepsProps
    >(
      useToArr(computed(() => waveEffectClassNames), contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    // =========================== Warning ============================
    if (isDev) {
      const { labelPlacement, progressDot, direction } = props
      const warning = devUseWarning('Steps')

      warning.deprecated(!labelPlacement, 'labelPlacement', 'titlePlacement')
      warning.deprecated(!progressDot, 'progressDot', 'type="dot"')
      warning.deprecated(!direction, 'direction', 'orientation')
      warning.deprecated(
        mergedItems.value.every(item => !item.description),
        'items.description',
        'items.content',
      )
    }
    return () => {
      const {
        variant,
        onChange,
        offset,
        ellipsis,
        rootClass,
        current,
        ...restProps
      } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      // const icon = getSlotPropsFnRun(slots,props,"icon")
      const iconRender = slots?.iconRender || props?.iconRender

      // Progress Dot Render function
      const legacyProgressDotRenderFn = () => {
        return mergedType.value === 'dot' && typeof props.progressDot === 'function' ? props.progressDot : undefined
      }
      const legacyProgressDotRender = legacyProgressDotRenderFn()
      // ============================= Icon =============================
      const internalIconRender: VcStepsProps['iconRender'] = (_, info) => {
        const {
          index,
          item,
          active,
          components: { Icon: StepIcon },
        } = info

        const { status, icon } = item

        let iconContent: any
        if (isDot.value || icon) {
          iconContent = icon
        }
        else {
          switch (status) {
            case 'finish':
              iconContent = <CheckOutlined class={`${itemIconCls.value}-finish`} />
              break
            case 'error':
              iconContent = <CheckOutlined class={`${itemIconCls.value}-error`} />
              break
            default:{
              let numNode = <span class={`${itemIconCls.value}-number`}>{info.index + 1}</span>
              if (status === 'process' && mergedPercent.value !== undefined) {
                numNode = (
                  <ProgressIcon
                    prefixCls={prefixCls.value}
                    rootPrefixCls={rootPrefixCls.value}
                    percent={mergedPercent.value}
                  >
                    {numNode}
                  </ProgressIcon>
                )
              }
              iconContent = numNode
            }
          }
        }

        let iconNode = <StepIcon>{iconContent}</StepIcon>

        // Custom Render Props
        if (iconRender) {
          iconNode = iconRender({
            oriNode: iconNode,
            info: {
              index,
              active,
              item,
              components: {
                Icon: StepIcon,
              },
            },
          })
        }
        else if (typeof legacyProgressDotRender === 'function') {
          iconNode = legacyProgressDotRender({
            iconDot: iconNode,
            info: {
              index,
              ...(item as any),
            },
          })
        }
        return iconNode
      }

      // ============================ Custom ============================
      const itemRender: VcStepsProps['itemRender'] = (itemNode, itemInfo) => {
        let content = itemNode
        const itemContent = getSlotPropsFnRun({}, itemInfo.item, 'content')
        if (isInline.value && itemContent) {
          content = (
            <Tooltip destroyOnHidden title={itemContent}>
              {itemNode}
            </Tooltip>
          )
        }

        return (
          <Wave
            component="Steps"
            disabled={itemInfo.item.disabled || !onChange}
            colorSource={variant === 'filled' ? 'color' : null}
          >
            {content}
          </Wave>
        )
      }

      const itemWrapperRender: VcStepsProps['itemWrapperRender'] = mergedType.value === 'panel'
        ? (itemNode) => {
            return (
              <>
                {itemNode}
                <PanelArrow prefixCls={prefixCls.value} />
              </>
            )
          }
        : undefined

      // ============================ Styles ============================
      const mergedStyle = {
        [varName('items-offset')]: `${offset}`,
        ...contextStyle.value,
        ...style,
      }

      const stepsClassName = clsx(
        contextClassName.value,
        `${prefixCls.value}-${variant}`,
        {
          [`${prefixCls.value}-${mergedType.value}`]: mergedType.value !== 'dot' ? mergedType.value : false,
          [`${prefixCls.value}-rtl`]: rtlDirection.value === 'rtl',
          [`${prefixCls.value}-dot`]: isDot.value,
          [`${prefixCls.value}-ellipsis`]: ellipsis,
          [`${prefixCls.value}-with-progress`]: mergedPercent.value !== undefined,
          [`${prefixCls.value}-${mergedSize.value}`]: mergedSize.value,
        },
        className,
        rootClass,
        hashId.value,
        cssVarCls.value,
      )

      // ============================ Render ============================
      return (
        <VcSteps
          {...restProps}
          {...restAttrs}
          // Style
          prefixCls={prefixCls.value}
          className={stepsClassName}
          style={mergedStyle}
          classNames={mergedClassNames.value}
          styles={mergedStyles.value as any}
          // Layout
          orientation={mergedOrientation.value}
          titlePlacement={mergedTitlePlacement.value}
          components={components.value}
          // Data
          current={current}
          items={mergedItems.value as any}
          onChange={(current) => {
            onChange?.(current)
            emit('update:current', current)
          }}
          // Render
          iconRender={internalIconRender}
          itemRender={itemRender}
          itemWrapperRender={itemWrapperRender}
        />
      )
    }
  },
  {
    name: 'ASteps',
    inheritAttrs: false,
  },
)

;(Steps as any).install = (app: App) => {
  app.component(Steps.name, Steps)
}
export default Steps
