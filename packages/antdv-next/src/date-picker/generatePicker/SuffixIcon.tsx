import type { PickerMode } from '@v-c/picker'
import type { VueNode } from '../../_util/type'
import { CalendarOutlined, ClockCircleOutlined } from '@antdv-next/icons'
import { defineComponent } from 'vue'
import { TIME } from './constant'

export interface SuffixIconProps {
  picker?: PickerMode
  hasFeedback?: boolean
  feedbackIcon?: VueNode
  suffixIcon?: VueNode
}

const SuffixIcon = defineComponent<SuffixIconProps>(
  (props) => {
    return () => {
      const { picker, hasFeedback, feedbackIcon, suffixIcon } = props
      if (suffixIcon === null || suffixIcon === false) {
        return null
      }
      if (suffixIcon === true || suffixIcon === undefined) {
        return (
          <>
            {picker === TIME
              ? <ClockCircleOutlined aria-hidden="true" />
              : <CalendarOutlined aria-hidden="true" />}
            {hasFeedback ? feedbackIcon : null}
          </>
        )
      }

      return suffixIcon as any
    }
  },
  {
    name: 'APickerSuffixIcon',
  },
)

export default SuffixIcon
