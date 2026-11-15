import type { Ref } from 'vue'
import { computed } from 'vue'
import { useToken } from '../../theme/internal.ts'
import { devUseWarning, isDev } from '../warning.ts'
import { useZIndexContext } from '../zindexContext.ts'

export type ZIndexContainer
  = | 'Modal'
    | 'Drawer'
    | 'Popover'
    | 'Popconfirm'
    | 'Tooltip'
    | 'Tour'
    | 'FloatButton'

export type ZIndexConsumer = 'SelectLike' | 'Dropdown' | 'DatePicker' | 'Menu' | 'ImagePreview'

// Z-Index control range
// Container: 1000 + offset 100 (max base + 10 * offset = 2000)
// Popover: offset 50
// Notification: Container Max zIndex + componentOffset

const CONTAINER_OFFSET = 100
const CONTAINER_OFFSET_MAX_COUNT = 10

export const CONTAINER_MAX_OFFSET = CONTAINER_OFFSET * CONTAINER_OFFSET_MAX_COUNT

/**
 * Static function will default be the `CONTAINER_MAX_OFFSET`.
 * But it still may have children component like Select, Dropdown.
 * So the warning zIndex should exceed the `CONTAINER_MAX_OFFSET`.
 */
const CONTAINER_MAX_OFFSET_WITH_CHILDREN = CONTAINER_MAX_OFFSET + CONTAINER_OFFSET

export const containerBaseZIndexOffset: Record<ZIndexContainer, number> = {
  Modal: CONTAINER_OFFSET,
  Drawer: CONTAINER_OFFSET,
  Popover: CONTAINER_OFFSET,
  Popconfirm: CONTAINER_OFFSET,
  Tooltip: CONTAINER_OFFSET,
  Tour: CONTAINER_OFFSET,
  FloatButton: CONTAINER_OFFSET,
}

export const consumerBaseZIndexOffset: Record<ZIndexConsumer, number> = {
  SelectLike: 50,
  Dropdown: 50,
  DatePicker: 50,
  Menu: 50,
  ImagePreview: 1,
}

function isContainerType(type: ZIndexContainer | ZIndexConsumer): type is ZIndexContainer {
  return type in containerBaseZIndexOffset
}

type ReturnResult = [zIndex: Ref<number | undefined>, contextZIndex: Ref<number>]

export function useZIndex(
  componentType: ZIndexContainer | ZIndexConsumer,
  customZIndex?: Ref<number | undefined>,
): ReturnResult {
  const [, token] = useToken()
  const parentZIndex = useZIndexContext()
  const isContainer = isContainerType(componentType)

  const contextZIndex = computed<number>(() => {
    if (customZIndex?.value !== undefined) {
      return customZIndex.value
    }

    let zIndex = parentZIndex.value ?? 0

    if (isContainer) {
      zIndex
      // Use preset token zIndex by default but not stack when has parent container
        += (parentZIndex.value ? 0 : token.value.zIndexPopupBase)
        // Container offset
          + containerBaseZIndexOffset[componentType]
    }
    else {
      zIndex += consumerBaseZIndexOffset[componentType]
    }
    return zIndex
  })

  const zIndex = computed<number | undefined>(() => {
    if (customZIndex?.value !== undefined) {
      return customZIndex.value
    }
    return parentZIndex.value === undefined ? undefined : contextZIndex.value
  })

  if (isDev) {
    const warning = devUseWarning(componentType)

    const maxZIndex = token.value.zIndexPopupBase + CONTAINER_MAX_OFFSET_WITH_CHILDREN

    warning(
      customZIndex?.value !== undefined || (zIndex.value ?? 0) <= maxZIndex,
      'usage',
      '`zIndex` is over design token `zIndexPopupBase` too much. It may cause unexpected override.',
    )
  }

  return [zIndex, contextZIndex]
}
