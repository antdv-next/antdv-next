import type { SizeType } from '../config-provider/SizeContext'
import type { SkeletonElementProps } from './Element'
import { classNames } from '@v-c/util'
import { defineComponent, toRef } from 'vue'
import { getAttrStyleAndClass } from '../_util/hooks'
import { useComponentBaseConfig } from '../config-provider/context'
import { useSize } from '../config-provider/hooks/useSize.ts'
import Element from './Element'
import useStyle from './style'

export interface SkeletonInputProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  /**
   * Note: `default` is deprecated and will be removed in v7, please use `medium` instead.
   */
  size?: SizeType | 'default'
  block?: boolean
}

const defaults = {} as any

const SkeletonInput = defineComponent<SkeletonInputProps>(
  (props = defaults, { attrs }) => {
    const {
      prefixCls,
      class: contextClassName,
      style: contextStyle,
    } = useComponentBaseConfig('skeleton', props)
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const mergedSize = useSize<SkeletonInputProps['size']>(toRef(props, 'size'))

    return () => {
      const { active, rootClass, block, classes, styles } = props
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
        contextClassName.value,
        className,
      )
      return (
        <div {...restAttrs} class={cls} style={[styles?.root, contextStyle.value]}>
          <Element
            prefixCls={`${prefixCls.value}-input`}
            size={mergedSize.value}
            class={classes?.content}
            style={[styles?.content, style]}
          />
        </div>
      )
    }
  },
  {
    name: 'ASkeletonInput',
    inheritAttrs: false,
  },
)

export default SkeletonInput
