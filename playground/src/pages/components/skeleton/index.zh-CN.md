---
category: Components
group: 反馈
title: Skeleton
subtitle: 骨架屏
description: 在需要等待加载内容的位置提供一个占位图形组合。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*uae3QbkNCm8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*VcjGQLSrYdcAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

- 网络较慢，需要长时间等待加载处理的情况下。
- 图文信息内容较多的列表/卡片中。
- 只在第一次加载数据的时候使用。
- 可以被 Spin 完全代替，但是在可用的场景下可以比 Spin 提供更好的视觉效果和用户体验。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/complex.vue">复杂的组合</demo>
  <demo src="./demo/active.vue">动画效果</demo>
  <demo src="./demo/element.vue">按钮/头像/输入框/图像/自定义节点</demo>
  <demo src="./demo/children.vue">包含子组件</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### Skeleton

#### 属性 {#skeleton-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| active | 是否展示动画效果 | boolean | false | - |
| avatar | 是否显示头像占位图 | boolean \| [SkeletonAvatarProps](#skeletonavatarprops) | false | - |
| loading | 为 true 时，显示占位图。反之则直接展示子组件 | boolean | - | - |
| paragraph | 是否显示段落占位图 | boolean \| [SkeletonParagraphProps](#skeletonparagraphprops) | true | - |
| round | 为 true 时，段落和标题显示圆角 | boolean | false | - |
| title | 是否显示标题占位图 | boolean \| [SkeletonTitleProps](#skeletontitleprops) | true | - |
| classes | 用于自定义组件内部各语义化结构的 class | SkeletonClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style | SkeletonStylesType | - | - |

### SkeletonAvatar

#### 属性 {#skeletonavatar-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| active | 是否展示动画效果，仅在单独使用头像骨架时生效 | boolean | false | - |
| shape | 指定头像的形状 | `circle` \| `square` | `circle` | - |
| size | 设置头像占位图的大小 | number \| `large` \| `small` \| `default` | `default` | - |

### SkeletonTitle

#### 属性 {#skeletontitle-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| width | 设置标题占位图的宽度 | number \| string | - | - |

### SkeletonParagraph

#### 属性 {#skeletonparagraph-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| rows | 设置段落占位图的行数 | number | - | - |
| width | 设置段落占位图的宽度，若为数组时则为对应的每行宽度，反之则是最后一行的宽度 | number \| string \| Array&lt;number \| string&gt; | - | - |

### SkeletonAvatar

#### 属性 {#skeletonavatar-avatar}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| active | 是否展示动画效果 | boolean | false | - |
| shape | 指定头像的形状 | `circle` \| `square` | `circle` | - |
| size | 设置头像占位图的大小 | number \| `large` \| `small` \| `default` | `default` | - |
| classes | 用于自定义组件内部各语义化结构的 class | SkeletonClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style | SkeletonStylesType | - | - |

### SkeletonButton

#### 属性 {#skeletonbutton-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| active | 是否展示动画效果 | boolean | false | - |
| block | 将按钮宽度调整为其父宽度的选项 | boolean | false | - |
| shape | 指定按钮的形状 | `circle` \| `round` \| `square` \| `default` | - | - |
| size | 设置按钮的大小 | `large` \| `small` \| `default` | - | - |
| classes | 用于自定义组件内部各语义化结构的 class | SkeletonClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style | SkeletonStylesType | - | - |

### SkeletonInput

#### 属性 {#skeletoninput-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| active | 是否展示动画效果 | boolean | false | - |
| size | 设置输入框的大小 | `large` \| `small` \| `default` | - | - |
| classes | 用于自定义组件内部各语义化结构的 class | SkeletonClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style | SkeletonStylesType | - | - |

### SkeletonImage

#### 属性 {#skeletonimage-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| active | 是否展示动画效果 | boolean | false | - |
| classes | 用于自定义组件内部各语义化结构的 class | SkeletonClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style | SkeletonStylesType | - | - |

### SkeletonNode

#### 属性 {#skeletonnode-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| active | 是否展示动画效果 | boolean | false | - |
| classes | 用于自定义组件内部各语义化结构的 class | SkeletonClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style | SkeletonStylesType | - | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Skeleton"></ComponentTokenTable>
