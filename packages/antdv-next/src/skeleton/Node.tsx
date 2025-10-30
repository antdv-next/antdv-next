import type { SlotsType } from 'vue'
import type { EmptyEmit } from '../_util/type.ts'
import type { SkeletonElementProps } from './Element'
import { classNames } from '@v-c/util'
import { defineComponent } from 'vue'
import { useBaseConfig } from '../config-provider/context'
import useStyle from './style'

export interface SkeletonNodeProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  fullSize?: boolean
}

export interface SkeletonNodeSlots {
  default?: () => any
}

const SkeletonNode = defineComponent<SkeletonNodeProps, EmptyEmit, string, SlotsType<SkeletonNodeSlots>>(
  (props, { attrs, slots }) => {
    const { prefixCls } = useBaseConfig('skeleton', props)
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const { active, rootClass } = props
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

      return wrapCSSVar(
        <div class={cls}>
          <div
            class={classNames(`${prefixCls.value}-image`, (attrs as any)?.class)}
            style={(attrs as any)?.style}
          >
            {slots.default?.()}
          </div>
        </div>,
      )
    }
  },
  {
    name: 'ASkeletonNode',
    inheritAttrs: false,
  },
)

export default SkeletonNode
