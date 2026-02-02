---
category: Components
group: 导航
title: Menu
subtitle: 导航菜单
description: 为页面和功能提供导航的菜单列表。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*KeyQQL5iKkkAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Vn4XSqJFAxcAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

导航菜单是一个网站的灵魂，用户依赖导航在各个页面中进行跳转。一般分为顶部导航和侧边导航，顶部导航提供全局性的类目和功能，侧边导航提供多级结构来收纳和排列网站架构。

更多布局和导航的使用可以参考：[通用布局](/components/layout-cn)。

## 开发者注意事项 {#notes-for-developers}

- Menu 元素为 `ul`，因而仅支持 [`li` 以及 `script-supporting` 子元素](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ul-element)。因而你的子节点元素应该都在 `Menu.Item` 内使用。
- Menu 需要计算节点结构，因而其子元素仅支持 `Menu.*` 或封装后的组件。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/horizontal.vue">顶部导航</demo>
  <demo src="./demo/inline.vue">内嵌菜单</demo>
  <demo src="./demo/inline-collapsed.vue">缩起内嵌菜单</demo>
  <demo src="./demo/sider-current.vue">只展开当前父级菜单</demo>
  <demo src="./demo/vertical.vue">垂直菜单</demo>
  <demo src="./demo/theme.vue">主题</demo>
  <demo src="./demo/submenu-theme.vue">子菜单主题</demo>
  <demo src="./demo/switch-mode.vue">切换菜单类型</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
  <demo src="./demo/custom-popup-render.vue">自定义弹出框</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | MenuClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | MenuStylesType | - | - |
| rootClass | 根节点样式类 | string | - | - |
| defaultOpenKeys | 初始展开的 SubMenu 菜单项 key 数组 | string[] | - | - |
| defaultSelectedKeys | 初始选中的菜单项 key 数组 | string[] | - | - |
| expandIcon | 自定义展开图标 | VueNode \| ((props: SubMenuProps & { isSubMenu: boolean }) => VueNode) | - | - |
| forceSubMenuRender | 在子菜单展示之前就渲染进 DOM | boolean | false | - |
| inlineCollapsed | inline 时菜单是否收起状态 | boolean | - | - |
| inlineIndent | inline 模式的菜单缩进宽度 | number | 24 | - |
| items | 菜单内容 | ItemType[] | - | - |
| mode | 菜单类型，现在支持垂直、水平、和内嵌模式三种 | `vertical` \| `horizontal` \| `inline` | `vertical` | - |
| multiple | 是否允许多选 | boolean | false | - |
| openKeys | 当前展开的 SubMenu 菜单项 key 数组 | string[] | - | - |
| overflowedIndicator | 用于自定义 Menu 水平空间不足时的省略收缩的图标 | VueNode | `<EllipsisOutlined />` | - |
| selectable | 是否允许选中 | boolean | true | - |
| selectedKeys | 当前选中的菜单项 key 数组 | string[] | - | - |
| subMenuCloseDelay | 用户鼠标离开子菜单后关闭延时，单位：秒 | number | 0.1 | - |
| subMenuOpenDelay | 用户鼠标进入子菜单后开启延时，单位：秒 | number | 0 | - |
| theme | 主题颜色 | `light` \| `dark` | `light` | - |
| triggerSubMenuAction | SubMenu 展开/关闭的触发行为 | `hover` \| `click` | `hover` | - |
| getPopupContainer | 菜单弹出层渲染容器，默认渲染到 body | (triggerNode: HTMLElement) => HTMLElement | () => document.body | - |
| itemIcon | 自定义菜单项图标渲染 | (props: MenuItemProps & RenderIconInfo) => any | - | - |
| labelRender | 自定义菜单项标签渲染 | (item: RenderItem) => any | - | - |
| extraRender | 自定义菜单项额外内容渲染 | (item: RenderItem) => any | - | - |
| popupRender | 自定义子菜单的弹出框 | (node: VueNode, info: { item: SubMenuProps; keys: string[] }) => VueNode | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| click | 点击 MenuItem 调用此函数 | (info: MenuInfo) => void | - |
| select | 被选中时调用 | (info: SelectInfo) => void | - |
| deselect | 取消选中时调用，仅在 multiple 生效 | (info: SelectInfo) => void | - |
| openChange | SubMenu 展开/关闭的回调 | (openKeys: string[]) => void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| expandIcon | 自定义展开图标 | () => any | - |
| labelRender | 自定义菜单项标签 | (item: RenderItem) => any | - |
| extraRender | 自定义菜单项额外内容 | (item: RenderItem) => any | - |
| itemIcon | 自定义菜单项图标 | (props: MenuItemProps & RenderIconInfo) => any | - |

