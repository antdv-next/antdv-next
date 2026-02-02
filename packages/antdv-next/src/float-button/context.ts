import type { InjectionKey, Ref } from 'vue'
import type { FloatButtonProps, FloatButtonShape } from './FloatButton'
import { computed, defineComponent, inject, provide } from 'vue'

export interface GroupContextProps {
  shape?: FloatButtonShape
  individual?: boolean
  classNames?: FloatButtonProps['classes']
  styles?: FloatButtonProps['styles']
}

const GroupContextKey: InjectionKey<Ref<GroupContextProps | null>> = Symbol('FloatButtonGroupContext')

export function useGroupContext() {
  return inject(GroupContextKey, undefined)
}

export function useGroupContextProvider(value: Ref<GroupContextProps | null>) {
  provide(GroupContextKey, value)
}

export const GroupContextProvider = defineComponent<{
  value: GroupContextProps
}>(
  (props, { slots }) => {
    useGroupContextProvider(computed(() => props.value))
    return () => slots.default?.()
  },
  {
    name: 'AFloatButtonGroupContextProvider',
    inheritAttrs: false,
    props: ['value'],
  },
)
