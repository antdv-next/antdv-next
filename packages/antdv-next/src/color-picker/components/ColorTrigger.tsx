import type { CSSProperties } from 'vue'
import type { EmptyEmit } from '../../_util/type.ts'
import type { AggregationColor } from '../color'
import type {
  ColorFormatType,
  ColorPickerProps,
  ColorPickerSemanticClassNames,
  ColorPickerSemanticStyles,
} from '../interface'
import { ColorBlock } from '@v-c/color-picker'
import { clsx } from '@v-c/util'
import { computed, defineComponent } from 'vue'
import useLocale from '../../locale/useLocale'
import { getColorAlpha } from '../util'
import ColorClear from './ColorClear'

export interface ColorTriggerProps {
  prefixCls: string
  disabled?: boolean
  format?: ColorFormatType
  color: AggregationColor
  open?: boolean
  showText?: ColorPickerProps['showText']
  className?: string
  style?: CSSProperties
  activeIndex: number
  classes: ColorPickerSemanticClassNames
  styles: ColorPickerSemanticStyles
}

export default defineComponent<
  ColorTriggerProps,
  EmptyEmit,
  string
>(
  (props, { attrs }) => {
    const [locale] = useLocale('ColorPicker')
    const colorTriggerPrefixCls = computed(() => `${props.prefixCls}-trigger`)
    const colorTextPrefixCls = computed(() => `${colorTriggerPrefixCls.value}-text`)
    const colorTextCellPrefixCls = computed(() => `${colorTextPrefixCls.value}-cell`)

    const desc = computed(() => {
      const { color, showText, format, activeIndex } = props
      if (!showText)
        return ''
      if (typeof showText === 'function')
        return showText({ color })
      if (color.cleared)
        return locale?.value?.transparent
      if (color.isGradient()) {
        return color.getColors().map((c, index) => {
          const inactive = activeIndex !== -1 && activeIndex !== index
          return (
            <span
              key={index}
              class={clsx(
                colorTextCellPrefixCls.value,
                inactive && `${colorTextCellPrefixCls.value}-inactive`,
              )}
            >
              {`${c.color.toRgbString()} ${c.percent}%`}
            </span>
          )
        })
      }
      const hexString = color.toHexString().toUpperCase()
      const alpha = getColorAlpha(color)
      switch (format) {
        case 'rgb':
          return color.toRgbString()
        case 'hsb':
          return color.toHsbString()
        default:
          return alpha < 100 ? `${hexString.slice(0, 7)},${alpha}%` : hexString
      }
    })

    const containerNode = computed(() => {
      const { color, prefixCls, classes, styles } = props
      return color?.cleared
        ? (
            <ColorClear
              prefixCls={prefixCls}
              class={classes.body}
              style={styles.body}
            />
          )
        : (
            <ColorBlock
              innerClassName={classes.content}
              innerStyle={styles.content}
              class={classes.body}
              style={styles.body}
              prefixCls={prefixCls}
              color={color.toCssString()}
            />
          )
    })

    return () => {
      const { open, disabled, style, className, classes, styles } = props
      return (
        <div
          {...attrs}
          class={clsx(
            colorTriggerPrefixCls.value,
            className,
            classes.root,
            {
              [`${colorTriggerPrefixCls.value}-active`]: open,
              [`${colorTriggerPrefixCls.value}-disabled`]: disabled,
            },
          )}
          style={[
            styles.root,
            style,
          ]}
        >
          {containerNode.value}
          {props.showText && (
            <div
              class={[colorTextPrefixCls.value, classes.description]}
              style={classes.description}
            >
              {desc.value}
            </div>
          )}
        </div>
      )
    }
  },
  {
    name: 'AColorTrigger',
    inheritAttrs: false,
  },
)
