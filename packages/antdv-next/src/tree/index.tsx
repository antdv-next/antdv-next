import type { App } from 'vue'

import { TreeNode, useTree } from '@v-c/tree'
import DirectoryTree from './DirectoryTree'
import TreePure from './Tree'

export type {
  DirectoryTreeEmits,
  ExpandAction as DirectoryTreeExpandAction,
  DirectoryTreeProps,
  DirectoryTreeSlots,
} from './DirectoryTree'

export type {
  AntdTreeNodeAttribute,
  AntTreeNode,
  AntTreeNodeCheckedEvent,
  AntTreeNodeExpandedEvent,
  AntTreeNodeMouseEvent,
  AntTreeNodeProps,
  AntTreeNodeSelectedEvent,
  TreeEmits,
  TreeProps,
  TreeSlots,
} from './Tree'

export type {
  BasicDataNode,
  DataNode,
  EventDataNode,
  TreeInstance,
  UseTreeConfig,
} from '@v-c/tree'

const Tree = TreePure as typeof TreePure & {
  DirectoryTree: typeof DirectoryTree
  TreeNode: typeof TreeNode
  useTree: typeof useTree
}

Tree.DirectoryTree = DirectoryTree
Tree.TreeNode = TreeNode
Tree.useTree = useTree

;(Tree as any).install = (app: App) => {
  app.component(Tree.name, Tree)
  app.component(DirectoryTree.name, DirectoryTree)
  app.component('ATreeOption', TreeNode)
}
export {
  DirectoryTree,
  useTree,
}
export default Tree
