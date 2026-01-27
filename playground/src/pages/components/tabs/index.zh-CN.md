---
category: Components
group: 导航
title: Tabs
subtitle: 标签页
description: 选项卡切换组件。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*72NDQqXkyOEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8HMoTZUoSGoAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

提供平级的区域将大块内容进行收纳和展现，保持界面整洁。

Antdv Next 依次提供了三级选项卡，分别用于不同的场景。

- 卡片式的页签，提供可关闭的样式，常用于容器顶部。
- 既可用于容器顶部，也可用于容器内部，是最通用的 Tabs。
- [Radio.Button](/components/radio-cn/#radio-demo-radiobutton) 可作为更次级的页签来使用。

## 示例 {#examples}

<demo-group>
<demo src="./demo/basic.vue">基本</demo>
<demo src="./demo/disabled.vue">禁用</demo>
<demo src="./demo/centered.vue">居中</demo>
<demo src="./demo/icon.vue">图标</demo>
<demo src="./demo/custom-indicator.vue">指示条</demo>
<demo src="./demo/slide.vue">滑动</demo>
<demo src="./demo/extra.vue">附加内容</demo>
<demo src="./demo/size.vue">大小</demo>
<demo src="./demo/placement.vue">位置</demo>
<demo src="./demo/card.vue">卡片式页签</demo>
<demo src="./demo/editable-card.vue">新增和关闭页签</demo>
<demo src="./demo/custom-add-trigger.vue">自定义新增页签触发器</demo>
<demo src="./demo/custom-tab-bar.vue">自定义页签头</demo>
<demo src="./demo/custom-tab-bar-node.vue">可拖拽标签</demo>
<demo src="./demo/style-class.vue" >自定义语义结构的样式和类</demo>
</demo-group>

## API

### 属性 {#property}

通用属性参考：[通用属性](/docs/vue/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| activeKey | 当前激活 tab 面板的 key | string | - | - |
| addIcon | 自定义添加按钮，设置 `type="editable-card"` 时有效 | VueNode | `<PlusOutlined />` | - |
| animated | 是否使用动画切换 Tabs | boolean \| { inkBar: boolean, tabPane: boolean } | { inkBar: true, tabPane: false } | - |
| centered | 标签居中展示 | boolean | false | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | TabsClassNamesType | - | - |
| defaultActiveKey | 初始化选中面板的 key，如果没有设置 activeKey | string | `第一个面板的 key` | - |
| hideAdd | 是否隐藏加号图标，在 `type="editable-card"` 时有效 | boolean | false | - |
| indicator | 自定义指示条的长度和对齐方式 | { size?: number \| (origin: number) => number; align?: `start` \| `center` \| `end` } | - | - |
| items | 配置选项卡内容 | TabItemType[] | [] | - |
| more | 自定义折叠菜单属性 | MoreProps | { icon: `<EllipsisOutlined />`, trigger: 'hover' } | - |
| moreIcon | 自定义折叠图标 | VueNode | `<EllipsisOutlined />` | - |
| removeIcon | 自定义删除按钮，设置 `type="editable-card"` 时有效 | VueNode | `<CloseOutlined />` | - |
| renderTabBar | 替换 TabBar，用于二次封装标签头 | (ctx: { props: any; TabNavListComponent: any }) => VueNode | - | - |
| size | 大小，提供 `large` `middle` 和 `small` 三种大小 | `large` \| `middle` \| `small` | `middle` | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | TabsStylesType | - | - |
| tabBarExtraContent | tab bar 上额外的元素 | VueNode \| { left?: VueNode, right?: VueNode } | - | - |
| tabBarGutter | tabs 之间的间隙 | number | - | - |
| tabBarStyle | tab bar 的样式对象 | CSSProperties | - | - |
| tabPlacement | 页签位置，可选值有 `top` `end` `bottom` `start` | `top` \| `end` \| `bottom` \| `start` | `top` | - |
| destroyOnHidden | 被隐藏时是否销毁 DOM 结构 | boolean | false | - |
| type | 页签的基本样式，可选 `line`、`card` `editable-card` 类型 | `line` \| `card` \| `editable-card` | `line` | - |

### TabItemType {#tabitemtype}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| closeIcon | 自定义关闭图标，设置为 `null` 或 `false` 时隐藏关闭按钮 | VueNode | - | - |
| destroyOnHidden | 被隐藏时是否销毁 DOM 结构 | boolean | false | - |
| disabled | 禁用某一项 | boolean | false | - |
| forceRender | 被隐藏时是否渲染 DOM 结构 | boolean | false | - |
| key | 对应 activeKey | string | - | - |
| label | 选项卡头部文字元素 | VueNode | - | - |
| icon | 选项卡头部图标元素 | VueNode | - | - |
| content | 选项卡内容元素 | VueNode | - | - |
| closable | 是否显示选项卡的关闭按钮，在 `type="editable-card"` 时有效 | boolean | true | - |

### MoreProps {#moreprops}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| icon | 自定义折叠图标 | VueNode | - | - |
| DropdownProps | Dropdown 属性 | DropdownProps | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 切换面板的回调 | (activeKey: string) => void | - |
| edit | 新增和删除页签的回调，在 `type="editable-card"` 时有效 | (e: MouseEvent \| KeyboardEvent \| string, action: 'add' \| 'remove') => void | - |
| tabClick | tab 被点击的回调 | (key: string, event: MouseEvent) => void | - |
| tabScroll | tab 滚动时触发 | ({ direction: `left` \| `right` \| `top` \| `bottom` }) => void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| addIcon | 自定义添加按钮，设置 `type="editable-card"` 时有效 | () => any | - |
| moreIcon | 自定义折叠图标 | () => any | - |
| removeIcon | 自定义删除按钮，设置 `type="editable-card"` 时有效 | () => any | - |
| labelRender | 自定义标签头 | (args: { item: TabItemType; index: number }) => any | - |
| contentRender | 自定义内容 | (args: { item: TabItemType; index: number }) => any | - |
| renderTabBar | 替换 TabBar | (args: { props: any; TabNavListComponent: any }) => any | - |
| rightExtra | 右侧附加内容 | () => any | - |
| leftExtra | 左侧附加内容 | () => any | - |

### 方法 {#methods}

| 方法 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| nativeElement | 根节点 | any | - |

## 语义化结构 {#semantic-dom}

| 名称 | 说明 |
| --- | --- |
| root | 根元素，包含布局、方向等基础样式 |
| header | 头部元素，控制导航布局与边框样式 |
| item | 标签项元素，包含间距、颜色、交互状态样式 |
| indicator | 指示器元素，用于激活状态展示 |
| content | 内容区域元素，用于面板布局 |
| popup | 折叠菜单弹出层 |

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Tabs"></ComponentTokenTable>

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
