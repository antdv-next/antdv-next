import type { CSSProperties, SlotsType } from 'vue'
import type { EmptyEmit } from '../_util/type.ts'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { defineComponent } from 'vue'
import { useSpaceContext } from './context.ts'

export interface ItemProps {
  index: number
  className: string
  classes: {
    separator?: string
  }
  styles: {
    separator?: CSSProperties
  }
}

export interface ItemSlots {
  default?: () => any
  separator?: () => any
}

const Item = defineComponent<ItemProps, EmptyEmit, string, SlotsType<ItemSlots>>(
  (props, { slots, attrs }) => {
    const spaceContext = useSpaceContext()
    return () => {
      const { index, className, classes, styles } = props
      const { latestIndex } = spaceContext.value
      const children = filterEmpty(slots?.default?.())
      const separator = filterEmpty(slots?.separator?.())
      if (children.length === 0) {
        return null
      }
      return (
        <>
          <div class={className} {...attrs}>
            {children}
          </div>
          {index < latestIndex && !!separator.length && (
            <span
              class={[`${className}-item-separator`, classes.separator]}
              style={styles.separator}
            >
              {separator}
            </span>
          )}
        </>
      )
    }
  },
)

export default Item
