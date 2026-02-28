import type { SlotsType } from 'vue'
import type { AbstractCheckboxProps, CheckboxEmits, CheckboxSlots } from '../checkbox/Checkbox'
import { defineComponent, ref } from 'vue'
import { useComponentBaseConfig } from '../config-provider/context'
import { useRadioOptionTypeContextProvider } from './context'

import Radio from './radio'

export type RadioButtonProps = AbstractCheckboxProps

export interface RadioButtonEmitsProps {
  onChange?: CheckboxEmits['change']
  'onUpdate:checked'?: CheckboxEmits['update:checked']
  'onUpdate:value'?: CheckboxEmits['update:value']
  onMouseenter?: CheckboxEmits['mouseenter']
  onMouseleave?: CheckboxEmits['mouseleave']
  onKeypress?: CheckboxEmits['keypress']
  onKeydown?: CheckboxEmits['keydown']
  onFocus?: CheckboxEmits['focus']
  onBlur?: CheckboxEmits['blur']
  onClick?: CheckboxEmits['click']
}

export interface InternalRadioButtonProps extends RadioButtonProps,
  /* @vue-ignore */
  RadioButtonEmitsProps {}

const RadioButton = defineComponent<
  InternalRadioButtonProps,
  CheckboxEmits,
  string,
  SlotsType<CheckboxSlots>
>(
  (props, { slots, attrs }) => {
    const { prefixCls } = useComponentBaseConfig('radio', props)
    useRadioOptionTypeContextProvider(ref('button'))
    return () => {
      return (
        <Radio
          prefixCls={prefixCls.value}
          {...attrs}
          {...props}
          v-slots={slots}
        />
      )
    }
  },
  {
    name: 'ARadioButton',
    inheritAttrs: false,
  },
)

export default RadioButton
