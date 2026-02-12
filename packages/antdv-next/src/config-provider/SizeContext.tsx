import type { InjectionKey, Ref } from 'vue'
import { computed, defineComponent, inject, provide } from 'vue'

/**
 * Note: `middle` is deprecated and will be removed in v7, please use `medium` instead.
 */
export type SizeType = 'small' | 'medium' | 'middle' | 'large' | undefined

export interface SizeContextProps {
  size?: SizeType
}

const SizeContextKey: InjectionKey<Ref<SizeType>> = Symbol('SizeContext')
export const useSizeContext = () => inject(SizeContextKey, computed(() => undefined))
export const SizeProvider = defineComponent<SizeContextProps>(
  (props, { slots }) => {
    const parentSize = useSizeContext()
    const size = computed(() => props?.size || parentSize.value)
    provide(SizeContextKey, size)
    return () => {
      return slots?.default?.()
    }
  },
)

export function useSizeProvider(value: Ref<SizeType>) {
  provide(SizeContextKey, value)
}
