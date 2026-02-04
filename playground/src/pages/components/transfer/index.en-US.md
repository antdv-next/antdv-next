---
category: Components
group: Data Entry
title: Transfer
description: Double column transfer choice box.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*fkfzT5BbwNIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*g9vUQq2nkpEAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use {#when-to-use}

- It is a select control essentially which can be use for selecting multiple items.
- Transfer can display more information for items and take up more space.

Transfer the elements between two columns in an intuitive and efficient way.

One or more elements can be selected from either column, one click on the proper `direction` button, and the transfer is done. The left column is considered the `source` and the right column is considered the `target`. As you can see in the API description, these names are reflected in.

> Notice: Transfer is a controlled component, uncontrolled mode is not supported.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/oneWay.vue">One Way</demo>
  <demo src="./demo/search.vue">Search</demo>
  <demo src="./demo/advanced.vue">Advanced</demo>
  <demo src="./demo/custom-item.vue">Custom datasource</demo>
  <demo src="./demo/actions.vue">Custom Actions</demo>
  <demo src="./demo/large-data.vue">Pagination</demo>
  <demo src="./demo/tree-transfer.vue">Tree Transfer</demo>
  <demo src="./demo/status.vue">Status</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
  <demo src="./demo/custom-select-all-labels.vue">Custom Select All Labels</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actions | A set of operations that are sorted from top to bottom. When an array of strings is provided, default buttons will be used; when an array of VueNode is provided, custom elements will be used | VueNode[] | [`>`, `<`] | 6.0.0 |
| classes | Customize class for each semantic structure inside the component. Supports object or function | TransferClassNamesType | - | - |
| dataSource | Used for setting the source data. The elements that are part of this array will be present the left column. Except the elements whose keys are included in `targetKeys` prop | TransferItem[] | [] | - |
| disabled | Whether disabled transfer | boolean | false | - |
| filterOption | A function to determine whether an item should show in search result list, only works when searching | (inputValue: string, option: TransferItem, direction: `left` \| `right`) =&gt; boolean | - | - |
| footer | A function used for rendering the footer | (props: TransferListProps, direction: `left` \| `right`) =&gt; VueNode | - | - |
| locale | The i18n text including filter, empty text, item unit, etc | TransferLocale | - | - |
| oneWay | Display as single direction style | boolean | false | - |
| pagination | Use pagination. Not work in render props | boolean \| &#123; pageSize: number; simple: boolean; showSizeChanger?: boolean; showLessItems?: boolean &#125; | false | - |
| render | The function to generate the item shown on a column. Based on an record (element of the dataSource array), this function should return a VueNode which is generated from that record. Also, it can return a plain object with `value` and `label`, `label` is a VueNode and `value` is for title | (record: TransferItem) =&gt; VueNode | - | - |
| rowKey | Specify the key that will be used for uniquely identify each element | (record: TransferItem) =&gt; string | - | - |
| selectAllLabels | A set of customized labels for select all checkboxes on the header | (VueNode \| (info: &#123; selectedCount: number; totalCount: number &#125;) =&gt; VueNode)[] | - | - |
| selectedKeys | A set of keys of selected items, support `v-model:selected-keys` | string[] | [] | - |
| selectionsIcon | Custom dropdown icon | VueNode | - | - |
| showSearch | If included, a search box is shown on each column | boolean \| &#123; placeholder?: string; defaultValue?: string &#125; | false | - |
| showSelectAll | Show select all checkbox on the header | boolean | true | - |
| status | Set validation status | `error` \| `warning` | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | TransferStylesType | - | - |
| targetKeys | A set of keys of elements that are listed on the right column, support `v-model:target-keys` | string[] | [] | - |
| titles | A set of titles that are sorted from left to right | VueNode[] | - | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | A callback function that is executed when the transfer between columns is complete | (targetKeys: string[], direction: `left` \| `right`, moveKeys: string[]) =&gt; void | - |
| scroll | A callback function which is executed when scroll options list | (direction: `left` \| `right`, event: Event) =&gt; void | - |
| search | A callback function which is executed when search field are changed | (direction: `left` \| `right`, value: string) =&gt; void | - |
| selectChange | A callback function which is executed when selected items are changed | (sourceSelectedKeys: string[], targetSelectedKeys: string[]) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| actions | Custom operation buttons | (direction: `left` \| `right`) =&gt; VueNode | - |
| footer | Custom footer | (props: TransferListProps, direction: `left` \| `right`) =&gt; VueNode | - |
| render | Custom item render | (item: TransferItem) =&gt; VueNode | - |
| notFoundContent | Custom empty content | (direction: `left` \| `right`) =&gt; VueNode | - |
| selectAllLabels | Custom select all label | (info: &#123; selectedCount: number; totalCount: number; direction: `left` \| `right` &#125;) =&gt; VueNode | - |

## Types

### Render Props

Transfer accept `children` to customize render list, using follow props:

| Property | Description | Type | Version |
| --- | --- | --- | --- |
| direction | List render direction | `left` \| `right` | - |
| disabled | Disable list or not | boolean | - |
| filteredItems | Filtered items | TransferItem[] | - |
| selectedKeys | Selected items | string[] | - |
| onItemSelect | Select item | (key: string, selected: boolean) =&gt; void | - |
| onItemSelectAll | Select a group of items | (keys: string[], selected: boolean) =&gt; void | - |

## Warning

According the standard of Vue, the key should always be supplied directly to the elements in the array. In Transfer, the keys should be set on the elements included in `dataSource` array. By default, `key` property is used as an unique identifier.

If there's no `key` in your data, you should use `rowKey` to specify the key that will be used for uniquely identify each element.

```vue
<!--  eg. your primary key is `uid` -->
<a-transfer :row-key="(record) => record.uid" />
```

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Transfer"></ComponentTokenTable>

## FAQ

### How to support fetch and present data from a remote server in Transfer column. {#faq-async-data-loading}

In order to keep the page number synchronized, you can disable columns you checked without removing the option.
