import type { SelectProps } from '../select'
import type { PaginationProps } from './interface'

export default function resolveShowSizeChanger(showSizeChanger?: PaginationProps['showSizeChanger']) {
  if (typeof showSizeChanger === 'boolean') {
    return {
      show: showSizeChanger,
      selectProps: undefined,
    }
  }

  if (showSizeChanger && typeof showSizeChanger === 'object') {
    return {
      show: true,
      selectProps: showSizeChanger as SelectProps,
    }
  }

  return {
    show: undefined,
    selectProps: undefined,
  }
}
