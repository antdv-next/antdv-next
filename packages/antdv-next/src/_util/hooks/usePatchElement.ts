import type { Ref } from 'vue'
import { shallowRef } from 'vue'

export function usePatchElement(): [Ref<any[]>, (element: any) => () => void] {
  const elements = shallowRef<any[]>([])

  const patchElement = (element: any) => {
    // append a new element to elements (and create a new ref)
    elements.value = [...elements.value, element]
    // return a function that removes the new element out of elements (and create a new ref)
    // it works a little like useEffect
    return () => {
      const originElements = [...elements.value]
      elements.value = originElements.filter(ele => ele !== element)
    }
  }
  return [elements, patchElement] as const
}
