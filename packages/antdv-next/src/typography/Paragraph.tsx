import type { SlotsType } from 'vue'
import type { BlockProps, TypographyBaseEmits, TypographySlots } from './interface'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'

import Base from './Base'

export type TypographyBaseEmitsProps = {
  [K in keyof TypographyBaseEmits as `on${Capitalize<string & K>}`]?: TypographyBaseEmits[K]
}

export interface ParagraphProps extends BlockProps,
  /* @vue-ignore */
  TypographyBaseEmitsProps {}

const Paragraph = defineComponent<
  ParagraphProps,
  TypographyBaseEmits,
  string,
  SlotsType<TypographySlots>
>(
  (props, { slots, attrs, emit }) => {
    const listeners = {
      'onClick': (e: MouseEvent) => emit('click', e),
      'onCopy': (e?: MouseEvent) => emit('copy', e as any),
      'onExpand': (expanded: boolean, e: MouseEvent) => emit('expand', expanded, e),
      'onEditStart': () => emit('edit:start'),
      'onEditChange': (val: string) => emit('edit:change', val),
      'onEditCancel': () => emit('edit:cancel'),
      'onEditEnd': () => emit('edit:end'),
      'onUpdate:expanded': (val: boolean) => emit('update:expanded', val),
      'onUpdate:editing': (val: boolean) => emit('update:editing', val),
    }

    return () => {
      const restAttrs = omit(
        attrs as any,
        [
          'onClick',
          'onCopy',
          'onExpand',
          'onEditStart',
          'onEditChange',
          'onEditCancel',
          'onEditEnd',
          'onUpdate:expanded',
          'onUpdate:editing',
        ],
      )
      return (
        <Base
          {...(restAttrs as any)}
          {...props}
          component="div"
          v-slots={slots}
          {...listeners}
        />
      )
    }
  },
  {
    name: 'ATypographyParagraph',
    inheritAttrs: false,
  },
)

export default Paragraph
