import type { ComponentBaseProps } from '../config-provider/context.ts'
import { classNames } from '@v-c/util'
import { defineComponent } from 'vue'

export interface SkeletonElementProps extends ComponentBaseProps {
  size?: 'large' | 'small' | 'default' | number
  shape?: 'circle' | 'square' | 'round' | 'default'
  active?: boolean
}

const Element = defineComponent<SkeletonElementProps>(
  (props) => {
    return () => {
      const { prefixCls, size, shape } = props
      const sizeCls = classNames({
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
      })

      const shapeCls = classNames({
        [`${prefixCls}-circle`]: shape === 'circle',
        [`${prefixCls}-square`]: shape === 'square',
        [`${prefixCls}-round`]: shape === 'round',
      })
      const sizeStyle = typeof size === 'number'
        ? {
            width: size,
            height: size,
            lineHeight: `${size}px`,
          }
        : {}
      return (
        <span
          class={classNames(prefixCls, sizeCls, shapeCls)}
          style={[sizeStyle]}
        />
      )
    }
  },
)

export default Element
