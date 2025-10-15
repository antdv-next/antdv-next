import type { CSSProperties, SlotsType } from 'vue'
import type { RenderNodeFn } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { SizeType } from '../config-provider/SizeContext.ts'
import type { ButtonColorType, ButtonHTMLType, ButtonShape, ButtonType, ButtonVariantType } from './buttonHelper.tsx'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { toArray } from 'es-toolkit/compat'
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { getSlotPropFn } from '../_util/tools.ts'
import { useComponentConfig, useConfig } from '../config-provider/context.ts'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'
import { useSize } from '../config-provider/hooks/useSize.ts'
import { useCompactItemContext } from '../space/Compact.tsx'
import {
  isTwoCNChar,
  isUnBorderedButtonVariant,
} from './buttonHelper.tsx'
import DefaultLoadingIcon from './DefaultLoadingIcon.tsx'
import IconWrapper from './IconWrapper.tsx'
import useStyle from './style'

export type LegacyButtonType = ButtonType | 'danger'

export interface BaseButtonProps extends ComponentBaseProps {
  type?: ButtonType
  color?: ButtonColorType
  variant?: ButtonVariantType
  icon?: RenderNodeFn
  iconPosition?: 'start' | 'end'
  shape?: ButtonShape
  size?: SizeType
  disabled?: boolean
  loading?: boolean | { delay?: number, icon?: RenderNodeFn }
  ghost?: boolean
  danger?: boolean
  block?: boolean
  [key: `data-${string}`]: string
  classes?: { icon: string }
  styles?: { icon: CSSProperties }
  autoFocus?: boolean
}

export interface ButtonProps extends BaseButtonProps {
  href?: string
  htmlType?: ButtonHTMLType
  autoInsertSpace?: boolean
}

interface LoadingConfigType {
  loading: boolean
  delay: number
}

function getLoadingConfig(loading: BaseButtonProps['loading']): LoadingConfigType {
  if (typeof loading === 'object' && loading) {
    let delay = loading?.delay
    delay = !Number.isNaN(delay) && typeof delay === 'number' ? delay : 0
    return {
      loading: delay <= 0,
      delay,
    }
  }

  return {
    loading: !!loading,
    delay: 0,
  }
}

type ColorVariantPairType = [color?: ButtonColorType, variant?: ButtonVariantType]

const ButtonTypeMap: Partial<Record<ButtonType, ColorVariantPairType>> = {
  default: ['default', 'outlined'],
  primary: ['primary', 'solid'],
  dashed: ['default', 'dashed'],
  // `link` is not a real color but we should compatible with it
  link: ['link' as any, 'link'],
  text: ['default', 'text'],
}

export interface ButtonEmits {
  click?: (e: MouseEvent) => void
  [key: string]: any
}

export interface ButtonSlots {
  default?: () => any
  icon?: () => any
}

const defaultButtonProps = {
  iconPosition: 'start',
  htmlType: 'button',
  autoInsertSpace: undefined,
  disabled: undefined,
} as any

const InternalCompoundedButton = defineComponent<
  ButtonProps,
  ButtonEmits,
  string,
  SlotsType<ButtonSlots>
