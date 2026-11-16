import raf from '@v-c/util/dist/raf'
/**
 * Callback will only execute last one for each raf
 */
import { shallowRef } from 'vue'

export default function useRafDebounce(callback: VoidFunction) {
  const executeRef = shallowRef(false)

  const wrapperCallback = callback
  return () => {
    if (executeRef.value) {
      return
    }
    executeRef.value = true
    wrapperCallback()
    raf(() => {
      executeRef.value = false
    })
  }
}
