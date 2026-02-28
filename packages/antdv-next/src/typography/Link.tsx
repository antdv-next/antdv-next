import type { SlotsType } from 'vue'
import type { BlockProps, TypographyBaseEmits, TypographySlots } from './interface'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'
import { devUseWarning, isDev } from '../_util/warning'

import Base from './Base'

export type TypographyBaseEmitsProps = {
  [K in keyof TypographyBaseEmits as `on${Capitalize<string & K>}`]?: TypographyBaseEmits[K]
}

export interface LinkProps extends BlockProps,
  /* @vue-ignore */
  TypographyBaseEmitsProps {
  ellipsis?: boolean
  href?: string
  target?: string
  rel?: string
}

const Link = defineComponent<
  LinkProps,
  TypographyBaseEmits,
  string,
  SlotsType<TypographySlots>
>(
  (props, { slots, attrs, emit }) => {
    if (isDev) {
      const warning = devUseWarning('Typography.Link')
      warning(typeof props.ellipsis !== 'object', 'usage', '`ellipsis` only supports boolean value.')
    }

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
      const rel = props.rel === undefined && (props.target || (attrs as any).target) === '_blank'
        ? 'noopener noreferrer'
        : props.rel
      const restAttrs = omit(attrs as any, [
        'onClick',
        'onCopy',
        'onExpand',
        'onEditStart',
        'onEditChange',
        'onEditCancel',
        'onEditEnd',
        'onUpdate:expanded',
        'onUpdate:editing',
      ])

      return (
        <Base
          {...(restAttrs as any)}
          {...props}
          rel={rel}
          ellipsis={!!props.ellipsis}
          component="a"
          v-slots={slots}
          {...listeners}
        />
      )
    }
  },
  {
    name: 'ATypographyLink',
    inheritAttrs: false,
  },
)

export default Link
