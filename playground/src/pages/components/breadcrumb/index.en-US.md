---
category: Components
group: Navigation
title: Breadcrumb
description: Display the current location within a hierarchy. And allow going back to states higher up in the hierarchy.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*I5a2Tpqs3y0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Tr90QKrE_LcAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

- When the system has more than two layers in a hierarchy.
- When you need to inform the user of where they are.
- When the user may need to navigate back to a higher level.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic Usage</demo>
  <demo src="./demo/withIcon.vue">With an Icon</demo>
  <demo src="./demo/withParams.vue">With Params</demo>
  <demo src="./demo/separator.vue">Configuring the Separator</demo>
  <demo src="./demo/overlay.vue">Bread crumbs with drop down menu</demo>
  <demo src="./demo/separator-component.vue">Configuring the Separator Independently</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: \{ props \})=> Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| dropdownIcon | Custom dropdown icon | VueNode | `<DownOutlined />` | - |
| itemRender | Custom item renderer, work with vue-router | (route, params, routes, paths) =&gt; VueNode | - | - |
| params | Routing parameters | object | - | - |
| items | The routing stack information of router | [ItemType\[\]](#itemtype) | - | - |
| separator | Custom separator | VueNode | `/` | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: \{ props \})=> Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| clickItem | Triggered when clicking a breadcrumb item | (item: ItemType, event: MouseEvent) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| itemRender | Custom item renderer, work with vue-router | (route: ItemType, params: AnyObject, routes: ItemType[], paths: string[]) =&gt; any | - |
| titleRender | Custom title renderer | (params: \{ item: ItemType, index: number \}) =&gt; any | - |
| separator | Custom separator | () =&gt; any | - |
| menuLabelRender | Custom menu label renderer | (params: \{ item: ItemType, index: number, menu: MenuItem \}) =&gt; any | - |
| menuExtraRender | Custom menu extra content renderer | (params: \{ item: ItemType, index: number, menu: MenuItem \}) =&gt; any | - |

## Types {#types}

### ItemType {#itemtype}

> type ItemType = Omit&lt;RouteItemType, 'title' | 'path'&gt; | SeparatorType

### RouteItemType {#routeitemtype}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| dropdownProps | The dropdown props | [Dropdown](/components/dropdown) | - | - |
| href | Target of hyperlink. Can not work with path | string | - | - |
| path | Connected path. Each path will connect with prev one. Can not work with href | string | - | - |
| menu | The menu props | [MenuProps](/components/menu#api) | - | - |
| onClick | Set the handler to handle click event | (e: MouseEvent) =&gt; void | - | - |
| title | item name | VueNode | - | - |

### SeparatorType {#separatortype}

```ts
const item = {
  type: 'separator', // Must have
  separator: '/',
}
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| type | Mark as separator | `separator` | - | - |
| separator | Custom separator | VueNode | `/` | - |

## Use with vue-router {#use-with-vue-router}

The link of Breadcrumb item targets `#` by default, you can use `itemRender` slot to make a vue-router Link.

```vue
<script setup lang="ts">
import type { BreadcrumbProps } from 'antdv-next'
import { RouterLink } from 'vue-router'

const items: BreadcrumbProps['items'] = [
  {
    path: '/index',
    title: 'home',
  },
  {
    path: '/first',
    title: 'first',
  },
  {
    path: '/second',
    title: 'second',
  },
]
</script>

<template>
  <a-breadcrumb :items="items">
    <template #itemRender="{ route, paths }">
      <RouterLink v-if="paths.length > 0" :to="`/${paths.join('/')}`">
        {{ route.title }}
      </RouterLink>
      <span v-else>{{ route.title }}</span>
    </template>
  </a-breadcrumb>
</template>
```

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Breadcrumb" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
