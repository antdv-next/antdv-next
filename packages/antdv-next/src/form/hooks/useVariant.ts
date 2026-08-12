import type { Ref } from 'vue'
import type { Variant } from '../../config-provider/context'
import type { ConfigProviderProps } from '../../config-provider/define.ts'
import { computed } from 'vue'
import { useConfig, Variants } from '../../config-provider/context'
import { useVariantContext } from '../context.tsx'

type VariantComponents = keyof Pick<
  ConfigProviderProps,
  | 'input'
  | 'inputPassword'
  | 'inputSearch'
  | 'otp'
  | 'inputNumber'
  | 'textArea'
  | 'mentions'
  | 'select'
  | 'cascader'
  | 'treeSelect'
  | 'datePicker'
  | 'timePicker'
  | 'rangePicker'
  | 'card'
>

export default function useVariant(
  component: VariantComponents,
  variant?: Ref<Variant | undefined>,
  legacyBordered?: Ref<boolean | undefined> | boolean,
  fallbackComponent?: VariantComponents,
) {
  const config = useConfig()
  const formVariant = useVariantContext()

  const configComponentVariant = computed<Variant | undefined>(() => {
    const componentConfigVariant = (config.value as any)?.[component]?.variant
    const fallbackConfigVariant = fallbackComponent
      ? (config.value as any)?.[fallbackComponent]?.variant
      : undefined

    return componentConfigVariant ?? fallbackConfigVariant
  })

  const mergedVariant = computed<Variant>(() => {
    if (typeof variant?.value !== 'undefined') {
      return variant.value
    }

    const borderedValue = typeof legacyBordered === 'object' ? legacyBordered.value : legacyBordered

    if (borderedValue === false) {
      return 'borderless'
    }

    // form variant > component global variant > fallback component global variant > global variant
    return formVariant.value ?? configComponentVariant.value ?? config.value?.variant ?? 'outlined'
  })

  const enableVariantCls = computed(() => Variants.includes(mergedVariant.value))

  const isVariantConfigured = computed(() => {
    const borderedValue = typeof legacyBordered === 'object' ? legacyBordered.value : legacyBordered

    return typeof variant?.value !== 'undefined'
      || borderedValue === false
      || typeof formVariant.value !== 'undefined'
      || typeof configComponentVariant.value !== 'undefined'
      || typeof config.value?.variant !== 'undefined'
  })

  return [mergedVariant, enableVariantCls, isVariantConfigured] as const
}

export const useVariants = useVariant
