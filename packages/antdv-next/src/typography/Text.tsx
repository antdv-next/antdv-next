import type { SlotsType } from 'vue'
import type { BlockProps, EllipsisConfig, TypographyBaseEmits, TypographySlots } from './interface'
import { omit } from 'es-toolkit'
import { computed, defineComponent, getCurrentInstance, watchEffect } from 'vue'
import { devUseWarning, isDev } from '../_util/warning'
import Base from './Base'
import { typographyBaseCallbackPropKeys } from './interface'

export interface TextProps extends BlockProps {
  ellipsis?: boolean | Omit<EllipsisConfig, 'expandable' | 'rows' | 'onExpand'>
}

const Text = defineComponent<
  TextProps,
  TypographyBaseEmits,
  string,
  SlotsType<TypographySlots>
>(
  (props, { slots, attrs }) => {
    const instance = getCurrentInstance()
    const getCallbackProps = () => (instance?.vnode.props ?? {}) as any
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
      const restProps = omit(props, [...typographyBaseCallbackPropKeys]) as Record<string, any>
      return (
        <Base
          {...(restAttrs as any)}
          {...restProps}
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
