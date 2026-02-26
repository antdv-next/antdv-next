import type { CSSProperties } from 'vue'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import { classNames } from '@v-c/util'
import { defineComponent } from 'vue'
import { getAttrStyleAndClass } from '../_util/hooks/useMergeSemantic'

export interface ElementSemanticClassNames {
  root?: string
  content?: string
}

export interface ElementSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
}

export interface SkeletonElementProps extends ComponentBaseProps {
  size?: 'large' | 'small' | 'default' | number
  shape?: 'circle' | 'square' | 'round' | 'default'
  active?: boolean
  classes?: ElementSemanticClassNames
  styles?: ElementSemanticStyles
}

const Element = defineComponent<SkeletonElementProps>(
  (props, { attrs }) => {
    return () => {
      const { prefixCls, size, shape, classes, styles } = props
      const { className, style } = getAttrStyleAndClass(attrs)
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
          class={classNames(prefixCls, sizeCls, shapeCls, classes?.root, classes?.content, className)}
          style={[sizeStyle, styles?.root, styles?.content, style]}
        />
      )
    }
  },
  { inheritAttrs: false },
)

export default Element
