import { createSharedComposable } from '@vueuse/core'
import { useBreakpoint } from 'antdv-next'
import { computed } from 'vue'

export const useMobile = createSharedComposable(() => {
  const breakpoint = useBreakpoint()
  const isMobile = computed(() => breakpoint?.value?.md === false)

  return {
    isMobile,
  }
})
