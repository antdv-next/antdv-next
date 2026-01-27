import type { CSSProperties, InjectionKey, Ref } from 'vue'
import { inject, provide, ref } from 'vue'

export interface CellSemanticClassNames {
  label?: string
  content?: string
}

export interface CellSemanticStyles {
  label?: CSSProperties
  content?: CSSProperties
}

export interface DescriptionsContextProps {
  styles?: CellSemanticStyles
  classes?: CellSemanticClassNames
}

const DescriptionsContext: InjectionKey<Ref<DescriptionsContextProps>> = Symbol('DescriptionsContext')
export function useDescriptionsProvider(props: Ref<DescriptionsContextProps>) {
  provide(DescriptionsContext, props)
}

export function useDescriptionsCtx() {
  return inject(DescriptionsContext, ref<DescriptionsContextProps>({}))
}
