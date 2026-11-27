import type { MaybeRefOrGetter, Ref } from 'vue'
import { useScopeIdAttrs } from '@v-c/util'
import { toValue, unref, watchEffect } from 'vue'

export { useScopeIdAttrs }

type ScopeElement = HTMLElement | Ref<HTMLElement | undefined> | undefined
export function useScopeIdOnElement(elementRef: MaybeRefOrGetter<ScopeElement>) {
  const scopeIdAttrs = useScopeIdAttrs()
  watchEffect(() => {
    const element = unref(toValue(elementRef))
    if (!element) {
      return
    }
    Object.entries(scopeIdAttrs).forEach(([key, value]) => element.setAttribute(key, value))
  }, { flush: 'post' })
}
