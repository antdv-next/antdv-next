import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'
import type { DirectionType } from '../config-provider/context'
import { LeftOutlined, RightOutlined } from '@antdv-next/icons'
import { cloneVNode, defineComponent, isVNode } from 'vue'
import Button from '../button'

export interface TransferOperationProps {
  class?: string
  actions: VueNode[]
  moveToLeft?: (event: MouseEvent) => void
  moveToRight?: (event: MouseEvent) => void
  leftActive?: boolean
  rightActive?: boolean
  style?: CSSProperties
  disabled?: boolean
  direction?: DirectionType
  oneWay?: boolean
}

interface ActionProps {
  type: 'left' | 'right'
  actions: VueNode[]
  moveToLeft?: (event: MouseEvent) => void
  moveToRight?: (event: MouseEvent) => void
  leftActive?: boolean
  rightActive?: boolean
  direction?: DirectionType
  disabled?: boolean
}

function getArrowIcon(type: 'left' | 'right', direction?: DirectionType) {
  const isRight = type === 'right'
  if (direction !== 'rtl') {
    return isRight ? <RightOutlined /> : <LeftOutlined />
  }
  return isRight ? <LeftOutlined /> : <RightOutlined />
}

const Action = defineComponent<ActionProps>(
  (props) => {
    return () => {
      const isRight = props.type === 'right'
      const button = isRight ? props.actions[0] : props.actions[1]
      const moveHandler = isRight ? props.moveToRight : props.moveToLeft
      const active = isRight ? props.rightActive : props.leftActive
      const icon = getArrowIcon(props.type, props.direction)

      if (isVNode(button)) {
        const nodeProps = (button as any).props || {}
        const mergedDisabled = nodeProps.disabled || props.disabled || !active
        const onClick = (event: MouseEvent) => {
          if (mergedDisabled) {
            event.preventDefault()
            return
          }
          nodeProps?.onClick?.(event)
          moveHandler?.(event)
        }
        const cloned = cloneVNode(button, {
          disabled: mergedDisabled,
          onClick,
        })
        // cloneVNode merges `onClick` into an array (both original and new
        // handlers fire). Override it so our gated handler fully replaces the
        // original, matching React's cloneElement behavior.
        if (cloned.props) {
          cloned.props.onClick = onClick
        }
        return cloned
      }

      return (
        <Button
          type="primary"
          size="small"
          disabled={props.disabled || !active}
          onClick={(event: MouseEvent) => moveHandler?.(event)}
          icon={icon}
        >
          {button}
        </Button>
      )
    }
  },
  {
    name: 'ATransferAction',
    inheritAttrs: false,
  },
)

const Actions = defineComponent<
  TransferOperationProps
>(
  (props) => {
    return () => {
      const { class: className, style, oneWay, actions, ...restProps } = props
      return (
        <div class={className} style={style}>
          <Action type="right" actions={actions} {...restProps} />
          {!oneWay && <Action type="left" actions={actions} {...restProps} />}
          {actions.slice(oneWay ? 1 : 2).map(node => node)}
        </div>
      )
    }
  },
  {
    name: 'ATransferOperation',
    inheritAttrs: false,
  },
)

export default Actions
