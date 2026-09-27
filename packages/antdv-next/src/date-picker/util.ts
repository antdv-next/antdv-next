import type { PickerMode } from '@v-c/picker'
import type { AllowClear } from '../_util/hooks/useAllowClear'
import type { VueNode } from '../_util/type'
import type { PickerLocale, PickerProps } from './generatePicker'
import { cloneVNode, isVNode } from 'vue'
import useAllowClear from '../_util/hooks/useAllowClear'
import useSelectIcons from '../select/useIcons'

export function getPlaceholder(
  locale: PickerLocale,
  picker?: PickerMode,
  customizePlaceholder?: string,
): string {
  if (customizePlaceholder !== undefined) {
    return customizePlaceholder
  }

  if (picker === 'year' && locale.lang.yearPlaceholder) {
    return locale.lang.yearPlaceholder
  }
  if (picker === 'quarter' && locale.lang.quarterPlaceholder) {
    return locale.lang.quarterPlaceholder
  }
  if (picker === 'month' && locale.lang.monthPlaceholder) {
    return locale.lang.monthPlaceholder
  }
  if (picker === 'week' && locale.lang.weekPlaceholder) {
    return locale.lang.weekPlaceholder
  }
  if (picker === 'time' && locale.timePickerLocale.placeholder) {
    return locale.timePickerLocale.placeholder
  }
  return locale.lang.placeholder
}

export function getRangePlaceholder(
  locale: PickerLocale,
  picker?: PickerMode,
  customizePlaceholder?: [string, string],
) {
  if (customizePlaceholder !== undefined) {
    return customizePlaceholder
  }

  if (picker === 'year' && locale.lang.rangeYearPlaceholder) {
    return locale.lang.rangeYearPlaceholder
  }
  if (picker === 'quarter' && locale.lang.rangeQuarterPlaceholder) {
    return locale.lang.rangeQuarterPlaceholder
  }
  if (picker === 'month' && locale.lang.rangeMonthPlaceholder) {
    return locale.lang.rangeMonthPlaceholder
  }
  if (picker === 'week' && locale.lang.rangeWeekPlaceholder) {
    return locale.lang.rangeWeekPlaceholder
  }
  if (picker === 'time' && locale.timePickerLocale.rangePlaceholder) {
    return locale.timePickerLocale.rangePlaceholder
  }
  return locale.lang.rangePlaceholder
}

export function useIcons(
  props: Pick<PickerProps, 'allowClear' | 'clearIcon' | 'removeIcon'>,
  prefixCls: string,
  context?: { allowClear?: AllowClear, clearIcon?: VueNode },
) {
  const { removeIcon } = useSelectIcons({
    ...props,
    prefixCls,
    componentName: 'DatePicker',
  } as any)

  const mergedAllowClear = useAllowClear({
    allowClear: props.allowClear,
    clearIcon: props.clearIcon,
    contextAllowClear: context?.allowClear,
    contextClearIcon: context?.clearIcon,
    defaultAllowClear: true,
  })

  if (!mergedAllowClear) {
    return [false, removeIcon] as const
  }

  const { clearIcon: mergedClearIcon, ...rest } = mergedAllowClear

  return [
    {
      clearIcon: isVNode(mergedClearIcon) ? cloneVNode(mergedClearIcon) : mergedClearIcon,
      ...rest,
    },
    removeIcon,
  ] as const
}
