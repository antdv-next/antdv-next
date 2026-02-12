---
category: Components
group: 导航
title: Pagination
subtitle: 分页
description: 分页器用于分隔长列表，每次只加载一个页面。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8y_iTJGY_aUAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WM86SrBC8TsAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

- 当加载/渲染所有数据将花费很多时间时；
- 可切换页码浏览数据。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/align.vue">对齐</demo>
  <demo src="./demo/more.vue">更多</demo>
  <demo src="./demo/changer.vue">改变</demo>
  <demo src="./demo/jump.vue">跳转</demo>
  <demo src="./demo/mini.vue">迷你</demo>
  <demo src="./demo/simple.vue">简洁</demo>
  <demo src="./demo/controlled.vue">受控</demo>
  <demo src="./demo/total.vue">总数</demo>
  <demo src="./demo/all.vue">全部展示</demo>
  <demo src="./demo/itemRender.vue">上一步和下一步</demo>
  <demo src="./demo/style-class.vue">语义化样式</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 对齐方式 | `start` \| `center` \| `end` | - | - |
| classes | 自定义组件内部各语义化结构的类名，支持对象或函数 | PaginationClassNamesType | - | - |
| current | 当前页数 | number | - | - |
| defaultCurrent | 默认的当前页数 | number | 1 | - |
| defaultPageSize | 默认的每页条数 | number | 10 | - |
| disabled | 禁用分页 | boolean | - | - |
| hideOnSinglePage | 只有一页时是否隐藏分页器 | boolean | false | - |
| itemRender | 用于自定义页码内容 | (page: number, type: 'page' \| 'prev' \| 'next' \| 'jump-prev' \| 'jump-next', element: VueNode) => VueNode | - | - |
| pageSize | 每页条数 | number | - | - |
| pageSizeOptions | 指定每页可以显示多少条 | (string \| number)[] | ['10', '20', '50', '100'] | - |
| responsive | 当 size 未指定时，根据屏幕宽度自动调整尺寸 | boolean | - | - |
| rootClass | 根节点样式类 | string | - | - |
| showLessItems | 是否显示较少页面内容 | boolean | false | - |
| showQuickJumper | 是否可以快速跳转至某页 | boolean \| \{ goButton?: VueNode \} | false | - |
| showSizeChanger | 是否展示 `pageSize` 切换器 | boolean \| SelectProps | - | - |
| totalBoundaryShowSizeChanger | 当 `total` 大于该值时，`showSizeChanger` 默认为 true | number | 50 | - |
| showTitle | 是否显示原生 tooltip 页码提示 | boolean | true | - |
| showTotal | 用于显示数据总量和当前数据顺序 | (total: number, range: [number, number]) => VueNode | - | - |
| simple | 当添加该属性时，显示为简单分页 | boolean \| \{ readOnly?: boolean \} | - | - |
| size | 当为 `small` 时，是小尺寸分页 | `default` \| `small` | `default` | - |
| styles | 自定义组件内部各语义化结构的内联样式，支持对象或函数 | PaginationStylesType | - | - |
| total | 数据总数 | number | 0 | - |
| locale | 分页文案配置 | PaginationLocale | - | - |
| prevIcon | 自定义上一页图标 | VueNode | - | - |
| nextIcon | 自定义下一页图标 | VueNode | - | - |
| jumpPrevIcon | 自定义向前跳转图标 | VueNode | - | - |
| jumpNextIcon | 自定义向后跳转图标 | VueNode | - | - |
| selectComponentClass | 已废弃，非官方支持 | any | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 页码或 `pageSize` 改变的回调 | (page: number, pageSize: number) => void | - |
| showSizeChange | pageSize 变化的回调 | (current: number, size: number) => void | - |
| update:current | 更新当前页 | (page: number) => void | - |
| update:pageSize | 更新每页条数 | (pageSize: number) => void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| itemRender | 自定义页码内容 | (ctx: { page: number; type: 'page' \| 'prev' \| 'next' \| 'jump-prev' \| 'jump-next'; element: VueNode }) => any | - |
| showTotal | 自定义总数展示 | (ctx: { total: number; range: [number, number] }) => any | - |
| prevIcon | 自定义上一页图标 | () => any | - |
| nextIcon | 自定义下一页图标 | () => any | - |
| jumpPrevIcon | 自定义向前跳转图标 | () => any | - |
| jumpNextIcon | 自定义向后跳转图标 | () => any | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Pagination"></ComponentTokenTable>

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
