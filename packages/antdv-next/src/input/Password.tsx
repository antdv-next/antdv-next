import type { SlotsType } from 'vue'
import type { VueNode } from '../_util/type'
import type { InputEmits as BaseInputEmits, InputProps as BaseInputProps, InputRef } from './Input'
import { EyeInvisibleOutlined, EyeOutlined } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef, watch } from 'vue'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { useComponentBaseConfig } from '../config-provider/context'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'
import useRemovePasswordTimeout from './hooks/useRemovePasswordTimeout'
import Input from './Input'

type VisibilityToggle = boolean | { tabIndex?: number, visible?: boolean, onVisibleChange?: (visible: boolean) => void }

type PasswordAction = 'click' | 'hover'

export interface PasswordProps extends Omit<BaseInputProps, 'type'>,
  /* @vue-ignore */
  PasswordEmitsProps {
  inputPrefixCls?: string
  action?: PasswordAction
  visibilityToggle?: VisibilityToggle
  suffix?: VueNode
  iconRender?: (params: { visible: boolean }) => any
  iconVisible?: boolean
}

export interface PasswordEmits extends BaseInputEmits {
  'update:iconVisible': (visible: boolean) => void
}
export interface PasswordEmitsProps {
  'onUpdate:iconVisible'?: PasswordEmits['update:iconVisible']
}

export interface InputPasswordRef {
  focus: (...args: Parameters<NonNullable<InputRef['focus']>>) => void
  blur: () => void
  input: HTMLInputElement | null
}

export interface PasswordSlots {
  prefix?: () => any
  suffix?: () => any
  addonBefore?: () => any
  addonAfter?: () => any
  clearIcon?: () => any
  default?: () => any
  iconRender?: (params: { visible: boolean }) => any
}

const defaultIconRender = (visible: boolean) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)

const InternalPassword = defineComponent<
  PasswordProps,
  PasswordEmits,
  string,
  SlotsType<PasswordSlots>
>(
  (props, { slots, attrs, emit, expose }) => {
    const { disabled: customDisabled, inputPrefixCls: customizeInputPrefixCls } = toPropsRefs(props, 'disabled', 'inputPrefixCls')
    const {
      getPrefixCls,
    } = useComponentBaseConfig('input', props)
    const inputPrefixCls = computed(() => getPrefixCls('input', customizeInputPrefixCls.value))
    const passwordPrefixCls = computed(() => getPrefixCls('input-password', props.prefixCls))

    const disabledContext = useDisabledContext()
    const mergedDisabled = computed(() => customDisabled.value ?? disabledContext.value)

    const inputRef = shallowRef<InputRef>()
    const removePasswordTimeout = useRemovePasswordTimeout(inputRef)

    const visibilityToggle = computed<VisibilityToggle>(() => props.visibilityToggle ?? true)
    const visibilityControlled = computed(() => typeof visibilityToggle.value === 'object' && visibilityToggle.value.visible !== undefined)
    const visible = shallowRef(visibilityControlled.value ? Boolean((visibilityToggle.value as any).visible) : false)

    watch(visibilityToggle, (next) => {
      if (visibilityControlled.value) {
        visible.value = Boolean((next as any).visible)
      }
    })

    const triggerVisibleChange = () => {
      if (mergedDisabled.value || visibilityToggle.value === false) {
        return
      }
      if (visible.value) {
        removePasswordTimeout()
      }
      const next = !visible.value
      visible.value = next
      if (typeof visibilityToggle.value === 'object') {
        visibilityToggle.value.onVisibleChange?.(next)
      }
    }

    const action = computed<PasswordAction>(() => props.action ?? 'click')

    const iconRender = (visible: boolean) => {
      const _iconRender = getSlotPropsFnRun(slots, props, 'iconRender', true, { visible })
      if (_iconRender) {
        return _iconRender
      }
      return defaultIconRender(visible)
    }

    const getIcon = () => {
      if (!visibilityToggle.value) {
        return null
      }
      const iconNode = iconRender(visible.value)
      const eventName = action.value === 'hover' ? 'onMouseover' : 'onClick'
      const toggle = visibilityToggle.value
      const iconTabIndex = typeof toggle === 'object' ? toggle.tabIndex : undefined
      const triggerProps = { [eventName]: () => triggerVisibleChange() }
      return (
        <span
          key="passwordIcon"
          role="button"
          tabindex={mergedDisabled.value ? -1 : (iconTabIndex ?? 0)}
          class={`${passwordPrefixCls.value}-icon`}
          aria-disabled={mergedDisabled.value}
          aria-pressed={visible.value}
          // Prevent focused state lost
          // https://github.com/ant-design/ant-design/issues/15173
          onMousedown={(e: MouseEvent) => e.preventDefault()}
          // Prevent caret position change
          // https://github.com/ant-design/ant-design/issues/23524
          onMouseup={(e: MouseEvent) => e.preventDefault()}
          onKeydown={(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              triggerVisibleChange()
            }
          }}
          {...triggerProps}
        >
          {iconNode}
        </span>
      )
    }

    const handleUpdateValue = (value: any) => {
      emit('update:value', value)
    }

    const handleChange: PasswordEmits['change'] = (e) => {
      emit('change', e)
    }

    const handleFocus: PasswordEmits['focus'] = e => emit('focus', e)
    const handleBlur: PasswordEmits['blur'] = e => emit('blur', e)

    expose({
      focus: (...args: Parameters<NonNullable<InputRef['focus']>>) => inputRef.value?.focus?.(...args),
      blur: () => inputRef.value?.blur?.(),
      input: computed(() => inputRef.value?.input ?? null),
    })

    return () => {
      const restInputProps = omit(props, ['iconRender', 'visibilityToggle', 'action', 'suffix', 'inputPrefixCls', 'rootClass', 'prefixCls'])
      const suffixSlot = getSlotPropsFnRun(slots, props, 'suffix')
      const visibilityIcon = getIcon()
      const mergedSuffix = visibilityToggle.value && visibilityIcon
        ? (
            <>
              {visibilityIcon}
              {suffixSlot}
            </>
          )
        : suffixSlot

      return (
        <Input
          {...attrs}
          {...restInputProps}
          ref={inputRef as any}
          prefixCls={inputPrefixCls.value}
          type={visible.value ? 'text' : 'password'}
          suffix={mergedSuffix}
          disabled={mergedDisabled.value}
          rootClass={clsx(passwordPrefixCls.value, props.rootClass, { [`${passwordPrefixCls.value}-${props.size}`]: props.size })}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPressEnter={(e: any) => emit('pressEnter', e)}
          onClear={() => emit('clear')}
          onCompositionstart={(e: any) => emit('compositionstart', e)}
          onCompositionend={(e: any) => emit('compositionend', e)}
          onKeydown={(e: any) => emit('keydown', e)}
          onKeyup={(e: any) => emit('keyup', e)}
          v-slots={{
            ...omit(slots, ['suffix', 'iconRender']),
          }}
          {...{
            'onUpdate:value': handleUpdateValue,
          }}
        />
      )
    }
  },
  {
    name: 'AInputPassword',
    inheritAttrs: false,
  },
)

export default InternalPassword
