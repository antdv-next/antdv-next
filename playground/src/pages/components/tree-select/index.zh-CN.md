---
category: Components
group: 数据录入
title: TreeSelect
subtitle: 树选择
description: 树型选择控件。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*1zcHQLltaJcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*hjwGSIa4J8QAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

类似 Select 的选择控件，可选择的数据结构是一个树形结构时，可以使用 TreeSelect，例如公司层级、学科系统、分类目录等等。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/multiple.vue">多选</demo>
  <demo src="./demo/treeData.vue">从数据直接生成</demo>
  <demo src="./demo/checkable.vue">可勾选</demo>
  <demo src="./demo/async.vue">异步加载</demo>
  <demo src="./demo/treeLine.vue">线性样式</demo>
  <demo src="./demo/placement.vue">弹出位置</demo>
  <demo src="./demo/variant.vue">形态变体</demo>
  <demo src="./demo/status.vue">状态</demo>
  <demo src="./demo/maxCount.vue">最大选中数量</demo>
  <demo src="./demo/maxCountNoEffect.vue">最大选中数量不生效</demo>
  <demo src="./demo/suffix.vue">前后缀</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

### 属性 {#props}

通用属性参考：[通用属性](/docs/vue/common-props)

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 显示清除按钮 | boolean \| &#123; clearIcon?: VueNode &#125; | false | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| rootClass | 根节点 class | string | - | - |
| defaultOpen | 是否默认展开下拉菜单 | boolean | - | - |
| defaultValue | 指定默认选中的条目 | string \| string[] | - | - |
| disabled | 是否禁用 | boolean | false | - |
| popupMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动 | boolean \| number | true | - |
| popupRender | 自定义下拉框内容 | (menu: VueNode) =&gt; VueNode | - | - |
| fieldNames | 自定义节点 label、value、children 的字段 | object | &#123; label: `label`, value: `value`, children: `children` &#125; | - |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。[示例](https://codepen.io/afc163/pen/zEjNOy?editors=0010) | (triggerNode: HTMLElement) =&gt; HTMLElement | () =&gt; document.body | - |
| labelInValue | 是否把每个选项的 label 包装到 value 中，会把 value 类型从 `string` 变为 &#123; value: string, label: VueNode, halfChecked: boolean &#125; 的格式 | boolean | false | - |
| listHeight | 设置弹窗滚动高度 | number | 256 | - |
| loadData | 异步加载数据 | (node: DataNode) =&gt; Promise&lt;void&gt; | - | - |
| maxTagCount | 最多显示多少个 tag，响应式模式会对性能产生损耗 | number \| 'responsive' | - | - |
| maxCount | 指定可选中的最多 items 数量，仅在 `multiple=true` 时生效。如果此时 (`showCheckedStrategy = 'SHOW_ALL'` 且未开启 `treeCheckStrictly`)，或使用 `showCheckedStrategy = 'SHOW_PARENT'`，则 maxCount 无效。 | number | - | - |
| maxTagPlaceholder | 隐藏 tag 时显示的内容 | VueNode \| ((omittedValues: LabeledValue[]) =&gt; VueNode) | - | - |
| maxTagTextLength | 最大显示的 tag 文本长度 | number | - | - |
| multiple | 支持多选（当设置 treeCheckable 时自动变为 true） | boolean | false | - |
| notFoundContent | 当下拉列表为空时显示的内容 | VueNode | `Not Found` | - |
| open | 是否展开下拉菜单 | boolean | - | - |
| placeholder | 选择框默认文字 | string | - | - |
| placement | 选择框弹出的位置 | `bottomLeft` \| `bottomRight` \| `topLeft` \| `topRight` | bottomLeft | - |
| prefix | 自定义前缀 | VueNode | - | - |
| showCheckedStrategy | 配置 `treeCheckable` 时，定义选中项回填的方式。`TreeSelect.SHOW_ALL`: 显示所有选中节点（包括父节点）；`TreeSelect.SHOW_PARENT`: 只显示父节点（当父节点下所有子节点都选中时）；默认只显示子节点 | `TreeSelect.SHOW_ALL` \| `TreeSelect.SHOW_PARENT` \| `TreeSelect.SHOW_CHILD` | `TreeSelect.SHOW_CHILD` | - |
| showSearch | 是否支持搜索框 | boolean \| [Object](#showsearch) | 单选：false \| 多选：true | - |
| size | 选择框大小 | `large` \| `middle` \| `small` | - | - |
| status | 设置校验状态 | 'error' \| 'warning' | - | - |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | - |
| suffixIcon | 自定义的选择框后缀图标 | VueNode | `&lt;DownOutlined /&gt;` | - |
| switcherIcon | 自定义树节点的展开/折叠图标 | VueNode \| ((props: AntTreeNodeProps) =&gt; VueNode) | - | - |
| tagRender | 自定义 tag 内容，多选时生效 | (props: any) =&gt; VueNode | - | - |
| treeCheckable | 显示 Checkbox | boolean | false | - |
| treeCheckStrictly | `checkable` 状态下节点选择完全受控（父子节点选中状态不再关联），会使得 `labelInValue` 强制为 true | boolean | false | - |
| treeData | treeNodes 数据，如果设置则不需要手动构造 TreeNode 节点（value 在整个树范围内唯一） | array&lt;&#123;value, title, children, [disabled, disableCheckbox, selectable, checkable]&#125;&gt; | [] | - |
| treeDataSimpleMode | 使用简单格式的 treeData，具体设置参考可设置的类型 (此时 treeData 应变为这样的数据结构: [&#123;id:1, pId:0, value:'1', title:"test1",...&#125;,...]， `pId` 是父节点的 id) | boolean \| object&lt;&#123; id: string, pId: string, rootPId: string &#125;&gt; | false | - |
| treeTitleRender | 自定义渲染节点 | (nodeData) =&gt; VueNode | - | - |
| treeDefaultExpandAll | 默认展开所有树节点 | boolean | false | - |
| treeDefaultExpandedKeys | 默认展开的树节点 | string[] | - | - |
| treeExpandAction | 点击节点 title 时的展开逻辑，可选：false \| `click` \| `doubleClick` | string \| boolean | false | - |
| treeExpandedKeys | 设置展开的树节点 | string[] | - | - |
| treeIcon | 是否展示 TreeNode title 前的图标，没有默认样式，如设置为 true，需要自行定义图标相关样式 | boolean | false | - |
| treeLine | 是否展示线条样式，请参考 [Tree - showLine](/components/tree-cn#tree-demo-line) | boolean \| object | false | - |
| treeLoadedKeys | （受控）已经加载的节点，需要配合 `loadData` 使用 | Key[] | [] | - |
| treeNodeLabelProp | 作为显示的 prop 设置 | string | `title` | - |
| value | 指定当前选中的条目，支持 `v-model:value` | string \ | string[] | - | - |
| virtual | 设置 false 时关闭虚拟滚动 | boolean | true | - |
| bordered | 已废弃。请使用 `variant` | boolean | - | - |
| showArrow | 已废弃，设置 `suffixIcon` 为 null 可隐藏 | boolean | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 选中树节点时调用此函数 | function(value, label, extra) | - |
| openChange | 展开下拉菜单的回调 | (open: boolean) =&gt; void | - |
| select | 被选中时调用 | function(value, node, extra) | - |
| treeExpand | 展示节点时调用 | function(expandedKeys) | - |
| popupScroll | 下拉列表滚动时的回调 | (event: UIEvent) =&gt; void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| suffixIcon | 自定义的选择框后缀图标 | () =&gt; any | - |
| tagRender | 自定义 tag 内容，多选时生效 | (props: any) =&gt; any | - |
| notFoundContent | 当下拉列表为空时显示的内容 | () =&gt; any | - |
| switcherIcon | 自定义树节点的展开/折叠图标 | () =&gt; any | - |
| treeTitleRender | 自定义渲染节点 | (nodeData: DataNode) =&gt; any | - |

### 方法 {#methods}

| 名称 | 描述 | 版本 |
| --- | --- | --- |
| blur() | 移除焦点 | - |
| focus() | 获取焦点 | - |

## 类型 {#types}

### showSearch {#showsearch}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoClearSearchValue | 当多选模式下值被选择，自动清空搜索框 | boolean | true | - |
| filterTreeNode | 是否根据输入项进行筛选，默认用 treeNodeFilterProp 的值作为要筛选的 TreeNode 的属性值 | boolean \| function(inputValue: string, treeNode: TreeNode) (函数需要返回 bool 值) | function | - |
| searchValue | 搜索框的值，可以通过 `onSearch` 获取用户输入 | string | - | - |
| treeNodeFilterProp | 输入项过滤对应的 treeNode 属性 | string | `value` | - |
| onSearch | 文本框值变化时的回调 | (value: string) =&gt; void | - | - |

### TreeNode 属性 {#treenode-props}

> 建议使用 `treeData` 来代替 `TreeNode`，免去手动构造的麻烦。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| checkable | 当树为 Checkbox 时，设置独立节点是否展示 Checkbox | boolean | - | - |
| disableCheckbox | 禁掉 Checkbox | boolean | false | - |
| disabled | 是否禁用 | boolean | false | - |
| isLeaf | 是否是叶子节点 | boolean | false | - |
| key | 此项必须设置（除非使用 `treeDataSimpleMode`），其值在整个树范围内唯一 | Key | - | - |
| selectable | 是否可选 | boolean | true | - |
| title | 树节点显示的内容 | VueNode | `---` | - |
| value | 默认根据此属性值进行筛选（其值在整个树范围内唯一） | Key | - | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="TreeSelect"></ComponentTokenTable>

## FAQ

### onChange 时如何获得父节点信息？ {#faq-parent-node-info}

从性能角度考虑，我们默认不透出父节点信息。你可以这样获得：<https://codesandbox.io/s/get-parent-node-in-onchange-eb1608>

### 自定义 Option 样式导致滚动异常怎么办？ {#faq-custom-option-scroll}

请参考 Select 的 [FAQ](/components/select-cn)。

### 为何在搜索时 `loadData` 不会触发展开？ {#faq-load-data-expand}

在早期版本中，搜索时会触发 `loadData`。但我们收到反馈，输入时会阻塞网络，因此改为搜索不触发 `loadData`。你仍然可以通过 `filterTreeNode` 处理异步加载逻辑：

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

### 为何弹出框不能横向滚动？ {#faq-popup-not-scroll}

关闭虚拟滚动即可，因为开启虚拟滚动时无法准确测量完整列表的 `scrollWidth`。
