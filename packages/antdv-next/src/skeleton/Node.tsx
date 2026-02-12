import type { SlotsType } from 'vue'
import type { EmptyEmit } from '../_util/type.ts'
import type { SkeletonElementProps } from './Element'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'
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
      const { active, rootClass, internalClassName } = props
      const cls = classNames(
        prefixCls.value,
        `${prefixCls.value}-element`,
        {
          [`${prefixCls.value}-active`]: active,
        },
        hashId.value,
        (attrs as any)?.class,
        rootClass,
        cssVarCls.value,
      )

      return (
        <div class={cls} {...omit(attrs, ['class', 'style'])}>
          <div
            class={internalClassName || `${prefixCls.value}-node`}
            style={(attrs as any)?.style}
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
