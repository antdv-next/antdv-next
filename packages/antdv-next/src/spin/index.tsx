import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { debounce } from 'throttle-debounce'
import { computed, defineComponent, shallowRef, watch } from 'vue'
import { pureAttrs, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
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
  wrapper?: string
  mask?: string
  indicator?: string
  tip?: string
}

export interface SpinSemanticStyles {
  root?: CSSProperties
  wrapper?: CSSProperties
  mask?: CSSProperties
  indicator?: CSSProperties
  tip?: CSSProperties
}

export type SpinClassNamesType = SemanticClassNamesType<SpinProps, SpinSemanticClassNames>

export type SpinStylesType = SemanticStylesType<
  SpinProps,
  SpinSemanticStyles,
  { wrapper?: CSSProperties }
>

export interface SpinProps extends ComponentBaseProps {
  /** Whether Spin is spinning */
  spinning?: boolean
  /** Size of Spin, options: `small`, `default` and `large` */
  size?: SpinSize
  /** Customize description content when Spin has children */
  tip?: VueNode
  /** Specifies a delay in milliseconds for loading state (prevent flush) */
  delay?: number
  /** The className of wrapper when Spin has children */
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
  tip?: () => any
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
  tip: undefined,
  indicator: undefined,
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
      const tip = getSlotPropsFnRun(slots, props, 'tip')
      const children = filterEmpty(slots?.default?.() || [])
      const indicator = getSlotPropsFnRun(slots, props, 'indicator')
      const contextIndicator = getSlotPropsFnRun({}, componentCtx.value, 'indicator')
      const isNestedPattern = children.length > 0 && !fullscreen
      if (isDev) {
        // 开发环境下的警告
        warning(
          !tip || isNestedPattern || !!fullscreen,
          'usage',
          '`tip` only work in nest or fullscreen pattern.',
        )
      }

      const spinClassName = classNames(
        prefixCls.value,
        contextClassName.value,
        {
          [`${prefixCls.value}-sm`]: size === 'small',
          [`${prefixCls.value}-lg`]: size === 'large',
          [`${prefixCls.value}-spinning`]: spinning.value,
          [`${prefixCls.value}-show-text`]: !!tip,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        (attrs as any).class,
        !fullscreen && rootClass,
        !fullscreen && mergedClassNames.value.root,
        hashId.value,
        cssVarCls.value,
      )

      const containerClassName = classNames(`${prefixCls.value}-container`, {
        [`${prefixCls.value}-blur`]: spinning.value,
      })

      const mergedIndicator = indicator ?? contextIndicator ?? defaultIndicator
      const mergedStyle = [contextStyle.value, (attrs as any).style]
      const spinElement = (
        <div
          {...omit(attrs, ['class', 'style'])}
          style={fullscreen ? mergedStyle : [mergedStyles.value.root, mergedStyle]}
          class={spinClassName}
          aria-live="polite"
          aria-busy={spinning.value}
        >
          <Indicator
            class={mergedClassNames.value.indicator}
            style={mergedStyles.value.indicator}
            prefixCls={prefixCls.value}
            indicator={mergedIndicator}
            percent={mergedPercent.value as any}
          />
          {tip && (isNestedPattern || fullscreen)
            ? (
                <div
                  class={[`${prefixCls.value}-text`, mergedClassNames.value.tip]}
                  style={mergedStyles.value.tip}
                >
                  {tip}
                </div>
              )
            : null}
        </div>
      )
      if (isNestedPattern) {
        return (
          <div
            {...pureAttrs(attrs)}
            class={classNames(
              `${prefixCls.value}-nested-loading`,
              wrapperClassName,
              mergedClassNames.value.wrapper,
              hashId.value,
              cssVarCls.value,
            )}
            style={mergedStyles.value.wrapper}
          >
            {spinning.value && <div key="loading">{spinElement}</div>}
            <div class={containerClassName} key="container">
              {children}
            </div>
          </div>
        )
      }
      if (fullscreen) {
        return (
          <div
            class={classNames(
              `${prefixCls.value}-fullscreen`,
              {
                [`${prefixCls.value}-fullscreen-show`]: spinning.value,
              },
              rootClass,
              hashId.value,
              cssVarCls.value,
              mergedClassNames.value.mask,
            )}
            style={mergedStyles.value.mask}
          >
            {spinElement}
          </div>
        )
      }
      return spinElement
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