>(
  (props = defaultButtonProps, { slots, attrs, emit }) => {
    // https://github.com/ant-design/ant-design/issues/47605
    // Compatible with original `type` behavior
    const mergedType = computed(() => props.type || 'default')
    const configCtx = useConfig()

    const shape = computed(() => props.shape || configCtx.value?.button?.shape || 'default')

    const mergedColorVariant = computed<ColorVariantPairType>(
      () => {
        const { color, variant, type, danger } = props
        const button = configCtx.value?.button || {}
        // >>>>> Local
        // Color & Variant
        if (color && variant) {
          return [color, variant]
        }
        // Sugar syntax
        if (type || danger) {
          const colorVariantPair = ButtonTypeMap[mergedType.value] || []
          if (danger) {
            return ['danger', colorVariantPair[1]]
          }
          return colorVariantPair
        }
        // >>> Context fallback
        if (button?.color && button?.variant) {
          return [button.color, button.variant]
        }
        return ['default', 'outlined']
      },
    )
    const mergedColor = computed(() => mergedColorVariant.value[0])
    const mergedVariant = computed(() => mergedColorVariant.value[1])
    const isDanger = computed(() => mergedColor.value === 'danger')
    const mergedColorText = computed(() => isDanger.value ? 'dangerous' : mergedColor.value)
    const componentCtx = useComponentConfig('button')
    const mergedInsertSpace = computed(() => {
      return props?.autoInsertSpace ?? componentCtx.value?.autoInsertSpace ?? true
    })
    const prefixCls = computed(() => componentCtx.value.getPrefixCls('btn', props.prefixCls))
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls.value)
    const disabled = useDisabledContext()
    const mergedDisabled = computed(() => {
      return props?.disabled ?? disabled.value
    })
    const direction = computed(() => componentCtx.value?.direction)

    const loadingOrDelay = computed<LoadingConfigType>(() => {
      return getLoadingConfig(props.loading)
    })
    const innerLoading = shallowRef(loadingOrDelay.value.loading)
    const hasTwoCNChar = shallowRef(false)
    const buttonRef = shallowRef<HTMLButtonElement | HTMLAnchorElement>()
    const isMountRef = shallowRef(false)
    onMounted(() => {
      isMountRef.value = false
      if (props.autoFocus && buttonRef.value) {
        buttonRef.value?.focus?.()
      }
    })
    onBeforeUnmount(() => {
      isMountRef.value = true
    })
    let delayTimer: ReturnType<typeof setTimeout> | null = null
    // Update loading state
    watch(
      [() => loadingOrDelay.value.delay, () => loadingOrDelay.value.loading],
      async (_new, _old, onCleanup) => {
        await nextTick()
        if (loadingOrDelay.value.delay > 0) {
          delayTimer = setTimeout(() => {
            delayTimer = null
            innerLoading.value = true
          }, loadingOrDelay.value.delay)
        }
        else {
          innerLoading.value = loadingOrDelay.value.loading
        }
        onCleanup(() => {
          if (delayTimer) {
            clearTimeout(delayTimer)
            delayTimer = null
          }
        })
      },
      {
        immediate: true,
      },
    )

    watch([mergedInsertSpace, buttonRef, mergedVariant], async () => {
      await nextTick()
      // FIXME: for HOC usage like <FormatMessage />
      if (!buttonRef.value || !mergedInsertSpace.value) {
        return
      }
      const buttonText = buttonRef.value.textContent || ''
      const children = filterEmpty(slots?.default?.())
      const iconChildren = filterEmpty(toArray(getSlotPropFn(slots, props, 'icon')?.()))
      const needInserted = children.length === 1 && iconChildren.length === 0 && !isUnBorderedButtonVariant(mergedVariant.value)
      if (needInserted && isTwoCNChar(buttonText)) {
        if (!hasTwoCNChar.value) {
          hasTwoCNChar.value = true
        }
      }
      else if (hasTwoCNChar.value) {
        hasTwoCNChar.value = false
      }
    }, {
      immediate: true,
    })

    // ========================= Events =========================
    const handleClick = (e: MouseEvent) => {
      // FIXME: https://github.com/ant-design/ant-design/issues/30207
      if (innerLoading.value || mergedDisabled.value) {
        e.preventDefault()
        return
      }
      emit('click', e)
    }

    // ========================== Size ==========================
    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction)

    const sizeClassNameMap = { large: 'lg', small: 'sm', middle: undefined }
    const sizeFullName = useSize<SizeType>(ctxSize => (props?.size ?? compactSize.value ?? ctxSize) as SizeType)

    return () => {
      const { loading } = props
      const sizeCls = sizeFullName.value ? (sizeClassNameMap?.[sizeFullName.value] ?? '') : ''
      const iconChildren = filterEmpty(toArray(getSlotPropFn(slots, props, 'icon')?.()))
      const iconType = innerLoading.value ? 'loading' : iconChildren
      const children = filterEmpty(slots?.default?.())
      // ========================= Render =========================
      const cls = classNames(
        prefixCls.value,
        hashId,
        cssVarCls,
        {
          [`${prefixCls.value}-${shape.value}`]: shape.value !== 'default' && shape.value,
          // Compatible with versions earlier than 5.21.0
          [`${prefixCls.value}-${mergedType.value}`]: mergedType.value,
          [`${prefixCls.value}-dangerous`]: props.danger,

          [`${prefixCls.value}-color-${mergedColorText.value}`]: mergedColorText.value,
          [`${prefixCls.value}-variant-${mergedVariant.value}`]: mergedVariant.value,
          [`${prefixCls.value}-${sizeCls}`]: sizeCls,
          [`${prefixCls.value}-icon-only`]: !children && children !== 0 && !!iconType,
          [`${prefixCls.value}-background-ghost`]: props.ghost && !isUnBorderedButtonVariant(mergedVariant.value),
          [`${prefixCls.value}-loading`]: innerLoading.value,
          [`${prefixCls.value}-two-chinese-chars`]: hasTwoCNChar.value && mergedInsertSpace.value && !innerLoading.value,
          [`${prefixCls.value}-block`]: props.block,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-icon-end`]: props.iconPosition === 'end',
        },
        compactItemClassnames.value,
        componentCtx.value.class,
        props.rootClass,
      )
      const iconClasses = classNames(props.classes?.icon, componentCtx.value?.classes?.icon)
      const iconNode = iconChildren.length && !innerLoading.value
        ? (
            <IconWrapper
              prefixCls={prefixCls.value}
              class={[iconClasses]}
              style={[props.styles?.icon, componentCtx.value?.styles?.icon]}
            >
              {iconChildren}
            </IconWrapper>
          )
        : (loading && typeof loading === 'object' && loading.icon
            ? (
                <IconWrapper
                  prefixCls={prefixCls.value}
                  class={[iconClasses]}
                  style={[props.styles?.icon, componentCtx.value?.styles?.icon]}
                >
                  {loading.icon?.()}
                </IconWrapper>
              )
            : (
                <DefaultLoadingIcon
                  existIcon={!!iconChildren.length}
                  prefixCls={prefixCls.value}
                  loading={innerLoading.value}
                  mount={isMountRef.value}
                />
              )
          )
      return <></>
    }
  },
  {
    name: 'AButton',
    inheritAttrs: false,
  },
)
