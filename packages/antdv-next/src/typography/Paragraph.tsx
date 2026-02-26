import type { SlotsType } from 'vue'
import type { BlockProps, TypographyBaseEmits, TypographySlots } from './interface'
import { omit } from 'es-toolkit'
import { defineComponent, getCurrentInstance } from 'vue'
import Base from './Base'
import { typographyBaseCallbackPropKeys } from './interface'

export interface ParagraphProps extends BlockProps {}

const Paragraph = defineComponent<
  ParagraphProps,
  TypographyBaseEmits,
  string,
  SlotsType<TypographySlots>
>(
  (props, { slots, attrs }) => {
    const instance = getCurrentInstance()
    const getCallbackProps = () => (instance?.vnode.props ?? {}) as any
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
      const restProps = omit(props, [...typographyBaseCallbackPropKeys]) as Record<string, any>
      return (
        <Base
          {...(restAttrs as any)}
          {...restProps}
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
