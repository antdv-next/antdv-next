import type { GradientColor } from '../../color'
import type { PanelPickerContextProps } from '../../context'
import { computed, defineComponent, shallowRef, watch } from 'vue'
import { AggregationColor } from '../../color'
import { getGradientPercentColor } from '../../util'
import { GradientColorSlider } from '../ColorSlider'

function sortColors(colors: { percent: number, color: string }[]) {
  return [...colors].sort((a, b) => a.percent - b.percent)
}

export interface GradientColorBarProps extends PanelPickerContextProps {
  colors: GradientColor
}

/**
 * GradientColorBar will auto show when the mode is `gradient`.
 */
export default defineComponent<GradientColorBarProps>(
  (props) => {
    const isGradient = computed(() => props.mode === 'gradient')

    const colorList = computed(() => props.colors.map(info => ({
      percent: info.percent,
      color: info.color.toRgbString(),
    })))

    const values = computed(() => colorList.value.map(info => info.percent))

    const colorsRef = shallowRef(colorList.value)

    watch(
      colorList,
      (val) => {
        colorsRef.value = val
      },
      { deep: true },
    )

    const onDragStart = ({ rawValues, draggingIndex, draggingValue }: { rawValues: number[], draggingIndex: number, draggingValue: number }) => {
      if (rawValues.length > colorList.value.length) {
        // Add new node
        const newPointColor = getGradientPercentColor(colorList.value, draggingValue)
        const nextColors = [...colorList.value]
        nextColors.splice(draggingIndex, 0, {
          percent: draggingValue,
          color: newPointColor,
        })

        colorsRef.value = nextColors
      }
      else {
        colorsRef.value = colorList.value
      }

      props.onGradientDragging(true)
      props.onChange?.(new AggregationColor(sortColors(colorsRef.value)), true)
    }

    const onDragChange = ({ deleteIndex, draggingIndex, draggingValue }: { deleteIndex: number, draggingIndex: number, draggingValue: number }) => {
      let nextColors = [...colorsRef.value]

      if (deleteIndex !== -1) {
        nextColors.splice(deleteIndex, 1)
      }
      else {
        ;(nextColors as any)[draggingIndex] = {
          ...nextColors[draggingIndex],
          percent: draggingValue,
        }

        nextColors = sortColors(nextColors)
      }

      props.onChange?.(new AggregationColor(nextColors), true)
    }

    const onKeyDelete = (index: number) => {
      // A gradient needs at least two stops
      if (colorList.value.length <= 2) {
        return
      }

      const nextColors = [...colorList.value]
      nextColors.splice(index, 1)

      if (props.activeIndex >= nextColors.length) {
        props.onActive(nextColors.length - 1)
      }

      const nextColor = new AggregationColor(nextColors)

      props.onChange?.(nextColor)
      props.onChangeComplete?.(nextColor)
    }

    const onInternalChangeComplete = (nextValues: number[]) => {
      props.onChangeComplete?.(new AggregationColor(colorList.value))

      if (props.activeIndex >= nextValues.length) {
        props.onActive(nextValues.length - 1)
      }

      props.onGradientDragging(false)
    }

    return () => {
      if (!isGradient.value) {
        return null
      }

      return (
        <GradientColorSlider
          min={0}
          max={100}
          prefixCls={props.prefixCls}
          className={`${props.prefixCls}-gradient-slider`}
          colors={colorList.value}
          color={null as any}
          value={values.value}
          range
          onChangeComplete={onInternalChangeComplete}
          disabled={false}
          type="gradient"
          activeIndex={props.activeIndex}
          onActive={props.onActive}
          onDragStart={onDragStart}
          onDragChange={onDragChange}
          onKeyDelete={onKeyDelete}
        />
      )
    }
  },
  {
    name: 'GradientColorBar',
    inheritAttrs: false,
  },
)
