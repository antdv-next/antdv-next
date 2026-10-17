import { CloseCircleFilled } from '@antdv-next/icons'
import { useLocaleContext } from '../../locale'
import defaultLocale from '../../locale/en_US'
import fallbackProp from '../fallbackProp'
import { isPlainObject } from '../is'

// `clearIcon` is `any` on purpose: @v-c/* props ship their own VueNode alias, not assignable to this repo's `VueNode`.
export interface AllowClearConfig {
  /** Custom clear icon */
  clearIcon?: any
  /** Disable the clear button */
  disabled?: boolean
  /** Tab order of the clear button. `-1` excludes it from Tab navigation */
  tabIndex?: number
  /** Accessible name of the clear button */
  label?: string
}

export type AllowClear = boolean | AllowClearConfig

/** The hook never returns plain `true`: a truthy allowClear is normalized to the object form. */
export type MergedAllowClear = AllowClearConfig | false

export interface UseAllowClearOptions {
  allowClear?: AllowClear
  clearIcon?: any
  contextAllowClear?: AllowClear
  contextClearIcon?: any
  defaultAllowClear?: boolean
  defaultLabel?: string
}

/**
 * Getter for the localized clear button label (`locale.global.clear`).
 * Reads the locale context lazily so callers can use it inside their own `computed` without extra reactive objects.
 */
export function useAllowClearLabel() {
  const { locale } = useLocaleContext()
  return () => locale.value?.global?.clear ?? defaultLocale.global?.clear
}

/**
 * Merge component- and ConfigProvider-level `allowClear` / `clearIcon`.
 * Each field is resolved on its own (priority: props → context → default), so `allowClear: true`
 * inherits the global config while `disabled: false` / `tabIndex: 0` / `label: ''` still override it.
 */
export default function useAllowClear({
  allowClear,
  clearIcon,
  contextAllowClear,
  contextClearIcon,
  defaultAllowClear,
  defaultLabel,
}: UseAllowClearOptions): MergedAllowClear {
  const mergedAllowClear = allowClear ?? contextAllowClear ?? defaultAllowClear
  if (!mergedAllowClear) {
    return false
  }

  const config = isPlainObject<AllowClearConfig>(allowClear) ? allowClear : undefined
  const contextConfig = isPlainObject<AllowClearConfig>(contextAllowClear) ? contextAllowClear : undefined

  return {
    clearIcon: fallbackProp(
      config?.clearIcon,
      clearIcon,
      contextConfig?.clearIcon,
      contextClearIcon,
      <CloseCircleFilled />,
    ),
    disabled: config?.disabled ?? contextConfig?.disabled,
    tabIndex: config?.tabIndex ?? contextConfig?.tabIndex,
    label: config?.label ?? contextConfig?.label ?? defaultLabel,
  }
}
