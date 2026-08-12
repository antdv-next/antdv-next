import { clsx } from '@v-c/util'
import { defineComponent, shallowRef } from 'vue'
import { getAttrStyleAndClass } from '../_util/hooks'
import { useBaseConfig } from '../config-provider/context.ts'

export interface CardGridProps {
  prefixCls?: string
  hoverable?: boolean
}

export interface CardGridRef {
  nativeElement: HTMLDivElement
}

const defaultProps: CardGridProps = {
  hoverable: true,
}

const CardGrid = defineComponent<CardGridProps>(
  (props = defaultProps, { attrs, slots, expose }) => {
    const { prefixCls } = useBaseConfig('card', props)

    const nativeElementRef = shallowRef<HTMLDivElement>()
    expose({
      nativeElement: nativeElementRef,
    })

    return () => {
      const prefix = `${prefixCls.value}-grid`
      const { className, restAttrs, style } = getAttrStyleAndClass(attrs)
      const classString = clsx(prefix, className, {
        [`${prefix}-hoverable`]: props.hoverable,
      })
      return (
        <div ref={nativeElementRef} {...restAttrs} class={classString} style={style}>
          {slots?.default?.()}
        </div>
      )
    }
  },
  {
    name: 'ACardGrid',
    inheritAttrs: false,
  },
)

export default CardGrid
