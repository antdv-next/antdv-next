---
category: Components
group: 数据展示
title: Tree
subtitle: 树形控件
description: 多层次的结构列表。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*zYIWT52S4UMAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_9MMRpWoOcYAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

文件夹、组织架构、生物分类、国家地区等等，世间万物的大多数结构都是树形结构。使用 `树控件` 可以完整展现其中的层级关系，并具有展开收起选择等交互功能。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/basic-controlled.vue">受控操作示例</demo>
  <demo src="./demo/draggable.vue">拖动示例</demo>
  <demo src="./demo/dynamic.vue">异步数据加载</demo>
  <demo src="./demo/search.vue">可搜索</demo>
  <demo src="./demo/line.vue">连接线</demo>
  <demo src="./demo/customized-icon.vue">自定义图标</demo>
  <demo src="./demo/directory.vue">目录</demo>
  <demo src="./demo/switcher-icon.vue">自定义展开/折叠图标</demo>
  <demo src="./demo/virtual-scroll.vue">虚拟滚动</demo>
  <demo src="./demo/block-node.vue">占据整行</demo>
  <demo src="./demo/big-data.vue" debug>大数据</demo>
  <demo src="./demo/multiple-line.vue" debug>多行</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### Tree

#### 属性 {#tree-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowDrop | 是否允许拖拽时放置在该节点 | (&#123; dropNode, dropPosition &#125;) =&gt; boolean | - | - |
| autoExpandParent | 是否自动展开父节点 | boolean | false | - |
| blockNode | 是否节点占据一行 | boolean | false | - |
| checkable | 节点前添加 Checkbox 复选框 | boolean | false | - |
| checkedKeys | （受控）选中复选框的树节点（注意：父子节点有关联，如果传入父节点 key，则子节点自动选中；相应当子节点 key 都传入，父节点也自动选中。当设置 `checkable` 和 `checkStrictly`，它是一个有`checked`和`halfChecked`属性的对象，并且父子节点的选中与否不再关联，支持 `v-model:checked-keys` | string[] \ | &#123;checked: string[], halfChecked: string[]&#125; | [] | - |
| checkStrictly | checkable 状态下节点选择完全受控（父子节点选中状态不再关联） | boolean | false | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - | - |
| defaultCheckedKeys | 默认选中复选框的树节点 | string[] | [] | - |
| defaultExpandAll | 默认展开所有树节点 | boolean | false | - |
| defaultExpandedKeys | 默认展开指定的树节点 | string[] | [] | - |
| defaultExpandParent | 默认展开父节点 | boolean | true | - |
| defaultSelectedKeys | 默认选中的树节点 | string[] | [] | - |
| disabled | 将树禁用 | boolean | false | - |
| draggable | 设置节点可拖拽，可以通过 `icon: false` 关闭拖拽提示图标 | boolean \| ((node: DataNode) =&gt; boolean) \| &#123; icon?: VueNode \| false, nodeDraggable?: (node: DataNode) =&gt; boolean &#125; | false | - |
| expandedKeys | （受控）展开指定的树节点，支持 `v-model:expanded-keys` | string[] | [] | - |
| fieldNames | 自定义节点 title、key、children 的字段 | object | &#123; title: `title`, key: `key`, children: `children` &#125; | - |
| filterAntTreeNode | 按需筛选树节点（高亮），返回 true | function(node) | - | - |
| height | 设置虚拟滚动容器高度，设置后内部节点不再支持横向滚动 | number | - | - |
| icon | 在标题之前插入自定义图标。需要设置 `showIcon` 为 true | VueNode \| (props) =&gt; VueNode | - | - |
| loadData | 异步加载数据 | function(node) | - | - |
| loadedKeys | （受控）已经加载的节点，需要配合 `loadData` 使用 | string[] | [] | - |
| multiple | 支持点选多个节点（节点本身） | boolean | false | - |
| rootStyle | 添加在 Tree 最外层的 style | CSSProperties | - | - |
| selectable | 是否可选中 | boolean | true | - |
| selectedKeys | （受控）设置选中的树节点，多选需设置 `multiple` 为 true，支持 `v-model:selected-keys` | string[] | - | - |
| showIcon | 控制是否展示 `icon` 节点，没有默认样式 | boolean | false | - |
| showLine | 是否展示连接线 | boolean \| &#123; showLeafIcon: VueNode \| ((props: AntTreeNodeProps) =&gt; VueNode) &#125; | false | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | - |
| switcherIcon | 自定义树节点的展开/折叠图标（带有默认 rotate 角度样式） | VueNode \| ((props: AntTreeNodeProps) =&gt; VueNode) | - | - |
| switcherLoadingIcon | 自定义树节点的加载图标 | VueNode | - | - |
| titleRender | 自定义渲染节点 | (nodeData) =&gt; VueNode | - | - |
| treeData | treeNodes 数据，如果设置则不需要手动构造 TreeNode 节点（key 在整个树范围内唯一） | array&lt;&#123;key, title, children, [disabled, selectable]&#125;&gt; | - | - |
| virtual | 设置 false 时关闭虚拟滚动 | boolean | true | - |

