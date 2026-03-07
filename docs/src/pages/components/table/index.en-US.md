---
category: Components
group: Data Display
title: Table
description: A table displays rows of data.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*3yz3QqMlShYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Sv8XQ50NB40AAAAAAAAAAAAADrJ8AQ/original
---

## When To Use

- To display a collection of structured data.
- To sort, search, paginate, filter data.

## How To Use

Specify `dataSource` of Table as an array of data.

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

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/bordered.vue">Bordered</demo>
  <demo src="./demo/ajax.vue">Ajax</demo>
  <demo src="./demo/pagination.vue">Pagination</demo>
  <demo src="./demo/size.vue">Size</demo>
  <demo src="./demo/sticky.vue">Sticky Header</demo>
  <demo src="./demo/fixed-header.vue">Fixed Header</demo>
  <demo src="./demo/fixed-columns.vue">Fixed Columns</demo>
  <demo src="./demo/fixed-columns-header.vue">Fixed Columns & Header</demo>
  <demo src="./demo/fixed-gapped-columns.vue">Wide Fixed Columns</demo>
  <demo src="./demo/narrow.vue">Narrow Table</demo>
  <demo src="./demo/responsive.vue">Responsive</demo>
  <demo src="./demo/grouping-columns.vue">Grouped Columns</demo>
  <demo src="./demo/colspan-rowspan.vue">Rowspan & Colspan</demo>
  <demo src="./demo/summary.vue">Summary</demo>
  <demo src="./demo/custom-empty.vue">Custom Empty</demo>
  <demo src="./demo/custom-filter-panel.vue">Custom Filter Panel</demo>
  <demo src="./demo/filter-search.vue">Filter Search</demo>
  <demo src="./demo/filter-in-tree.vue">Tree Filter</demo>
  <demo src="./demo/head.vue">Sorting & Filtering</demo>
  <demo src="./demo/multiple-sorter.vue">Multiple Sorter</demo>
  <demo src="./demo/order-column.vue">Order Columns</demo>
  <demo src="./demo/hidden-columns.vue">Hidden Columns</demo>
  <demo src="./demo/drag-sorting.vue">Drag Row Sorting</demo>
  <demo src="./demo/drag-sorting-handler.vue">Drag Handle Sorting</demo>
  <demo src="./demo/resizable-column.vue">Resizable Column</demo>
  <demo src="./demo/edit-row.vue">Edit Row</demo>
  <demo src="./demo/edit-cell.vue">Edit Cell</demo>
  <demo src="./demo/ellipsis.vue">Ellipsis</demo>
  <demo src="./demo/ellipsis-custom-tooltip.vue">Custom Ellipsis Tooltip</demo>
  <demo src="./demo/expand.vue">Expand</demo>
  <demo src="./demo/expand-sticky.vue">Expand Sticky</demo>
  <demo src="./demo/nested-table.vue">Nested Table</demo>
  <demo src="./demo/tree-data.vue">Tree Data</demo>
  <demo src="./demo/row-selection.vue">Row Selection</demo>
  <demo src="./demo/row-selection-custom.vue">Custom Selection</demo>
  <demo src="./demo/row-selection-and-operation.vue">Selection Operations</demo>
  <demo src="./demo/reset-filter.vue">Reset Filter</demo>
  <demo src="./demo/virtual-list.vue">Virtual List</demo>
  <demo src="./demo/style-class.vue">Style & Class</demo>
  <demo src="./demo/dynamic-settings.vue">Dynamic Settings</demo>
  <demo src="./demo/cell-slot.vue">Header & Body Cell Slots</demo>
</demo-group>

## API

