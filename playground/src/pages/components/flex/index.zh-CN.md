---
category: Components
group: 布局
title: Flex
subtitle: 弹性布局
description: 用于对齐的弹性布局容器。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*SMzgSJZE_AwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8yArQ43EGccAAAAAAAAAAAAADrJ8AQ/original
---



## 何时使用 {#when-to-use}

- 适合设置元素之间的间距。
- 适合设置各种水平、垂直对齐方式。

### 与 Space 组件的区别 {#difference-with-space}

- Space 为内联元素提供间距，其本身会为每一个子元素添加包裹元素用于内联对齐。适用于行、列中多个子元素的等距排列。
- Flex 为块级元素提供间距，其本身不会添加包裹元素。适用于垂直或水平方向上的子元素布局，并提供了更多的灵活性和控制能力。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本布局</demo>
  <demo src="./demo/align.vue">对齐方式</demo>
  <demo src="./demo/gap.vue">设置间隙</demo>
  <demo src="./demo/wrap.vue">自动换行</demo>
  <demo src="./demo/combination.vue">组合使用</demo>
</demo-group>

## API

### 属性 {#props}

通用属性参考：[通用属性](/docs/vue/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| vertical | flex 主轴的方向是否垂直，使用 `flex-direction: column` | boolean | `false` | - |
| wrap | 设置元素单行显示还是多行显示 | boolean \| CSSProperties['flexWrap'] | nowrap | boolean: 5.17.0 |
| justify | 设置元素在主轴方向上的对齐方式 | CSSProperties['justifyContent'] | normal | - |
| align | 设置元素在交叉轴方向上的对齐方式 | CSSProperties['alignItems'] | normal | - |
| flex | flex CSS 简写属性 | CSSProperties['flex'] | normal | - |
| gap | 设置网格之间的间隙 | CSSProperties['gap'] \| SizeType | - | - |
| component | 自定义元素类型 | any | `div` | - |

## 主题变量（Design Token）

<ComponentTokenTable component="Flex" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
