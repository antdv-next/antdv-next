import type { InjectionKey, Ref } from 'vue'
import { computed, defineComponent, inject, provide, ref } from 'vue'

export interface DisabledContextProps {
  disabled?: boolean
}
const DisabledContextKey: InjectionKey<Ref<boolean>> = Symbol('DisabledContextKey')

export function useDisabledContextProvider(props: Ref<boolean>) {
  provide(DisabledContextKey, props)
}

export function useDisabledContext() {
  return inject(DisabledContextKey, ref(false))
}

export const DisabledContextProvider = defineComponent<DisabledContextProps>(
  (props = { disabled: undefined }, { slots }) => {
    const disabledContext = useDisabledContext()
    const mergedDisabled = computed(() => {
      return props?.disabled ?? disabledContext.value
    })
    useDisabledContextProvider(mergedDisabled)
    return () => {
      return slots?.default?.()
    }
  },
)
