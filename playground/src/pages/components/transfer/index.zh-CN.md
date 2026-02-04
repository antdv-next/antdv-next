---
category: Components
group: 数据录入
title: Transfer
subtitle: 穿梭框
description: 双栏穿梭选择框。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*fkfzT5BbwNIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*g9vUQq2nkpEAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

- 需要在多个可选项中进行多选时。
- 比起 Select 和 TreeSelect，穿梭框占据更大的空间，可以展示可选项的更多信息。

穿梭选择框用直观的方式在两栏中移动元素，完成选择行为。

选择一个或以上的选项后，点击对应的方向键，可以把选中的选项移动到另一栏。其中，左边一栏为 `source`，右边一栏为 `target`，API 的设计也反映了这两个概念。

> 注意：穿梭框组件只支持受控使用，不支持非受控模式。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本用法</demo>
  <demo src="./demo/oneWay.vue">单向样式</demo>
  <demo src="./demo/search.vue">带搜索框</demo>
  <demo src="./demo/advanced.vue">高级用法</demo>
  <demo src="./demo/custom-item.vue">自定义渲染</demo>
  <demo src="./demo/actions.vue">自定义操作</demo>
  <demo src="./demo/large-data.vue">分页</demo>
  <demo src="./demo/tree-transfer.vue">树形穿梭框</demo>
  <demo src="./demo/status.vue">状态</demo>
  <demo src="./demo/style-class.vue">语义化样式</demo>
  <demo src="./demo/custom-select-all-labels.vue">自定义全选文案</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 操作文案集合，顺序从上至下。当为字符串数组时使用默认的按钮，当为 VueNode 数组时直接使用自定义元素 | VueNode[] | [`>`, `<`] | 6.0.0 |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | TransferClassNamesType | - | - |
| dataSource | 数据源，其中的数据将会被渲染到左边一栏中，`targetKeys` 中指定的除外 | TransferItem[] | [] | - |
| disabled | 是否禁用 | boolean | false | - |
| filterOption | 根据搜索内容进行筛选，接收 `inputValue` `option` `direction` 三个参数，当 `option` 符合筛选条件时，应返回 true，反之则返回 false | (inputValue: string, option: TransferItem, direction: `left` \| `right`) =&gt; boolean | - | - |
| footer | 底部渲染函数 | (props: TransferListProps, direction: `left` \| `right`) =&gt; VueNode | - | - |
| locale | 各种语言 | TransferLocale | - | - |
| oneWay | 展示为单向样式 | boolean | false | - |
| pagination | 使用分页样式，自定义渲染列表下无效 | boolean \| &#123; pageSize: number; simple: boolean; showSizeChanger?: boolean; showLessItems?: boolean &#125; | false | - |
| render | 每行数据渲染函数，该函数的入参为 `dataSource` 中的项，返回值为 VueNode。或者返回一个普通对象，其中 `label` 字段为 VueNode，`value` 字段为 title | (record: TransferItem) =&gt; VueNode | - | - |
| rowKey | 数据列的主键 | (record: TransferItem) =&gt; string | - | - |
| selectAllLabels | 自定义顶部多选框标题的集合 | (VueNode \| (info: &#123; selectedCount: number; totalCount: number &#125;) =&gt; VueNode)[] | - | - |
| selectedKeys | 设置哪些项应该被选中，支持 `v-model:selected-keys` | string[] | [] | - |
| selectionsIcon | 自定义下拉菜单图标 | VueNode | - | - |
| showSearch | 是否显示搜索框，或可对两侧搜索框进行配置 | boolean \| &#123; placeholder?: string; defaultValue?: string &#125; | false | - |
| showSelectAll | 是否展示全选勾选框 | boolean | true | - |
| status | 设置校验状态 | `error` \| `warning` | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | TransferStylesType | - | - |
| targetKeys | 显示在右侧框数据的 key 集合，支持 `v-model:target-keys` | string[] | [] | - |
| titles | 标题集合，顺序从左至右 | VueNode[] | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 选项在两栏之间转移时的回调函数 | (targetKeys: string[], direction: `left` \| `right`, moveKeys: string[]) =&gt; void | - |
| scroll | 选项列表滚动时的回调函数 | (direction: `left` \| `right`, event: Event) =&gt; void | - |
| search | 搜索框内容时改变时的回调函数 | (direction: `left` \| `right`, value: string) =&gt; void | - |
| selectChange | 选中项发生改变时的回调函数 | (sourceSelectedKeys: string[], targetSelectedKeys: string[]) =&gt; void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| actions | 自定义操作按钮 | (direction: `left` \| `right`) =&gt; VueNode | - |
| footer | 自定义底部 | (props: TransferListProps, direction: `left` \| `right`) =&gt; VueNode | - |
| render | 自定义渲染项 | (item: TransferItem) =&gt; VueNode | - |
| notFoundContent | 自定义空内容 | (direction: `left` \| `right`) =&gt; VueNode | - |
| selectAllLabels | 自定义全选标签 | (info: &#123; selectedCount: number; totalCount: number; direction: `left` \| `right` &#125;) =&gt; VueNode | - |

## 类型 {#types}

### Render Props

Transfer 支持接收 `children` 自定义渲染列表，并返回以下参数：

| 参数 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| direction | 渲染列表的方向 | `left` \| `right` | - |
| disabled | 是否禁用列表 | boolean | - |
| filteredItems | 过滤后的数据 | TransferItem[] | - |
| selectedKeys | 选中的条目 | string[] | - |
| onItemSelect | 勾选条目 | (key: string, selected: boolean) =&gt; void | - |
| onItemSelectAll | 勾选一组条目 | (keys: string[], selected: boolean) =&gt; void | - |

## 注意

按照 Vue 的规范，所有的组件数组必须绑定 key。在 Transfer 中，`dataSource` 里的数据值需要指定 `key` 值。对于 `dataSource` 默认将每列数据的 `key` 属性作为唯一的标识。

如果你的数据没有这个属性，务必使用 `rowKey` 来指定数据列的主键。

```vue
<!-- 比如你的数据主键是 uid -->
<a-transfer :row-key="(record) => record.uid" />
```

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Transfer"></ComponentTokenTable>

## FAQ

### 怎样让 Transfer 穿梭框列表支持异步数据加载 {#faq-async-data-loading}

为了保持页码同步，在勾选时可以不移除选项而以禁用代替。
