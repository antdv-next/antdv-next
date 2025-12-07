import type { EmptyEmit } from '../../_util/type.ts'
import type { AggregationColor } from '../color'
import type { ColorFormatType } from '../interface'
import { computed, defineComponent, shallowRef, watch } from 'vue'
import Select from '../../select'
import { FORMAT_HEX, FORMAT_HSB, FORMAT_RGB } from '../interface'
import ColorAlphaInput from './ColorAlphaInput'
import ColorHexInput from './ColorHexInput'
import ColorHsbInput from './ColorHsbInput'
import ColorRgbInput from './ColorRgbInput'

export interface ColorInputProps {
  prefixCls: string
  format?: ColorFormatType
  onFormatChange?: (format: ColorFormatType) => void
  disabledAlpha?: boolean
  value?: AggregationColor
  onChange?: (value: AggregationColor) => void
  disabledFormat?: boolean
}

const selectOptions = [FORMAT_HEX, FORMAT_HSB, FORMAT_RGB].map(format => ({
  value: format,
  label: format.toUpperCase(),
}))

export default defineComponent<
  ColorInputProps,
  EmptyEmit,
  string
>(
  (props) => {
    const colorFormat = shallowRef<ColorFormatType>(props.format ?? FORMAT_HEX)

    watch(
      () => props.format,
      (val) => {
        if (val)
          colorFormat.value = val
      },
    )

    const triggerFormatChange = (fmt: ColorFormatType) => {
      colorFormat.value = fmt
      props.onFormatChange?.(fmt)
    }

    const steppersNode = computed(() => {
      const inputProps = { value: props.value, prefixCls: props.prefixCls, onChange: props.onChange }
      switch (colorFormat.value) {
        case FORMAT_HSB:
          return <ColorHsbInput {...inputProps} />
        case FORMAT_RGB:
          return <ColorRgbInput {...inputProps} />
        default:
          return <ColorHexInput {...inputProps} />
      }
    })

    return () => {
      const prefixCls = props.prefixCls

      return (
        <div class={`${prefixCls}-input-container`}>
          {!props.disabledFormat && (
            <Select
              value={colorFormat.value}
              variant="borderless"
              getPopupContainer={current => current}
              popupMatchSelectWidth={68}
              placement="bottomRight"
              onChange={triggerFormatChange}
              class={`${prefixCls}-format-select`}
              size="small"
              options={selectOptions}
            />
          )}
          <div class={`${prefixCls}-input`}>
            {steppersNode.value}
            {!props.disabledAlpha && (
              <ColorAlphaInput prefixCls={prefixCls} value={props.value} onChange={props.onChange} />
            )}
          </div>
        </div>
      )
    }
  },
  {
    name: 'ColorInput',
    inheritAttrs: false,
  },
)
