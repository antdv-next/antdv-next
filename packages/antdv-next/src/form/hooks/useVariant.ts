import type { ComputedRef, Ref } from 'vue'
import type { Variant } from '../../config-provider/context'
import type { ConfigProviderProps } from '../../config-provider/define.ts'
import { isRef, toRef } from 'vue'
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
  | 'tag'
  | 'alert'
  | 'divider'
  | 'steps'
  | 'timeline'
>

export interface VariantOptions<T extends readonly string[]> {
  variants: T
  defaultVariant: T[number]
}

type VariantResult<T extends string> = readonly [Readonly<Ref<T>>, Readonly<Ref<boolean>>, Readonly<Ref<boolean>>]

type MaybeRef<T> = Ref<T> | ComputedRef<T> | Readonly<Ref<T>>

function isVariantOptions(val: unknown): val is VariantOptions<readonly string[]> {
  return val !== null
    && typeof val === 'object'
    && !isRef(val)
    && Array.isArray((val as VariantOptions<readonly string[]>).variants)
}

/**
 * Compatible for legacy `bordered` prop.
 */
function useVariant<const T extends readonly string[]>(
  component: VariantComponents,
  variant: MaybeRef<string | undefined> | undefined,
  options: VariantOptions<T>,
): VariantResult<T[number]>
function useVariant(
  component: VariantComponents,
  variant?: MaybeRef<Variant | undefined>,
  legacyBordered?: Ref<boolean | undefined> | boolean,
  fallbackComponent?: VariantComponents,
): VariantResult<Variant>
function useVariant(
  component: VariantComponents,
  variant?: MaybeRef<string | undefined>,
  legacyBordered?: Ref<boolean | undefined> | boolean | VariantOptions<readonly string[]>,
  fallbackComponent?: VariantComponents,
): VariantResult<string> {
  const config = useConfig()
  const formVariant = useVariantContext()
  const options = isVariantOptions(legacyBordered) ? legacyBordered : undefined

  const getBordered = () => {
    if (options)
      return undefined
    return isRef(legacyBordered) ? legacyBordered.value : legacyBordered as boolean | undefined
  }

  const getConfigComponentVariant = (): string | undefined => {
    const componentConfigVariant = (config.value as any)?.[component]?.variant
    const fallbackConfigVariant = fallbackComponent
      ? (config.value as any)?.[fallbackComponent]?.variant
      : undefined

    return componentConfigVariant ?? fallbackConfigVariant
  }

  const supportedVariants: readonly string[] = options?.variants ?? Variants

  const getMergedVariant = (): string => {
    let merged: string
    if (typeof variant?.value !== 'undefined') {
      merged = variant.value
    }
    else if (getBordered() === false) {
      merged = 'borderless'
    }
    else {
      // form variant > component global variant > fallback component global variant > global variant
      merged = formVariant.value
        ?? getConfigComponentVariant()
        ?? config.value?.variant
        ?? options?.defaultVariant
        ?? 'outlined'
    }

    if (options && !supportedVariants.includes(merged)) {
      merged = options.defaultVariant
    }
    return merged
  }

  // Getter refs instead of `computed`: the derivation is cheap and this keeps
  // the per-instance reactive cost of every variant-aware component at zero.
  const mergedVariant = toRef(getMergedVariant)

  const enableVariantCls = toRef(() => supportedVariants.includes(getMergedVariant()))

  const isVariantConfigured = toRef(() => {
    return typeof variant?.value !== 'undefined'
      || getBordered() === false
      || typeof formVariant.value !== 'undefined'
      || typeof getConfigComponentVariant() !== 'undefined'
      || typeof config.value?.variant !== 'undefined'
  })

  return [mergedVariant, enableVariantCls, isVariantConfigured] as const
}

export default useVariant

export const useVariants = useVariant
