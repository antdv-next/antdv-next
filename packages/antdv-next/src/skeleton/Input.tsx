import type { SkeletonElementProps } from './Element'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'
import { useBaseConfig } from '../config-provider/context'
import Element from './Element'
import useStyle from './style'

export interface SkeletonInputProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  size?: 'large' | 'small' | 'default'
  block?: boolean
}

const defaults = {
  size: 'default',
} as any

const SkeletonInput = defineComponent<SkeletonInputProps>(
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
            prefixCls={`${prefixCls.value}-input`}
            size={size}
            {...otherProps}
          />
        </div>,
      )
    }
  },
  {
    name: 'ASkeletonInput',
    inheritAttrs: false,
  },
)

export default SkeletonInput
