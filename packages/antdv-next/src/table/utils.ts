import type { ColumnsType } from './interface.ts'
import { flattenChildren } from '@v-c/util/dist/props-util'
import { camelize, isVNode } from 'vue'

// Column children are rendered with kebab-case template attributes
// (`data-index`, `min-width`, ...). Declared runtime props are already
// camelized by Vue, but any attribute that did not match a declared prop
// still reaches us kebab-cased in `node.props`. Remap those keys so the
// column object always carries camelCase field names.
function camelizeProps(props: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key in props) {
    const value = props[key]
    if (key.includes('-')) {
      result[camelize(key)] = value
    }
    else {
      result[key] = value
    }
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
