import type { SkeletonElementProps } from './Element'
import { classNames } from '@v-c/util'
import { defineComponent } from 'vue'
import { getAttrStyleAndClass } from '../_util/hooks'
import { useBaseConfig } from '../config-provider/context'
import Element from './Element'
import useStyle from './style'

export interface SkeletonButtonProps extends Omit<SkeletonElementProps, 'size'> {
  size?: 'large' | 'small' | 'default'
  block?: boolean
}

const defaults = {
  size: 'default',
} as any
const SkeletonButton = defineComponent<SkeletonButtonProps>(
  (props = defaults, { attrs }) => {
    const { prefixCls } = useBaseConfig('skeleton', props)
    const [hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const { active, rootClass, block, size, shape, classes, styles } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const cls = classNames(
        prefixCls.value,
        `${prefixCls.value}-element`,
        {
          [`${prefixCls.value}-active`]: active,
          [`${prefixCls.value}-block`]: block,
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
            prefixCls={`${prefixCls.value}-button`}
            size={size}
            shape={shape}
            class={classes?.content}
            style={[styles?.content, style]}
          />
        </div>
      )
    }
  },
  {
    name: 'ASkeletonButton',
    inheritAttrs: false,
  },
)

export default SkeletonButton
