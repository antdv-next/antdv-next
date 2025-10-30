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
  size: 'small',
} as any
const SkeletonButton = defineComponent<SkeletonButtonProps>(
  (props = defaults, { attrs }) => {
    const { prefixCls } = useBaseConfig('skeleton', props)
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const { active, rootClass, block, size } = props
      const cls = classNames(
        prefixCls.value,
        `${prefixCls.value}-element`,
        {
          [`${prefixCls.value}-active`]: active,
          [`${prefixCls.value}-block`]: block,
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
            prefixCls={`${prefixCls.value}-button`}
            size={size}
            {...otherProps}
          />
        </div>,
      )
    }
  },
  {
    name: 'ASkeletonButton',
    inheritAttrs: false,
  },
)

export default SkeletonButton
