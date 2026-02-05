import type { SliderProps as VcSliderProps } from '@v-c/slider'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { Orientation, SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { TooltipPlacement, TriggerCommonApi } from '../tooltip'
import VcSlider from '@v-c/slider'
import { clsx } from '@v-c/util'
import raf from '@v-c/util/dist/raf'
import { omit } from 'es-toolkit'
import { cloneVNode, computed, defineComponent, onMounted, onUnmounted, shallowRef } from 'vue'
import {
  getAttrStyleAndClass,
  useMergeSemantic,
  useOrientation,
  useToArr,
  useToProps,
} from '../_util/hooks'
import { toPropsRefs } from '../_util/tools'
import { useComponentBaseConfig } from '../config-provider/context'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'
import { useSliderInternalContext } from './Context'
import SliderTooltip from './SliderTooltip.tsx'
import useStyle from './style'
import useRafLock from './useRafLock'

export type SliderMarks = VcSliderProps['marks']

export type SliderSemanticName = keyof SliderSemanticClassNames & keyof SliderSemanticStyles

export interface SliderSemanticClassNames {
  root?: string
  tracks?: string
  track?: string
  rail?: string
  handle?: string
}

export interface SliderSemanticStyles {
  root?: CSSProperties
  tracks?: CSSProperties
  track?: CSSProperties
  rail?: CSSProperties
  handle?: CSSProperties
}

export type SliderClassNamesType = SemanticClassNamesType<
  SliderBaseProps,
  SliderSemanticClassNames
>

export type SliderStylesType = SemanticStylesType<SliderBaseProps, SliderSemanticStyles>

export interface SliderProps extends Omit<VcSliderProps, 'styles' | 'classNames'> {
  classes?: SliderClassNamesType
  styles?: SliderStylesType
}

interface HandleGeneratorInfo {
  value?: number
  dragging?: boolean
  index: number
}

export type HandleGeneratorFn = (config: {
  tooltipPrefixCls?: string
  prefixCls?: string
  info: HandleGeneratorInfo
}) => any

export type Formatter = ((value?: number) => any) | null

export interface SliderTooltipProps extends TriggerCommonApi {
  prefixCls?: string
  open?: boolean
  placement?: TooltipPlacement
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  formatter?: Formatter
  autoAdjustOverflow?: boolean
}

export interface SliderBaseProps {
  prefixCls?: string
  reverse?: boolean
  min?: number
  max?: number
  step?: null | number
  marks?: SliderMarks
  dots?: boolean
  included?: boolean
  disabled?: boolean
  keyboard?: boolean
  orientation?: Orientation
  vertical?: boolean
  // className?: string
  rootClass?: string
  id?: string
  // style?: CSSProperties;
  tooltip?: SliderTooltipProps
  autoFocus?: boolean

  styles?: SliderStylesType
  classes?: SliderClassNamesType
  // onFocus?: FocusEventHandler<HTMLDivElement>;
  // onBlur?: FocusEventHandler<HTMLDivElement>;

  // Accessibility
  tabindex?: SliderProps['tabIndex']
  ariaLabelForHandle?: SliderProps['ariaLabelForHandle']
  ariaLabelledByForHandle?: SliderProps['ariaLabelledByForHandle']
  ariaRequired?: SliderProps['ariaRequired']
  ariaValueTextFormatterForHandle?: SliderProps['ariaValueTextFormatterForHandle']
}

export interface SliderInternalProps extends SliderBaseProps {
  range?: boolean | SliderRange
  value?: number | number[]
  defaultValue?: number | number[]
  // onChange?: (value: number) => void
  // /** @deprecated Please use `onChangeComplete` instead */
  // onAfterChange?: (value: number) => void
  // onChangeComplete?: (value: number) => void
  /** @deprecated Please use `styles.handle` instead */
  handleStyle?: CSSProperties | CSSProperties[]
  /** @deprecated Please use `styles.track` instead */
  trackStyle?: CSSProperties | CSSProperties[]
  /** @deprecated Please use `styles.rail` instead */
  railStyle?: CSSProperties
}

export interface SliderEmits {
  'change': (value: any) => void
  'afterChange': (value: any) => void
  'update:value': (value: any) => void
  'changeComplete': (value: any) => void
}

export interface SliderSlots {

}

type SliderRange = VcSliderProps['range']

export interface Opens { [index: number]: boolean }

function getTipFormatter(tipFormatter?: Formatter) {
  if (tipFormatter || tipFormatter === null) {
    return tipFormatter
  }
  return (val?: number) => (typeof val === 'number' ? val.toString() : '')
}

const Slider = defineComponent<
  SliderInternalProps,
  SliderEmits,
  string,
  SlotsType<SliderSlots>
>(
  (props, { attrs, emit, expose }) => {
    const { classes, styles, vertical, orientation } = toPropsRefs(props, 'classes', 'styles', 'vertical', 'orientation')
    const [, mergedVertical] = useOrientation(orientation, vertical)
    const sliderRef = shallowRef()
    const {
      prefixCls,
      direction: contextDirection,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      getPopupContainer,
      getPrefixCls,
    } = useComponentBaseConfig('slider', props)

    const contextDisabled = useDisabledContext()
    const mergedDisabled = computed(() => props.disabled ?? contextDisabled.value)

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        disabled: mergedDisabled.value,
        vertical: mergedVertical.value,
      } as SliderInternalProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      SliderClassNamesType,
      SliderStylesType,
      SliderInternalProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    // ============================= Context ==============================
    const { handleRender: contextHandleRender, direction: internalContextDirection } = useSliderInternalContext()

    const mergedDirection = computed(() => internalContextDirection?.value || contextDirection.value)
    const isRTL = computed(() => mergedDirection.value === 'rtl')

    // =============================== Open ===============================
    const [hoverOpen, setHoverOpen] = useRafLock()
    const [focusOpen, setFocusOpen] = useRafLock()

    const tooltipProps = computed(() => {
      return {
        ...props.tooltip,
      }
    })

    const lockOpen = computed(() => tooltipProps.value?.open)
    const activeOpen = computed(() => (hoverOpen.value || focusOpen.value) && lockOpen.value !== false)

    // ============================= Change ==============================
    const [dragging, setDragging] = useRafLock()

    const onInternalChangeComplete: VcSliderProps['onChangeComplete'] = (nextValues) => {
      emit('changeComplete', nextValues)
      setDragging(false)
    }

    // ============================ Placement ============================
    const getTooltipPlacement = (placement?: TooltipPlacement, vert?: boolean) => {
      if (placement) {
        return placement
      }
      if (!vert) {
        return 'top'
      }
      return isRTL ? 'left' : 'right'
    }

    const [hashId, cssVarCls] = useStyle(prefixCls)

    // ============================== Handle ==============================
    const onMouseUp = () => {
      raf(() => {
        focusOpen.value = false
      }, 1)
    }
    onMounted(() => {
      document.addEventListener('mouseup', onMouseUp)
    })
    onUnmounted(() => {
      document.removeEventListener('mouseup', onMouseUp)
    })
    expose({
      focus: () => sliderRef.value?.focus?.(),
      blur: () => sliderRef.value?.blur?.(),
    })
    return () => {
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const { rootClass, tooltip, range } = props
      const tooltipProps: SliderTooltipProps = {
        ...tooltip,
      }
      const {
        placement: tooltipPlacement,
        getPopupContainer: getTooltipPopupContainer,
        prefixCls: customizeTooltipPrefixCls,
        formatter: tipFormatter,
      } = tooltipProps
      const rootClassNames = clsx(
        className,
        contextClassName.value,
        mergedClassNames.value.root,
        rootClass,
        {
          [`${prefixCls.value}-rtl`]: isRTL.value,
          [`${prefixCls.value}-lock`]: dragging.value,
        },
        hashId.value,
        cssVarCls.value,
      )

      const restProps: Record<string, any> = {
        ...omit(props, [
          'prefixCls',
          'range',
          'rootClass',
          'style',
          'disabled',
          'tooltip', // Deprecated
          'classes',
          'styles',
          'vertical',
          'orientation',
        ]),
        ...restAttrs,
      }
      if (isRTL.value && !mergedVertical.value) {
        restProps.reverse = !restProps.reverse
      }
      const mergedTipFormatter = getTipFormatter(tipFormatter)
      const useActiveTooltipHandle = range && !lockOpen.value
      const handleRender: VcSliderProps['handleRender'] = contextHandleRender || (({ node, index, value }) => {
        const nodeProps: Record<string, any> = {}
        function proxyEvent(
          eventName: keyof any,
          event: any,
          triggerRestPropsEvent?: boolean,
        ) {
          if (triggerRestPropsEvent) {
            (restProps as any)[eventName]?.(event)
          }

          (nodeProps as any)[eventName]?.(event)
        }

        const passedProps: Record<string, any> = {
          onMouseenter: (e: MouseEvent) => {
            setHoverOpen(true)
            proxyEvent('onMouseenter', e)
          },
          onMouseleave: (e: MouseEvent) => {
            setHoverOpen(false)
            proxyEvent('onMouseleave', e)
          },
          onMousedown: (e: MouseEvent) => {
            setFocusOpen(true)
            setDragging(true)
            proxyEvent('onMousedown', e)
          },
          onFocus: (e: FocusEvent) => {
            setFocusOpen(true)
            restProps?.onFocus?.(e)
            proxyEvent('onFocus', e, true)
          },
          onBlur: (e: FocusEvent) => {
            setFocusOpen(false)
            restProps?.onBlur?.(e)
            proxyEvent('onBlur', e, true)
          },
        }

        const cloneNode = cloneVNode(node, passedProps)
        const open = (!!lockOpen.value || activeOpen.value) && mergedTipFormatter !== null
        // Wrap on handle with Tooltip when is single mode or multiple with all show tooltip
        if (!useActiveTooltipHandle) {
          return (
            <SliderTooltip
              {...tooltipProps}
              prefixCls={getPrefixCls('tooltip', customizeTooltipPrefixCls)}
              title={mergedTipFormatter ? mergedTipFormatter(value) : ''}
              value={value}
              open={open}
              placement={getTooltipPlacement(tooltipPlacement, mergedVertical.value)}
              key={index!}
              classes={{ root: `${prefixCls.value}-tooltip` }}
              getPopupContainer={getTooltipPopupContainer || getPopupContainer}
            >
              {cloneNode}
            </SliderTooltip>
          )
        }
        return cloneNode
      })

      // ========================== Active Handle ===========================
      const activeHandleRender: SliderProps['activeHandleRender'] = useActiveTooltipHandle
        ? ({ node, ...info }) => {
            const cloneNode = cloneVNode(node, {
              style: {
                visibility: 'hidden',
              },
            })
            return (
              <SliderTooltip
                {...tooltipProps}
                prefixCls={getPrefixCls('tooltip', customizeTooltipPrefixCls)}
                title={mergedTipFormatter ? mergedTipFormatter(info.value) : ''}
                open={mergedTipFormatter !== null && activeOpen.value}
                placement={getTooltipPlacement(tooltipPlacement, mergedVertical.value)}
                key="tooltip"
                classes={{ root: `${prefixCls.value}-tooltip` }}
                getPopupContainer={getTooltipPopupContainer || getPopupContainer}
                draggingDelete={info.draggingDelete}
              >
                {cloneNode}
              </SliderTooltip>
            )
          }
        : undefined

      // ============================== Render ==============================
      const rootStyle = {
        ...mergedStyles.value.root,
        ...contextStyle.value,
        ...style,
      }
      return (
        <VcSlider
          {...restProps}
          classNames={mergedClassNames.value}
          styles={mergedStyles.value}
          step={restProps.step}
          range={range}
          className={rootClassNames}
          style={rootStyle}
          disabled={mergedDisabled.value}
          vertical={mergedVertical.value}
          prefixCls={prefixCls.value}
          handleRender={handleRender}
          activeHandleRender={activeHandleRender}
          onChangeComplete={onInternalChangeComplete}
          onChange={(...args) => {
            emit('change', ...args)
            emit('update:value', ...args)
          }}
          ref={sliderRef}
        />
      )
    }
  },
  {
    name: 'ASlider',
    inheritAttrs: false,
  },
)

;(Slider as any).install = (app: App) => {
  app.component(Slider.name, Slider)
}
export default Slider
