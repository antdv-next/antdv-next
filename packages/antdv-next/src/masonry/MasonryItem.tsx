import type { Key } from '@v-c/util/dist/type'
import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type.ts'
import type { MasonryProps } from './Masonry.tsx'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { defineComponent, shallowRef, watch } from 'vue'

export interface MasonryItemType<T = any> {
  key: Key
  column?: number
  height?: number
  children?: VueNode
  data: T
  class?: string
  style?: CSSProperties
}

interface MasonryItemProps extends Pick<MasonryProps, 'itemRender'> {
  prefixCls: string
  item: MasonryItemType
  style: CSSProperties
  class?: string
  index: number
  column: number
  onResize?: VoidFunction | null
}

const MasonryItem = defineComponent<MasonryItemProps>(
  (props, { slots }) => {
    const domRef = shallowRef<HTMLDivElement>()
    let observer: ResizeObserver | null = null
    const onResize = () => {
      const onResize = props?.onResize
      if (onResize) {
        onResize()
      }
    }

    // Listen for resize
    watch(
      [() => props.onResize, domRef],
      (_n, _o, onCleanup) => {
        const _onResize = props.onResize
        // 赋值的情况下的处理方案
        if (_onResize && domRef.value) {
          observer = new ResizeObserver(onResize)
          observer.observe(domRef.value)
        }
        onCleanup(() => {
          if (observer) {
            observer.disconnect()
            observer = null
          }
        })
      },
      {
        immediate: true,
        flush: 'post',
      },
    )
    return () => {
      const { item, style, prefixCls, class: className, itemRender, index, column } = props
      const itemPrefix = `${prefixCls}-item`
      // ====================== Render ======================
      const children = filterEmpty(slots?.default?.() ?? [])
      const renderNode = children.length
        ? children
        : itemRender?.({
            ...item,
            index,
            column,
          })

      return (
        <div style={style} ref={domRef} class={clsx(itemPrefix, className)}>
          {renderNode}
        </div>
      )
    }
  },
  {
    name: 'AMasonryItem',
    inheritAttrs: false,
  },
)

export default MasonryItem
