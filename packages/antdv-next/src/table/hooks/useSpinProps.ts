import type { ComputedRef, Ref } from 'vue'
import type { SpinProps } from '../../spin'
import { computed } from 'vue'

export default function useSpinProps(
  loading: Ref<boolean | SpinProps | undefined>,
): ComputedRef<SpinProps> {
  return computed<SpinProps>(() => {
    if (typeof loading.value === 'boolean') {
      return { spinning: loading.value }
    }
    if (typeof loading.value === 'object' && loading.value !== null) {
      return { spinning: true, ...loading.value }
    }
    return {}
  })
}
