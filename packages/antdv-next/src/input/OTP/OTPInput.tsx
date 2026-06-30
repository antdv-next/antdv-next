import type { SlotsType } from 'vue'
import type { EmptyEmit } from '../../_util/type.ts'
import type { InputEmits, InputProps, InputRef } from '../Input'
import { clsx } from '@v-c/util'
import raf from '@v-c/util/dist/raf'
import { omit } from 'es-toolkit'
import { defineComponent, shallowRef } from 'vue'
import { getAttrStyleAndClass } from '../../_util/hooks'
import Input from '../Input'

export interface OTPInputProps extends Omit<InputProps, 'onChange'> {
  prefixCls: string
  index: number
  value?: string
  onChange: (index: number, value: string) => void
  onActiveChange: (nextIndex: number) => void
  mask?: boolean | string
}

const OTPInput = defineComponent<
  OTPInputProps,
  EmptyEmit,
  string,
  SlotsType<{ default?: () => any }>
>(
  (props, { attrs, expose, slots }) => {
    const inputRef = shallowRef<InputRef>()
    expose({
      focus: (...args: Parameters<NonNullable<InputRef['focus']>>) => inputRef.value?.focus?.(...args),
      blur: () => inputRef.value?.blur?.(),
      input: inputRef,
    })

    const syncSelection = () => {
      raf(() => {
        const inputEle = inputRef.value?.input
        if (document.activeElement === inputEle && inputEle) {
          inputEle.select()
        }
      })
    }

    const handleChange: InputEmits['change'] = (e) => {
      props.onChange(props.index, (e?.target as HTMLInputElement)?.value ?? '')
    }

    const handleKeyDown: InputEmits['keydown'] = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey } = event
      if (key === 'ArrowLeft') {
        props.onActiveChange(props.index - 1)
      }
      else if (key === 'ArrowRight') {
        props.onActiveChange(props.index + 1)
      }
      else if (key === 'z' && (ctrlKey || metaKey)) {
        event.preventDefault()
      }
      else if (key === 'Backspace' && !props.value) {
        props.onActiveChange(props.index - 1)
      }
      syncSelection()
    }

    const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
    const restInputProps = omit(props, ['prefixCls', 'index', 'onChange', 'onActiveChange', 'mask'])
    const maskValue = typeof props.mask === 'string' ? props.mask : props.value

    return () => (
      <span class={`${props.prefixCls}-input-wrapper`} role="presentation">
        {props.mask && props.value !== '' && props.value !== undefined && (
          <span class={`${props.prefixCls}-mask-icon`} aria-hidden="true">
            {maskValue}
          </span>
        )}
        <Input
          {...restAttrs}
          {...restInputProps}
          ref={inputRef as any}
          value={props.value}
          type={props.mask === true ? 'password' : (props.type ?? 'text')}
          class={clsx(className, { [`${props.prefixCls}-mask-input`]: props.mask })}
          style={style}
          onChange={handleChange}
          htmlSize={1}
          onKeydown={handleKeyDown}
          onFocus={() => syncSelection()}
          onMousedown={() => syncSelection()}
          onMouseup={() => syncSelection()}
          aria-label={`OTP Input ${props.index + 1}`}
          v-slots={slots}
        />
      </span>
    )
  },
  {
    name: 'AInputOTPInput',
    inheritAttrs: false,
  },
)

export default OTPInput