### 方法 {#methods}

| 方法 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| menu | Menu 实例 | VcMenuRef \| null | - |
| focus | 聚焦菜单 | (options?: FocusOptions) => void | - |

## 类型 {#types}

### ItemType {#itemtype}

> type ItemType = MenuItemType | SubMenuType | MenuItemGroupType | MenuDividerType | null;

#### MenuItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| danger | 展示错误状态样式 | boolean | false | - |
| disabled | 是否禁用 | boolean | false | - |
| extra | 额外节点 | VueNode | - | - |
| icon | 菜单图标 | VueNode | - | - |
| key | item 的唯一标志 | string | - | - |
| label | 菜单项标题 | VueNode | - | - |
| title | 设置收缩时展示的悬浮标题 | string | - | - |

#### SubMenuType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 子菜单的菜单项 | ItemType[] | - | - |
| disabled | 是否禁用 | boolean | false | - |
| icon | 菜单图标 | VueNode | - | - |
| key | 唯一标志 | string | - | - |
| label | 菜单项标题 | VueNode | - | - |
| popupClassName | 子菜单样式，`mode="inline"` 时无效 | string | - | - |
| popupOffset | 子菜单偏移量，`mode="inline"` 时无效 | [number, number] | - | - |
| onTitleClick | 点击子菜单标题 | (info: { key: string; domEvent: MouseEvent }) => void | - | - |
| theme | 设置子菜单的主题，默认从 Menu 上继承 | `light` \| `dark` | - | - |
| popupRender | 自定义当前子菜单的弹出框 | (node: VueNode, info: { item: SubMenuProps; keys: string[] }) => VueNode | - | - |

#### MenuItemGroupType

定义类型为 `group` 时，会作为分组处理:

```ts
const groupItem = {
  type: 'group', // Must have
  label: 'My Group',
  children: [],
}
```

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 分组的菜单项 | MenuItemType[] | - | - |
| label | 分组标题 | VueNode | - | - |

#### MenuDividerType

菜单项分割线，只用在弹出菜单内，需要定义类型为 `divider`：

```ts
const dividerItem = {
  type: 'divider', // Must have
}
```

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| dashed | 是否虚线 | boolean | false | - |

## FAQ

### 为何 Menu 的子元素会渲染两次？ {#faq-render-twice}

Menu 通过[二次渲染](https://github.com/react-component/menu/blob/f4684514096d6b7123339cbe72e7b0f68db0bce2/src/Menu.tsx#L543)收集嵌套结构信息以支持 HOC 的结构。合并成一个推导结构会使得逻辑变得十分复杂，欢迎 PR 以协助改进该设计。

### 在 Flex 布局中，Menu 没有按照预期响应式省略菜单？ {#faq-flex-layout}

Menu 初始化时会先全部渲染，然后根据宽度裁剪内容。当处于 Flex 布局中，你需要告知其预期宽度为响应式宽度（[在线 Demo](https://codesandbox.io/s/ding-bu-dao-hang-antd-4-21-7-forked-5e3imy?file=/demo.js)）：

```html
<div style="display: flex;">
  <div style="flex: none;">Some Content</div>
  <a-menu style="min-width: 0; flex: auto;" />
</div>
```

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Menu"></ComponentTokenTable>

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
