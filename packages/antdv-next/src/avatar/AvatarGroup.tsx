import type { App, CSSProperties } from 'vue'
import type { ComponentBaseProps } from '../config-provider/context'
import type { PopoverProps } from '../popover'
import type { AvatarSize } from './AvatarContext'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, createVNode, defineComponent, isVNode } from 'vue'
import { getAttrStyleAndClass } from '../_util/hooks'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import Popover from '../popover'
import Avatar from './Avatar.tsx'
import { useAvatarProvider } from './AvatarContext'
import useStyle from './style'

export interface AvatarGroupProps extends ComponentBaseProps {
  prefixCls?: string
  max?: {
    count?: number
    style?: CSSProperties
    popover?: PopoverProps
  }
  /**
   * Size of avatar, options: `large`, `medium`, `small`
   * or a custom number size
   */
  size?: AvatarSize
  shape?: 'circle' | 'square'
}

const AvatarGroup = defineComponent<AvatarGroupProps>(
  (props, { slots, attrs }) => {
    const { prefixCls, direction } = useComponentBaseConfig('avatar', props)
    const groupPrefixCls = computed(() => `${prefixCls.value}-group`)
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    const contextValue = computed(() => {
      return {
        size: props.size,
        shape: props.shape,
      }
    })

    useAvatarProvider(contextValue)
    return () => {
      const { rootClass, max } = props
      const children = filterEmpty(slots?.default?.() ?? [])
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const cls = clsx(
        groupPrefixCls.value,
        {
          [`${groupPrefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        cssVarCls.value,
        rootCls.value,
        className,
        rootClass,
        hashId.value,
      )
      const childrenWithProps = children.map((child, index) => {
        if (isVNode(child)) {
          return createVNode(child, {
            key: `avatar-key-${index}`,
          })
        }
        return child
      })
      const mergeCount = max?.count
      const numOfChildren = childrenWithProps.length
      if (mergeCount && mergeCount < numOfChildren) {
        const childrenShow = childrenWithProps.slice(0, mergeCount)
        const childrenHidden = childrenWithProps.slice(mergeCount, numOfChildren)

        const mergeStyle = max?.style
        const mergePopoverTrigger = max?.popover?.trigger || 'hover'
        const mergePopoverPlacement = max?.popover?.placement || 'top'

        const popoverProps: PopoverProps = {
          content: () => childrenHidden,
          ...max?.popover,
          placement: mergePopoverPlacement,
          trigger: mergePopoverTrigger,
          rootClass: clsx(`${groupPrefixCls.value}-popover`, max?.popover?.rootClass),
        }

        childrenShow.push(
          <Popover key="avatar-popover-key" destroyOnHidden {...popoverProps}>
            <Avatar style={mergeStyle}>{`+${numOfChildren - mergeCount}`}</Avatar>
          </Popover>,
        )

        return (
          <div {...restAttrs} class={cls} style={style}>
            {childrenShow}
          </div>
        )
      }
      return (
        <div {...restAttrs} class={cls} style={style}>
          {childrenWithProps}
        </div>
      )
    }
  },
  {
    name: 'AAvatarGroup',
    inheritAttrs: false,
  },
)

;(AvatarGroup as any).install = (app: App) => {
  app.component(AvatarGroup.name, AvatarGroup)
}

export default AvatarGroup
