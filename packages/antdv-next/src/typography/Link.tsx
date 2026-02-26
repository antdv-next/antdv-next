import type { SlotsType } from 'vue'
import type { BlockProps, TypographyBaseEmits, TypographySlots } from './interface'
import { omit } from 'es-toolkit'
import { defineComponent, getCurrentInstance } from 'vue'
import { devUseWarning, isDev } from '../_util/warning'
import Base from './Base'
import { typographyBaseCallbackPropKeys } from './interface'

export interface LinkProps extends BlockProps {
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
  (props, { slots, attrs }) => {
    const instance = getCurrentInstance()
    const getCallbackProps = () => (instance?.vnode.props ?? {}) as any
    if (isDev) {
      const warning = devUseWarning('Typography.Link')
      warning(typeof props.ellipsis !== 'object', 'usage', '`ellipsis` only supports boolean value.')
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
      const restProps = omit(props, [...typographyBaseCallbackPropKeys]) as Record<string, any>

      return (
        <Base
          {...(restAttrs as any)}
          {...restProps}
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
