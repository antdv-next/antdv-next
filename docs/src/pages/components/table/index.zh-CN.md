---
category: Components
group: 数据展示
title: Table
subtitle: 表格
description: 展示行列数据。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*3yz3QqMlShYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Sv8XQ50NB40AAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

- 当有大量结构化的数据需要展现时；
- 当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时。

## 如何使用 {#how-to-use}

指定表格的数据源 `dataSource` 为一个数组。

```vue
<script setup lang="ts">
const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
]

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
]
</script>

<template>
  <a-table :data-source="dataSource" :columns="columns" />
</template>
```

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/bordered.vue">带边框</demo>
  <demo src="./demo/ajax.vue">异步数据</demo>
  <demo src="./demo/pagination.vue">分页</demo>
  <demo src="./demo/size.vue">尺寸</demo>
  <demo src="./demo/sticky.vue">粘性表头</demo>
  <demo src="./demo/fixed-header.vue">固定表头</demo>
  <demo src="./demo/fixed-columns.vue">固定列</demo>
  <demo src="./demo/fixed-columns-header.vue">固定列与表头</demo>
  <demo src="./demo/fixed-gapped-columns.vue">超宽固定列</demo>
  <demo src="./demo/narrow.vue">窄屏表格</demo>
  <demo src="./demo/responsive.vue">响应式</demo>
  <demo src="./demo/grouping-columns.vue">分组表头</demo>
  <demo src="./demo/colspan-rowspan.vue">合并单元格</demo>
  <demo src="./demo/summary.vue">汇总行</demo>
  <demo src="./demo/custom-empty.vue">自定义空状态</demo>
  <demo src="./demo/custom-filter-panel.vue">自定义筛选</demo>
  <demo src="./demo/filter-search.vue">筛选搜索</demo>
  <demo src="./demo/filter-in-tree.vue">树形筛选</demo>
  <demo src="./demo/head.vue">排序与筛选</demo>
  <demo src="./demo/multiple-sorter.vue">多列排序</demo>
  <demo src="./demo/order-column.vue">列顺序</demo>
  <demo src="./demo/hidden-columns.vue">隐藏列</demo>
  <demo src="./demo/drag-sorting.vue">拖动行排序</demo>
  <demo src="./demo/drag-sorting-handler.vue">拖动手柄排序</demo>
  <demo src="./demo/resizable-column.vue">调整列宽</demo>
  <demo src="./demo/edit-row.vue">整行编辑</demo>
  <demo src="./demo/edit-cell.vue">单元格编辑</demo>
  <demo src="./demo/ellipsis.vue">超出省略</demo>
  <demo src="./demo/ellipsis-custom-tooltip.vue">自定义省略提示</demo>
  <demo src="./demo/expand.vue">可展开行</demo>
  <demo src="./demo/expand-sticky.vue">展开与粘性表头</demo>
  <demo src="./demo/nested-table.vue">嵌套表格</demo>
  <demo src="./demo/tree-data.vue">树形数据</demo>
  <demo src="./demo/row-selection.vue">行选择</demo>
  <demo src="./demo/row-selection-custom.vue">自定义选择</demo>
  <demo src="./demo/row-selection-and-operation.vue">选择与操作</demo>
  <demo src="./demo/reset-filter.vue">重置筛选</demo>
  <demo src="./demo/virtual-list.vue">虚拟列表</demo>
  <demo src="./demo/style-class.vue">自定义样式</demo>
  <demo src="./demo/dynamic-settings.vue">动态配置</demo>
  <demo src="./demo/cell-slot.vue">表头与单元格插槽</demo>
</demo-group>

## API

### 属性 {#props}

