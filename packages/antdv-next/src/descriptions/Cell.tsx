import type { VueNode } from '../_util/type.ts'
import type { CellSemanticClassNames, CellSemanticStyles } from './DescriptionsContext'
import { classNames } from '@v-c/util'
import { defineComponent } from 'vue'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useDescriptionsCtx } from './DescriptionsContext'

function notEmpty(val: any) {
  return val !== undefined && val !== null
}

export interface CellProps {
  itemPrefixCls: string
  span: number
  component: string
  classes?: CellSemanticClassNames
  styles?: CellSemanticStyles
  bordered?: boolean
  label?: VueNode
  content?: VueNode
  type?: 'label' | 'content' | 'item'
  colon?: boolean
}

const Cell = defineComponent<CellProps>(
  (props, { attrs, slots }) => {
    const descContext = useDescriptionsCtx()
    return () => {
      const { component, bordered, type, itemPrefixCls, span, styles, classes, colon } = props
      const { classes: descriptionsClassNames } = descContext.value
      const Component = component as any
      const label = getSlotPropsFnRun(slots, props, 'label')
      const content = getSlotPropsFnRun(slots, props, 'content')
      if (bordered) {
        return (
          <Component
            class={classNames(
              {
                [`${itemPrefixCls}-item-label`]: type === 'label',
                [`${itemPrefixCls}-item-content`]: type === 'content',
                [`${descriptionsClassNames?.label}`]: type === 'label',
                [`${descriptionsClassNames?.content}`]: type === 'content',
              },
            )}
            colSpan={span}
            {
              ...attrs
            }
          >
            {notEmpty(label) && <span style={styles?.label} class={classes?.label}>{label}</span>}
            {notEmpty(content) && <span style={styles?.content} class={classes?.content}>{content}</span>}
          </Component>
        )
      }
      return (
        <Component
          class={classNames(`${itemPrefixCls}-item`)}
          {...attrs}
          colSpan={span}
        >
          <div class={`${itemPrefixCls}-item-container`}>
            {(label || label === 0) && (
              <span class={classNames(
                `${itemPrefixCls}-item-label`,
                descriptionsClassNames?.label,
                {
                  [`${itemPrefixCls}-item-no-colon`]: !colon,
                },
                classes?.label,
              )}
              >
                {label}
              </span>
            )}
            {(content || content === 0) && (
              <span
                class={classNames(
                  `${itemPrefixCls}-item-content`,
                  descriptionsClassNames?.content,
                  classes?.content,
                )}
                style={styles?.content}
              >
                {content}
              </span>
            )}
          </div>
        </Component>
      )
    }
  },
)

export default Cell
