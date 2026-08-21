import type { AriaAttributes, Ref, VNodeChild } from 'vue'
import type { RenderNodeFn, VueNode } from '../type'
import { CloseOutlined } from '@antdv-next/icons'
import pickAttrs from '@v-c/util/dist/pickAttrs'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, createVNode, isVNode, ref, unref } from 'vue'
import defaultLocale from '../../locale/en_US'
import useLocale from '../../locale/useLocale'
import extendsObject from '../extendsObject'
import isNonNullable from '../isNonNullable'
import { getSlotPropsFnRun } from '../tools'
import { getVNode } from '../vueNode'

interface DataAttributes {
  [key: `data-${string}`]: string
}
export type ClosableType = boolean | ({
  closeIcon?: VueNode
  disabled?: boolean
} & AriaAttributes)

export interface BaseContextClosable {
  closable?: ClosableType
  closeIcon?: VueNode
}

export type ContextClosable<T extends BaseContextClosable = any> = Partial<Pick<T, 'closable' | 'closeIcon'>>

export function pickClosable<T extends BaseContextClosable>(context: Ref<ContextClosable<T>>): Ref<ContextClosable<T> | undefined> {
  return computed(() => {
    if (!context.value) {
      return undefined
    }
    const { closable, closeIcon } = context.value
    return { closable, closeIcon }
  })
}

/** Collection contains the all the props related with closable. e.g. `closable`, `closeIcon` */
interface ClosableCollection {
  closable?: ClosableType
  closeIcon?: VueNode
}

interface FallbackCloseCollection extends ClosableCollection {
  /**
   * Some components need to wrap CloseIcon twice,
   * this method will be executed once after the final CloseIcon is calculated
   */
  closeIconRender?: (closeIcon: VNodeChild) => VNodeChild
}

export interface UseClosableParams {
  closable?: ClosableType
  closeIcon?: RenderNodeFn
  defaultClosable?: boolean
  defaultCloseIcon?: RenderNodeFn
  customCloseIconRender?: (closeIcon: VNodeChild) => VNodeChild
  context?: ContextClosable
}

/** Convert `closable` and `closeIcon` to config object */
function useClosableConfig(closableCollection?: Ref<ClosableCollection | null>) {
  return computed(() => {
    const { closable, closeIcon } = closableCollection?.value ?? {}
    if (!closable && (closable === false || closeIcon === false || closeIcon === null)) {
      // TODO
      return false
    }
    if (closable === undefined && closeIcon === undefined) {
      return null
    }
    let closableConfig: ClosableType = {
      closeIcon: typeof closeIcon !== 'boolean' && closeIcon !== null ? closeIcon : undefined,
    }
    if (closable && typeof closable === 'object') {
      closableConfig = {
        ...closableConfig,
        ...closable,
      }
    }
    return closableConfig
  })
}

/** Use same object to support `useMemo` optimization */
const EmptyFallbackCloseCollection: FallbackCloseCollection = {}

export default function useClosable(
  propCloseCollection?: Ref<ClosableCollection>,
  contextCloseCollection?: Ref<ClosableCollection | null>,
  fallbackCloseCollection: Ref<FallbackCloseCollection> = ref(EmptyFallbackCloseCollection),
) {
  // Align the `props`, `context` `fallback` to config object first
  const propCloseConfig = useClosableConfig(propCloseCollection)
  const contextCloseConfig = useClosableConfig(contextCloseCollection)
  // 预留的多语言的部分
  const [contextLocale] = useLocale('global', defaultLocale.global)
  const closeBtnIsDisabled = computed(() => {
    return typeof propCloseConfig.value !== 'boolean' ? !!propCloseConfig.value?.disabled : false
  })
  const mergedFallbackCloseCollection = computed(() => {
    return {
      closeIcon: <CloseOutlined />,
      ...fallbackCloseCollection.value,
    }
  })

  // Use fallback logic to fill the config
  const mergedClosableConfig = computed(() => {
    // ================ Props First ================
    // Skip if prop is disabled
    if (propCloseConfig.value === false) {
      return false
    }
    if (propCloseConfig.value) {
      return extendsObject(mergedFallbackCloseCollection.value, contextCloseConfig.value, propCloseConfig.value)
    }

    // =============== Context Second ==============
    // Skip if context is disabled
    if (contextCloseConfig.value === false) {
      return false
    }
    if (contextCloseConfig.value) {
      return extendsObject(mergedFallbackCloseCollection.value, contextCloseConfig.value)
    }
    // ============= Fallback Default ==============
    return !mergedFallbackCloseCollection.value.closable ? false : mergedFallbackCloseCollection.value
  })

  // Calculate the final closeIcon
  return computed(() => {
    if (mergedClosableConfig.value === false) {
      return [false, null, closeBtnIsDisabled.value, {}]
    }
    const { closeIconRender } = mergedFallbackCloseCollection.value
    const { closeIcon } = mergedClosableConfig.value
    let mergedCloseIcon: VNodeChild = getVNode(closeIcon)
    // Wrap the closeIcon with aria props
    const ariaOrDataProps = pickAttrs(mergedClosableConfig.value, true)
    if (mergedCloseIcon !== null && mergedCloseIcon !== undefined) {
      // Wrap the closeIcon if needed
      if (closeIconRender) {
        mergedCloseIcon = closeIconRender(mergedCloseIcon)
        if (Array.isArray(mergedCloseIcon)) {
          mergedCloseIcon = filterEmpty(mergedCloseIcon)?.[0]
        }
        else {
          mergedCloseIcon = filterEmpty([mergedCloseIcon])?.[0]
        }
      }
      mergedCloseIcon = isVNode(mergedCloseIcon)
        ? createVNode(mergedCloseIcon, {
            ...mergedCloseIcon.props,
            'aria-label': mergedCloseIcon.props?.['aria-label'] ?? contextLocale?.value?.close,
            ...ariaOrDataProps,
          })
        : (<span aria-label={contextLocale?.value?.close} {...ariaOrDataProps}>{mergedCloseIcon}</span>)
      return [true, mergedCloseIcon, closeBtnIsDisabled.value, {
        'aria-label': contextLocale?.value?.close ?? defaultLocale.global?.close,
        ...ariaOrDataProps,
      }] as const
    }
  })
}

