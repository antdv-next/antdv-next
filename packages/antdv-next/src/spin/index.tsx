import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { debounce } from 'throttle-debounce'
import { computed, defineComponent, shallowRef, watch } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning.ts'
import { useComponentBaseConfig, useComponentConfig } from '../config-provider/context'
import Indicator from './Indicator'
import useStyle from './style/index'
import usePercent from './usePercent.ts'

const _SpinSizes = ['small', 'default', 'large'] as const
export type SpinSize = (typeof _SpinSizes)[number]

export type SpinSemanticName = keyof SpinSemanticClassNames & keyof SpinSemanticStyles

export interface SpinSemanticClassNames {
  root?: string
  section?: string
  indicator?: string
  description?: string

  container?: string

  /** @deprecated Please use `description` instead */
  tip?: string
  /** @deprecated Please use `root` instead */
  mask?: string
}

export interface SpinSemanticStyles {
  root?: CSSProperties
  section?: CSSProperties
  indicator?: CSSProperties
  description?: CSSProperties

  container?: CSSProperties

  /** @deprecated Please use `description` instead */
  tip?: CSSProperties
  /** @deprecated Please use `root` instead */
  mask?: CSSProperties
}

export type SpinClassNamesType = SemanticClassNamesType<SpinProps, SpinSemanticClassNames>

export type SpinStylesType = SemanticStylesType<SpinProps, SpinSemanticStyles>

export interface SpinProps extends ComponentBaseProps {
  /** Whether Spin is spinning */
  spinning?: boolean
  /** Size of Spin, options: `small`, `default` and `large` */
  size?: SpinSize
  /** Customize description content when Spin has children */
  /** @deprecated Please use `description` instead */
  tip?: VueNode
  description?: VueNode
  /** Specifies a delay in milliseconds for loading state (prevent flush) */
  delay?: number
  /** The className of wrapper when Spin has children */
  /** @deprecated Please use `classes.root` instead */
  wrapperClassName?: string
  /** React node of the spinning indicator */
  indicator?: VueNode
  /** Display a backdrop with the `Spin` component */
  fullscreen?: boolean
  percent?: number | 'auto'
  classes?: SpinClassNamesType
  styles?: SpinStylesType
}

export interface SpinSlots {
  indicator?: () => any
  /** @deprecated Please use `description` instead */
  tip?: () => any
  description?: () => any
  default?: () => any
}

// Render indicator
let defaultIndicator: VueNode

function shouldDelay(spinning?: boolean, delay?: number): boolean {
  return !!spinning && !!delay && !Number.isNaN(Number(delay))
}

const defaultSpinProps = {
  spinning: true,
  delay: 0,
  size: 'default',
  fullscreen: false,
} as any

const Spin = defineComponent<
  SpinProps,
  EmptyEmit,
  string,
  SlotsType<SpinSlots>
