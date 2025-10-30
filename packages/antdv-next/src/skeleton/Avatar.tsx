import type { SkeletonElementProps } from './Element'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'
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
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const { active, rootClass, shape, size } = props
      const cls = classNames(
        prefixCls.value,
        `${prefixCls.value}-element`,
        {
          [`${prefixCls.value}-active`]: active,
        },
        (attrs as any)?.class,
        rootClass,
        hashId.value,
        cssVarCls.value,
      )
      const otherProps = omit(props, ['prefixCls'])
      return wrapCSSVar(
        <div class={cls} {...omit(attrs, ['class'])}>
          <Element
            prefixCls={`${prefixCls.value}-avatar`}
            shape={shape}
            size={size}
            {...otherProps}
          />
        </div>,
      )
    }
  },
  {
    name: 'ASkeletonAvatar',
    inheritAttrs: false,
  },
)

export default SkeletonAvatar
