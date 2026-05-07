import type { SlotsType } from 'vue'
import type { EmptyEmit } from '../_util/type.ts'
import type { DescriptionsContextProps } from './DescriptionsContext.ts'
import type { InternalDescriptionsItemType, RenderDescriptionsItem } from './index.tsx'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { defineComponent } from 'vue'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import Cell from './Cell.tsx'
import { useDescriptionsCtx } from './DescriptionsContext.ts'

interface CellConfig {
  component: string | [string, string]
  type: 'label' | 'content' | 'item'
  showLabel?: boolean
  showContent?: boolean
}
function renderCells(
  items: InternalDescriptionsItemType[],
  { colon, prefixCls, bordered, labelRender, contentRender }: RowProps,
  {
    component,
    type,
    showLabel,
    showContent,
    styles: rootStyles,
  }: CellConfig & DescriptionsContextProps,
) {
  return items.map((item, index) => {
    const {
      prefixCls: itemPrefixCls = prefixCls,
      span = 1,
      key,
      styles,
      style,
    } = item
    let label = getSlotPropsFnRun({}, item, 'label')
    let children = getSlotPropsFnRun({}, item, 'content')

    const className = item.class
    if (labelRender) {
      const _oldLabel = label
      label = labelRender({ item, index: item?._$index ?? index, value: label }) ?? label
      const arrLabel = Array.isArray(label) ? label : [label]
      const _label = filterEmpty(arrLabel)
      label = _label.length > 0 ? _label : _oldLabel
    }
    if (contentRender) {
      const _oldChild = children
      children = contentRender({ item, index: item?._$index ?? index, value: children }) ?? children
      const arrChild = Array.isArray(children) ? children : [children]
      const _child = filterEmpty(arrChild)
      children = _child.length > 0 ? _child : _oldChild
    }

    if (typeof component === 'string') {
      return (
        <Cell
          key={`${type}-${key || index}`}
          class={className}
          style={style}
          styles={{
            label: {
              ...rootStyles?.label,
              ...styles?.label,
            },
            content: {
              ...rootStyles?.content,
              ...styles?.content,
            },
          }}
          span={span}
          colon={colon}
          component={component}
          itemPrefixCls={itemPrefixCls}
          bordered={bordered}
          label={showLabel ? label : null}
          content={showContent ? children : null}
          type={type}
        />
      )
    }

    return [
      <Cell
        key={`label-${key || index}`}
        class={className}
        style={{
          ...rootStyles?.label,
          ...style,
          ...styles?.label,
        }}
        span={1}
        colon={colon}
        component={component[0]}
        itemPrefixCls={itemPrefixCls}
        bordered={bordered}
        label={label}
        type="label"
      />,
      <Cell
        key={`content-${key || index}`}
        class={className}
        style={{
          ...rootStyles?.content,
          ...style,
          ...styles?.content,
        }}
        span={span * 2 - 1}
        component={component[1]}
        itemPrefixCls={itemPrefixCls}
        bordered={bordered}
        content={children}
        type="content"
      />,
    ]
  })
}

export interface RowProps {
  prefixCls: string
  vertical: boolean
  row: InternalDescriptionsItemType[]
  bordered?: boolean
  colon: boolean
  index: number
  labelRender?: RenderDescriptionsItem
  contentRender?: RenderDescriptionsItem
}

export interface RowSlots {
  default?: () => any
}
const Row = defineComponent<
  RowProps,
  EmptyEmit,
  string,
  SlotsType<RowSlots>
>(
  (props) => {
    const descContext = useDescriptionsCtx()
    return () => {
      const { prefixCls, vertical, row, index, bordered } = props

      if (vertical) {
        return (
          <>
            <tr key={`label-${index}`} class={`${prefixCls}-row`}>
              {renderCells(
                row,
                props,
                {
                  component: 'th',
                  type: 'label',
                  showLabel: true,
                  ...descContext.value,
                },
              )}
            </tr>
            <tr key={`content-${index}`} class={`${prefixCls}-row`}>
              {renderCells(
                row,
                props,
                {
                  component: 'td',
                  type: 'content',
                  showContent: true,
                  ...descContext.value,
                },
              )}
            </tr>
          </>
        )
      }

      return (
        <tr key={index} class={`${prefixCls}-row`}>
          {renderCells(
            row,
            props,
            {
              component: bordered ? ['th', 'td'] : 'td',
              type: 'item',
              showLabel: true,
              showContent: true,
              ...descContext.value,
            },
          )}
        </tr>
      )
    }
  },
)

export default Row
