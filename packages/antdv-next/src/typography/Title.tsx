import type { SlotsType } from 'vue'
import type { BlockProps, TypographyBaseEmits, TypographySlots } from './interface'
import { omit } from 'es-toolkit'
import { computed, defineComponent, getCurrentInstance, watchEffect } from 'vue'
import { devUseWarning, isDev } from '../_util/warning'
import Base from './Base'
import { typographyBaseCallbackPropKeys } from './interface'

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
  (props, { slots, attrs }) => {
    const instance = getCurrentInstance()
    const getCallbackProps = () => (instance?.vnode.props ?? {}) as any
    const level = computed(() => props.level ?? 1)

    if (isDev) {
      const warning = devUseWarning('Typography.Title')
      watchEffect(() => {
        warning(
          TITLE_ELE_LIST.includes(level.value as any),
          'usage',
          'Title only accept `1 | 2 | 3 | 4 | 5` as `level` value.',
        )
      })
    }

    const component = computed(() => (TITLE_ELE_LIST.includes(level.value as any) ? `h${level.value}` : 'h1'))

    const listeners = {
      'onClick': (e: MouseEvent) => getCallbackProps()?.onClick?.(e),
      'onCopy': (e?: MouseEvent) => getCallbackProps()?.onCopy?.(e as any),
      'onExpand': (expanded: boolean, e: MouseEvent) => getCallbackProps()?.onExpand?.(expanded, e),
      'onEditStart': () => getCallbackProps()?.onEditStart?.(),
      'onEditChange': (val: string) => getCallbackProps()?.onEditChange?.(val),
      'onEditCancel': () => getCallbackProps()?.onEditCancel?.(),
      'onEditEnd': () => getCallbackProps()?.onEditEnd?.(),
      'onUpdate:expanded': (val: boolean) => getCallbackProps()?.['onUpdate:expanded']?.(val),
      'onUpdate:editing': (val: boolean) => getCallbackProps()?.['onUpdate:editing']?.(val),
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
      const restProps = omit(props, ['level', ...typographyBaseCallbackPropKeys]) as Record<string, any>
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
