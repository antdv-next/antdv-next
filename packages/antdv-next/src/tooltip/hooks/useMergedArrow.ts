import type { ComputedRef, Ref } from 'vue'
import type { TooltipConfig } from '../../config-provider/context.ts'
import { computed } from 'vue'

interface MergedArrow {
  show: boolean
  pointAtCenter?: boolean
}

function useMergedArrow(
  providedArrow?: Ref<TooltipConfig['arrow'] | undefined>,
  providedContextArrow?: Ref<TooltipConfig['arrow'] | undefined>,
): ComputedRef<MergedArrow> {
  const toConfig = (arrow?: boolean | TooltipConfig['arrow']): Partial<MergedArrow> =>
    typeof arrow === 'boolean' ? { show: arrow } : arrow || {}

  return computed(() => {
    const arrowConfig = toConfig(providedArrow?.value)
    const contextArrowConfig = toConfig(providedContextArrow?.value)
    return {
      ...contextArrowConfig,
      ...arrowConfig,
      show: arrowConfig.show ?? contextArrowConfig.show ?? true,
    }
  })
}

export default useMergedArrow