>(
  (props = defaultSpinProps, { slots, attrs }) => {
    const componentCtx = useComponentConfig('spin')
    const {
      direction,
      prefixCls,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('spin', props, ['indicator'])
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')
    const spinning = shallowRef(shouldDelay(props.spinning, props.delay) ? false : !!props.spinning)
    const mergedPercent = usePercent(spinning, computed(() => props.percent))

    watch(
      [() => props.delay, () => props.spinning],
      (_, _p, onCleanup) => {
        if (props.spinning) {
          const showSpinning = debounce(
            props?.delay ?? 0,
            () => {
              spinning.value = true
            },
          )
          showSpinning()
          onCleanup(() => {
            showSpinning?.cancel?.()
          })
          return
        }
        spinning.value = false
      },
      {
        immediate: true,
      },
    )

    const warning = devUseWarning('Spin')

    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return {
        ...props,
        size: props.size,
        spinning: spinning.value,
        fullscreen: props.fullscreen,
        percent: mergedPercent.value,
      }
    })
    // ========================= Style ==========================
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      SpinClassNamesType,
      SpinStylesType,
      SpinProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))
    return () => {
      const { fullscreen, size, rootClass, wrapperClassName } = props
      const children = filterEmpty(slots?.default?.() || [])
      const indicator = getSlotPropsFnRun(slots, props, 'indicator')
      const contextIndicator = getSlotPropsFnRun({}, componentCtx.value, 'indicator')
      const hasChildren = children.length > 0
      const isNested = hasChildren || fullscreen
      const description = getSlotPropsFnRun(slots, props, 'description')
      const tip = getSlotPropsFnRun(slots, props, 'tip')
      const mergedDescription = description ?? tip
      const { style, className, restAttrs } = getAttrStyleAndClass(attrs)

      // ======================== Warning =========================
      if (isDev) {
        warning.deprecated(!props.tip && !slots.tip, 'tip', 'description')
        warning.deprecated(!wrapperClassName, 'wrapperClassName', 'classes.root')

        warning.deprecated(
          !(mergedClassNames.value?.tip || mergedStyles.value?.tip),
          'classes.tip and styles.tip',
          'classes.description and styles.description',
        )
        warning.deprecated(
          !(mergedClassNames.value?.mask || mergedStyles.value?.mask),
          'classes.mask and styles.mask',
          'classes.root and styles.root',
        )
      }

      // ======================= Indicator ========================
      const mergedIndicator = indicator ?? contextIndicator ?? defaultIndicator

      // ========================= Render =========================
      const indicatorNode = (
        <>
          <Indicator
            class={classNames(mergedClassNames.value.indicator)}
            style={mergedStyles.value.indicator}
            prefixCls={prefixCls.value}
            indicator={mergedIndicator}
            percent={mergedPercent.value as any}
          />
          {mergedDescription && (
            <div
              class={classNames(
                `${prefixCls.value}-description`,
                mergedClassNames.value.tip,
                mergedClassNames.value.description,
              )}
              style={{
                ...mergedStyles.value.tip,
                ...mergedStyles.value.description,
              }}
            >
              {mergedDescription}
            </div>
          )}
        </>
      )

      return (
        <div
          {...restAttrs}
          class={classNames(
            prefixCls.value,
            {
              [`${prefixCls.value}-sm`]: size === 'small',
              [`${prefixCls.value}-lg`]: size === 'large',
              [`${prefixCls.value}-spinning`]: spinning.value,
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
              [`${prefixCls.value}-fullscreen`]: fullscreen,
            },
            rootClass,
            mergedClassNames.value.root,
            fullscreen && mergedClassNames.value.mask,
            isNested ? wrapperClassName : [`${prefixCls.value}-section`, mergedClassNames.value.section],
            contextClassName.value,
            className,
            hashId.value,
            cssVarCls.value,
          )}
          style={{
            ...mergedStyles.value.root,
            ...(!isNested ? mergedStyles.value.section : {}),
            ...(fullscreen ? mergedStyles.value.mask : {}),
            ...contextStyle.value,
            ...style,
          }}
          aria-live="polite"
          aria-busy={spinning.value}
        >
          {/* Indicator */}
          {spinning.value
            && (isNested
              ? (
                  <div
                    class={classNames(`${prefixCls.value}-section`, mergedClassNames.value.section)}
                    style={mergedStyles.value.section}
                  >
                    {indicatorNode}
                  </div>
                )
              : (
                  indicatorNode
                ))}

          {/* Children */}
          {hasChildren && (
            <div
              class={classNames(`${prefixCls.value}-container`, mergedClassNames.value.container)}
              style={mergedStyles.value.container}
            >
              {children}
            </div>
          )}
        </div>
      )
    }
  },
  {
    name: 'ASpin',
    inheritAttrs: false,
  },
)

;(Spin as any).setDefaultIndicator = (indicator: VueNode) => {
  defaultIndicator = indicator
}

;(Spin as any).install = (app: App) => {
  app.component(Spin.name, Spin)
}
export default Spin as typeof Spin & {
  setDefaultIndicator: (indicator: VueNode) => void
}
