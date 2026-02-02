import type { InjectionKey, Ref } from 'vue'
import { inject, provide } from 'vue'

export interface RowContextState {
  gutter?: Ref<[number, number]>
  wrap?: Ref<boolean | undefined>
}

const RowContext: InjectionKey<RowContextState> = Symbol('RowContext')

export function useRowContextProvider(value: RowContextState) {
  provide(RowContext, value)
}

export function useRowContext() {
  return inject(RowContext, {})
}
