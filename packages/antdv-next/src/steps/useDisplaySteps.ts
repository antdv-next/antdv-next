import type { ComputedRef, Ref } from 'vue'
import type { StepItem } from './index'
import { EllipsisOutlined } from '@antdv-next/icons'
import { computed, h } from 'vue'

interface DisplayStep {
  item: StepItem
  originIndex: number
}

interface UseDisplayStepsResult {
  canApplyMaxCount: ComputedRef<boolean>
  displaySteps: ComputedRef<DisplayStep[]>
  mappedDisplayCurrent: ComputedRef<number>
  displayItems: ComputedRef<StepItem[]>
}

/**
 * Normalize a real item into the collapsed display list.
 * The original item key is preserved when provided, otherwise the original index keeps
 * reconciliation stable while visible steps move around the collapsed list.
 */
function getDisplayStep(item: StepItem, index: number): DisplayStep {
  return {
    item: {
      ...item,
      key: item.key ?? index,
    },
    originIndex: index,
  }
}

/**
 * Build the disabled ellipsis item between two visible steps.
 * Its status reflects the hidden range so the connector still communicates
 * finished or error progress, and its key is derived from the adjacent real steps.
 */
function getEllipsisStep(
  items: StepItem[],
  currentIndex: number,
  prevIndex: number,
  nextIndex: number,
  prefixCls: string,
): DisplayStep {
  const prevKey = (items[prevIndex]!.key ?? prevIndex) as string | number
  const nextKey = (items[nextIndex]!.key ?? nextIndex) as string | number
  const hasError = items.slice(prevIndex + 1, nextIndex).some(step => step.status === 'error')
  const ellipsisStatus = hasError ? 'error' : nextIndex - 1 < currentIndex ? 'finish' : 'wait'

  return {
    item: {
      key: `ellipsis-${prevKey}-${nextKey}`,
      title: '',
      icon: h(EllipsisOutlined),
      status: ellipsisStatus,
      disabled: true,
      class: `${prefixCls}-item-ellipsis`,
    },
    originIndex: -1,
  }
}

/**
 * Pick the real step indexes that should remain visible when `maxCount` applies.
 * First, last, and current are always kept. Remaining slots are filled by priority:
 * current left, current right, first right, last left, then repeat at larger distances.
 *
 * `null` is inserted between non-contiguous indexes and later rendered as an ellipsis.
 */
function getCollapsedIndexes(
  total: number,
  currentIndex: number,
  maxCount: number,
): Array<number | null> {
  const safeCurrent = Math.min(Math.max(currentIndex, 0), total - 1)
  const targetCount = Math.min(maxCount, total)
  const indexes = new Set([0, safeCurrent, total - 1])

  for (let distance = 1; indexes.size < targetCount && distance < total; distance += 1) {
    const candidates = [
      safeCurrent - distance,
      safeCurrent + distance,
      distance,
      total - 1 - distance,
    ]

    for (const index of candidates) {
      if (indexes.size >= targetCount) {
        break
      }

      if (index >= 0 && index < total) {
        indexes.add(index)
      }
    }
  }

  return Array.from(indexes)
    .sort((a, b) => a - b)
    .flatMap((index, order, sortedIndexes) =>
      order > 0 && index - sortedIndexes[order - 1]! > 1 ? [null, index] : [index],
    )
}

/**
 * Convert the original items/current into the list consumed by @v-c/steps.
 * When steps are collapsed, @v-c/steps receives a compact item list and a remapped current,
 * while callers still interact with the original step indexes through `onChange`.
 */
export default function useDisplaySteps(
  mergedItems: Ref<StepItem[]>,
  current: Ref<number>,
  initial: Ref<number>,
  maxCount: Ref<number | undefined>,
  prefixCls: Ref<string>,
): UseDisplayStepsResult {
  const canApplyMaxCount = computed(
    () => maxCount.value !== undefined && maxCount.value >= 3 && mergedItems.value.length > maxCount.value,
  )

  const mappedCurrent = computed(() => current.value - initial.value)

  const displaySteps = computed<DisplayStep[]>(() => {
    if (!canApplyMaxCount.value) {
      return mergedItems.value.map((item, originIndex) => ({ item, originIndex }))
    }

    const collapsedIndexes = getCollapsedIndexes(mergedItems.value.length, mappedCurrent.value, maxCount.value!)

    return collapsedIndexes.map((index, collapsedIndex) =>
      index === null
        ? getEllipsisStep(
            mergedItems.value,
            mappedCurrent.value,
            collapsedIndexes[collapsedIndex - 1] as number,
            collapsedIndexes[collapsedIndex + 1] as number,
            prefixCls.value,
          )
        : getDisplayStep(mergedItems.value[index]!, index),
    )
  })

  const mappedDisplayCurrent = computed(() => {
    const displayCurrent = displaySteps.value.findIndex(step => step.originIndex === mappedCurrent.value)
    return displayCurrent >= 0 ? displayCurrent : mappedCurrent.value
  })

  const displayItems = computed(() => displaySteps.value.map(step => step.item))

  return {
    canApplyMaxCount,
    displaySteps,
    mappedDisplayCurrent,
    displayItems,
  }
}
