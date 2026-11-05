import type { VueNode } from '../_util/type.ts'

import {
  CheckOutlined,
  CloseCircleFilled,
  CloseOutlined,
  DownOutlined,
  LoadingOutlined,
  SearchOutlined,
} from '@antdv-next/icons'
import { filterEmpty } from '@v-c/util/dist/props-util'
import fallbackProp from '../_util/fallbackProp'
import { isFunction, isRenderable } from '../_util/is'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning'

type RenderNode = VueNode

/** Render info passed to a function `suffix` / `#suffix` slot by the underlying `@v-c/select`. */
export interface SelectSuffixRenderInfo {
  searchValue: string
  open: boolean
  focused: boolean
  showSearch?: boolean
  loading?: boolean
}

/**
 * Read the `suffix` render prop with slot priority. The slot (or a function prop) is kept as a
 * function so `@v-c/select` can call it with the latest open / search state.
 */
export function getCustomSuffix(slots: Record<string, any>, props: { suffix?: any }): any {
  const slot = slots?.suffix
  if (slot) {
    return (info: SelectSuffixRenderInfo) => {
      const nodes = filterEmpty([slot(info)].flat()).filter(node => node !== undefined && node !== null)
      if (!nodes.length) {
        return undefined
      }
      return nodes.length === 1 ? nodes[0] : nodes
    }
  }
  return props.suffix
}

export default function useIcons({
  suffix,
  contextSuffix,
  clearIcon,
  menuItemSelectedIcon,
  removeIcon,
  loading,
  loadingIcon,
  multiple,
  hasFeedback,
  showSuffix,
  feedbackIcon,
  showArrow,
  componentName,
}: {
  suffix?: RenderNode
  contextSuffix?: RenderNode
  clearIcon?: RenderNode
  menuItemSelectedIcon?: RenderNode
  removeIcon?: RenderNode
  loading?: boolean
  loadingIcon?: any
  multiple?: boolean
  hasFeedback?: boolean
  feedbackIcon?: VueNode
  prefixCls: string
  showSuffix?: boolean
  showArrow?: boolean
  componentName: string
}) {
  if (isDev) {
    const warning = devUseWarning(componentName)

    warning.deprecated(!clearIcon, 'clearIcon', 'allowClear={{ clearIcon: VueNode }}')
  }

  // Clear Icon
  const mergedClearIcon = clearIcon ?? <CloseCircleFilled />

  // Validation Feedback Icon
  const getSuffixNode = (suffixNode?: any) => {
    if (!isRenderable(suffixNode) && !hasFeedback && !showArrow) {
      return null
    }
    return (
      <>
        {showSuffix !== false && suffixNode}
        {hasFeedback && feedbackIcon}
      </>
    )
  }

  // Suffix
  let mergedSuffix: RenderNode = null
  if (suffix !== undefined) {
    mergedSuffix = isFunction(suffix)
      ? (props: SelectSuffixRenderInfo) => getSuffixNode(suffix(props))
      : getSuffixNode(suffix)
  }
  else if (loading) {
    mergedSuffix = getSuffixNode(
      getSlotPropsFnRun({}, { loadingIcon }, 'loadingIcon') ?? <LoadingOutlined spin aria-hidden="true" />,
    )
  }
  else {
    mergedSuffix = (props: SelectSuffixRenderInfo) => {
      const { open, showSearch } = props
      if (open && showSearch) {
        return getSuffixNode(<SearchOutlined aria-hidden="true" />)
      }
      const fallbackSuffix = fallbackProp<any>(contextSuffix, <DownOutlined aria-hidden="true" />)
      return getSuffixNode(isFunction(fallbackSuffix) ? fallbackSuffix(props) : fallbackSuffix)
    }
  }

  // Checked item icon
  let mergedItemIcon = null
  if (menuItemSelectedIcon !== undefined) {
    mergedItemIcon = menuItemSelectedIcon
  }
  else if (multiple) {
    mergedItemIcon = <CheckOutlined />
  }
  else {
    mergedItemIcon = null
  }

  let mergedRemoveIcon = null
  if (removeIcon !== undefined) {
    mergedRemoveIcon = removeIcon
  }
  else {
    mergedRemoveIcon = <CloseOutlined />
  }
  return {
    // TODO: remove as when all the deps bumped
    clearIcon: mergedClearIcon as VueNode,
    suffix: mergedSuffix,
    itemIcon: mergedItemIcon,
    removeIcon: mergedRemoveIcon,
  }
}
