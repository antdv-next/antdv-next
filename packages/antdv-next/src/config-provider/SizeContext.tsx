import type { InjectionKey, Ref } from 'vue'
import { computed, defineComponent, inject, provide } from 'vue'

export type SizeType = 'small' | 'middle' | 'large' | undefined

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
