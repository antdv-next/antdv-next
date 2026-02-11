// https://github.com/ant-design/ant-design/issues/14324
import type { LiteralUnion } from '@v-c/util/dist/type'
import type { App, CSSProperties } from 'vue'
import { classNames } from '@v-c/util'
import { getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { computed, defineComponent } from 'vue'
import { responsiveArrayReversed } from '../_util/responsiveObserver'
import { useConfig } from '../config-provider/context.ts'
import { genCssVar } from '../theme/util/genStyleUtils.ts'
import { useRowContext } from './RowContext.ts'
import { useColStyle } from './style'

type ColSpanType = number | string

type FlexType = number | LiteralUnion<'none' | 'auto'>

export interface ColSize {
  flex?: FlexType
  span?: ColSpanType
  order?: ColSpanType
  offset?: ColSpanType
  push?: ColSpanType
  pull?: ColSpanType
}

export interface ColProps {
  flex?: FlexType
  span?: ColSpanType
  order?: ColSpanType
  offset?: ColSpanType
  push?: ColSpanType
  pull?: ColSpanType
  prefixCls?: string
  xs?: ColSpanType | ColSize
  sm?: ColSpanType | ColSize
  md?: ColSpanType | ColSize
  lg?: ColSpanType | ColSize
  xl?: ColSpanType | ColSize
  xxl?: ColSpanType | ColSize
  xxxl?: ColSpanType | ColSize
}

function isNumber(value: any): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

function parseFlex(flex: FlexType): string {
  if (isNumber(flex)) {
    return `${flex} ${flex} auto`
  }

  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
    return `0 0 ${flex}`
  }

  return flex
}

const Col = defineComponent<ColProps>(
  (props, { slots, attrs }) => {
    const configCtx = useConfig()
    const { gutter, wrap } = useRowContext()

    const prefixCls = computed(() => configCtx.value?.getPrefixCls('col', props.prefixCls))
    const rootPrefixCls = computed(() => configCtx.value?.getPrefixCls())
    const [varName] = genCssVar(rootPrefixCls.value, 'col')

    const [hashId, cssVarCls] = useColStyle(prefixCls)

    return () => {
      const { span, order, offset, push, pull, flex } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)

      // ===================== Size ======================
      const sizeStyle: Record<string, string> = {}

      let sizeClassObj: Record<string, boolean | ColSpanType> = {}
      responsiveArrayReversed.forEach((size) => {
        let sizeProps: ColSize = {}
        const propSize = props[size]
        if (typeof propSize === 'number') {
          sizeProps.span = propSize
        }
        else if (typeof propSize === 'object') {
          sizeProps = propSize || {}
        }

        // delete others[size];

        sizeClassObj = {
          ...sizeClassObj,
          [`${prefixCls.value}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
          [`${prefixCls.value}-${size}-order-${sizeProps.order}`]: sizeProps.order || sizeProps.order === 0,
          [`${prefixCls.value}-${size}-offset-${sizeProps.offset}`]:
                    sizeProps.offset || sizeProps.offset === 0,
          [`${prefixCls.value}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0,
          [`${prefixCls.value}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0,
          [`${prefixCls.value}-rtl`]: configCtx.value.direction === 'rtl',
        }

        // Responsive flex layout
        if (sizeProps.flex) {
          sizeClassObj[`${prefixCls.value}-${size}-flex`] = true
          sizeStyle[varName(`${size}-flex`)] = parseFlex(sizeProps.flex)
        }
      })

      // ==================== Normal =====================
      const classes = classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-${span}`]: span !== undefined,
          [`${prefixCls.value}-order-${order}`]: order,
          [`${prefixCls.value}-offset-${offset}`]: offset,
          [`${prefixCls.value}-push-${push}`]: push,
          [`${prefixCls.value}-pull-${pull}`]: pull,
        },
        sizeClassObj,
        hashId.value,
        cssVarCls.value,
        className,
      )
      const mergedStyle: CSSProperties = {}

      // Horizontal gutter use padding
      if (gutter?.value && gutter.value[0] > 0) {
        const horizontalGutter = gutter.value[0] / 2
        mergedStyle.paddingLeft = `${horizontalGutter}px`
        mergedStyle.paddingRight = `${horizontalGutter}px`
      }
      if (flex) {
        mergedStyle.flex = parseFlex(flex)
        // Hack for Firefox to avoid size issue
        // https://github.com/ant-design/ant-design/pull/20023#issuecomment-564389553
        if (wrap?.value === false && !mergedStyle.minWidth) {
          mergedStyle.minWidth = 0
        }
      }

      // ==================== Render =====================

      return (
        <div
          {...restAttrs}
          class={classes}
          style={[mergedStyle, style, sizeStyle]}
        >
          {slots.default?.()}
        </div>
      )
    }
  },
  {
    name: 'ACol',
    inheritAttrs: false,
  },
)
;(Col as any).install = (app: App) => {
  app.component(Col.name, Col)
}
export default Col