#### 事件 {#tree-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| check | 点击复选框触发 | function(checkedKeys, e:&#123;checked: boolean, checkedNodes, node, event, halfCheckedKeys&#125;) | - |
| dragEnd | dragend 触发时调用 | function(&#123;event, node&#125;) | - |
| dragEnter | dragenter 触发时调用 | function(&#123;event, node, expandedKeys&#125;) | - |
| dragLeave | dragleave 触发时调用 | function(&#123;event, node&#125;) | - |
| dragOver | dragover 触发时调用 | function(&#123;event, node&#125;) | - |
| dragStart | 开始拖拽时调用 | function(&#123;event, node&#125;) | - |
| drop | drop 触发时调用 | function(&#123;event, node, dragNode, dragNodesKeys&#125;) | - |
| expand | 展开/收起节点时触发 | function(expandedKeys, &#123;expanded: boolean, node&#125;) | - |
| load | 节点加载完毕时触发 | function(loadedKeys, &#123;event, node&#125;) | - |
| rightClick | 响应右键点击 | function(&#123;event, node&#125;) | - |
| select | 点击树节点触发 | function(selectedKeys, e:&#123;selected: boolean, selectedNodes, node, event&#125;) | - |

#### 插槽 {#tree-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| switcherLoadingIcon | 自定义树节点的加载图标 | () =&gt; any | - |
| switcherIcon | 自定义树节点的展开/折叠图标（带有默认 rotate 角度样式） | (props: AntTreeNodeProps) =&gt; any | - |
| draggableIcon | 自定义拖拽图标 | () =&gt; any | - |
| icon | 在标题之前插入自定义图标 | (props: AntdTreeNodeAttribute) =&gt; any | - |
| titleRender | 自定义渲染节点 | VcTreeProps['titleRender'] | - |

#### 方法 {#tree-methods}

| 名称 | 说明 |
| --- | --- |
| scrollTo(&#123; key: Key, align?: 'top' \| 'bottom' \| 'auto', offset?: number &#125;) | 虚拟滚动下，滚动到指定 key 条目 |

### TreeNode

#### 属性 {#treenode-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| checkable | 当树为 checkable 时，设置独立节点是否展示 Checkbox | boolean | - | - |
| disableCheckbox | 禁掉 checkbox | boolean | false | - |
| disabled | 禁掉响应 | boolean | false | - |
| icon | 自定义图标。可接收组件，props 为当前节点 props | VueNode \| (props) =&gt; VueNode | - | - |
| isLeaf | 设置为叶子节点 (设置了 `loadData` 时有效)。为 `false` 时会强制将其作为父节点 | boolean | - | - |
| key | 被树的 (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys 属性所用。注意：整个树范围内的所有节点的 key 值不能重复！ | string | (内部计算出的节点位置) | - |
| selectable | 设置节点是否可被选中 | boolean | true | - |
| title | 标题 | VueNode | `---` | - |

### DirectoryTree

#### 属性 {#directorytree-props}

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| expandAction | 目录展开逻辑，可选：false \| `click` \| `doubleClick` | string \| boolean | `click` |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Tree"></ComponentTokenTable>

## FAQ

### defaultExpandAll 在异步加载数据时为何不生效？ {#faq-default-expand-all}

`default` 前缀属性只有在初始化时生效，因而异步加载数据时 `defaultExpandAll` 已经执行完成。你可以通过受控 `expandedKeys` 或者在数据加载完成后渲染 Tree 来实现全部展开。

### 虚拟滚动的限制 {#faq-virtual-scroll-limitation}

虚拟滚动通过仅渲染可视区域的元素来提升渲染性能。但由于不会渲染所有节点，所以无法自动拓展横向宽度（比如超长 `title` 的横向滚动条）。

### `disabled` 节点在树中的关系是什么？ {#faq-disabled-node}

Tree 通过传导方式进行数据变更。无论是展开还是勾选，它都会从变更的节点开始向上、向下传导变化，直到遍历的当前节点是 `disabled` 时停止。因而如果控制的节点本身为 `disabled` 时，那么它只会修改本身而不会影响其他节点。举例来说，一个父节点包含 3 个子节点，其中一个为 `disabled` 状态。那么勾选父节点，只会影响其余两个子节点变成勾选状态。勾选两个子节点后，无论 `disabled` 节点什么状态，父节点都会变成勾选状态。

这种传导终止的方式是为了防止通过勾选子节点使得 `disabled` 父节点变成勾选状态，而用户无法直接勾选 `disabled` 父节点更改其状态导致的交互矛盾。如果你有着自己的传导需求，可以通过 `checkStrictly` 自定义勾选逻辑。
