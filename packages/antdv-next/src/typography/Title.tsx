import type { SlotsType } from 'vue'
import type { BlockProps, TypographyBaseEmits, TypographySlots } from './interface'
import { omit } from 'es-toolkit'
import { computed, defineComponent, watchEffect } from 'vue'
import { devUseWarning, isDev } from '../_util/warning'
import Base from './Base'

const TITLE_ELE_LIST = [1, 2, 3, 4, 5] as const

export interface TitleProps extends Omit<BlockProps, 'strong'> {
  level?: (typeof TITLE_ELE_LIST)[number]
}

const Title = defineComponent<
  TitleProps,
  TypographyBaseEmits,
  string,
  SlotsType<TypographySlots>
>(
  (props, { slots, attrs, emit }) => {
    const level = computed(() => props.level ?? 1)

    if (isDev) {
      const warning = devUseWarning('Typography.Title')
      watchEffect(() => {
        warning(
          TITLE_ELE_LIST.includes(level.value as any),
          'usage',
          'Title only accept `1 | 2 | 3 | 4 | 5` as `level` value. And `5` need 4.6.0+ version.',
        )
      })
    }

    const component = computed(() => (TITLE_ELE_LIST.includes(level.value as any) ? `h${level.value}` : 'h1'))

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
      const restProps = omit(props, ['level']) as Record<string, any>
      return (
        <Base
          {...(restAttrs as any)}
          {...restProps}
          component={component.value as any}
          v-slots={slots}
          {...listeners}
        />
      )
    }
  },
  {
    name: 'ATypographyTitle',
    inheritAttrs: false,
  },
)

export default Title
