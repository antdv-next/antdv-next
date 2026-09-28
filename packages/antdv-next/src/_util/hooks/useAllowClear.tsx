import { CloseCircleFilled } from '@antdv-next/icons'
import fallbackProp from '../fallbackProp'
import { isPlainObject } from '../is'

// `clearIcon` is `any` on purpose: @v-c/* props ship their own VueNode alias, not assignable to this repo's `VueNode`.
export interface AllowClearObject {
  clearIcon?: any
  disabled?: boolean
}

export type AllowClear = boolean | AllowClearObject

/** The hook never returns plain `true`: a truthy allowClear is normalized to the object form. */
export type MergedAllowClear = AllowClearObject | false

export interface UseAllowClearOptions {
  allowClear?: AllowClear
  clearIcon?: any
  contextAllowClear?: AllowClear
  contextClearIcon?: any
  defaultAllowClear?: boolean
}

/** Merge component- and ConfigProvider-level `allowClear` / `clearIcon` (priority: props → context → `defaultAllowClear`). */
export default function useAllowClear({
  allowClear,
  clearIcon,
  contextAllowClear,
  contextClearIcon,
  defaultAllowClear,
}: UseAllowClearOptions): MergedAllowClear {
  const mergedAllowClear = allowClear ?? contextAllowClear ?? defaultAllowClear
  if (!mergedAllowClear) {
    return false
  }

  return {
    clearIcon: fallbackProp(
      isPlainObject(allowClear) ? allowClear?.clearIcon : clearIcon,
      isPlainObject(contextAllowClear) ? contextAllowClear?.clearIcon : contextClearIcon,
      <CloseCircleFilled />,
    ),
    disabled:
      (isPlainObject(allowClear) ? allowClear?.disabled : undefined)
      ?? (isPlainObject(contextAllowClear) ? contextAllowClear?.disabled : undefined),
  }
}
