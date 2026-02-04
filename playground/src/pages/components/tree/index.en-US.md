---
category: Components
group: Data Display
title: Tree
description: Multiple-level structure list.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*zYIWT52S4UMAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_9MMRpWoOcYAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use

Almost anything can be represented in a tree structure. Examples include directories, organization hierarchies, biological classifications, countries, etc. The `Tree` component is a way of representing the hierarchical relationship between these things. You can also expand, collapse, and select a treeNode within a `Tree`.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/basic-controlled.vue">Controlled Tree</demo>
  <demo src="./demo/draggable.vue">draggable</demo>
  <demo src="./demo/dynamic.vue">load data asynchronously</demo>
  <demo src="./demo/search.vue">Searchable</demo>
  <demo src="./demo/line.vue">Tree with line</demo>
  <demo src="./demo/customized-icon.vue">Customize Icon</demo>
  <demo src="./demo/directory.vue">directory</demo>
  <demo src="./demo/switcher-icon.vue">Customize collapse/expand icon</demo>
  <demo src="./demo/virtual-scroll.vue">Virtual scroll</demo>
  <demo src="./demo/block-node.vue">Block Node</demo>
  <demo src="./demo/big-data.vue" debug>Big data</demo>
  <demo src="./demo/multiple-line.vue" debug>Multiple lines</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Tree

