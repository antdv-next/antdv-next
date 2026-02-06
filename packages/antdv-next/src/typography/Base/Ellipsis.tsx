import type { CSSProperties, SlotsType } from 'vue'
import type { EmptyEmit, VueNode } from '../../_util/type'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, defineComponent, nextTick, shallowRef, watch, watchEffect } from 'vue'
import toList from '../../_util/toList'
import { getSlotPropsFnRun } from '../../_util/tools.ts'
import { getTextNodeArr } from '../../_util/vueNode.ts'
import { isValidText } from './util'

interface MeasureTextProps {
  style?: CSSProperties
}

interface MeasureTextExpose {
  isExceed: () => boolean
  getHeight: () => number
}

const MeasureText = defineComponent<
  MeasureTextProps,
  EmptyEmit,
  string,
  SlotsType<{ default?: () => any }>
>((props, { slots, expose }) => {
  const spanRef = shallowRef<HTMLSpanElement>()
  expose({
    isExceed: () => {
      const span = spanRef.value!
      return span.scrollHeight > span.clientHeight
    },
    getHeight: () => spanRef.value?.clientHeight || 0,
  })

  return () => {
    return (
      <span
        aria-hidden
        ref={spanRef}
        style={{
          position: 'fixed',
          display: 'block',
          left: 0,
          top: 0,
          pointerEvents: 'none',
          backgroundColor: 'rgba(255, 0, 0, 0.65)',
          ...props.style,
        }}
      >
        {slots.default?.()}
      </span>
    )
  }
}, {
  name: 'TypographyMeasureText',
  inheritAttrs: false,
})

function getNodesLen(nodeList: any[]) {
  return nodeList.reduce((totalLen, node) => totalLen + (isValidText(node) ? String(node).length : 1), 0)
}

function sliceNodes(nodeList: any[], len: number) {
  let currLen = 0
  const currentNodeList: any[] = []

  for (let i = 0; i < nodeList.length; i += 1) {
    if (currLen === len) {
      return currentNodeList
    }

    const node = nodeList[i]
    const canCut = isValidText(node)
    const nodeLen = canCut ? String(node).length : 1
    const nextLen = currLen + nodeLen

    if (nextLen > len) {
      const restLen = len - currLen
      currentNodeList.push(String(node).slice(0, restLen))
      return currentNodeList
    }

    currentNodeList.push(node)
    currLen = nextLen
  }

  return nodeList
}

export interface EllipsisProps {
  enableMeasure?: boolean
  text?: VueNode
  width: number
  rows: number
  onEllipsis: (isEllipsis: boolean) => void
  expanded: boolean
  /**
   * Mark for misc update. Which will not affect ellipsis content length.
   * e.g. tooltip content update.
   */
  miscDeps: any[]
}

// Measure for the `text` is exceed the `rows` or not
const STATUS_MEASURE_NONE = 0
const STATUS_MEASURE_PREPARE = 1
const STATUS_MEASURE_START = 2
const STATUS_MEASURE_NEED_ELLIPSIS = 3
const STATUS_MEASURE_NO_NEED_ELLIPSIS = 4

const lineClipStyle: CSSProperties = {
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
}

const Ellipsis = defineComponent<
  EllipsisProps,
  EmptyEmit,
  string,
  SlotsType<{
    default?: (nodeList: any[], canEllipsis: boolean) => any
  }>
