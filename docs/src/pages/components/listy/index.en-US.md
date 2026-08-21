---
category: Components
group: Data Display
title: Listy
description: A high-performance list that supports grouping and can virtualize long data sets.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EYuhSpw1iSwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*tBzwQ7raKX8AAAAAAAAAAAAADrJ8AQ/original
tag: 1.5.0
---

## When To Use

- When you need to render a long list without paying the cost of mounting every row — enable `virtual` to render only the rows in view.
- When the list needs grouped sections with sticky headers.
- When you need imperative control over scroll position (jump to an item, a group, or a pixel offset).

## Examples

<!-- prettier-ignore -->
<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/virtual.vue">Virtual scrolling</demo>
  <demo src="./demo/group.vue">Grouping and sticky headers</demo>
  <demo src="./demo/scroll-to.vue" debug>Scroll control</demo>
  <demo src="./demo/rich.vue">Rich content</demo>
  <demo src="./demo/drag-sorting.vue">Drag sorting</demo>
  <demo src="./demo/infinite.vue">Infinite loading</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref: [Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version | [Global Config](/components/config-provider#component-config) |
| --- | --- | --- | --- | --- | --- |
| classes | Semantic class names | `{ root?, item?, groupHeader? }` | - | 1.5.0 | 1.5.0 |
| group | Grouping config, see [Group](#group) below | `Group<T, K>` | - | 1.5.0 | × |
| height | Height of the scroll container; content scrolls when it overflows | number | - | 1.5.0 | × |
| itemRender | Render a single row | `(item: T, index: number) => VNode` | - | 1.5.0 | × |
| items | Data source of the list | `T[]` | `[]` | 1.5.0 | × |
| rowKey | Unique key of an item, a field name or a getter | `keyof T \| (item: T) => Key` | - | 1.5.0 | × |
| sticky | Whether group headers stick to the top | boolean | false | 1.5.0 | × |
| styles | Semantic inline styles | `{ root?, item?, groupHeader? }` | - | 1.5.0 | 1.5.0 |
| virtual | Whether to enable virtual scrolling, rendering only rows in view, requires `height` | boolean | false | 1.5.0 | × |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| scroll | Native scroll event handler | `(e: Event) => void` | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| itemRender | Render a single row | (item: any, index: number) => any | - |

### Group

| Property | Description | Type |
| --- | --- | --- |
| key | Compute the group key an item belongs to; items with the same key are grouped together | `(item: T) => K` |
| title | Render the group header; receives the group key and its items | `(groupKey: K, items: T[]) => VNode` |

### Ref

| Name     | Description                               | Type                                |
| -------- | ----------------------------------------- | ----------------------------------- |
| scrollTo | Scroll to a position, an item, or a group | `(config?: ListyScrollToConfig) => void` |

`ListyScrollToConfig` is one of:

| Shape                           | Description                                     |
| ------------------------------- | ----------------------------------------------- |
| number                          | Scroll to a pixel offset (scrollTop)            |
| `{ top?, left? }`               | Scroll to an absolute pixel position            |
| `{ key, align?, offset? }`      | Scroll to the item whose `rowKey` matches `key` |
| `{ groupKey, align?, offset? }` | Scroll to a group header                        |

`align` is `'top' | 'bottom' | 'auto'`; `offset` is an extra pixel offset applied after alignment.

## Semantic DOM

<demo src="./demo/_semantic.vue" :simplify="true"></demo>

## Design Token {#design-token}

<ComponentTokenTable component="Listy"></ComponentTokenTable>
