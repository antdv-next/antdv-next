import type { PickerMode } from '@v-c/picker'
import type { VueNode } from '../../_util/type'
import { CalendarOutlined, ClockCircleOutlined } from '@antdv-next/icons'
import { TIME } from './constant'

export interface UseSuffixProps {
  picker?: PickerMode
  hasFeedback?: boolean
  feedbackIcon?: VueNode
  suffix?: VueNode
}

function useSuffix({ picker, hasFeedback, feedbackIcon, suffix }: UseSuffixProps): VueNode {
  if (suffix === null || suffix === false) {
    return null
  }
  if (suffix === true || suffix === undefined) {
    return (
      <>
        {picker === TIME
          ? <ClockCircleOutlined aria-hidden="true" />
          : <CalendarOutlined aria-hidden="true" />}
        {hasFeedback ? feedbackIcon : null}
      </>
    )
  }

  return suffix
}

export default useSuffix
