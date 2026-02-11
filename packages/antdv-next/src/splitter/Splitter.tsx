import type { SizeInfo } from '@v-c/resize-observer'
import type { CSSProperties, SlotsType } from 'vue'
import type {
  SplitterClassNamesType,
  SplitterEmits,
  SplitterProps,
  SplitterSemanticDraggerClassNames,
  SplitterSlots,
  SplitterStylesType,
} from './interface'
import ResizeObserver from '@v-c/resize-observer'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, Fragment, shallowRef } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useOrientation, useToArr, useToProps } from '../_util/hooks'
import { toPropsRefs } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning.ts'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { convertChildrenToItems } from './hooks/useItems.ts'
import useResizable from './hooks/useResizable.ts'
import useResize from './hooks/useResize.ts'
import useSizes from './hooks/useSizes.ts'
import InternalPanel from './Panel.tsx'
import SplitBar from './SplitBar.tsx'
import useStyle from './style'

const Splitter = defineComponent<
  SplitterProps,
  SplitterEmits,
  string,
  SlotsType<SplitterSlots>
>(
  (props, { slots, attrs }) => {
    const {
      prefixCls,
      rootPrefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('splitter', props)
    const { classes, styles, orientation, layout, vertical } = toPropsRefs(props, 'classes', 'styles', 'orientation', 'layout', 'vertical')
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    // ======================== Direct ========================
    const [mergedOrientation, isVertical] = useOrientation(orientation, vertical, layout)
    const isRTL = computed(() => direction.value === 'rtl')
    const reverse = computed(() => !isVertical.value && isRTL.value)

    // ====================== Items Data ======================
    const items = shallowRef<ReturnType<typeof convertChildrenToItems>>([])

    // >>> Warning for uncontrolled

    if (isDev) {
      const warning = devUseWarning('Splitter')
      const existSize = items.value.some(item => item.size !== undefined)
      const existUndefinedSize = items.value.some(item => item.size === undefined)
      if (existSize && existUndefinedSize) {
        warning(
          false,
          'usage',
          'When part of `Splitter.Panel` has `size`, `onResize` is required or change `size` to `defaultSize`.',
        )
      }

      warning.deprecated(!layout.value, 'layout', 'orientation')
    }

    // ====================== Container =======================
    const containerSize = shallowRef<number>()
    const onContainerResize = (size: SizeInfo) => {
      const { offsetWidth, offsetHeight } = size
      const _containerSize = isVertical.value ? offsetHeight : offsetWidth
      // Skip when container has no size, Such as nested in a hidden tab panel
      // to fix: https://github.com/ant-design/ant-design/issues/51106
      if (_containerSize === 0) {
        return
      }
      containerSize.value = _containerSize
    }

    // ========================= Size =========================
    const [panelSizes, itemPxSizes, itemPtgSizes, itemPtgMinSizes, itemPtgMaxSizes, updateSizes] = useSizes(items, containerSize as any)

    // ====================== Resizable =======================
    const resizableInfos = useResizable(items, itemPxSizes, reverse)
    const [onOffsetStart, onOffsetUpdate, onOffsetEnd, onCollapse, movingIndex] = useResize(
      items,
      resizableInfos,
      itemPtgSizes,
      containerSize,
      updateSizes,
      isRTL,
    )

    // ======================== Events ========================

    const onInternalResizeStart = (index: number) => {
      onOffsetStart(index)
      props?.onResizeStart?.(itemPxSizes.value)
    }

    const onInternalResizeUpdate = (index: number, offset: number, lazyEnd?: boolean) => {
      const nextSizes = onOffsetUpdate(index, offset)
      if (lazyEnd) {
        props?.onResizeEnd?.(nextSizes)
      }
      else {
        props?.onResize?.(nextSizes)
      }
    }

    const onInternalResizeEnd = (lazyEnd?: boolean) => {
      onOffsetEnd()
      if (!lazyEnd) {
        props?.onResizeEnd?.(itemPxSizes.value)
      }
    }

    const onInternalCollapse = (index: number, type: 'start' | 'end') => {
      const nextSizes = onCollapse(index, type)
      props?.onResize?.(nextSizes)
      props?.onResizeEnd?.(nextSizes)
      const collapsed = nextSizes.map(size => Math.abs(size) < Number.EPSILON)
      props?.onCollapse?.(collapsed, nextSizes)
      props?.['onUpdate:collapse']?.(collapsed)
    }

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        vertical: isVertical.value,
        orientation: mergedOrientation.value,
      } as SplitterProps
    })

    // ======================== Styles ========================
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      SplitterClassNamesType,
      SplitterStylesType,
      SplitterProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
      computed(() => ({
        // Convert `classNames.dragger: 'a'` to
        // `classNames.dragger: { default: 'a' }`
        dragger: {
          _default: 'default',
        },
      })),
    )

    const stackSizes = computed(() => {
      const mergedSizes: number[] = []
      let stack = 0
      const len = items.value.length
      for (let i = 0; i < len; i += 1) {
        stack += itemPtgSizes.value[i]!
        mergedSizes.push(stack)
      }
      return mergedSizes
    })
    return () => {
      const {
        rootClass,
        lazy,
        draggerIcon,
        collapsibleIcon,
      } = props

      // Update items from slots in render function for reactivity
      items.value = convertChildrenToItems(slots?.default?.() ?? [])
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const containerClassName = clsx(
        prefixCls.value,
        className,
        `${prefixCls.value}-${mergedOrientation.value}`,
        {
          [`${prefixCls.value}-rtl`]: isRTL.value,
        },
        rootClass,
        mergedClassNames.value.root,
        contextClassName.value,
        cssVarCls.value,
        rootCls.value,
        hashId.value,
      )

      // ======================== Render ========================
      const maskCls = `${prefixCls.value}-mask`

      const mergedStyle = {
        ...mergedStyles.value.root,
        ...contextStyle.value,
        ...style,
      }
      return (
        <ResizeObserver onResize={onContainerResize}>
          <div {...restAttrs} style={mergedStyle} class={containerClassName}>
            {items.value?.map?.((item, idx) => {
              const panelProps = {
                ...omit(item, ['_$slots']),
                class: clsx(mergedClassNames.value.panel, item.class),
                style: { ...mergedStyles.value.panel, ...item.style },
              }
              // Panel
              const panel = (
                <InternalPanel {...panelProps} prefixCls={prefixCls.value} size={panelSizes.value[idx]}>
                  {item._$slots?.default?.()}
                </InternalPanel>
              )
              // Split Bar
              let splitBar: any | null = null

              const resizableInfo = resizableInfos.value[idx]
              if (resizableInfo) {
                const ariaMinStart = (stackSizes.value[idx - 1] || 0) + itemPtgMinSizes.value[idx]!
                const ariaMinEnd = (stackSizes.value[idx + 1] || 100) - itemPtgMaxSizes.value[idx + 1]!

                const ariaMaxStart = (stackSizes.value[idx - 1] || 0) + itemPtgMaxSizes.value[idx]!
                const ariaMaxEnd = (stackSizes.value[idx + 1] || 100) - itemPtgMinSizes.value[idx + 1]!

                splitBar = (
                  <SplitBar
                    lazy={lazy}
                    index={idx}
                    active={movingIndex.value === idx}
                    prefixCls={prefixCls.value}
                    rootPrefixCls={rootPrefixCls.value}
                    vertical={isVertical.value}
                    resizable={resizableInfo.resizable}
                    draggerStyle={mergedStyles.value.dragger as CSSProperties}
                    draggerClassName={mergedClassNames.value.dragger as SplitterSemanticDraggerClassNames}
                    draggerIcon={draggerIcon}
                    collapsibleIcon={collapsibleIcon}
                    v-slots={slots}
                    ariaNow={stackSizes.value![idx]! * 100}
                    ariaMin={Math.max(ariaMinStart, ariaMinEnd) * 100}
                    ariaMax={Math.min(ariaMaxStart, ariaMaxEnd) * 100}
                    startCollapsible={resizableInfo.startCollapsible}
                    endCollapsible={resizableInfo.endCollapsible}
                    showStartCollapsibleIcon={resizableInfo.showStartCollapsibleIcon}
                    showEndCollapsibleIcon={resizableInfo.showEndCollapsibleIcon}
                    onDraggerDoubleClick={props?.onDraggerDoubleClick}
                    onOffsetStart={onInternalResizeStart}
                    onOffsetUpdate={(index, offsetX, offsetY, lazyEnd) => {
                      let offset = isVertical.value ? offsetY : offsetX
                      if (reverse.value) {
                        offset = -offset
                      }

                      onInternalResizeUpdate(index, offset, lazyEnd)
                    }}
                    onOffsetEnd={onInternalResizeEnd}
                    onCollapse={onInternalCollapse}
                    containerSize={containerSize.value || 0}
                  />
                )
              }
              return (
                <Fragment key={`split-panel-${idx}`}>
                  {panel}
                  {splitBar}
                </Fragment>
              )
            })}
            {/* Fake mask for cursor */}
            {typeof movingIndex.value === 'number' && (
              <div aria-hidden class={clsx(maskCls, `${maskCls}-${mergedOrientation.value}`)} />
            )}
          </div>
        </ResizeObserver>
      )
    }
  },
  {
    name: 'ASplitter',
    inheritAttrs: false,
  },
)

export default Splitter
