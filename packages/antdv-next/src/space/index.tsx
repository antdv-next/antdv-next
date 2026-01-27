import type { App, CSSProperties, SlotsType } from 'vue'
import type { Orientation, SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { SizeType } from '../config-provider/SizeContext'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, defineComponent, shallowRef } from 'vue'
import { isPresetSize, isValidGapNumber } from '../_util/gapSize.ts'
import { pureAttrs, useMergeSemantic, useOrientation, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropFn, toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import Addon from './Addon.tsx'
import Compact from './Compact.tsx'
import { useSpaceContextProvider } from './context.ts'
import Item from './Item.tsx'
import useStyle from './style'

export type SpaceSize = SizeType | number

export type SpaceSemanticName = keyof SpaceSemanticClassNames & keyof SpaceSemanticStyles

export interface SpaceSemanticClassNames {
  root?: string
  item?: string
  separator?: string
}

export interface SpaceSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  separator?: CSSProperties
}

export type SpaceClassNamesType = SemanticClassNamesType<SpaceProps, SpaceSemanticClassNames>

export type SpaceStylesType = SemanticStylesType<SpaceProps, SpaceSemanticStyles>

export interface SpaceProps extends ComponentBaseProps {
  size?: SpaceSize | [SpaceSize, SpaceSize]
  /** @deprecated please use `orientation` instead */
  direction?: Orientation
  orientation?: Orientation
  vertical?: boolean
  // No `stretch` since many components do not support that.
  align?: 'start' | 'end' | 'center' | 'baseline'
  separator?: VueNode
  wrap?: boolean
  classes?: SpaceClassNamesType
  styles?: SpaceStylesType
}

const defaultSizeProps = {
  size: undefined,
  direction: 'horizontal',
} as any

export interface SpaceSlots {
  default?: () => any
  separator?: () => any
}

const InternalSpace = defineComponent<
  SpaceProps,
  EmptyEmit,
  string,
  SlotsType<SpaceSlots>
>(
  (props = defaultSizeProps, { slots, attrs }) => {
    const {
      prefixCls,
      direction: directionConfig,
      size: contextSize,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('space', props, ['size'])
    const {
      orientation,
      vertical,
      direction,
      size,
      align,
      classes,
      styles,
    } = toPropsRefs(props, 'orientation', 'vertical', 'direction', 'size', 'align', 'classes', 'styles')
    const [mergedOrientation, mergedVertical] = useOrientation(orientation, vertical, direction)

    const sizes = computed(() => {
      const _size = size.value ?? contextSize.value ?? 'small'
      return Array.isArray(_size) ? _size : ([_size, _size] as const)
    })
    const isPresetVerticalSize = computed(() => isPresetSize(sizes.value?.[1]))
    const isPresetHorizontalSize = computed(() => isPresetSize(sizes.value?.[0]))
    const isValidVerticalSize = computed(() => isValidGapNumber(sizes.value?.[1]))
    const isValidHorizontalSize = computed(() => isValidGapNumber(sizes.value?.[0]))
    const mergedAlign = computed(() => align.value === undefined && !mergedVertical.value ? 'center' : align.value)
    const [hashId, cssVarCls] = useStyle(prefixCls)

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        orientation: mergedOrientation.value,
        align: mergedAlign.value,
      }
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      SpaceClassNamesType,
      SpaceStylesType,
      SpaceProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    const latestIndex = shallowRef(0)
    useSpaceContextProvider(computed(() => {
      return {
        latestIndex: latestIndex.value,
      }
    }))
    return () => {
      const verticalSize = sizes.value?.[1]
      const horizontalSize = sizes.value?.[0]
      const cls = classNames(
        prefixCls.value,
        contextClassName.value,
        hashId.value,
        `${prefixCls.value}-${mergedOrientation.value}`,
        {
          [`${prefixCls.value}-rtl`]: directionConfig.value === 'rtl',
          [`${prefixCls.value}-align-${mergedAlign.value}`]: mergedAlign.value,
          [`${prefixCls.value}-gap-row-${verticalSize}`]: isPresetVerticalSize.value,
          [`${prefixCls.value}-gap-col-${horizontalSize}`]: isPresetHorizontalSize.value,
        },
        (attrs as any).class,
        props.rootClass,
        cssVarCls.value,
        mergedClassNames.value.root,
      )
      const childNodes = filterEmpty(slots?.default?.())
      const itemClassName = classNames(
        `${prefixCls.value}-item`,
        mergedClassNames.value.item,
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
            classes={mergedClassNames.value}
            styles={mergedStyles.value}
            key={key}
            index={i}
            v-slots={{
              default: () => child,
              separator: getSlotPropFn(slots, props, 'separator'),
            }}
            style={mergedStyles.value.item}
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
      return (
        <div
          class={cls}
          style={[gapStyle, mergedStyles.value.root, contextStyle.value, (attrs as any).style]}
          {...pureAttrs(attrs)}
        >
          {nodes}
        </div>
      )
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
  app.component(Addon.name, Addon)
}

export default Space
export const SpaceCompact = Compact
export const SpaceAddon = Addon