function computeClosableConfig(closable?: ClosableType, closeIcon?: VueNode): ClosableType | boolean | null {
  if (!closable && (closable === false || closeIcon === false || closeIcon === null)) {
    return false
  }

  if (closable === undefined && closeIcon === undefined) {
    return null
  }

  let closableConfig: ClosableType = {
    closeIcon: typeof closeIcon !== 'boolean' && closeIcon !== null ? closeIcon : undefined,
  }

  if (closable && typeof closable === 'object') {
    closableConfig = {
      ...closableConfig,
      ...closable,
    }
  }
  return closableConfig
}

function computeCloseIcon(
  mergedConfig: ClosableCollection,
  fallbackCloseCollection: FallbackCloseCollection,
  closeLabel: string,
): [VueNode, AriaAttributes & DataAttributes] {
  const { closeIconRender } = fallbackCloseCollection
  const { closeIcon, ...restConfig } = mergedConfig

  let finalCloseIcon = getSlotPropsFnRun({}, { closeIcon }, 'closeIcon')
  const ariaOrDataProps = pickAttrs(restConfig, true)

  if (isNonNullable(finalCloseIcon)) {
    if (closeIconRender) {
      finalCloseIcon = closeIconRender(finalCloseIcon)
    }

    finalCloseIcon = isVNode(finalCloseIcon)
      ? (
          createVNode(finalCloseIcon, {
            'aria-label': finalCloseIcon.props?.['aria-label'] ?? closeLabel,
            ...ariaOrDataProps,
          })
        )
      : (
          <span aria-label={closeLabel} {...ariaOrDataProps}>
            {finalCloseIcon}
          </span>
        )
  }

  return [
    finalCloseIcon,
    {
      'aria-label': closeLabel,
      ...ariaOrDataProps,
    },
  ]
}

function mergeClosableConfigs(
  propConfig: ReturnType<typeof computeClosableConfig>,
  contextConfig: ReturnType<typeof computeClosableConfig>,
  fallbackConfig: ClosableCollection & { closeIconRender?: (icon: VNodeChild) => VNodeChild },
) {
  if (propConfig === false) {
    return false
  }
  if (propConfig) {
    return extendsObject(fallbackConfig, contextConfig, propConfig)
  }

  if (contextConfig === false) {
    return false
  }
  if (contextConfig) {
    return extendsObject(fallbackConfig, contextConfig)
  }

  return fallbackConfig.closable ? fallbackConfig : false
}

export function computeClosable(
  propCloseCollection?: Ref<ClosableCollection>,
  contextCloseCollection?: Ref<ClosableCollection | null>,
  fallbackCloseCollection: Ref<FallbackCloseCollection> = ref(EmptyFallbackCloseCollection),
  closeLabel = 'Close',
): [
    closable: boolean,
    closeIcon: VueNode,
    closeBtnIsDisabled: boolean,
    ariaOrDataProps: AriaAttributes & DataAttributes,
] {
  const propConfig = computeClosableConfig(
    unref(propCloseCollection)?.closable,
    unref(propCloseCollection)?.closeIcon,
  )
  const contextConfig = computeClosableConfig(
    unref(contextCloseCollection)?.closable,
    unref(contextCloseCollection)?.closeIcon,
  )

  const mergedFallback = {
    closeIcon: <CloseOutlined />,
    ...fallbackCloseCollection.value,
  }

  const mergedConfig = mergeClosableConfigs(propConfig, contextConfig, mergedFallback)

  const closeBtnIsDisabled = typeof mergedConfig !== 'boolean' ? !!(mergedConfig as any)?.disabled : false
  if (mergedConfig === false) {
    return [false, null, closeBtnIsDisabled, {}]
  }

  const [closeIcon, ariaProps] = computeCloseIcon(mergedConfig, mergedFallback, closeLabel)
  return [true, closeIcon, closeBtnIsDisabled, ariaProps]
}
