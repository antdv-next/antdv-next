import type { ColumnsType } from './interface.ts'
import { flattenChildren } from '@v-c/util/dist/props-util'
import { camelize, isVNode } from 'vue'

// Column children are rendered with kebab-case template attributes
// (`data-index`, `min-width`, ...). `convertColumnsToColumnProps` reads the
// raw `node.props` of the column vnodes, so neither camelize nor boolean
// casting has been applied to them by Vue (that only happens at component
// instantiation). Remap kebab-case keys to the camelCase field names the
// table understands, and cast bare boolean attributes the same way Vue
// does for declared props (`<a-table-column ellipsis />` -> `{ ellipsis: '' }`).
//
// The cast targets are the Column attributes whose declared types include
// `boolean` (from `ColumnSharedType`/`ColumnType`): `hidden` (boolean),
// `ellipsis` (object | boolean), `sorter` (boolean | function | object),
// `resizable` (boolean). `fixed` is `FixedType` where a bare attribute means left-fixed by antd
// convention. (The runtime props emitted by tsx-resolve-types carry no
// usable type info for these generic column types, so the list is explicit
// and must be extended when new boolean column attributes are added.)
const COLUMN_BOOLEAN_PROPS: Record<string, () => any> = {
  hidden: () => true,
  ellipsis: () => true,
  sorter: () => true,
  resizable: () => true,
  fixed: () => 'left',
}

function camelizeProps(props: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key in props) {
    let value = props[key]
    const camelKey = key.includes('-') ? camelize(key) : key
    const cast = COLUMN_BOOLEAN_PROPS[camelKey]
    if (cast && (value === '' || value === key)) {
      value = cast()
    }
    result[camelKey] = value
  }
  return result
}

export function convertColumnsToColumnProps<RecordType>(children: any): ColumnsType<RecordType> {
  return flattenChildren(children)
    .filter(node => isVNode(node))
    .map((node: any) => {
      const { key, props, children: nodeChildren } = node
      const column: any = {
        key,
        ...(props ? camelizeProps(props) : {}),
      }

      if (nodeChildren?.default) {
        column.children = convertColumnsToColumnProps(nodeChildren.default())
      }

      return column
    })
    .filter(Boolean)
}
