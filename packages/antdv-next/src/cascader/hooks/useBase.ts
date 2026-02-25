import type { Ref } from 'vue'
import type { DirectionType } from '../../config-provider/context'
import { computed } from 'vue'
import { useConfig } from '../../config-provider'

export default function useBase(
  customizePrefixCls: Ref<string | undefined>,
  direction?: Ref<DirectionType | undefined>,
) {
  const config = useConfig()

  const mergedDirection = computed(() => direction?.value ?? config.value.direction)
  const prefixCls = computed(() => config.value.getPrefixCls('select', customizePrefixCls.value))
  const cascaderPrefixCls = computed(() => config.value.getPrefixCls('cascader', customizePrefixCls.value))
  const renderEmpty = computed(() => config.value.renderEmpty)

  return {
    prefixCls,
    cascaderPrefixCls,
    direction: mergedDirection,
    renderEmpty,
  }
}
