import type { VueNode } from '../_util/type.ts'
import type { CellSemanticClassNames, CellSemanticStyles } from './DescriptionsContext'
import { classNames } from '@v-c/util'
import { defineComponent } from 'vue'
import { isRenderable } from '../_util/is'
import { normalizeStyle } from '../_util/styleUtils'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useDescriptionsCtx } from './DescriptionsContext'

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
        let typeStyle: CellSemanticStyles['label']
        if (type === 'label')
          typeStyle = styles?.label
        if (type === 'content')
          typeStyle = styles?.content
        const mergedCellStyle = { ...normalizeStyle(attrs.style), ...typeStyle }
        return (
          <Component
            class={classNames(
              {
                [`${itemPrefixCls}-item-label`]: type === 'label',
                [`${itemPrefixCls}-item-content`]: type === 'content',
              },
              type === 'label' ? descriptionsClassNames?.label : undefined,
              type === 'content' ? descriptionsClassNames?.content : undefined,
            )}
            colSpan={span}
            {
              ...attrs
            }
            style={mergedCellStyle}
          >
            {isRenderable(label) && <span>{label}</span>}
            {isRenderable(content) && <span>{content}</span>}
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
              <span
                class={classNames(
                  `${itemPrefixCls}-item-label`,
                  descriptionsClassNames?.label,
                  {
                    [`${itemPrefixCls}-item-no-colon`]: !colon,
                  },
                  classes?.label,
                )}
                style={styles?.label}
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
  {
    inheritAttrs: false,
  },
)

export default Cell
