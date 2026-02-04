import type { SlotsType } from 'vue'
import type { BlockProps, EllipsisConfig, TypographyBaseEmits, TypographySlots } from './interface'
import { omit } from 'es-toolkit'
import { computed, defineComponent, watchEffect } from 'vue'
import { devUseWarning, isDev } from '../_util/warning'
import Base from './Base'

export interface TextProps extends BlockProps {
  ellipsis?: boolean | Omit<EllipsisConfig, 'expandable' | 'rows' | 'onExpand'>
}

const Text = defineComponent<
  TextProps,
  TypographyBaseEmits,
  string,
  SlotsType<TypographySlots>
>(
  (props, { slots, attrs, emit }) => {
    const mergedEllipsis = computed(() => {
      const ellipsis = props.ellipsis
      if (ellipsis && typeof ellipsis === 'object') {
        return omit(ellipsis as EllipsisConfig, ['expandable', 'rows'])
      }
      return ellipsis
    })

    if (isDev) {
      const warning = devUseWarning('Typography.Text')
      watchEffect(() => {
        const ellipsis = props.ellipsis as any
        warning(
          typeof ellipsis !== 'object'
          || !ellipsis
          || (!('expandable' in ellipsis) && !('rows' in ellipsis)),
          'usage',
          '`ellipsis` do not support `expandable` or `rows` props.',
        )
      })
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
          ellipsis={mergedEllipsis.value as any}
          component="span"
          v-slots={slots}
          {...listeners}
        />
      )
    }
  },
  {
    name: 'ATypographyText',
    inheritAttrs: false,
  },
)

export default Text
