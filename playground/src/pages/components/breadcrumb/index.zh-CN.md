---
category: Components
group: 导航
title: Breadcrumb
subtitle: 面包屑
description: 显示当前页面在系统层级结构中的位置，并能向上返回。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*I5a2Tpqs3y0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Tr90QKrE_LcAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

- 当系统拥有超过两级以上的层级结构时；
- 当需要告知用户『你在哪里』时；
- 当需要向上导航的功能时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/withIcon.vue">带有图标的</demo>
  <demo src="./demo/withParams.vue">带有参数的</demo>
  <demo src="./demo/separator.vue">分隔符</demo>
  <demo src="./demo/overlay.vue">带下拉菜单的面包屑</demo>
  <demo src="./demo/separator-component.vue">独立的分隔符</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: \{ props \})=> Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| dropdownIcon | 自定义下拉图标 | VueNode | `<DownOutlined />` | - |
| itemRender | 自定义链接函数，和 vue-router 配置使用 | (route, params, routes, paths) =&gt; VueNode | - | - |
| params | 路由的参数 | object | - | - |
| items | 路由栈信息 | [ItemType\[\]](#itemtype) | - | - |
| separator | 分隔符自定义 | VueNode | `/` | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: \{ props \})=> Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| clickItem | 点击面包屑项目时触发 | (item: ItemType, event: MouseEvent) =&gt; void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| itemRender | 自定义链接函数，和 vue-router 配置使用 | (route: ItemType, params: AnyObject, routes: ItemType[], paths: string[]) =&gt; any | - |
| titleRender | 自定义标题渲染 | (params: \{ item: ItemType, index: number \}) =&gt; any | - |
| separator | 分隔符自定义 | () =&gt; any | - |
| menuLabelRender | 自定义菜单标签渲染 | (params: \{ item: ItemType, index: number, menu: MenuItem \}) =&gt; any | - |
| menuExtraRender | 自定义菜单额外内容渲染 | (params: \{ item: ItemType, index: number, menu: MenuItem \}) =&gt; any | - |

## 类型 {#types}

### ItemType {#itemtype}

> type ItemType = Omit&lt;RouteItemType, 'title' | 'path'&gt; | SeparatorType

### RouteItemType {#routeitemtype}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| dropdownProps | 弹出下拉菜单的自定义配置 | [Dropdown](/components/dropdown) | - | - |
| href | 链接的目的地，不能和 `path` 共用 | string | - | - |
| path | 拼接路径，每一层都会拼接前一个 `path` 信息。不能和 `href` 共用 | string | - | - |
| menu | 菜单配置项 | [MenuProps](/components/menu#api) | - | - |
| onClick | 单击事件 | (e: MouseEvent) =&gt; void | - | - |
| title | 名称 | VueNode | - | - |

### SeparatorType {#separatortype}

```ts
const item = {
  type: 'separator', // Must have
  separator: '/',
}
```

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| type | 标记为分隔符 | `separator` | - | - |
| separator | 要显示的分隔符 | VueNode | `/` | - |

## 和 vue-router 配置 {#use-with-vue-router}

和 vue-router 一起使用时，默认生成的链接是 `#`，你可以使用 `itemRender` 属性定义面包屑链接。

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

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token） {#design-token}

<ComponentTokenTable component="Breadcrumb" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
