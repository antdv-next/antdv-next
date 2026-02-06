import VcColorPicker from '@v-c/color-picker'
import { defineComponent, shallowRef, watch } from 'vue'
import Segmented from '../../../segmented'
import { AggregationColor } from '../../color'
import { usePanelPickerContext } from '../../context'
import { genAlphaColor, generateColor } from '../../util'
import ColorClear from '../ColorClear'
import ColorInput from '../ColorInput'
import ColorSlider from '../ColorSlider'
import GradientColorBar from './GradientColorBar'

export default defineComponent(
  () => {
    const panelPickerContext = usePanelPickerContext()

    const colors = () => {
      const ctx = panelPickerContext.value
      if (ctx?.value && !ctx.value.cleared) {
        return ctx.value.getColors()
      }
      return [
        {
          percent: 0,
          color: new AggregationColor(''),
        },
        {
          percent: 100,
          color: new AggregationColor(''),
        },
      ]
    }

    const isSingle = () => !panelPickerContext.value?.value?.isGradient()

    const lockedColor = shallowRef<AggregationColor>(panelPickerContext.value?.value ?? new AggregationColor(''))

    watch(
      () => [
        isSingle(),
        panelPickerContext.value?.gradientDragging,
        panelPickerContext.value?.activeIndex,
        panelPickerContext.value?.value?.toHexString?.(),
      ],
      () => {
        if (!isSingle()) {
          lockedColor.value = colors()[panelPickerContext.value?.activeIndex || 0]?.color as any
        }
      },
      { immediate: true },
    )

    const activeColor = () => {
      const ctx = panelPickerContext.value!
      if (isSingle()) {
        return ctx.value
      }
      if (ctx.gradientDragging) {
        return lockedColor.value
      }
      return colors()[ctx.activeIndex]?.color ?? ctx.value
    }

    const pickerColor = shallowRef<AggregationColor | null>(activeColor())
    const forceSync = shallowRef(0)

    const mergedPickerColor = () => (pickerColor.value?.equals(activeColor()) ? activeColor() : pickerColor.value)

    watch(
      () => [activeColor()?.toHexString?.(), forceSync.value],
      () => {
        pickerColor.value = activeColor()
      },
      { immediate: true },
    )

    const fillColor = (nextColor: AggregationColor, info?: { type?: 'hue' | 'alpha', value?: number }) => {
      const ctx = panelPickerContext.value!
      let submitColor = generateColor(nextColor)

      if (ctx.value?.cleared) {
        const rgb = submitColor.toRgb()

        if (!rgb.r && !rgb.g && !rgb.b && info) {
          const { type: infoType, value: infoValue = 0 } = info

          submitColor = new AggregationColor({
            h: infoType === 'hue' ? infoValue : 0,
            s: 1,
            b: 1,
            a: infoType === 'alpha' ? infoValue / 100 : 1,
          })
        }
        else {
          submitColor = genAlphaColor(submitColor)
        }
      }

      if (ctx.mode === 'single') {
        return submitColor
      }

      const nextColors = [...colors()]
      const activeIndex = ctx.activeIndex || 0
      ;(nextColors as any)[activeIndex] = {
        ...nextColors[activeIndex],
        color: submitColor,
      }

      return new AggregationColor(nextColors)
    }

    const onPickerChange = (colorValue: AggregationColor, info?: { type?: 'hue' | 'alpha', value?: number }) => {
      const nextColor = fillColor(generateColor(colorValue), info)
      const activeIndex = panelPickerContext.value?.activeIndex || 0
      pickerColor.value = nextColor.isGradient() ? (nextColor.getColors() as any)[activeIndex].color : nextColor
      panelPickerContext.value?.onChange?.(nextColor, true)
    }

    const onInternalChangeComplete = (nextColor: AggregationColor, info?: { type?: 'hue' | 'alpha', value?: number }) => {
      panelPickerContext.value?.onChangeComplete?.(fillColor(nextColor, info))
      forceSync.value += 1
    }

    const onInputChange = (colorValue: AggregationColor) => {
      panelPickerContext.value?.onChange?.(fillColor(colorValue))
    }

    return () => {
      const {
        prefixCls,
        allowClear,
        disabledAlpha,
        mode,
        onModeChange,
        modeOptions,
        disabled,
        onClear,
        format,
        onFormatChange,
        disabledFormat,
      } = panelPickerContext.value!
      const showMode = (modeOptions?.length || 0) > 1
      const operationNode = allowClear || showMode
        ? (
            <div class={`${prefixCls}-operation`}>
              {showMode && (
                <Segmented
                  size="small"
                  options={modeOptions}
                  value={mode}
                  onChange={(val: any) => onModeChange(val as any)}
                />
              )}
              <ColorClear
                prefixCls={prefixCls}
                value={panelPickerContext.value?.value}
                disabled={disabled}
                onChange={(clearColor) => {
                  panelPickerContext.value?.onChange?.(clearColor)
                  onClear?.()
                }}
              />
            </div>
          )
        : null

      const active = activeColor()

      return (
        <>
          {operationNode}

          <GradientColorBar {...panelPickerContext.value!} colors={colors()} />

          <VcColorPicker
            prefixCls={prefixCls}
            value={mergedPickerColor()?.toHsb()}
            disabledAlpha={disabledAlpha}
            disabled={disabled}
            onChange={(colorValue, info) => {
              onPickerChange(colorValue as any, info as any)
            }}
            onChangeComplete={(colorValue, info) => {
              onInternalChangeComplete(colorValue as any, info as any)
            }}
            components={{ slider: ColorSlider as any }}
          />
          <ColorInput
            value={active}
            onChange={onInputChange}
            prefixCls={prefixCls}
            disabledAlpha={disabledAlpha}
            format={format}
            onFormatChange={onFormatChange}
            disabledFormat={disabledFormat}
          />
        </>
      )
    }
  },
  {
    name: 'ColorPanelPicker',
    inheritAttrs: false,
  },
)
