import type { VueNode } from '../_util/type.ts'

import {
  CheckOutlined,
  CloseCircleFilled,
  CloseOutlined,
  DownOutlined,
  LoadingOutlined,
  SearchOutlined,
} from '@antdv-next/icons'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning'

type RenderNode = VueNode

export default function useIcons({
  suffixIcon,
  clearIcon,
  menuItemSelectedIcon,
  removeIcon,
  loading,
  loadingIcon,
  multiple,
  hasFeedback,
  showSuffixIcon,
  feedbackIcon,
  showArrow,
  componentName,
}: {
  suffixIcon?: VueNode
  clearIcon?: RenderNode
  menuItemSelectedIcon?: RenderNode
  removeIcon?: RenderNode
  loading?: boolean
  loadingIcon?: any
  multiple?: boolean
  hasFeedback?: boolean
  feedbackIcon?: VueNode
  prefixCls: string
  showSuffixIcon?: boolean
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
  const getSuffixIconNode = (arrowIcon?: VueNode) => {
    if (suffixIcon === null && !hasFeedback && !showArrow) {
      return null
    }
    arrowIcon = getSlotPropsFnRun({}, { arrowIcon }, 'arrowIcon')
    return (
      <>
        {showSuffixIcon !== false && arrowIcon}
        {hasFeedback && feedbackIcon}
      </>
    )
  }

  // Arrow item icon
  let mergedSuffixIcon = null
  if (suffixIcon !== undefined) {
    mergedSuffixIcon = getSuffixIconNode(suffixIcon)
  }
  else if (loading) {
    mergedSuffixIcon = getSuffixIconNode(loadingIcon ?? <LoadingOutlined spin />)
  }
  else {
    mergedSuffixIcon = ({ open, showSearch }: { open: boolean, showSearch: boolean }) => {
      if (open && showSearch) {
        return getSuffixIconNode(<SearchOutlined />)
      }
      return getSuffixIconNode(<DownOutlined />)
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
    suffixIcon: mergedSuffixIcon,
    itemIcon: mergedItemIcon,
    removeIcon: mergedRemoveIcon,
  }
}