通用属性参考：[通用属性](/docs/vue/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bordered | 是否展示外边框和列边框 | boolean | false | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record\<[SemanticDOM](#semantic-dom), string\> \| (info: \{ props \})=> Record\<[SemanticDOM](#semantic-dom), string\> | - | - |
| columns | 表格列的配置描述，具体项见下表 | [ColumnsType](#Column)\[\] | - | - |
| dataSource | 数据数组 | object[] | - | - |
| expandable | 配置展开属性 | [expandable](#expandable) | - |  |
| getPopupContainer | 设置表格内各类浮层的渲染节点，如筛选菜单 | (triggerNode) => HTMLElement | () => TableHtmlElement | - |
| loading | 页面是否加载中 | boolean \| [Spin Props](/components/spin-cn#props) | false | - |
| locale | 默认文案设置，目前包括排序、过滤、空数据文案 | object | [默认值](https://github.com/ant-design/ant-design/blob/6dae4a7e18ad1ba193aedd5ab6867e1d823e2aa4/components/locale/zh_CN.tsx#L20-L37) | - |
| pagination | 分页器，参考[配置项](#pagination)或 [pagination](/components/pagination-cn) 文档，设为 false 时不展示和进行分页 | false \| TablePaginationConfig | - | - |
| rowClassName | 表格行的类名 | function(record, index): string | - |  |
| rowKey | 表格行 key 的取值，可以是字符串或一个函数 | string \| function(record): string | `key` | - |
| rowSelection | 表格行是否可选择，[配置项](#rowselection) | object | - | - |
| rowHoverable | 表格行是否开启 hover 交互 | boolean | true | - |
| scroll | 表格是否可滚动，也可以指定滚动区域的宽、高，[配置项](#scroll) | object | - | - |
| showHeader | 是否显示表头 | boolean | true | - |
| showSorterTooltip | 表头是否显示下一次排序的 tooltip 提示。当参数类型为对象时，将被设置为 Tooltip 的属性 | boolean \| [Tooltip props](/components/tooltip-cn) & `{target?: 'full-header' \| 'sorter-icon' }` | \{ target: 'full-header' \} | - |
| size | 表格大小 | `large` \| `middle` \| `small` | `large` |  |
| sortDirections | 支持的排序方式，取值为 `ascend` `descend` | Array | \[`ascend`, `descend`] | - |
| sticky | 设置粘性头部和滚动条 | boolean \| `{offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement}` | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record\<[SemanticDOM](#semantic-dom), CSSProperties\> \| (info: \{ props \})=> Record\<[SemanticDOM](#semantic-dom), CSSProperties\> | - | - |
| tableLayout | 表格元素的 [table-layout](https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout) 属性，设为 `fixed` 表示内容不会影响列的布局 | - \| `auto` \| `fixed` | 无<hr />固定表头/列或使用了 `column.ellipsis` 时，默认值为 `fixed` |  |
| dropdownPrefixCls | - | string | - | - |
| virtual | 支持虚拟列表 | boolean | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 分页、排序、筛选变化时触发 | (     pagination: TablePaginationConfig,     filters: Record&lt;string, FilterValue \| null&gt;,     sorter: SorterResult&lt;RecordType&gt; \| SorterResult&lt;RecordType&gt;[],     extra: TableCurrentDataSource&lt;RecordType&gt;,   ) =&gt; void | - |
| update:expandedRowKeys | - | (keys: readonly Key[]) =&gt; void | - |
| scroll | 表格是否可滚动，也可以指定滚动区域的宽、高，[配置项](#scroll) | NonNullable&lt;VcTableProps['onScroll']&gt; | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| title | 表格标题 | (data: readonly RecordType[]) =&gt; any | - |
| footer | 表格尾部 | (data: readonly RecordType[]) =&gt; any | - |
| summary | 总结栏 | (data: readonly RecordType[]) =&gt; any | - |
| emptyText | - | () =&gt; any | - |
| expandIcon | - | (info: any) =&gt; any | - |
| expandedRowRender | - | (ctx: &#123; record: RecordType, index: number, indent: number, expanded: boolean &#125;) =&gt; any | - |
| headerCell | - | (ctx: &#123; column: ColumnType&lt;RecordType&gt;, index: number, text: any &#125;) =&gt; any | - |
| bodyCell | - | (ctx: &#123; column: ColumnType&lt;RecordType&gt;, index: number, text: any, record: RecordType &#125;) =&gt; any | - |
| filterDropdown | - | (ctx: FilterDropdownProps & &#123; column: ColumnType&lt;RecordType&gt; &#125;) =&gt; any | - |
| filterIcon | - | (ctx: &#123; column: ColumnType&lt;RecordType&gt;, filtered: boolean &#125;) =&gt; any | - |

### Column

列描述数据对象，是 columns 中的一项，Column 使用相同的 API。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 设置列的对齐方式 | `left` \| `right` \| `center` | `left` | - |
| className | 列样式类名 | string | - | - |
| colSpan | 表头列合并，设置为 0 时，不渲染 | number | - | - |
| dataIndex | 列数据在数据项中对应的路径，支持通过数组查询嵌套路径 | string \| string\[] | - | - |
| defaultFilteredValue | 默认筛选值 | string\[] | - | - |
| filterResetToDefaultFilteredValue | 点击重置按钮的时候，是否恢复默认筛选值 | boolean | false | - |
| defaultSortOrder | 默认排序顺序 | `ascend` \| `descend` | - | - |
| ellipsis | 超过宽度将自动省略，暂不支持和排序筛选一起使用。<br />设置为 `true` 或 `{ showTitle?: boolean }` 时，表格布局将变成 `tableLayout="fixed"`。 | boolean \| \{ showTitle?: boolean \} | false | - |
| filterDropdown | 可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互 | VueNode \| (props: [FilterDropdownProps](https://github.com/antdv-next/antdv-next/blob/main/packages/antdv-next/src/table/interface.ts#L94)) => VueNode | - | - |
| filtered | 是否处于筛选状态 | boolean | false | - |
| filteredValue | 筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组 | string\[] | - | - |
| filterIcon | 自定义 filter 图标。 | VueNode \| (filtered: boolean) => VueNode | false | - |
| filterOnClose | 是否在筛选菜单关闭时触发筛选 | boolean | true | - |
| filterMultiple | 是否多选 | boolean | true | - |
| filterMode | 指定筛选菜单的用户界面 | 'menu' \| 'tree' | 'menu' | - |
| filterSearch | 筛选菜单项是否可搜索 | boolean \| function(input, record):boolean | false | - |
| filters | 表头的筛选菜单项 | object\[] | - | - |
| filterDropdownProps | 自定义下拉属性 | [DropdownProps](/components/dropdown#api) | - | - |
| fixed | （IE 下无效）列是否固定，可选 `true` (等效于 `'start'`) `'start'` `'end'` | boolean \| string | false | - |
| render | 生成复杂数据的渲染函数，参数分别为当前单元格的值，当前行数据，行索引 | (value: V, record: T, index: number): VueNode | - | - |
| responsive | 响应式 breakpoint 配置列表。未设置则始终可见。 | [Breakpoint](https://github.com/antdv-next/antdv-next/blob/main/packages/antdv-next/src/_util/responsiveObserver.ts#L9)\[] | - | - |
| rowScope | 设置列范围 | `row` \| `rowgroup` | - | - |
| shouldCellUpdate | 自定义单元格渲染时机 | (record, prevRecord) => boolean | - | - |
| showSorterTooltip | 表头显示下一次排序的 tooltip 提示, 覆盖 table 中 `showSorterTooltip` | boolean \| [Tooltip props](/components/tooltip-cn/#api) & `{target?: 'full-header' \| 'sorter-icon' }` | \{ target: 'full-header' \} | - |
| sortDirections | 支持的排序方式，覆盖 `Table` 中 `sortDirections`， 取值为 `ascend` `descend` | Array | \[`ascend`, `descend`] | - |
| sorter | 排序函数，本地排序使用一个函数(参考 [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 的 compareFunction)。需要服务端排序可设为 `true`（单列排序） 或 `{ multiple: number }`（多列排序） | function \| boolean \| \{ compare: function, multiple: number \} | - | - |
| sortOrder | 排序的受控属性，外界可用此控制列的排序，可设置为 `ascend` `descend` `null` | `ascend` \| `descend` \| null | - | - |
| sortIcon | 自定义 sort 图标 | (props: \{ sortOrder \}) => VueNode | - | - |
| title | 列头显示文字（函数用法 `3.10.0` 后支持） | VueNode \| (\{ sortColumns, filters \}) => VueNode | - | - |
| width | 列宽 | string \| number | - | - |
| minWidth | 最小列宽度，只在 `tableLayout="auto"` 时有效 | number | - | - |
| hidden | 隐藏列 | boolean | false | - |
| onCell | 设置单元格属性 | function(record, rowIndex) | - | - |
| onFilter | 本地模式下，确定筛选的运行函数 | function | - | - |
| onHeaderCell | 设置头部单元格属性 | function(column) | - | - |

### ColumnGroup

| 参数  | 说明         | 类型      | 默认值 |
| ----- | ------------ | --------- | ------ |
| title | 列头显示文字 | VueNode | -      |

### pagination

分页的配置项。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| placement | 指定分页显示的位置， 取值为`topStart` \| `topCenter` \| `topEnd` \|`bottomStart` \| `bottomCenter` \| `bottomEnd`\| `none` | Array | \[`bottomEnd`] |

更多配置项，请查看 [`Pagination`](/components/pagination-cn)。

### expandable

展开功能的配置。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| childrenColumnName | 指定树形结构的列名 | string | children | - |
| columnTitle | 自定义展开列表头 | VueNode | - | - |
| columnWidth | 自定义展开列宽度 | string \| number | - | - |
| defaultExpandAllRows | 初始时，是否展开所有行 | boolean | false | - |
| defaultExpandedRowKeys | 默认展开的行 | string\[] | - | - |
| expandedRowClassName | 展开行的 className | string \| (record, index, indent) => string | - | - |
| expandedRowKeys | 展开的行，控制属性 | string\[] | - | - |
| expandedRowRender | 额外的展开行 | function(record, index, indent, expanded): VueNode | - | - |
| expandIcon | 自定义展开图标，参考[示例](https://stackblitz.com/edit/vitejs-vite-jezqinto?file=src%2FApp.vue) | function(props): VueNode | - | - |
| expandRowByClick | 通过点击行来展开子行 | boolean | false | - |
| fixed | 控制展开图标是否固定，可选 `true` `'left'` `'right'` | boolean \| string | false | - |
| indentSize | 展示树形数据时，每层缩进的宽度，以 px 为单位 | number | 15 | - |
| rowExpandable | 设置是否允许行展开（`dataSource` 若存在 `children` 字段将不生效） | (record) => boolean | - | - |
| showExpandColumn | 是否显示展开图标列 | boolean | true | - |
| onExpand | 点击展开图标时触发 | function(expanded, record) | - | - |
| onExpandedRowsChange | 展开的行变化时触发 | function(expandedRows) | - | - |

### rowSelection

选择功能的配置。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 设置选择列的对齐方式 | `left` \| `right` \| `center` | `left` | - |
| checkStrictly | checkable 状态下节点选择完全受控（父子数据选中状态不再关联） | boolean | true | - |
| columnTitle | 自定义列表选择框标题 | VueNode \| (originalNode: VueNode) => VueNode | - | - |
| columnWidth | 自定义列表选择框宽度 | string \| number | `32px` | - |
| fixed | 把选择框列固定在左边 | boolean | - | - |
| getCheckboxProps | 选择框的默认属性配置 | function(record) | - | - |
| getTitleCheckboxProps | 标题选择框的默认属性配置 | function() | - | - |
| hideSelectAll | 隐藏全选勾选框与自定义选择项 | boolean | false | - |
| preserveSelectedRowKeys | 当数据被删除时仍然保留选项的 `key` | boolean | - | - |
| renderCell | 渲染勾选框，用法与 Column 的 `render` 相同 | (checked: boolean, record: T, index: number, originNode: VueNode): VueNode | - | - |
| selectedRowKeys | 指定选中项的 key 数组，需要和 onChange 进行配合 | string\[] \| number\[] | \[] | - |
| defaultSelectedRowKeys | 默认选中项的 key 数组 | string\[] \| number\[] | \[] | - |
| selections | 自定义选择项 [配置项](#selection), 设为 `true` 时使用默认选择项 | object\[] \| boolean | true | - |
| type | 多选/单选 | `checkbox` \| `radio` | `checkbox` | - |
| onCell | 设置单元格属性，用法与 Column 的 `onCell` 相同 | function(record, rowIndex) | - | - |
| onChange | 选中项发生变化时的回调 | function(selectedRowKeys, selectedRows, info: \{ type \}) | - | - |
| onSelect | 用户手动选择/取消选择某行的回调 | function(record, selected, selectedRows, nativeEvent) | - | - |

### scroll

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| scrollToFirstRowOnChange | 当分页、排序、筛选变化后是否滚动到表格顶部 | boolean | - |
| x | 设置横向滚动，也可用于指定滚动区域的宽，可以设置为像素值，百分比，`true` 和 ['max-content'](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width#max-content) | string \| number \| true | - |
| y | 设置纵向滚动，也可用于指定滚动区域的高，可以设置为像素值 | string \| number | - |

### selection

| 参数     | 说明                       | 类型                        | 默认值 |
| -------- | -------------------------- | --------------------------- | ------ |
| key      | React 需要的 key，建议设置 | string                      | -      |
| text     | 选择项显示的文字           | VueNode                   | -      |
| onSelect | 选择项点击回调             | function(changeableRowKeys) | -      |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）

<ComponentTokenTable component="Table" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
