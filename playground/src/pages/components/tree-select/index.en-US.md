---
category: Components
group: Data Entry
title: TreeSelect
description: Tree selection control.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*1zcHQLltaJcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*hjwGSIa4J8QAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

`TreeSelect` is similar to `Select`, but the values are provided in a tree like structure. Any data whose entries are defined in a hierarchical manner is fit to use this control. Examples of such case may include a corporate hierarchy, a directory structure, and so on.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/multiple.vue">Multiple Selection</demo>
  <demo src="./demo/treeData.vue">Generate from tree data</demo>
  <demo src="./demo/checkable.vue">Checkable</demo>
  <demo src="./demo/async.vue">Asynchronous loading</demo>
  <demo src="./demo/treeLine.vue">Show Tree Line</demo>
  <demo src="./demo/placement.vue">Placement</demo>
  <demo src="./demo/variant.vue">Variants</demo>
  <demo src="./demo/status.vue">Status</demo>
  <demo src="./demo/maxCount.vue">Max Count</demo>
  <demo src="./demo/maxCountNoEffect.vue">Max Count no effect</demo>
  <demo src="./demo/suffix.vue">Prefix and Suffix</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

### TreeSelect Props {#props}

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Show clear button | boolean \| &#123; clearIcon?: VueNode &#125; | false | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | - |
| defaultOpen | Initial open state of dropdown | boolean | - | - |
| defaultValue | To set the initial selected treeNode(s) | string \| string[] | - | - |
| disabled | Disabled or not | boolean | false | - |
| popupMatchSelectWidth | Determine whether the popup menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | true | - |
| popupRender | Customize dropdown content | (menu: VueNode) =&gt; VueNode | - | - |
| fieldNames | Customize node label, value, children field name | object | &#123; label: `label`, value: `value`, children: `children` &#125; | - |
| getPopupContainer | To set the container of the dropdown menu | (triggerNode: HTMLElement) =&gt; HTMLElement | () =&gt; document.body | - |
| labelInValue | Whether to embed label in value, turn the format of value from `string` to &#123; value: string, label: VueNode, halfChecked: boolean &#125; | boolean | false | - |
| listHeight | Config popup height | number | 256 | - |
| loadData | Load data asynchronously | (node: DataNode) =&gt; Promise&lt;void&gt; | - | - |
| maxTagCount | Max tag count to show. `responsive` will cost render performance | number \| 'responsive' | - | - |
| maxCount | The maximum number of items that can be selected. Only takes effect when `multiple=true`. If (`showCheckedStrategy = 'SHOW_ALL'` and `treeCheckStrictly` is disabled) or `showCheckedStrategy = 'SHOW_PARENT'` is used, `maxCount` will not take effect. | number | - | - |
| maxTagPlaceholder | Placeholder for not showing tags | VueNode \| ((omittedValues: LabeledValue[]) =&gt; VueNode) | - | - |
| maxTagTextLength | Max tag text length to show | number | - | - |
| multiple | Support multiple or not, will be `true` when enable `treeCheckable` | boolean | false | - |
| notFoundContent | Specify content to show when no result matches | VueNode | `Not Found` | - |
| open | Controlled open state of dropdown | boolean | - | - |
| placeholder | Placeholder of the select input | string | - | - |
| placement | The position where the selection box pops up | `bottomLeft` \| `bottomRight` \| `topLeft` \| `topRight` | `bottomLeft` | - |
| prefix | The custom prefix | VueNode | - | - |
| showCheckedStrategy | The way show selected item in box when `treeCheckable` set. **Default:** just show child nodes. **`TreeSelect.SHOW_ALL`:** show all checked treeNodes (include parent treeNode). **`TreeSelect.SHOW_PARENT`:** show checked treeNodes (just show parent treeNode) | `TreeSelect.SHOW_ALL` \| `TreeSelect.SHOW_PARENT` \| `TreeSelect.SHOW_CHILD` | `TreeSelect.SHOW_CHILD` | - |
| showSearch | Support search or not | boolean \| [Object](#showsearch) | single: false \| multiple: true | - |
| size | To set the size of the select input | `large` \| `middle` \| `small` | - | - |
| status | Set validation status | `error` \| `warning` | - | - |
| variant | Variants of selector | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | - |
| suffixIcon | The custom suffix icon | VueNode | `&lt;DownOutlined /&gt;` | - |
| switcherIcon | Customize collapse/expand icon of tree node | VueNode \| ((props: AntTreeNodeProps) =&gt; VueNode) | - | - |
| tagRender | Customize tag render when `multiple` | (props: any) =&gt; VueNode | - | - |
| treeCheckable | Whether to show checkbox on the treeNodes | boolean | false | - |
| treeCheckStrictly | Whether to check nodes precisely (in the `checkable` mode), means parent and child nodes are not associated, and it will make `labelInValue` be true | boolean | false | - |
| treeData | Data of the treeNodes, manual construction work is no longer needed if this property has been set(ensure the Uniqueness of each value) | array&lt;&#123; value, title, children, [disabled, disableCheckbox, selectable, checkable] &#125;&gt; | [] | - |
| treeDataSimpleMode | Enable simple mode of treeData. Changes the `treeData` schema to: [&#123;id:1, pId:0, value:'1', title:"test1",...&#125;,...] where pId is parent node's id). It is possible to replace the default `id` and `pId` keys by providing object to `treeDataSimpleMode` | boolean \| object&lt;&#123; id: string, pId: string, rootPId: string &#125;&gt; | false | - |
| treeTitleRender | Customize tree node title render | (nodeData: DataNode) =&gt; VueNode | - | - |
| treeDefaultExpandAll | Whether to expand all treeNodes by default | boolean | false | - |
| treeDefaultExpandedKeys | Default expanded treeNodes | string[] | - | - |
| treeExpandAction | Tree title open logic when click, optional: false \| `click` \| `doubleClick` | string \| boolean | false | - |
| treeExpandedKeys | Set expanded keys | string[] | - | - |
| treeIcon | Shows the icon before a TreeNode's title | boolean | false | - |
| treeLine | Show the line. Ref [Tree - showLine](/components/tree/#tree-demo-line) | boolean \| object | false | - |
| treeLoadedKeys | (Controlled) Set loaded tree nodes, work with `loadData` only | string[] | [] | - |
| treeNodeLabelProp | Will render as content of select | string | `title` | - |
| value | To set the current selected treeNode(s), support `v-model:value` | string \ | string[] | - | - |
| virtual | Disable virtual scroll when set to false | boolean | true | - |
| bordered | Deprecated. Use `variant` instead | boolean | - | - |
| showArrow | Deprecated. Set `suffixIcon` to null to hide | boolean | - | - |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | A callback function, can be executed when selected treeNodes or input value change | function(value, label, extra) | - |
| openChange | Callback when dropdown open state changes | (open: boolean) =&gt; void | - |
| select | A callback function, can be executed when you select a treeNode | function(value, node, extra) | - |
| treeExpand | A callback function, can be executed when treeNode expanded | function(expandedKeys) | - |
| popupScroll | Called when dropdown scrolls | (event: UIEvent) =&gt; void | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| suffixIcon | The custom suffix icon | () =&gt; any | - |
| tagRender | Customize tag render when `multiple` | (props: any) =&gt; any | - |
| notFoundContent | Specify content to show when no result matches | () =&gt; any | - |
| switcherIcon | Customize collapse/expand icon of tree node | () =&gt; any | - |
| treeTitleRender | Customize tree node title render | (nodeData: DataNode) =&gt; any | - |

### Methods {#methods}

| Name | Description | Version |
| --- | --- | --- |
| blur() | Remove focus | - |
| focus() | Get focus | - |

## Types {#types}

### showSearch {#showsearch}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoClearSearchValue | If auto clear search input value when multiple select is selected/deselected | boolean | true | - |
| filterTreeNode | Whether to filter treeNodes by input value | boolean \| (inputValue: string, treeNode: DataNode) =&gt; boolean | function | - |
| searchValue | Work with `onSearch` to make search value controlled | string | - | - |
| treeNodeFilterProp | Will be used for filtering if `filterTreeNode` returns true | string | `value` | - |
| onSearch | A callback function, can be executed when the search input changes | (value: string) =&gt; void | - | - |

### TreeNode Props {#treenode-props}

> We recommend you to use `treeData` rather than `TreeNode`, to avoid the trouble of manual construction.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| checkable | When Tree is checkable, set TreeNode display Checkbox or not | boolean | - | - |
| disableCheckbox | Disables the checkbox of the treeNode | boolean | false | - |
| disabled | Disabled or not | boolean | false | - |
| isLeaf | Leaf node or not | boolean | false | - |
| key | Required property (unless using `treeDataSimpleMode`), should be unique in the tree | Key | - | - |
| selectable | Whether can be selected | boolean | true | - |
| title | Content showed on the treeNodes | VueNode | `---` | - |
| value | Will be treated as `treeNodeFilterProp` by default, should be unique in the tree | Key | - | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="TreeSelect"></ComponentTokenTable>

## FAQ

### How to get parent node in onChange? {#faq-parent-node-info}

We don't provide this since performance consideration. You can get by this way: <https://codesandbox.io/s/get-parent-node-in-onchange-eb1608>

### Why sometimes customize Option cause scroll break? {#faq-custom-option-scroll}

You can ref Select [FAQ](/components/select).

### Why `loadData` not trigger when searching? {#faq-load-data-expand}

In earlier version, `loadData` will be triggered when searching. But we got feedback that it will block network when inputting. So we change it to not trigger `loadData` when searching. But you can still handle async logic by `filterTreeNode`:

```html
<a-tree-select
  :filterTreeNode="(input, treeNode) => {
    const match = YOUR_LOGIC_HERE;

    if (match && !treeNode.isLeaf && !treeNode.children) {
      // Do some loading logic
    }

    return match;
  }"
/>
```

### Why can't popup scroll horizontally? {#faq-popup-not-scroll}

Just turn off virtual scrolling, because the `scrollWidth` of the complete list cannot be accurately measured when virtual scrolling is turned on.
