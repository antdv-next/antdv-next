import type { App, CSSProperties, SlotsType } from 'vue'
import type { RenderNodeFn } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { SizeType } from '../config-provider/SizeContext'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, defineComponent, shallowRef } from 'vue'
import { isPresetSize, isValidGapNumber } from '../_util/gapSize.ts'
import { getSlotPropFn } from '../_util/tools.ts'
import { useComponentConfig } from '../config-provider/context.ts'
import Compact from './Compact.tsx'
import { useSpaceContextProvider } from './context.ts'
import Item from './Item.tsx'
import useStyle from './style'

export type SpaceSize = SizeType | number

export interface SpaceProps extends ComponentBaseProps {
  size?: SpaceSize | [SpaceSize, SpaceSize]
  direction?: 'horizontal' | 'vertical'
  // No `stretch` since many components do not support that.
  align?: 'start' | 'end' | 'center' | 'baseline'
  split?: RenderNodeFn
  wrap?: boolean
  classes?: { item: string }
  styles?: { item: CSSProperties }
}

const defaultSizeProps = {
  size: undefined,
  direction: 'horizontal',
} as any

export interface SpaceSlots {
  default?: () => any
  split?: () => any
}

const InternalSpace = defineComponent<
  SpaceProps,
  Record<string, any>,
  string,
  SlotsType<SpaceSlots>
>(
  (props = defaultSizeProps, { slots, attrs }) => {
    const componentCtx = useComponentConfig('space')

    const sizes = computed(() => {
      const size = props.size ?? componentCtx.value.size ?? 'small'
      return Array.isArray(size) ? size : ([size, size] as const)
    })
    const isPresetVerticalSize = computed(() => isPresetSize(sizes.value?.[1]))
    const isPresetHorizontalSize = computed(() => isPresetSize(sizes.value?.[0]))
    const isValidVerticalSize = computed(() => isValidGapNumber(sizes.value?.[1]))
    const isValidHorizontalSize = computed(() => isValidGapNumber(sizes.value?.[0]))
    const mergedAlign = computed(() => props.align === undefined && props.direction === 'horizontal' ? 'center' : props.align)
    const prefixCls = computed(() => componentCtx.value.getPrefixCls('space', props.prefixCls))
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls.value)

    const latestIndex = shallowRef(0)
    useSpaceContextProvider(computed(() => {
      return {
        latestIndex: latestIndex.value,
      }
    }))
    return () => {
      const directionConfig = componentCtx.value.direction
      const verticalSize = sizes.value?.[1]
      const horizontalSize = sizes.value?.[0]
      const cls = classNames(
        prefixCls.value,
        componentCtx.value.class,
        hashId,
        `${prefixCls.value}-${props.direction}`,
        {
          [`${prefixCls.value}-rtl`]: directionConfig === 'rtl',
          [`${prefixCls.value}-align-${mergedAlign.value}`]: mergedAlign.value,
          [`${prefixCls.value}-gap-row-${verticalSize}`]: isPresetVerticalSize.value,
          [`${prefixCls.value}-gap-col-${horizontalSize}`]: isPresetHorizontalSize.value,
        },
        props.rootClass,
        cssVarCls,
      )
      const childNodes = filterEmpty(slots?.default?.())
      const itemClassName = classNames(
        `${prefixCls.value}-item`,
        props?.classes?.item ?? componentCtx?.value?.classes.item,
      )
      // Calculate latest one
      const nodes = childNodes.map((child, i) => {
        if (child !== null && child !== undefined) {
          latestIndex.value = i
        }
        const key = child?.key || `${itemClassName}-${i}`
        return (
          <Item
            className={itemClassName}
            key={key}
            index={i}
            v-slots={{
              default: () => child,
              split: getSlotPropFn(slots, props, 'split'),
            }}
            style={props?.styles?.item ?? componentCtx.value?.styles?.item}
          />
        )
      })

      // =========================== Render ===========================
      if (childNodes.length === 0) {
        return null
      }
      const gapStyle: CSSProperties = {}
      if (props.wrap) {
        gapStyle.flexWrap = 'wrap'
      }
      if (!isPresetHorizontalSize.value && isValidHorizontalSize.value) {
        gapStyle.columnGap = typeof horizontalSize === 'number' ? `${horizontalSize}px` : horizontalSize
      }
      if (!isPresetVerticalSize.value && isValidVerticalSize.value) {
        gapStyle.rowGap = typeof verticalSize === 'number' ? `${verticalSize}px` : verticalSize
      }
      return wrapCSSVar(<div class={cls} style={[gapStyle, componentCtx.value.style]} {...attrs}>{nodes}</div>)
    }
  },
  {
    name: 'ASpace',
    inheritAttrs: false,
  },
)

const Space = InternalSpace

;(Space as any).install = (app: App) => {
  app.component(InternalSpace.name, Space)
  app.component(Compact.name, Compact)
}

export default Space
export const SpaceCompact = Compact
