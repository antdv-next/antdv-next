import type { Ref } from 'vue'
import { computed, unref } from 'vue'

export interface MaskConfig {
  enabled?: boolean
  blur?: boolean
  closable?: boolean
}
export type MaskType = MaskConfig | boolean

export function normalizeMaskConfig(mask?: MaskType, maskClosable?: boolean): MaskConfig {
  let maskConfig: MaskConfig = {}

  if (mask && typeof mask === 'object') {
    maskConfig = mask
  }
  if (typeof mask === 'boolean') {
    maskConfig = {
      enabled: mask,
    }
  }

  if (maskConfig.closable === undefined && maskClosable !== undefined) {
    maskConfig.closable = maskClosable
  }

  return maskConfig
}

export function useMergedMask(
  mask: Ref<MaskType | undefined>,
  contextMask: Ref<MaskType | undefined>,
  prefixCls: Ref<string | undefined>,
  maskClosable?: Ref<boolean | undefined>,
) {
  const context = computed(() => {
    const maskConfig = normalizeMaskConfig(mask.value, unref(maskClosable))
    const contextMaskConfig = normalizeMaskConfig(contextMask.value)
    const mergedConfig: MaskConfig = {
      blur: false,
      ...contextMaskConfig,
      ...maskConfig,
      closable: maskConfig.closable ?? unref(maskClosable) ?? contextMaskConfig.closable ?? true,
    }

    const className = mergedConfig.blur ? `${prefixCls.value}-mask-blur` : undefined
    return {
      enabled: mergedConfig.enabled !== false,
      classNames: { mask: className },
      closable: !!mergedConfig.closable,
    }
  })

  return [
    computed(() => context.value.enabled),
    computed(() => context.value.classNames),
    computed(() => context.value.closable),
  ] as const
}