### Props

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | TableClassNamesType&lt;RecordType&gt; | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | TableStylesType&lt;RecordType&gt; | - | - |
| dropdownPrefixCls | - | string | - | - |
| dataSource | Data record array to be displayed | VcTableProps&lt;RecordType&gt;['data'] | - | - |
| columns | Columns of table | ColumnsType&lt;RecordType&gt; | - | - |
| pagination | Config of pagination. You can ref table pagination [config](#pagination) or full [`pagination`](/components/pagination/) document, hide it by setting it to `false` | false \| TablePaginationConfig | - | - |
| loading | Loading status of table | boolean \| SpinProps | false | - |
| size | Size of table | SizeType | `large` | - |
| bordered | Whether to show all table borders | boolean | false | - |
| locale | The i18n text including filter, sort, empty text, etc | TableLocale | [Default Value](https://github.com/ant-design/ant-design/blob/6dae4a7e18ad1ba193aedd5ab6867e1d823e2aa4/components/locale/en_US.tsx#L19-L37) | - |
| rowSelection | Row selection [config](#rowselection) | TableRowSelection&lt;RecordType&gt; | - | - |
| getPopupContainer | The render container of dropdowns in table | GetPopupContainer | () =&gt; TableHtmlElement | - |
| scroll | Whether the table can be scrollable, [config](#scroll) | VcTableProps&lt;RecordType&gt;['scroll'] & &#123; scrollToFirstRowOnChange?: boolean &#125; | - | - |
| sortDirections | Supported sort way, could be `ascend`, `descend` | SortOrder[] | \[`ascend`, `descend`] | - |
| showSorterTooltip | The header show next sorter direction tooltip. It will be set as the property of Tooltip if its type is object | boolean \| SorterTooltipProps | &#123; target: 'full-header' &#125; | - |
| virtual | Support virtual list | boolean | - | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback executed when pagination, filters or sorter is changed | (     pagination: TablePaginationConfig,     filters: Record&lt;string, FilterValue \| null&gt;,     sorter: SorterResult&lt;RecordType&gt; \| SorterResult&lt;RecordType&gt;[],     extra: TableCurrentDataSource&lt;RecordType&gt;,   ) =&gt; void | - |
| update:expandedRowKeys | - | (keys: readonly Key[]) =&gt; void | - |
| scroll | Whether the table can be scrollable, [config](#scroll) | NonNullable&lt;VcTableProps['onScroll']&gt; | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | Table title renderer | (data: readonly RecordType[]) =&gt; any | - |
| footer | Table footer renderer | (data: readonly RecordType[]) =&gt; any | - |
| summary | Summary content | (data: readonly RecordType[]) =&gt; any | - |
| emptyText | - | () =&gt; any | - |
| expandIcon | - | (info: any) =&gt; any | - |
| expandedRowRender | - | (ctx: &#123; record: RecordType, index: number, indent: number, expanded: boolean &#125;) =&gt; any | - |
| headerCell | - | (ctx: &#123; column: ColumnType&lt;RecordType&gt;, index: number, text: any &#125;) =&gt; any | - |
| bodyCell | - | (ctx: &#123; column: ColumnType&lt;RecordType&gt;, index: number, text: any, record: RecordType &#125;) =&gt; any | - |
| filterDropdown | - | (ctx: FilterDropdownProps & &#123; column: ColumnType&lt;RecordType&gt; &#125;) =&gt; any | - |
| filterIcon | - | (ctx: &#123; column: ColumnType&lt;RecordType&gt;, filtered: boolean &#125;) =&gt; any | - |

### Column

One of the Table `columns` prop for describing the table's columns, Column has the same API.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | The specify which way that column is aligned | `left` \| `right` \| `center` | `left` | - |
| className | The className of this column | string | - | - |
| colSpan | Span of this column's title | number | - | - |
| dataIndex | Display field of the data record, support nest path by string array | string \| string\[] | - | - |
| defaultFilteredValue | Default filtered values | string\[] | - | - |
| filterResetToDefaultFilteredValue | click the reset button, whether to restore the default filter | boolean | false | - |
| defaultSortOrder | Default order of sorted values | `ascend` \| `descend` | - | - |
| ellipsis | The ellipsis cell content, not working with sorter and filters for now.<br />tableLayout would be `fixed` when `ellipsis` is `true` or `{ showTitle?: boolean }` | boolean \| {showTitle?: boolean } | false | - |
| filterDropdown | Customized filter overlay | VueNode \| (props: [FilterDropdownProps](https://github.com/antdv-next/antdv-next/blob/main/packages/antdv-next/src/table/interface.ts#L94)) => VueNode | - | - |
| filtered | Whether the `dataSource` is filtered | boolean | false | - |
| filteredValue | Controlled filtered value, filter icon will highlight | string\[] | - | - |
| filterIcon | Customized filter icon | VueNode \| (filtered: boolean) => VueNode | - | - |
| filterOnClose | Whether to trigger filter when the filter menu closes | boolean | true | - |
| filterMultiple | Whether multiple filters can be selected | boolean | true | - |
| filterMode | To specify the filter interface | 'menu' \| 'tree' | 'menu' | - |
| filterSearch | Whether to be searchable for filter menu | boolean \| function(input, record):boolean | false | - |
| filters | Filter menu config | object\[] | - | - |
| filterDropdownProps | Customized dropdown props | [DropdownProps](/components/dropdown#api) | - | - |
| fixed | (IE not support) Set column to be fixed: `true`(same as `'start'`) `'start'` `'end'` | boolean \| string | false | - |
| render | Renderer of the table cell. `value` is the value of current cell; `record` is the value object of current row; `index` is the row number. The return value should be a VueNode | (value: V, record: T, index: number): VueNode | - | - |
| responsive | The list of breakpoints at which to display this column. Always visible if not set | [Breakpoint](https://github.com/antdv-next/antdv-next/blob/main/packages/antdv-next/src/_util/responsiveObserver.ts#L9)\[] | - | - |
| rowScope | Set scope attribute for all cells in this column | `row` \| `rowgroup` | - | - |
| shouldCellUpdate | Control cell render logic | (record, prevRecord) => boolean | - | - |
| showSorterTooltip | If header show next sorter direction tooltip, override `showSorterTooltip` in table | boolean \| [Tooltip props](/components/tooltip/) & `{target?: 'full-header' \| 'sorter-icon' }` | \{ target: 'full-header' \} | - |
| sortDirections | Supported sort way, override `sortDirections` in `Table`, could be `ascend`, `descend` | Array | \[`ascend`, `descend`] | - |
| sorter | Sort function for local sort, see [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)'s compareFunction. If it is server-side sorting, set to `true`, but if you want to support multi-column sorting, you can set it to `{ multiple: number }` | function \| boolean \| \{ compare: function, multiple: number \} | - | - |
| sortOrder | Order of sorted values: `ascend` `descend` `null` | `ascend` \| `descend` \| null | - | - |
| sortIcon | Customized sort icon | (props: { sortOrder }) => VueNode | - | - |
| title | Title of this column | VueNode \| ({ sortColumns, filters }) => VueNode | - | - |
| width | Width of this column ([width not working?](https://github.com/ant-design/ant-design/issues/13825#issuecomment-449889241)) | string \| number | - | - |
| minWidth | Min width of this column, only works when `tableLayout="auto"` | number | - | - |
| hidden | Hidden this column | boolean | false | - |
| onCell | Set props on per cell | function(record, rowIndex) | - | - |
| onFilter | Function that determines if the row is displayed when filtered | function(value, record) => boolean | - | - |
| onHeaderCell | Set props on per header cell | function(column) | - | - |

### ColumnGroup

| Property | Description               | Type      | Default |
| -------- | ------------------------- | --------- | ------- |
| title    | Title of the column group | VueNode | -       |

### pagination

Properties for pagination.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| placement | Specify the placement of `Pagination`, could be`topStart` \| `topCenter` \| `topEnd` \|`bottomStart` \| `bottomCenter` \| `bottomEnd` \| `none` | Array | \[`bottomEnd`] |

More about pagination, please check [`Pagination`](/components/pagination/).

### expandable

Properties for expandable.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| childrenColumnName | The column contains children to display | string | children | - |
| columnTitle | Set the title of the expand column | VueNode | - | - |
| columnWidth | Set the width of the expand column | string \| number | - | - |
| defaultExpandAllRows | Expand all rows initially | boolean | false | - |
| defaultExpandedRowKeys | Initial expanded row keys | string\[] | - | - |
| expandedRowClassName | Expanded row's className | string \| (record, index, indent) => string | - | - |
| expandedRowKeys | Current expanded row keys | string\[] | - | - |
| expandedRowRender | Expanded container render for each row | function(record, index, indent, expanded): VueNode | - | - |
| expandIcon | Customize row expand Icon. Ref [example](https://stackblitz.com/edit/vitejs-vite-jezqinto?file=src%2FApp.vue) | function(props): VueNode | - | - |
| expandRowByClick | Whether to expand row by clicking anywhere in the whole row | boolean | false | - |
| fixed | Whether the expansion icon is fixed. Optional true `left` `right` | boolean \| string | false | - |
| indentSize | Indent size in pixels of tree data | number | 15 | - |
| rowExpandable | Enable row can be expandable | (record) => boolean | - | - |
| showExpandColumn | Show expand column | boolean | true | - |
| onExpand | Callback executed when the row expand icon is clicked | function(expanded, record) | - | - |
| onExpandedRowsChange | Callback executed when the expanded rows change | function(expandedRows) | - | - |

### rowSelection

Properties for row selection.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | Set the alignment of selection column | `left` \| `right` \| `center` | `left` | - |
| checkStrictly | Check table row precisely; parent row and children rows are not associated | boolean | true | - |
| columnTitle | Set the title of the selection column | VueNode \| (originalNode: VueNode) => VueNode | - | - |
| columnWidth | Set the width of the selection column | string \| number | `32px` | - |
| fixed | Fixed selection column on the left | boolean | - | - |
| getCheckboxProps | Get Checkbox or Radio props | function(record) | - | - |
| getTitleCheckboxProps | Get title Checkbox props | function() | - | - |
| hideSelectAll | Hide the selectAll checkbox and custom selection | boolean | false | - |
| preserveSelectedRowKeys | Keep selection `key` even when it removed from `dataSource` | boolean | - | - |
| renderCell | Renderer of the table cell. Same as `render` in column | (checked: boolean, record: T, index: number, originNode: VueNode): VueNode | - | - |
| selectedRowKeys | Controlled selected row keys | string\[] \| number\[] | \[] | - |
| selections | Custom selection [config](#selection), only displays default selections when set to `true` | object\[] \| boolean | - | - |
| type | `checkbox` or `radio` | `checkbox` \| `radio` | `checkbox` | - |
| onCell | Set props on per cell. Same as `onCell` in column | function(record, rowIndex) | - | - |
| onChange | Callback executed when selected rows change | function(selectedRowKeys, selectedRows, info: { type }) | - | - |
| onSelect | Callback executed when select/deselect one row | function(record, selected, selectedRows, nativeEvent) | - | - |

### scroll

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| scrollToFirstRowOnChange | Whether to scroll to the top of the table when paging, sorting, filtering changes | boolean | - |
| x | Set horizontal scrolling, can also be used to specify the width of the scroll area, could be number, percent value, true and ['max-content'](https://developer.mozilla.org/en-US/docs/Web/CSS/width#max-content) | string \| number \| true | - |
| y | Set vertical scrolling, can also be used to specify the height of the scroll area, could be string or number | string \| number | - |

### selection

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| key | Unique key of this selection | string | - |
| text | Display text of this selection | VueNode | - |
| onSelect | Callback executed when this selection is clicked | function(changeableRowKeys) | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Table" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
