import type { SlotsType } from 'vue'
import type { EmptyEmit } from '../_util/type.ts'
import type { DirectionType } from '../config-provider/context'
import type {
  PercentPositionType,
  ProgressGradient,
  ProgressProps,
  ProgressSemanticClassNames,
  ProgressSemanticStyles,
  StringGradients,
} from './progress'
import { presetPrimaryColors } from '@ant-design/colors'
import { clsx } from '@v-c/util'
import { computed, defineComponent } from 'vue'
import { devUseWarning, isDev } from '../_util/warning.ts'
import { LineStrokeColorVar } from './style'
import { getSize, getSuccessPercent, validProgress } from './utils.ts'

export interface LineProps extends Omit<ProgressProps, 'classes' | 'styles'> {
  prefixCls: string
  direction?: DirectionType
  strokeColor?: string | ProgressGradient
  percentPosition: PercentPositionType
  classes: ProgressSemanticClassNames
  styles: ProgressSemanticStyles
}

/**
 * @example
 *   {
 *     "0%": "#afc163",
 *     "75%": "#009900",
 *     "50%": "green", // ====> '#afc163 0%, #66FF00 25%, #00CC00 50%, #009900 75%, #ffffff 100%'
 *     "25%": "#66FF00",
 *     "100%": "#ffffff"
 *   }
 */
export function sortGradient(gradients: StringGradients) {
  let tempArr: { key: number, value?: string }[] = []
  Object.keys(gradients).forEach((key) => {
    const formattedKey = Number.parseFloat(key.replace(/%/g, ''))
    if (!Number.isNaN(formattedKey)) {
      tempArr.push({ key: formattedKey, value: gradients[key] })
    }
  })
  tempArr = tempArr.sort((a, b) => a.key - b.key)
  return tempArr.map(({ key, value }) => `${value} ${key}%`).join(', ')
}

/**
 * Then this man came to realize the truth: Besides six pence, there is the moon. Besides bread and
 * butter, there is the bug. And... Besides women, there is the code.
 *
 * @example
 *   {
 *     "0%": "#afc163",
 *     "25%": "#66FF00",
 *     "50%": "#00CC00", // ====>  linear-gradient(to right, #afc163 0%, #66FF00 25%,
 *     "75%": "#009900", //        #00CC00 50%, #009900 75%, #ffffff 100%)
 *     "100%": "#ffffff"
 *   }
 */
export function handleGradient(strokeColor: ProgressGradient, directionConfig?: DirectionType) {
  const {
    from = presetPrimaryColors.blue,
    to = presetPrimaryColors.blue,
    direction = directionConfig === 'rtl' ? 'to left' : 'to right',
    ...rest
  } = strokeColor
  if (Object.keys(rest).length !== 0) {
    const sortedGradients = sortGradient(rest as StringGradients)
    const background = `linear-gradient(${direction}, ${sortedGradients})`
    return { background, [LineStrokeColorVar]: background }
  }
  const background = `linear-gradient(${direction}, ${from}, ${to})`
  return { background, [LineStrokeColorVar]: background }
}

const Line = defineComponent<
  LineProps,
  EmptyEmit,
  string,
  SlotsType<{
    default?: () => any
  }>
>(
  (props, { slots }) => {
    if (isDev) {
      const warning = devUseWarning('Progress')
      warning.deprecated(!(props.strokeWidth !== undefined), 'strokeWidth', 'size')
    }

    const mergedSize = computed(
      () => props.size ?? [-1, props.strokeWidth || (props.size === 'small' ? 6 : 8)],
    )

    return () => {
      const {
        prefixCls,
        classes,
        styles,
        direction: directionConfig,
        percent,
        strokeWidth,
        strokeColor,
        strokeLinecap = 'round',
        railColor,
        trailColor,
        percentPosition,
        success,
      } = props

      const { align: infoAlign, type: infoPosition } = percentPosition

      const mergedRailColor = railColor ?? trailColor

      const borderRadius = strokeLinecap === 'square' || strokeLinecap === 'butt' ? 0 : undefined

      // ========================= Size =========================
      const [width, height] = getSize(mergedSize.value as any, 'line', { strokeWidth })

      // ========================= Rail =========================
      const railStyle = {
        backgroundColor: mergedRailColor || undefined,
        borderRadius: `${borderRadius}px`,
        height: `${height}px`,
      }

      // ======================== Tracks ========================
      const trackCls = `${prefixCls}-track`
      const backgroundProps
        = strokeColor && typeof strokeColor !== 'string'
          ? handleGradient(strokeColor, directionConfig)
          : { [LineStrokeColorVar]: strokeColor, background: strokeColor }

      const percentTrackStyle = {
        width: `${validProgress(percent)}%`,
        height,
        borderRadius,
        ...backgroundProps,
      }

      const successPercent = getSuccessPercent(props)
      const successTrackStyle = {
        width: `${validProgress(successPercent)}%`,
        height,
        borderRadius,
        backgroundColor: success?.strokeColor,
      }

      return (
        <div
          class={clsx(`${prefixCls}-body`, classes.body, {
            [`${prefixCls}-body-layout-bottom`]: infoAlign === 'center' && infoPosition === 'outer',
          })}
          style={{ width: width > 0 ? width : '100%', ...styles.body }}
        >
          {/** ************ Rail */}
          <div
            class={clsx(`${prefixCls}-rail`, classes.rail)}
            style={{ ...railStyle, ...styles.rail }}
          >
            {/** *********** Track */}
            {/* Percent */}
            <div
              class={clsx(trackCls, classes.track)}
              style={{
                ...percentTrackStyle,
                ...styles.track,
              }}
            >
              {infoPosition === 'inner' && slots.default?.()}
            </div>

            {/* Success */}
            {successPercent !== undefined && (
              <div
                class={clsx(trackCls, `${trackCls}-success`, classes.track)}
                style={{
                  ...successTrackStyle,
                  ...styles.track,
                }}
              />
            )}
          </div>

          {/* Indicator */}
          {infoPosition === 'outer' && slots.default?.()}
        </div>
      )
    }
  },
  {
    name: 'ProgressLine',
    inheritAttrs: false,
  },
)

export default Line
