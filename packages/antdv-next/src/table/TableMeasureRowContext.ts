import type { InjectionKey, Ref } from 'vue'
import { computed, defineComponent, inject, provide, ref } from 'vue'

const TableMeasureRowContextKey: InjectionKey<Ref<boolean>> = Symbol('TableMeasureRowContextKey')

export function useTableMeasureRowContext() {
  return inject(TableMeasureRowContextKey, ref(false))
}

export const TableMeasureRowContextProvider = defineComponent(
  (props, { slots }) => {
    const value = computed(() => props.value)
    provide(TableMeasureRowContextKey, value)
    return () => {
      return slots?.default?.()
    }
  },
  {
    name: 'TableMeasureRowContext',
    inheritAttrs: false,
    props: {
      value: Boolean,
    },
  },
)
