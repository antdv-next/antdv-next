import type { SlotsType } from 'vue'
import type { EmptyEmit } from '../_util/type.ts'
import type { SkeletonElementProps } from './Element'
import { classNames } from '@v-c/util'
import { defineComponent } from 'vue'
import { getAttrStyleAndClass } from '../_util/hooks'
import { useBaseConfig } from '../config-provider/context'
import useStyle from './style'

export interface SkeletonNodeProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  fullSize?: boolean
  internalClassName?: string
}

export interface SkeletonNodeSlots {
  default?: () => any
}

const SkeletonNode = defineComponent<SkeletonNodeProps, EmptyEmit, string, SlotsType<SkeletonNodeSlots>>(
  (props, { attrs, slots }) => {
    const { prefixCls } = useBaseConfig('skeleton', props)
    const [hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const { active, rootClass, internalClassName, classes, styles } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const cls = classNames(
        prefixCls.value,
        `${prefixCls.value}-element`,
        {
          [`${prefixCls.value}-active`]: active,
        },
        hashId.value,
        classes?.root,
        rootClass,
        cssVarCls.value,
        className,
      )

      return (
        <div {...restAttrs} class={cls} style={styles?.root}>
          <div
            class={classNames(internalClassName || `${prefixCls.value}-node`, classes?.content)}
            style={[styles?.content, style]}
          >
            {slots.default?.()}
          </div>
        </div>
      )
    }
  },
  {
    name: 'ASkeletonNode',
    inheritAttrs: false,
  },
)

export default SkeletonNode
