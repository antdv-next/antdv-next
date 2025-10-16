import type { Ref } from 'vue'
import { computed } from 'vue'
import { useSizeContext } from '../SizeContext'

export function useSize<T extends string | undefined | number | object>(
  customSize?: Ref<T> | ((ctxSize: string) => T),
) {
  const size = useSizeContext()
  return computed<T>(() => {
    if (!customSize) {
      return size.value as T
    }
    if (typeof customSize === 'object') {
      return (customSize.value ?? size.value) as T
    }
    if (typeof customSize === 'function') {
      return customSize(size.value!)
    }
    return size.value as T
  })
}
