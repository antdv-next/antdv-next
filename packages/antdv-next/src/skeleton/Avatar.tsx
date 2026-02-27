import type { SkeletonElementProps } from './Element'
import { classNames } from '@v-c/util'
import { defineComponent } from 'vue'
import { getAttrStyleAndClass } from '../_util/hooks'
import { useBaseConfig } from '../config-provider/context'
import Element from './Element'
import useStyle from './style'

export interface SkeletonAvatarProps extends Omit<SkeletonElementProps, 'shape'> {
  shape?: 'circle' | 'square'
}

const defaults = {
  shape: 'circle',
  size: 'default',
} as any

const SkeletonAvatar = defineComponent<SkeletonAvatarProps>(
  (props = defaults, { attrs }) => {
    const { prefixCls } = useBaseConfig('skeleton', props)
    const [hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const { active, rootClass, shape, size, classes, styles } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const cls = classNames(
        prefixCls.value,
        `${prefixCls.value}-element`,
        {
          [`${prefixCls.value}-active`]: active,
        },
        classes?.root,
        rootClass,
        hashId.value,
        cssVarCls.value,
        className,
      )
      return (
        <div {...restAttrs} class={cls} style={styles?.root}>
          <Element
            prefixCls={`${prefixCls.value}-avatar`}
            shape={shape}
            size={size}
            class={classes?.content}
            style={[styles?.content, style]}
          />
        </div>
      )
    }
  },
  {
    name: 'ASkeletonAvatar',
    inheritAttrs: false,
  },
)

export default SkeletonAvatar
