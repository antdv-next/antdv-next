import type { CSSProperties } from 'vue'
import type { SkeletonElementProps } from './Element'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'
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
      const cls = classNames(
        prefixCls.value,
        `${prefixCls.value}-element`,
        {
          [`${prefixCls.value}-active`]: active,
          [`${prefixCls.value}-block`]: block,
        },
        (attrs as any)?.class,
        classes?.root,
        rootClass,
        hashId.value,
        cssVarCls.value,
      )
      return (
        <div class={cls} style={styles?.root} {...omit(attrs as any, ['class', 'style'])}>
          <Element
            prefixCls={`${prefixCls.value}-button`}
            size={size}
            shape={shape}
            class={classes?.content}
            style={{ ...(styles?.content as CSSProperties), ...(attrs.style as CSSProperties) }}
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
