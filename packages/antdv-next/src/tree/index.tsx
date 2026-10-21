import type { App } from 'vue'
import type { DirectoryTreeConstructor } from './DirectoryTree'
import type { TreeConstructor } from './Tree'

import { TreeNode, useTree } from '@v-c/tree'
import _DirectoryTree from './DirectoryTree'
import TreePure from './Tree'

export type {
  DirectoryTreeConstructor,
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
  TreeConstructor,
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

const DirectoryTree = _DirectoryTree as unknown as DirectoryTreeConstructor

const Tree = TreePure as unknown as TreeConstructor & {
  DirectoryTree: DirectoryTreeConstructor
  TreeNode: typeof TreeNode
  useTree: typeof useTree
  install: (app: App) => void
}

Tree.DirectoryTree = DirectoryTree
Tree.TreeNode = TreeNode
Tree.useTree = useTree

Tree.install = (app: App) => {
  app.component(TreePure.name, TreePure)
  app.component(_DirectoryTree.name, _DirectoryTree)
  app.component('ATreeOption', TreeNode)
}
export {
  DirectoryTree,
  useTree,
}
export default Tree
