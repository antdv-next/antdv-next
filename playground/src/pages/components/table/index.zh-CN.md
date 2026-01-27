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
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | TableClassNamesType&lt;RecordType&gt; | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | TableStylesType&lt;RecordType&gt; | - | - |
| dropdownPrefixCls | - | string | - | - |
| dataSource | 数据数组 | VcTableProps&lt;RecordType&gt;['data'] | - | - |
| columns | 表格列的配置描述，具体项见下表 | ColumnsType&lt;RecordType&gt; | - | - |
| pagination | 分页器，参考[配置项](#pagination)或 [pagination](/components/pagination-cn) 文档，设为 false 时不展示和进行分页 | false \| TablePaginationConfig | - | - |
| loading | 页面是否加载中 | boolean \| SpinProps | false | - |
| size | 表格大小 | SizeType | `large` | - |
| bordered | 是否展示外边框和列边框 | boolean | false | - |
| locale | 默认文案设置，目前包括排序、过滤、空数据文案 | TableLocale | [默认值](https://github.com/ant-design/ant-design/blob/6dae4a7e18ad1ba193aedd5ab6867e1d823e2aa4/components/locale/zh_CN.tsx#L20-L37) | - |
| rowSelection | 表格行是否可选择，[配置项](#rowselection) | TableRowSelection&lt;RecordType&gt; | - | - |
| getPopupContainer | 设置表格内各类浮层的渲染节点，如筛选菜单 | GetPopupContainer | () =&gt; TableHtmlElement | - |
| scroll | 表格是否可滚动，也可以指定滚动区域的宽、高，[配置项](#scroll) | VcTableProps&lt;RecordType&gt;['scroll'] & &#123; scrollToFirstRowOnChange?: boolean &#125; | - | - |
| sortDirections | 支持的排序方式，取值为 `ascend` `descend` | SortOrder[] | \[`ascend`, `descend`] | - |
| showSorterTooltip | 表头是否显示下一次排序的 tooltip 提示。当参数类型为对象时，将被设置为 Tooltip 的属性 | boolean \| SorterTooltipProps | &#123; target: 'full-header' &#125; | 5.16.0 |
| virtual | 支持虚拟列表 | boolean | - | 5.9.0 |

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

## 主题变量（Design Token）

<ComponentTokenTable component="Table" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
