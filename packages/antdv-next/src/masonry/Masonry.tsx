import type { CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { Breakpoint } from '../_util/responsiveObserver'
import type { ComponentBaseProps } from '../config-provider/context'
import type { RowProps } from '../grid'
import type { ItemHeightData } from './hooks/usePositions'
import type { MasonryItemType } from './MasonryItem'
import ResizeObserver from '@v-c/resize-observer'
import { clsx } from '@v-c/util'
import { getDOM } from '@v-c/util/dist/Dom/findDOMNode'
import isEqual from '@v-c/util/dist/isEqual'
import { getTransitionGroupProps } from '@v-c/util/dist/utils/transition'
import { computed, defineComponent, onMounted, ref, shallowRef, TransitionGroup, watch } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { useChildLoadEvents } from '../_util/hooks/useChildLoadEvents.ts'
import { responsiveArray } from '../_util/responsiveObserver'
import { toPropsRefs } from '../_util/tools'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import useBreakpoint from '../grid/hooks/useBreakpoint'
import useGutter from '../grid/hooks/useGutter'
import { genCssVar } from '../theme/util/genStyleUtils'
import useDelay from './hooks/useDelay'
import usePositions from './hooks/usePositions'
import useRefs from './hooks/useRefs'
import MasonryItem from './MasonryItem'
import useStyle from './style'

export type Gap = number | undefined
export type Key = string | number

export type MasonrySemanticName = keyof MasonrySemanticClassNames & keyof MasonrySemanticStyles

export interface MasonrySemanticClassNames {
  root?: string
  item?: string
}

export interface MasonrySemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
}

export type MasonryClassNamesType = SemanticClassNamesType<MasonryProps, MasonrySemanticClassNames>

export type MasonryStylesType = SemanticStylesType<MasonryProps, MasonrySemanticStyles>

export interface MasonryProps extends ComponentBaseProps {
  classes?: MasonryClassNamesType
  styles?: MasonryStylesType
  /** Spacing between items */
  gutter?: RowProps['gutter']

  // Data
  items?: MasonryItemType[]

  itemRender?: (itemInfo: MasonryItemType & { index: number }) => any

  /** Number of columns in the masonry grid layout */
  columns?: number | Partial<Record<Breakpoint, number>>

  /** Trigger when item layout order changed */
  // onLayoutChange?: (sortInfo: { key: Key; column: number }[]) => void;

  fresh?: boolean

}

export interface MasonryEmits {
  layoutChange: (sortInfo: { key: Key, column: number }[]) => void
}

export interface MasonrySlots {
  default: () => any
  itemRender?: (itemInfo: MasonryItemType & { index: number }) => any
}

export interface MasonryRef {
  nativeElement: HTMLDivElement
}

type ItemColumnsType = [item: MasonryItemType, column: number]

const defaults = {
  gutter: 0,
} as any
const Masonry = defineComponent<
  MasonryProps,
  MasonryEmits,
  string,
  SlotsType<MasonrySlots>
