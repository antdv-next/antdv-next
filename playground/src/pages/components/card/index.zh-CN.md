---
category: Components
group: 数据展示
title: Card
subtitle: 卡片
description: 通用卡片容器。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*QXO1SKEdIzYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*5WDvQp_H7LUAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

最基础的卡片容器，可承载文字、列表、图片、段落，常用于后台概览页面。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">典型卡片</demo>
  <demo src="./demo/border-less.vue" background="grey">无边框</demo>
  <demo src="./demo/simple.vue">简洁卡片</demo>
  <demo src="./demo/flexible-content.vue">更灵活的内容展示</demo>
  <demo src="./demo/in-column.vue" background="grey">栅格卡片</demo>
  <demo src="./demo/loading.vue">预加载的卡片</demo>
  <demo src="./demo/grid-card.vue">网格型内嵌卡片</demo>
  <demo src="./demo/inner.vue">内部卡片</demo>
  <demo src="./demo/tabs.vue">带页签的卡片</demo>
  <demo src="./demo/meta.vue">支持更多内容配置</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### Card

#### 属性 {#card-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 卡片标题 | VueNode | - | - |
| extra | 卡片右上角的操作区域 | VueNode | - | - |
| bordered | 是否有边框, 请使用 `variant` 替换 | boolean | true | - |
| headStyle | Deprecated. | CSSProperties | - | - |
| bodyStyle | Deprecated. | CSSProperties | - | - |
| loading | 当卡片内容还在加载中时，可以用 loading 展示一个占位 | boolean | false | - |
| hoverable | 鼠标移过时可浮起 | boolean | false | - |
| id | - | string | - | - |
| size | card 的尺寸 | CardSize | `default` | - |
| type | 卡片类型，可设置为 `inner` 或 不设置 | CardType | - | - |
| cover | 卡片封面 | VueNode | - | - |
| actions | 卡片操作组，位置在卡片底部 | VueNode[] | - | - |
| tabList | 页签标题列表 | CardTabListType[] | - | - |
| tabBarExtraContent | tab bar 上额外的元素 | VueNode \| &#123; [key: string]: VueNode &#125; | - | - |
| activeTabKey | 当前激活页签的 key | string | - | - |
| defaultActiveTabKey | 初始化选中页签的 key，如果没有设置 activeTabKey | string | `第一个页签的 key` | - |
| tabProps | [Tabs](/components/tabs-cn#tabs) | Record&lt;string, any&gt; | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | CardClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | CardStylesType | - | - |
| variant | 形态变体 | 'borderless' \| 'outlined' | `outlined` | - |

#### 事件 {#card-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| tabChange | 页签切换的回调 | (key: string) =&gt; void | - |
| update:activeTabKey | - | (key: string) =&gt; void | - |

#### 插槽 {#card-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| title | 卡片标题 | () =&gt; any | - |
| extra | 卡片右上角的操作区域 | () =&gt; any | - |
| cover | 卡片封面 | () =&gt; any | - |
| actions | 卡片操作组，位置在卡片底部 | () =&gt; any | - |
| tabContentRender | - | TabsSlots['contentRender'] | - |
| tabLabelRender | - | TabsSlots['labelRender'] | - |
| tabBarExtraContent | tab bar 上额外的元素 | () =&gt; any | - |

### CardGrid

#### 属性 {#card-grid-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| prefixCls | - | string | - | - |
| hoverable | 鼠标移过时可浮起 | boolean | false | - |

### CardMeta

#### 属性 {#card-meta-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| prefixCls | - | string | - | - |
| avatar | - | VueNode | - | - |
| title | 卡片标题 | VueNode | - | - |
| description | - | VueNode | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | CardMetaClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | CardMetaStylesType | - | - |

#### 插槽 {#card-meta-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| avatar | 头像 | () =&gt; any | - |
| title | 标题 | () =&gt; any | - |
| description | 描述 | () =&gt; any | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）

<ComponentTokenTable component="Card" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
