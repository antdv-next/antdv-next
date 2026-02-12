---
category: Components
group: Navigation
title: Pagination
description: A long list can be divided into several pages, and only one page will be loaded at a time.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8y_iTJGY_aUAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WM86SrBC8TsAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

- When it will take a long time to load/render all items.
- If you want to browse the data by navigating through pages.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/align.vue">Align</demo>
  <demo src="./demo/more.vue">More</demo>
  <demo src="./demo/changer.vue">Changer</demo>
  <demo src="./demo/jump.vue">Jumper</demo>
  <demo src="./demo/mini.vue">Mini size</demo>
  <demo src="./demo/simple.vue">Simple mode</demo>
  <demo src="./demo/controlled.vue">Controlled</demo>
  <demo src="./demo/total.vue">Total number</demo>
  <demo src="./demo/all.vue">Show All</demo>
  <demo src="./demo/itemRender.vue">Prev and next</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | Alignment of pagination | `start` \| `center` \| `end` | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function | PaginationClassNamesType | - | - |
| current | Current page number | number | - | - |
| defaultCurrent | Default initial page number | number | 1 | - |
| defaultPageSize | Default number of data items per page | number | 10 | - |
| disabled | Disable pagination | boolean | - | - |
| hideOnSinglePage | Whether to hide pager on single page | boolean | false | - |
| itemRender | To customize item's innerHTML | (page: number, type: 'page' \| 'prev' \| 'next' \| 'jump-prev' \| 'jump-next', element: VueNode) => VueNode | - | - |
| pageSize | Number of data items per page | number | - | - |
| pageSizeOptions | Specify the sizeChanger options | (string \| number)[] | ['10', '20', '50', '100'] | - |
| responsive | If `size` is not specified, `Pagination` would resize according to the width of the window | boolean | - | - |
| rootClass | Root container class | string | - | - |
| showLessItems | Show less page items | boolean | false | - |
| showQuickJumper | Determine whether you can jump to pages directly | boolean \| \{ goButton?: VueNode \} | false | - |
| showSizeChanger | Determine whether to show `pageSize` select | boolean \| SelectProps | - | - |
| totalBoundaryShowSizeChanger | When `total` larger than it, `showSizeChanger` will be true | number | 50 | - |
| showTitle | Show page item's title | boolean | true | - |
| showTotal | To display the total number and range | (total: number, range: [number, number]) => VueNode | - | - |
| simple | Whether to use simple mode | boolean \| \{ readOnly?: boolean \} | - | - |
| size | Specify the size of `Pagination`, can be set to `small` | `default` \| `small` | `default` | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | PaginationStylesType | - | - |
| total | Total number of data items | number | 0 | - |
| locale | Pagination locale | PaginationLocale | - | - |
| prevIcon | Custom previous icon | VueNode | - | - |
| nextIcon | Custom next icon | VueNode | - | - |
| jumpPrevIcon | Custom jump-prev icon | VueNode | - | - |
| jumpNextIcon | Custom jump-next icon | VueNode | - | - |
| selectComponentClass | Deprecated, not official support | any | - | - |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Called when the page number or `pageSize` is changed | (page: number, pageSize: number) => void | - |
| showSizeChange | Called when `pageSize` is changed | (current: number, size: number) => void | - |
| update:current | Update current page | (page: number) => void | - |
| update:pageSize | Update page size | (pageSize: number) => void | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| itemRender | Customize page item | (ctx: { page: number; type: 'page' \| 'prev' \| 'next' \| 'jump-prev' \| 'jump-next'; element: VueNode }) => any | - |
| showTotal | Customize total display | (ctx: { total: number; range: [number, number] }) => any | - |
| prevIcon | Custom previous icon | () => any | - |
| nextIcon | Custom next icon | () => any | - |
| jumpPrevIcon | Custom jump-prev icon | () => any | - |
| jumpNextIcon | Custom jump-next icon | () => any | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

| Name | Description |
| --- | --- |
| root | Root element, set flex layout, alignment, wrap and list styles |
| item | Item element, set size, padding, border, background color, hover and active styles |

## Design Token {#design-token}

<ComponentTokenTable component="Pagination"></ComponentTokenTable>

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
