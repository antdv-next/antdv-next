---
category: Components
group: 数据展示
title: Descriptions
subtitle: 描述列表
description: 展示多个只读字段的组合。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*fHdlTpif6XQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*d27AQJrowGAAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

常见于详情页的信息展示。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/border.vue">带边框的</demo>
  <demo src="./demo/size.vue">自定义尺寸</demo>
  <demo src="./demo/responsive.vue">响应式</demo>
  <demo src="./demo/vertical.vue">垂直</demo>
  <demo src="./demo/vertical-border.vue">垂直带边框的</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
  <demo src="./demo/block.vue">整行</demo>
</demo-group>

## API

### 属性 {#props}

通用属性参考：[通用属性](/docs/vue/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bordered | 是否展示边框 | boolean | false | - |
| size | 设置列表的大小。可以设置为 `middle` 、`small`, 或不填（只有设置 `bordered=&#123;true&#125;` 生效） | 'middle' \| 'small' \| 'default' | - | - |
| title | 描述列表的标题，显示在最顶部 | VueNode | - | - |
| extra | 描述列表的操作区域，显示在右上方 | VueNode | - | - |
| labelRender | - | RenderDescriptionsItem | - | - |
| contentRender | - | RenderDescriptionsItem | - | - |
| column | 一行的 `DescriptionItems` 数量，可以写成像素值或支持响应式的对象写法 `&#123; xs: 8, sm: 16, md: 24&#125;` | number \| Partial&lt;Record&lt;Breakpoint, number&gt;&gt; | 3 | - |
| layout | 描述布局 | 'horizontal' \| 'vertical' | `horizontal` | - |
| colon | 配置 `Descriptions.Item` 的 `colon` 的默认值。表示是否显示 label 后面的冒号 | boolean | true | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | DescriptionsStylesType | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | DescriptionsClassNamesType | - | - |
| items | 描述列表项内容 | DescriptionsItemType[] | - | 5.8.0 |
| id | - | string | - | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| title | 描述列表的标题，显示在最顶部 | () =&gt; any | - |
| extra | 描述列表的操作区域，显示在右上方 | () =&gt; any | - |
| labelRender | - | RenderDescriptionsItem | - |
| contentRender | - | RenderDescriptionsItem | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）

<ComponentTokenTable component="Descriptions" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