>(
  (props = defaults, { expose, emit, attrs, slots }) => {
    const {
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      prefixCls,
      rootPrefixCls,
    } = useComponentBaseConfig('masonry', props)
    const { classes, styles, gutter, columns } = toPropsRefs(props, 'classes', 'styles', 'gutter', 'columns')

    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    const [varName, varRef] = genCssVar(rootPrefixCls.value, 'masonry')
    // ======================= Refs =======================
    const containerRef = shallowRef<HTMLDivElement>()
    expose({
      nativeElement: containerRef,
    })

    const [setItemRef, getItemRef] = useRefs()

    // ======================= Item =======================
    const mergedItems = shallowRef<MasonryItemType[]>([])
    watch(
      () => props.items,
      () => {
        mergedItems.value = props?.items ?? []
      },
      {
        immediate: true,
      },
    )

    // ==================== Breakpoint ====================
    const screens = useBreakpoint()
    const gutters = useGutter(gutter, screens)
    const horizontalGutter = computed(() => gutters.value[0] || 0)
    const verticalGutter = computed(() => gutters.value[1] || horizontalGutter.value)

    // ====================== Layout ======================
    const columnCount = computed(() => {
      if (!columns.value) {
        return 3
      }
      if (typeof columns.value === 'number') {
        return columns.value
      }
      // Find first matching responsive breakpoint
      const matchingBreakpoint = responsiveArray.find(
        breakpoint => screens.value![breakpoint] && (columns.value as any)?.[breakpoint] !== undefined,
      )

      if (matchingBreakpoint) {
        return columns.value[matchingBreakpoint] as number
      }
      return columns.value.xs ?? 1
    })

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        columns: columnCount.value,
      } as MasonryProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      MasonryClassNamesType,
      MasonryStylesType,
      MasonryProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    // ================== Items Position ==================
    const itemHeights = ref<ItemHeightData[]>([])

    const collectItemSize = useDelay(() => {
      const nextItemHeights = mergedItems.value.map((item, index) => {
        const itemKey = item?.key ?? index
        const itemEle = getItemRef(itemKey)
        const rect = itemEle?.getBoundingClientRect()
        return [itemKey, rect ? rect?.height : 0, item?.column] as const
      })
      if (!isEqual(itemHeights.value, nextItemHeights)) {
        itemHeights.value = nextItemHeights as any
      }
    })

    const { bindEvent } = useChildLoadEvents()
    onMounted(() => {
      if (containerRef.value) {
        bindEvent(containerRef.value, () => {
          collectItemSize()
        })
      }
    })
    const [itemPositions, totalHeight] = usePositions(
      itemHeights,
      columnCount,
      verticalGutter,
    )

    const itemWithPositions = computed(() => {
      return mergedItems.value.map((item, index) => {
        const key = item.key ?? index
        return {
          item,
          itemIndex: index,
          // CSSMotion will transform key to string.
          // Let's keep the original key here.
          itemKey: key,
          key,
          position: itemPositions.value.get(key),
        } as const
      })
    })

    watch(
      [mergedItems, columnCount],
      () => {
        collectItemSize()
      },
      {
        immediate: true,
        flush: 'post',
      },
    )

    // Trigger for `onLayoutChange`
    const itemColumns = ref<ItemColumnsType[]>([])

    watch(
      itemWithPositions,
      () => {
        if (itemWithPositions.value.every(({ position }) => position)) {
          const nextItemColumns = itemWithPositions.value.map<ItemColumnsType>(({ item, position }) => [
            item,
            position!.column,
          ])
          if (!isEqual(itemColumns.value, nextItemColumns)) {
            itemColumns.value = nextItemColumns
          }
        }
      },
      {
        immediate: true,
        flush: 'post',
      },
    )

    watch(
      itemColumns,
      async () => {
        if (!props.items?.length || props.items.length !== itemColumns.value.length) {
          return
        }
        const items = itemColumns.value.map(([item, column]) => ({ ...item, column }))
        emit('layoutChange', items)
      },
      {
        immediate: true,
        flush: 'post',
      },
    )

    return () => {
      const { fresh } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const motionName = `${prefixCls.value}-item-fade`
      const transitionProps = getTransitionGroupProps(motionName)
      const itemRender = slots?.itemRender ?? props?.itemRender
      return (
        <ResizeObserver onResize={collectItemSize}>
          <div
            {...restAttrs}
            ref={containerRef}
            class={clsx(
              prefixCls.value,
              contextClassName.value,
              mergedClassNames.value?.root,
              props.rootClass,
              className,
              hashId.value,
              cssVarCls.value,
              { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
            )}
            style={{
              height: `${totalHeight.value}px`,
              ...contextStyles.value.root,
              ...contextStyle.value,
              ...style,
            }}
          >
            <TransitionGroup {...transitionProps}>
              {itemWithPositions.value.map((motionInfo) => {
                const {
                  item,
                  itemKey,
                  itemIndex,
                  key,
                } = motionInfo
                const position = motionInfo.position as any
                const columnIndex = position?.column ?? 0
                const widthVar = `calc((100% + ${horizontalGutter.value}px) / ${columnCount.value})`
                const itemStyle: CSSProperties = {
                  [varName('item-width')]: widthVar,
                  insetInlineStart: `calc(${varRef('item-width')} * ${columnIndex})`,
                  width: `calc(${varRef('item-width')} - ${horizontalGutter.value}px)`,
                  top: `${position?.top}px`,
                  position: 'absolute',
                }

                return (
                  <MasonryItem
                    key={key}
                    ref={(ele) => {
                      setItemRef(itemKey, getDOM(ele) as any)
                    }}
                    prefixCls={prefixCls.value}
                    item={item}
                    class={clsx(mergedClassNames.value?.item, item.class)}
                    style={{
                      ...(mergedStyles.value?.item ?? {}),
                      ...(item.style ?? {}),
                      ...itemStyle,
                    }}
                    index={itemIndex}
                    itemRender={itemRender}
                    column={columnIndex}
                    onResize={fresh ? collectItemSize : null}
                  />
                )
              })}
            </TransitionGroup>
          </div>
        </ResizeObserver>
      )
    }
  },
  {
    name: 'AMasonry',
    inheritAttrs: false,
  },
)

export default Masonry
