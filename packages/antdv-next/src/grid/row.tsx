import type { App, CSSProperties, Ref } from 'vue'
import type { Breakpoint, ScreenMap } from '../_util/responsiveObserver.ts'
import { classNames } from '@v-c/util'
import { getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { computed, defineComponent, shallowRef, watch } from 'vue'
import { responsiveArray } from '../_util/responsiveObserver.ts'
import { useConfig } from '../config-provider/context.ts'
import { useBreakpoint } from './hooks/useBreakpoint.tsx'
import useGutter from './hooks/useGutter.ts'
import { useRowContextProvider } from './RowContext.ts'
import { useRowStyle } from './style'

const _RowAligns = ['top', 'middle', 'bottom', 'stretch'] as const
const _RowJustify = [
  'start',
  'end',
  'center',
  'space-around',
  'space-between',
  'space-evenly',
] as const

type ResponsiveLike<T> = {
  [key in Breakpoint]?: T;
}

export type Gutter = number | undefined | Partial<Record<Breakpoint, number>>

type ResponsiveAligns = ResponsiveLike<(typeof _RowAligns)[number]>
type ResponsiveJustify = ResponsiveLike<(typeof _RowJustify)[number]>
export interface RowProps {
  gutter?: Gutter | [Gutter, Gutter]
  align?: (typeof _RowAligns)[number] | ResponsiveAligns
  justify?: (typeof _RowJustify)[number] | ResponsiveJustify
  prefixCls?: string
  wrap?: boolean
}

function useMergedPropByScreen(
  oriProp: Ref<RowProps['align'] | RowProps['justify']>,
  screen: Ref<ScreenMap | null>,
) {
  const prop = shallowRef(typeof oriProp.value === 'string' ? oriProp.value : '')
  const calcMergedAlignOrJustify = () => {
    if (typeof oriProp.value === 'string') {
      prop.value = oriProp.value
    }
    if (typeof oriProp.value !== 'object') {
      return
    }
    for (let i = 0; i < responsiveArray.length; i++) {
      const breakpoint: Breakpoint = responsiveArray[i]!
      // if do not match, do nothing
      if (!screen.value || !screen.value[breakpoint]) {
        continue
      }
      const curVal = oriProp.value[breakpoint]
      if (curVal !== undefined) {
        prop.value = curVal
        return
      }
    }
  }
  watch(
    [() => JSON.stringify(oriProp.value), screen],
    () => {
      calcMergedAlignOrJustify()
    },
    {
      immediate: true,
    },
  )
  return prop
}
const defaults = {
  gutter: 0,
} as any

const Row = defineComponent<RowProps>(
  (props = defaults, { attrs, slots }) => {
    const configCtx = useConfig()
    const screens = useBreakpoint(true, null)

    const mergedAlign = useMergedPropByScreen(computed(() => props.align), screens)
    const mergedJustify = useMergedPropByScreen(computed(() => props.justify), screens)
    const prefixCls = computed(() => configCtx.value?.getPrefixCls('row', props.prefixCls))
    const [hashId, cssVarCls] = useRowStyle(prefixCls)

    const gutters = useGutter(computed(() => props.gutter), screens)

    useRowContextProvider({
      gutter: gutters as Ref<[number, number]>,
      wrap: computed(() => props.wrap),
    })

    return () => {
      const { wrap } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const classes = classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-no-wrap`]: wrap === false,
          [`${prefixCls.value}-${mergedJustify.value}`]: mergedJustify.value,
          [`${prefixCls.value}-${mergedAlign.value}`]: mergedAlign.value,
          [`${prefixCls.value}-rtl`]: configCtx.value.direction === 'rtl',
        },
        hashId.value,
        cssVarCls.value,
        className,
      )

      // Add gutter related style
      const rowStyle: CSSProperties = {}
      const horizontalGutter = gutters.value[0] != null && gutters.value[0] > 0 ? gutters.value[0] / -2 : undefined
      if (horizontalGutter) {
        rowStyle.marginLeft = `${horizontalGutter}px`
        rowStyle.marginRight = `${horizontalGutter}px`
      }
      // "gutters" is a new array in each rendering phase, it'll make 'React.useMemo' effectless.
      // So we deconstruct "gutters" variable here.
      const [_, gutterV] = gutters.value
      if (gutterV) {
        rowStyle.rowGap = `${gutterV}px`
      }

      return (
        <div {...restAttrs} class={classes} style={[rowStyle, style]}>
          {slots?.default?.()}
        </div>
      )
    }
  },
  {
    name: 'ARow',
    inheritAttrs: false,
  },
)
;(Row as any).install = (app: App) => {
  app.component(Row.name, Row)
}

export default Row
