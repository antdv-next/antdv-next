import type { PickerMode } from '@v-c/picker'
import type { PickerLocale, PickerProps } from './generatePicker'
import { cloneVNode, isVNode } from 'vue'
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

  if (picker === 'year' && locale.lang.yearPlaceholder) {
    return locale.lang.rangeYearPlaceholder
  }
  if (picker === 'quarter' && locale.lang.quarterPlaceholder) {
    return locale.lang.rangeQuarterPlaceholder
  }
  if (picker === 'month' && locale.lang.monthPlaceholder) {
    return locale.lang.rangeMonthPlaceholder
  }
  if (picker === 'week' && locale.lang.weekPlaceholder) {
    return locale.lang.rangeWeekPlaceholder
  }
  if (picker === 'time' && locale.timePickerLocale.placeholder) {
    return locale.timePickerLocale.rangePlaceholder
  }
  return locale.lang.rangePlaceholder
}

export function useIcons(
  props: Pick<PickerProps, 'allowClear' | 'removeIcon'>,
  prefixCls: string,
) {
  const { allowClear = true } = props

  const { clearIcon, removeIcon } = useSelectIcons({
    ...props,
    prefixCls,
    componentName: 'DatePicker',
  } as any)

  if (allowClear === false) {
    return [false, removeIcon] as const
  }

  const allowClearConfig = allowClear === true ? {} : allowClear
  const mergedClearIcon = isVNode(clearIcon) ? cloneVNode(clearIcon) : clearIcon

  return [
    {
      clearIcon: mergedClearIcon,
      ...allowClearConfig,
    },
    removeIcon,
  ] as const
}
