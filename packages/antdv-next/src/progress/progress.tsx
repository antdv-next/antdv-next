import type { App, AriaAttributes, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { EmptyEmit } from '../_util/type'
import type { ComponentBaseProps } from '../config-provider/context'
import { FastColor } from '@ant-design/fast-color'
import { CheckCircleFilled, CheckOutlined, CloseCircleFilled, CloseOutlined } from '@antdv-next/icons'
import { computed, defineComponent } from 'vue'
import {
  getAttrStyleAndClass,
  useMergeSemantic,
  useToArr,
  useToProps,
} from '../_util/hooks'
import { clsx, toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context'
import Circle from './Circle'
import Line from './Line'
import Steps from './Steps'
import useStyle from './style'
import { getSize, getSuccessPercent, validProgress } from './utils'

export type ProgressSemanticName = keyof ProgressSemanticClassNames & keyof ProgressSemanticStyles

export interface ProgressSemanticClassNames {
  root?: string
  body?: string
  rail?: string
  track?: string
  indicator?: string
}

export interface ProgressSemanticStyles {
  root?: CSSProperties
  body?: CSSProperties
  rail?: CSSProperties
  track?: CSSProperties
  indicator?: CSSProperties
}

export type ProgressClassNamesType = SemanticClassNamesType<
  ProgressProps,
  ProgressSemanticClassNames
>

export type ProgressStylesType = SemanticStylesType<ProgressProps, ProgressSemanticStyles>

export const ProgressTypes = ['line', 'circle', 'dashboard'] as const
export type ProgressType = (typeof ProgressTypes)[number]
const ProgressStatuses = ['normal', 'exception', 'active', 'success'] as const
export type ProgressSize = 'default' | 'small'
export type StringGradients = Record<string, string>
interface FromToGradients { from: string, to: string }
export type ProgressGradient = { direction?: string } & (StringGradients | FromToGradients)
export interface PercentPositionType {
  align?: 'start' | 'center' | 'end'
  type?: 'inner' | 'outer'
}

export interface SuccessProps {
  percent?: number
  strokeColor?: string
}

export type ProgressAriaProps = Pick<AriaAttributes, 'aria-label' | 'aria-labelledby'>

export type GapPlacement = 'top' | 'bottom' | 'start' | 'end'
export type GapPosition = 'top' | 'bottom' | 'left' | 'right'

export interface ProgressProps extends ComponentBaseProps, ProgressAriaProps {
  classes?: ProgressClassNamesType
  styles?: ProgressStylesType
  type?: ProgressType
  percent?: number
  format?: (percent?: number, successPercent?: number) => any
  status?: (typeof ProgressStatuses)[number]
  showInfo?: boolean
  strokeWidth?: number
  strokeLinecap?: 'butt' | 'square' | 'round'
  strokeColor?: string | string[] | ProgressGradient
  /** @deprecated Please use `railColor` instead */
  trailColor?: string
  railColor?: string
  /** @deprecated Use `size` instead */
  width?: number
  success?: SuccessProps
  gapDegree?: number
  gapPlacement?: GapPlacement
  /** @deprecated please use `gapPlacement` instead */
  gapPosition?: GapPosition
  size?: number | [number | string, number] | ProgressSize | { width?: number, height?: number }
  steps?: number | { count: number, gap: number }
  percentPosition?: PercentPositionType
  rounding?: (step: number) => number
}

export interface ProgressSlots {
  default?: () => any
}

const defaultProps = {
  percent: 0,
  showInfo: true,
  size: 'default',
  type: 'line',
  percentPosition: {},
} as ProgressProps

function getStrokeColorIsBright(strokeColor?: ProgressProps['strokeColor']) {
  if (!strokeColor) {
    return false
  }
  const color = typeof strokeColor === 'string' ? strokeColor : Object.values(strokeColor)[0]
  try {
    return new FastColor(color).isLight()
  }
  catch (e) {
    if (isDev) {
      console.error(e)
    }
    return false
  }
}

function getPercentNumber(percent: number | undefined, success: ProgressProps['success']) {
  const successPercent = getSuccessPercent({ success })
  return Number.parseInt(
    (successPercent ?? percent ?? 0)?.toString(),
    10,
  )
}

const Progress = defineComponent<
  ProgressProps,
  EmptyEmit,
  string,
  SlotsType<ProgressSlots>
>(
  (props = defaultProps, { attrs }) => {
    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('progress', props)
    const { classes, styles, rootClass } = toPropsRefs(props, 'classes', 'styles', 'rootClass')
    const [hashId, cssVarCls] = useStyle(prefixCls)

    const mergedPercent = computed(() => props.percent ?? defaultProps.percent)
    const mergedSize = computed(() => props.size ?? defaultProps.size)
    const mergedShowInfo = computed(() => props.showInfo ?? defaultProps.showInfo)
    const mergedType = computed(() => props.type ?? defaultProps.type)
    const mergedPercentPosition = computed(() => props.percentPosition ?? defaultProps.percentPosition!)

    const mergedProps = computed(() => ({
      ...props,
      percent: mergedPercent.value,
      size: mergedSize.value,
      showInfo: mergedShowInfo.value,
      type: mergedType.value,
      percentPosition: mergedPercentPosition.value,
    }))

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ProgressClassNamesType,
      ProgressStylesType,
      ProgressProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    const infoAlign = computed(() => mergedPercentPosition.value.align ?? 'end')
    const infoPosition = computed(() => mergedPercentPosition.value.type ?? 'outer')
    const isLineType = computed(() => mergedType.value === 'line')
    const isPureLineType = computed(() => isLineType.value && !props.steps)

    const strokeColorNotArray = computed(() => (Array.isArray(props.strokeColor) ? props.strokeColor[0] : props.strokeColor))
    const strokeColorNotGradient = computed(() => (typeof props.strokeColor === 'string' || Array.isArray(props.strokeColor) ? props.strokeColor : undefined))
    const strokeColorIsBright = computed(() => getStrokeColorIsBright(strokeColorNotArray.value))

    const percentNumber = computed(() => getPercentNumber(mergedPercent.value, props.success))
    const progressStatus = computed<(typeof ProgressStatuses)[number]>(() => {
      if (!ProgressStatuses.includes(props.status!) && percentNumber.value >= 100) {
        return 'success'
      }
      return props.status || 'normal'
    })

    if (isDev) {
      const warning = devUseWarning('Progress')
      ;[
        ['width', 'size'],
        ['trailColor', 'railColor'],
        ['gapPosition', 'gapPlacement'],
      ].forEach(([deprecatedName, newName]) => {
        warning.deprecated(!((props as any)[deprecatedName!] !== undefined), deprecatedName!, newName!)
      })

      if (mergedType.value === 'circle' || mergedType.value === 'dashboard') {
        if (Array.isArray(props.size)) {
          warning(
            false,
            'usage',
            'Type "circle" and "dashboard" do not accept array as `size`, please use number or preset size instead.',
          )
        }
        else if (typeof props.size === 'object') {
          warning(
            false,
            'usage',
            'Type "circle" and "dashboard" do not accept object as `size`, please use number or preset size instead.',
          )
        }
      }
    }

    const progressInfo = computed(() => {
      if (!mergedShowInfo.value) {
        return null
      }

      const successPercent = getSuccessPercent(props)
      let text: any
      const textFormatter = props.format || ((number?: number) => `${number}%`)
      const isBrightInnerColor = isLineType.value && strokeColorIsBright.value && infoPosition.value === 'inner'
      if (
        infoPosition.value === 'inner'
        || props.format
        || (progressStatus.value !== 'exception' && progressStatus.value !== 'success')
      ) {
        text = textFormatter(validProgress(mergedPercent.value), validProgress(successPercent))
      }
      else if (progressStatus.value === 'exception') {
        text = isLineType.value ? <CloseCircleFilled /> : <CloseOutlined />
      }
      else if (progressStatus.value === 'success') {
        text = isLineType.value ? <CheckCircleFilled /> : <CheckOutlined />
      }

      return (
        <span
          class={clsx(
            `${prefixCls.value}-indicator`,
            {
              [`${prefixCls.value}-indicator-bright`]: isBrightInnerColor,
              [`${prefixCls.value}-indicator-${infoAlign.value}`]: isPureLineType.value,
              [`${prefixCls.value}-indicator-${infoPosition.value}`]: isPureLineType.value,
            },
            mergedClassNames.value.indicator,
          )}
          style={mergedStyles.value.indicator}
          title={typeof text === 'string' ? text : undefined}
        >
          {text}
        </span>
      )
    })

    const sharedProps = computed(() => ({
      ...mergedProps.value,
      classes: mergedClassNames.value,
      styles: mergedStyles.value,
    }))

    return () => {
      const { className, style: attrStyle, restAttrs } = getAttrStyleAndClass(attrs)
      let progress: any

      if (mergedType.value === 'line') {
        const steps = typeof props.steps === 'object' ? props.steps.count : props.steps
        progress = props.steps
          ? (
              <Steps
                {...sharedProps.value}
                strokeColor={strokeColorNotGradient.value}
                prefixCls={prefixCls.value}
                steps={steps!}
              >
                {progressInfo.value}
              </Steps>
            )
          : (
              <Line
                {...sharedProps.value}
                strokeColor={strokeColorNotArray.value}
                prefixCls={prefixCls.value}
                direction={direction.value}
                percentPosition={{
                  align: infoAlign.value,
                  type: infoPosition.value,
                }}
              >
                {progressInfo.value}
              </Line>
            )
      }
      else if (mergedType.value === 'circle' || mergedType.value === 'dashboard') {
        progress = (
          <Circle
            {...sharedProps.value}
            strokeColor={strokeColorNotArray.value as any}
            prefixCls={prefixCls.value}
            progressStatus={progressStatus.value}
          >
            {progressInfo.value}
          </Circle>
        )
      }

      const classString = clsx(
        prefixCls.value,
        `${prefixCls.value}-status-${progressStatus.value}`,
        {
          [`${prefixCls.value}-${(mergedType.value === 'dashboard' && 'circle') || mergedType.value}`]: mergedType.value !== 'line',
          [`${prefixCls.value}-inline-circle`]: mergedType.value === 'circle' && getSize(mergedSize.value, 'circle')[0] <= 20,
          [`${prefixCls.value}-line`]: isPureLineType.value,
          [`${prefixCls.value}-line-align-${infoAlign.value}`]: isPureLineType.value,
          [`${prefixCls.value}-line-position-${infoPosition.value}`]: isPureLineType.value,
          [`${prefixCls.value}-steps`]: props.steps,
          [`${prefixCls.value}-show-info`]: mergedShowInfo.value,
          [`${prefixCls.value}-${mergedSize.value}`]: typeof mergedSize.value === 'string',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        contextClassName.value,
        className,
        rootClass.value,
        mergedClassNames.value.root,
        hashId.value,
        cssVarCls.value,
      )

      const rootStyle = [
        mergedStyles.value.root,
        contextStyle.value,
        attrStyle,
      ]

      const ariaProps: Record<string, any> = {}
      if (props['aria-label'] !== undefined) {
        ariaProps['aria-label'] = props['aria-label']
      }
      if (props['aria-labelledby'] !== undefined) {
        ariaProps['aria-labelledby'] = props['aria-labelledby']
      }

      return (
        <div
          {...restAttrs}
          style={rootStyle}
          class={classString}
          role="progressbar"
          aria-valuenow={percentNumber.value}
          aria-valuemin={0}
          aria-valuemax={100}
          {...ariaProps}
        >
          {progress}
        </div>
      )
    }
  },
  {
    name: 'AProgress',
    inheritAttrs: false,
  },
)

;(Progress as any).install = (app: App) => {
  app.component(Progress.name, Progress)
}

export default Progress
