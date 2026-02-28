import type { SlotsType } from 'vue'
import type { EmitsMap } from '../_util/type'
import type { AbstractCheckboxProps, CheckboxEmits, CheckboxSlots } from '../checkbox/Checkbox'
import { defineComponent, ref } from 'vue'
import { useComponentBaseConfig } from '../config-provider/context'
import { useRadioOptionTypeContextProvider } from './context'

import Radio from './radio'

export type RadioButtonProps = AbstractCheckboxProps

export interface InternalRadioButtonProps extends RadioButtonProps,
  /* @vue-ignore */
  EmitsMap<CheckboxEmits> {}

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