>(
  (props, { slots }) => {
    const nodeList = computed(() => getTextNodeArr(filterEmpty(toList(getSlotPropsFnRun({}, props, 'text'), true))))

    const nodeLen = computed(() => getNodesLen(nodeList.value))

    const ellipsisCutIndex = shallowRef<[number, number] | null>(null)
    const cutMidRef = shallowRef<MeasureTextExpose>()

    const measureWhiteSpaceRef = shallowRef<HTMLElement>()
    const needEllipsisRef = shallowRef<MeasureTextExpose>()
    const descRowsEllipsisRef = shallowRef<MeasureTextExpose>()
    const symbolRowEllipsisRef = shallowRef<MeasureTextExpose>()

    const canEllipsis = shallowRef(false)
    const needEllipsis = shallowRef(STATUS_MEASURE_NONE)
    const ellipsisHeight = shallowRef(0)
    const parentWhiteSpace = shallowRef<CSSProperties['whiteSpace'] | null>(null)

    watch(
      [() => props.enableMeasure, () => props.width, nodeLen, () => props.rows],
      ([enableMeasure, width, len, rows]) => {
        if (enableMeasure && width && len && rows) {
          needEllipsis.value = STATUS_MEASURE_PREPARE
        }
        else {
          needEllipsis.value = STATUS_MEASURE_NONE
        }
      },
      { immediate: true },
    )

    watch(
      needEllipsis,
      async (status) => {
        await nextTick()
        if (status === STATUS_MEASURE_PREPARE) {
          needEllipsis.value = STATUS_MEASURE_START
          const nextWhiteSpace = measureWhiteSpaceRef.value
            ? getComputedStyle(measureWhiteSpaceRef.value).whiteSpace
            : null
          parentWhiteSpace.value = nextWhiteSpace
        }
        else if (status === STATUS_MEASURE_START) {
          const isOverflow = !!needEllipsisRef.value?.isExceed()
          needEllipsis.value = isOverflow ? STATUS_MEASURE_NEED_ELLIPSIS : STATUS_MEASURE_NO_NEED_ELLIPSIS
          ellipsisCutIndex.value = isOverflow ? [0, nodeLen.value] : null
          canEllipsis.value = isOverflow

          const baseRowsEllipsisHeight = needEllipsisRef.value?.getHeight?.() || 0
          const descRowsEllipsisHeight = props.rows === 1 ? 0 : descRowsEllipsisRef.value?.getHeight?.() || 0
          const symbolRowEllipsisHeight = symbolRowEllipsisRef.value?.getHeight?.() || 0
          const maxRowsHeight = Math.max(
            baseRowsEllipsisHeight,
            descRowsEllipsisHeight + symbolRowEllipsisHeight,
          )

          ellipsisHeight.value = maxRowsHeight + 1

          props.onEllipsis?.(isOverflow)
        }
      },
      { flush: 'post', immediate: true },
    )

    // ========================= Cut Measure ==========================
    const cutMidIndex = shallowRef(0)
    watchEffect(() => {
      const range = ellipsisCutIndex.value
      if (range) {
        cutMidIndex.value = Math.ceil((range[0] + range[1]) / 2)
      }
    })

    watch(
      ellipsisCutIndex,
      async () => {
        await nextTick()
        const [minIndex, maxIndex] = ellipsisCutIndex.value || [0, 0]
        if (minIndex !== maxIndex) {
          const midHeight = cutMidRef.value?.getHeight() || 0
          const isOverflow = midHeight > ellipsisHeight.value
          let targetMidIndex = cutMidIndex.value
          if (maxIndex - minIndex === 1) {
            targetMidIndex = isOverflow ? minIndex : maxIndex
          }
          ellipsisCutIndex.value = isOverflow ? [minIndex, targetMidIndex] : [targetMidIndex, maxIndex]
        }
      },
      { flush: 'post', immediate: true },
    )

    return () => {
      const fullContent = slots?.default?.(nodeList.value, false)
      // ========================= Text Content =========================
      const finalContentFn = () => {
        if (!props.enableMeasure) {
          return slots?.default?.(nodeList.value, false)
        }
        if (
          needEllipsis.value !== STATUS_MEASURE_NEED_ELLIPSIS
          || !ellipsisCutIndex.value
          || ellipsisCutIndex.value[0] !== ellipsisCutIndex.value[1]
        ) {
          const content = slots?.default?.(nodeList.value, false)
          // Limit the max line count to avoid scrollbar blink unless no need ellipsis
          // https://github.com/ant-design/ant-design/issues/42958
          if ([STATUS_MEASURE_NO_NEED_ELLIPSIS, STATUS_MEASURE_NONE].includes(needEllipsis.value)) {
            return content
          }
          return (
            <span
              style={{
                ...lineClipStyle,
                WebkitLineClamp: props.rows,
              }}
            >
              {content}
            </span>
          )
        }

        return slots?.default?.(
          props.expanded ? nodeList.value : sliceNodes(nodeList.value, ellipsisCutIndex.value[0]),
          canEllipsis.value,
        )
      }
      const finalContent = finalContentFn()

      // ============================ Render ============================
      const measureStyle = {
        width: `${props.width}px`,
        margin: 0,
        padding: 0,
        whiteSpace: parentWhiteSpace.value === 'nowrap' ? 'normal' : 'inherit',
      }
      return (
        <>
          {/* Final show content */}
          {finalContent}

          {/* Measure if current content is exceed the rows */}
          {needEllipsis.value === STATUS_MEASURE_START && (
            <>
              {/** With `rows` */}
              <MeasureText
                style={{
                  ...measureStyle,
                  ...lineClipStyle,
                  WebkitLineClamp: props.rows,
                }}
                ref={needEllipsisRef as any}
              >
                {fullContent}
              </MeasureText>

              {/** With `rows - 1` */}
              <MeasureText
                style={{
                  ...measureStyle,
                  ...lineClipStyle,
                  WebkitLineClamp: props.rows - 1,
                }}
                ref={descRowsEllipsisRef as any}
              >
                {fullContent}
              </MeasureText>

              {/** With `rows - 1` */}
              <MeasureText
                style={{
                  ...measureStyle,
                  ...lineClipStyle,
                  WebkitLineClamp: 1,
                }}
                ref={symbolRowEllipsisRef as any}
              >
                {slots?.default?.([], true)}
              </MeasureText>
            </>
          )}

          {/* Real size overflow measure */}
          {needEllipsis.value === STATUS_MEASURE_NEED_ELLIPSIS
            && ellipsisCutIndex.value
            && ellipsisCutIndex.value[0] !== ellipsisCutIndex.value[1]
            && (
              <MeasureText
                style={{
                  ...measureStyle,
                  top: `${400}px`,
                }}
                ref={cutMidRef as any}
              >
                {slots?.default?.(sliceNodes(nodeList.value, cutMidIndex.value), true)}
              </MeasureText>
            )}

          {/* Measure white-space */}
          {needEllipsis.value === STATUS_MEASURE_PREPARE && (
            <span style={{ whiteSpace: 'inherit' }} ref={measureWhiteSpaceRef as any} />
          )}
        </>
      )
    }
  },
  {
    name: 'TypographyEllipsis',
    inheritAttrs: false,
  },
)

export default Ellipsis
