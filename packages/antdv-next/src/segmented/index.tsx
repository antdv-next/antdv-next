import type {
  SegmentedLabeledOption as RcSegmentedLabeledOption,
  SegmentedProps as RCSegmentedProps,
  SegmentedValue as RcSegmentedValue,
  SegmentedRawOption,
} from '@v-c/segmented'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { Orientation, SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type.ts'
import type { SizeType } from '../config-provider/SizeContext.tsx'
import type { TooltipProps } from '../tooltip'
import VcSegmented from '@v-c/segmented'
import { clsx } from '@v-c/util'
import { filterEmpty, removeUndefined } from '@v-c/util/dist/props-util'
import { computed, defineComponent, useId } from 'vue'
import { pureAttrs, useMergeSemantic, useOrientation, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import { useSize } from '../config-provider/hooks/useSize.ts'
import Tooltip from '../tooltip'
import useStyle from './style'

export type SegmentedSemanticName = keyof SegmentedSemanticClassNames
  & keyof SegmentedSemanticStyles

export interface SegmentedSemanticClassNames {
  root?: string
  icon?: string
  label?: string
  item?: string
}

export interface SegmentedSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  label?: CSSProperties
  item?: CSSProperties
}
interface SegmentedLabeledOptionWithoutIcon<ValueType = RcSegmentedValue>
  extends RcSegmentedLabeledOption<ValueType> {
  label: RcSegmentedLabeledOption['label']
  tooltip?: string | TooltipProps
}

interface SegmentedLabeledOptionWithIcon<ValueType = RcSegmentedValue>
  extends Omit<RcSegmentedLabeledOption<ValueType>, 'label'> {
  label?: RcSegmentedLabeledOption['label']
  /** Set icon for Segmented item */
  icon?: VueNode
  tooltip?: string | TooltipProps
}

function isSegmentedLabeledOptionWithIcon(
  option: SegmentedRawOption | SegmentedLabeledOptionWithIcon | SegmentedLabeledOptionWithoutIcon,
  iconFromSlot?: any[],
): option is SegmentedLabeledOptionWithIcon {
  return typeof option === 'object' && !!((option as SegmentedLabeledOptionWithIcon)?.icon || iconFromSlot?.length)
}

export type SegmentedLabeledOption<ValueType = RcSegmentedValue>
  = | SegmentedLabeledOptionWithIcon<ValueType>
    | SegmentedLabeledOptionWithoutIcon<ValueType>

export type SegmentedOptions<T = SegmentedRawOption> = (T | SegmentedLabeledOption<T>)[]

export type SegmentedClassNamesType = SemanticClassNamesType<
  SegmentedProps,
  SegmentedSemanticClassNames
>

export type SegmentedStylesType = SemanticStylesType<SegmentedProps, SegmentedSemanticStyles>

export interface SegmentedProps extends Omit<RCSegmentedProps, 'size' | 'options' | 'itemRender' | 'styles' | 'classNames' | 'onChange'> {
  options: SegmentedOptions
  rootClass?: string
  /** Option to fit width to its parent's width */
  block?: boolean
  /** Option to control the display size */
  size?: SizeType
  vertical?: boolean
  orientation?: Orientation
  classes?: SegmentedClassNamesType
  styles?: SegmentedStylesType
  shape?: 'default' | 'round'
  iconRender?: (option: SegmentedLabeledOption) => any
  labelRender?: (option: SegmentedLabeledOption) => any
}

export interface SegmentedEmits {
  'change': (value: RcSegmentedValue) => void
  'update:value': (value: RcSegmentedValue) => void
}

export interface SegmentedSlots {
  // itemRender: (option: SegmentedLabeledOption | SegmentedRawOption, checked: boolean) => VueNode
  iconRender: (option: SegmentedLabeledOption) => any
  labelRender: (option: SegmentedLabeledOption) => any

}

const defaults = {
  size: 'middle',
  shape: 'default',
} as any

const InternalSegmented = defineComponent<
  SegmentedProps,
  SegmentedEmits,
  string,
  SlotsType<SegmentedSlots>
>(
  (props = defaults, { attrs, emit, slots }) => {
    const defaultName = useId()
    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('segmented')
    const { classes, styles, size: customSize, orientation, vertical } = toPropsRefs(props, 'classes', 'styles', 'size', 'orientation', 'vertical')
    const name = computed(() => props?.name ?? defaultName)

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return props
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      SegmentedClassNamesType,
      SegmentedStylesType,
      SegmentedProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(
      mergedProps,
    ))

    // Style
    const [hashId, cssVarCls] = useStyle(prefixCls)

    // ===================== Size =====================
    const mergedSize = useSize(customSize)

    const [, mergedVertical] = useOrientation(orientation, vertical)
    // syntactic sugar to support `icon` for Segmented Item
    const extendedOptions = computed(() => {
      return props?.options?.map((option) => {
        const iconRender = slots.iconRender || props.iconRender
        const _option = typeof option === 'object' ? option : { value: option }
        let iconFromSlot = iconRender ? iconRender(_option) : null
        iconFromSlot = filterEmpty(Array.isArray(iconFromSlot) ? iconFromSlot : [iconFromSlot])
        const labelRender = slots.labelRender || props.labelRender
        let labelFromSlot = labelRender ? labelRender(_option) : null
        labelFromSlot = filterEmpty(Array.isArray(labelFromSlot) ? labelFromSlot : [labelFromSlot]).filter(Boolean)
        if (isSegmentedLabeledOptionWithIcon(option, iconFromSlot)) {
          const { label, ...restOption } = option
          labelFromSlot = labelFromSlot.length > 0 ? labelFromSlot : label
          const showLabel = !!(labelFromSlot && labelFromSlot.length > 0) || !!label
          const icon = getSlotPropsFnRun({}, option, 'icon') ?? iconFromSlot
          return {
            ...restOption,
            label: (
              <>
                <span
                  class={clsx(`${prefixCls.value}-item-icon`, mergedClassNames.value?.icon)}
                  style={mergedStyles.value?.icon}
                >
                  {icon}
                </span>
                {showLabel && <span>{labelFromSlot}</span>}
              </>
            ),
          }
        }
        else {
          return option
        }
      })
    })
    return () => {
      const {
        rootClass,
        block,
        shape,
        ...restProps
      } = props
      const cls = clsx(
        (attrs as any).class,
        rootClass,
        contextClassName.value,
        mergedClassNames.value?.root,
        {
          [`${prefixCls.value}-block`]: block,
          [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
          [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
          [`${prefixCls.value}-vertical`]: mergedVertical.value,
          [`${prefixCls.value}-shape-${shape}`]: shape === 'round',
        },
        hashId.value,
        cssVarCls.value,
      )
      const mergedStyle: CSSProperties = {
        ...mergedStyles?.value?.root,
        ...contextStyle.value,
      }

      const itemRender = (node: any, { item }: { item: SegmentedLabeledOption }) => {
        if (!item.tooltip) {
          return node
        }
        const tooltipProps = typeof item.tooltip === 'object' ? item.tooltip : { title: item.tooltip }
        return <Tooltip {...tooltipProps}>{node}</Tooltip>
      }
      return (
        <VcSegmented
          {...pureAttrs(attrs)}
          {...removeUndefined(restProps)}
          name={name.value}
          class={[cls]}
          style={[mergedStyle, (attrs as any).style]}
          classNames={mergedClassNames.value}
          styles={mergedStyles.value}
          itemRender={itemRender}
          options={extendedOptions.value}
          prefixCls={prefixCls.value}
          direction={direction.value}
          vertical={mergedVertical.value}
          onChange={(value) => {
            emit('change', value)
            emit('update:value', value)
          }}
        />
      )
    }
  },
  {
    name: 'ASegmented',
    inheritAttrs: false,
  },
)

const Segmented = InternalSegmented as typeof InternalSegmented & {
  install: (app: App) => void
}

Segmented.install = (app: App) => {
  app.component(Segmented.name, Segmented)
}
export default Segmented
