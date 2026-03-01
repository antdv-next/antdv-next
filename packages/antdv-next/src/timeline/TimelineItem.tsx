import type { SlotsType } from 'vue'
import type { EmptyEmit } from '../_util/type.ts'
import type { TimelineItemType } from './Timeline.tsx'
import { defineComponent } from 'vue'

export const TIMELINE_ITEM_MARK = '_ANTDV_NEXT_TIMELINE_ITEM'

export interface TimelineItemProps extends Omit<TimelineItemType, 'className' | 'class' | 'style' | 'classes' | 'styles' | 'children' | 'key'> {

}

export interface TimelineItemSlots {
  title?: () => any
  content?: () => any
  icon?: () => any
}

export const TimelineItem = defineComponent<
  TimelineItemProps,
  EmptyEmit,
  string,
  SlotsType<TimelineItemSlots>
>(
  () => {
    return () => null
  },
  {
    name: 'ATimelineItem',
    inheritAttrs: false,
  },
)

;(TimelineItem as any)[TIMELINE_ITEM_MARK] = true