#### Props {#tree-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowDrop | Whether to allow dropping on the node | (&#123; dropNode, dropPosition &#125;) =&gt; boolean | - | - |
| autoExpandParent | Whether to automatically expand a parent treeNode | boolean | false | - |
| blockNode | Whether treeNode fill remaining horizontal space | boolean | false | - |
| checkable | Add a Checkbox before the treeNodes | boolean | false | - |
| checkedKeys | (Controlled) Specifies the keys of the checked treeNodes (PS: When this specifies the key of a treeNode which is also a parent treeNode, all the children treeNodes of will be checked; and vice versa, when it specifies the key of a treeNode which is a child treeNode, its parent treeNode will also be checked. When `checkable` and `checkStrictly` is true, its object has `checked` and `halfChecked` property. Regardless of whether the child or parent treeNode is checked, they won't impact each other, support `v-model:checked-keys` | string[] \ | &#123;checked: string[], halfChecked: string[]&#125; | [] | - |
| checkStrictly | Check treeNode precisely; parent treeNode and children treeNodes are not associated | boolean | false | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - | - |
| defaultCheckedKeys | Specifies the keys of the default checked treeNodes | string[] | [] | - |
| defaultExpandAll | Whether to expand all treeNodes by default | boolean | false | - |
| defaultExpandedKeys | Specify the keys of the default expanded treeNodes | string[] | [] | - |
| defaultExpandParent | If auto expand parent treeNodes when init | boolean | true | - |
| defaultSelectedKeys | Specifies the keys of the default selected treeNodes | string[] | [] | - |
| disabled | Whether the tree is disabled | boolean | false | - |
| draggable | Specifies whether this Tree or the node is draggable. Use `icon: false` to disable drag handler icon | boolean \| ((node: DataNode) =&gt; boolean) \| &#123; icon?: VueNode \| false, nodeDraggable?: (node: DataNode) =&gt; boolean &#125; | false | - |
| expandedKeys | (Controlled) Specifies the keys of the expanded treeNodes, support `v-model:expanded-keys` | string[] | [] | - |
| fieldNames | Customize node title, key, children field name | object | &#123; title: `title`, key: `key`, children: `children` &#125; | - |
| filterAntTreeNode | Defines a function to filter (highlight) treeNodes. When the function returns `true`, the corresponding treeNode will be highlighted | function(node) | - | - |
| height | Config virtual scroll height. Will not support horizontal scroll when enabled | number | - | - |
| icon | Insert a custom icon before the title. Need to set `showIcon` to true | VueNode \| (props) =&gt; VueNode | - | - |
| loadData | Load data asynchronously | function(node) | - | - |
| loadedKeys | (Controlled) Set loaded tree nodes. Need to work with `loadData` | string[] | [] | - |
| multiple | Allows selecting multiple treeNodes | boolean | false | - |
| rootStyle | Style on the root element | CSSProperties | - | - |
| selectable | Whether it can be selected | boolean | true | - |
| selectedKeys | (Controlled) Specifies the keys of the selected treeNodes, multiple selection needs to set `multiple` to true, support `v-model:selected-keys` | string[] | - | - |
| showIcon | Controls whether to display the `icon` node (no default style) | boolean | false | - |
| showLine | Shows a connecting line | boolean \| &#123;showLeafIcon: VueNode \| ((props: AntTreeNodeProps) =&gt; VueNode)&#125; | false | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | - |
| switcherIcon | Customize expand/collapse icons for tree nodes (With default rotate angular style) | VueNode \| ((props: AntTreeNodeProps) =&gt; VueNode) | - | - |
| switcherLoadingIcon | Customize loading icons for tree nodes | VueNode | - | - |
| titleRender | Customize tree node title render | (nodeData) =&gt; VueNode | - | - |
| treeData | The treeNodes data Array, if set it then you need not to construct children TreeNode. (key should be unique across the whole array) | array&lt;&#123; key, title, children, [disabled, selectable] &#125;&gt; | - | - |
| virtual | Disable virtual scroll when set to false | boolean | true | - |

#### Events {#tree-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| check | Callback function for when the onCheck event occurs | function(checkedKeys, e:&#123;checked: boolean, checkedNodes, node, event, halfCheckedKeys&#125;) | - |
| dragEnd | Callback function for when the onDragEnd event occurs | function(&#123;event, node&#125;) | - |
| dragEnter | Callback function for when the onDragEnter event occurs | function(&#123;event, node, expandedKeys&#125;) | - |
| dragLeave | Callback function for when the onDragLeave event occurs | function(&#123;event, node&#125;) | - |
| dragOver | Callback function for when the onDragOver event occurs | function(&#123;event, node&#125;) | - |
| dragStart | Callback function for when the onDragStart event occurs | function(&#123;event, node&#125;) | - |
| drop | Callback function for when the onDrop event occurs | function(&#123;event, node, dragNode, dragNodesKeys&#125;) | - |
| expand | Callback function for when a treeNode is expanded or collapsed | function(expandedKeys, &#123;expanded: boolean, node&#125;) | - |
| load | Callback function for when a treeNode is loaded | function(loadedKeys, &#123;event, node&#125;) | - |
| rightClick | Callback function for when the user right clicks a treeNode | function(&#123;event, node&#125;) | - |
| select | Callback function for when the user clicks a treeNode | function(selectedKeys, e:&#123;selected: boolean, selectedNodes, node, event&#125;) | - |

#### Slots {#tree-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| switcherLoadingIcon | Customize loading icons for tree nodes | () =&gt; any | - |
| switcherIcon | Customize expand/collapse icons for tree nodes | (props: AntTreeNodeProps) =&gt; any | - |
| draggableIcon | Custom draggable icon | () =&gt; any | - |
| icon | Insert a custom icon before the title | (props: AntdTreeNodeAttribute) =&gt; any | - |
| titleRender | Customize tree node title render | VcTreeProps['titleRender'] | - |

#### Methods {#tree-methods}

| Name | Description |
| --- | --- |
| scrollTo(&#123; key: Key, align?: 'top' \| 'bottom' \| 'auto', offset?: number &#125;) | Scroll to key item in virtual scroll |

### TreeNode

#### Props {#treenode-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| checkable | When Tree is checkable, set TreeNode display Checkbox or not | boolean | - | - |
| disableCheckbox | Disables the checkbox of the treeNode | boolean | false | - |
| disabled | Disables the treeNode | boolean | false | - |
| icon | Customize icon. When you pass component, whose render will receive full TreeNode props as component props | VueNode \| (props) =&gt; VueNode | - | - |
| isLeaf | Determines if this is a leaf node (effective when `loadData` is specified). `false` will force the TreeNode to be treated as a parent node | boolean | - | - |
| key | Used with (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys. P.S.: It must be unique in all of treeNodes of the tree | string | (internal calculated position of treeNode) | - |
| selectable | Set whether the treeNode can be selected | boolean | true | - |
| title | Title | VueNode | `---` | - |

### DirectoryTree

#### Props {#directorytree-props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| expandAction | Directory opening logic, options: false \| `click` \| `doubleClick` | string \| boolean | `click` |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token {#design-token}

<ComponentTokenTable component="Tree"></ComponentTokenTable>

## FAQ

### Why defaultExpandAll not working on ajax data? {#faq-default-expand-all}

`default` prefix props only work when initializing. So `defaultExpandAll` has already been executed when ajax loads data. You can control `expandedKeys` or render the Tree when data is loaded to realize expanding all nodes.

### Virtual scroll limitation {#faq-virtual-scroll-limitation}

Virtual scroll only render items in visible region. Thus not support auto width (like long `title` with horizontal scroll).

### What does `disabled` node work logic in the tree? {#faq-disabled-node}

Tree change its data by conduction. Includes checked or auto expanded, it will conduction state to parent / children node until current node is `disabled`. So if a controlled node is `disabled`, it will only modify self state and not affect other nodes. For example, a parent node contains 3 child nodes and one of them is `disabled`. When check the parent node, it will only check rest 2 child nodes. As the same, when check these 2 child node, parent will be checked whatever checked state the `disabled` one is.

This conduction logic prevents modifying `disabled` parent checked state by checking children nodes, and users cannot modify directly with click which avoids interactive conflicts. If you want to modify this conduction logic, you can customize it with the `checkStrictly` prop.
