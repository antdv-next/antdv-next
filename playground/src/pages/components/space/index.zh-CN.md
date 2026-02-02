---
category: Components
group: 布局
title: Space
subtitle: 间距
description: 设置组件之间的间距。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ZiJ3SbOH9SUAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*37T2R6O9oi0AAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用

- 避免组件紧贴在一起，设置统一的间距。
- 当子表单组件紧密连接并且边框折叠时，使用 Space.Compact。

### 与 Flex 组件的区别

- Space 用于设置内联元素之间的间距。它会为每个子元素添加一个包装元素进行内联对齐。适用于多个子元素在行列中的等距排列。
- Flex 用于设置块级元素的布局。它不会添加包装元素。适用于子元素在垂直或水平方向的布局，并提供更多的灵活性和控制。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本用法</demo>
  <demo src="./demo/vertical.vue">垂直间距</demo>
  <demo src="./demo/size.vue">间距大小</demo>
  <demo src="./demo/align.vue">对齐方式</demo>
  <demo src="./demo/wrap.vue">自动换行</demo>
  <demo src="./demo/separator.vue">分隔符</demo>
  <demo src="./demo/compact.vue">紧凑布局组合</demo>
  <demo src="./demo/compact-buttons.vue">Button 紧凑布局</demo>
  <demo src="./demo/compact-button-vertical.vue">垂直方向紧凑布局</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### Space

#### 属性 {#space-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 对齐方式 | `start` \| `end` \| `center` \| `baseline` | - | 4.2.0 |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| orientation | 间距方向 | `vertical` \| `horizontal` | `horizontal` | - |
| separator | 设置分隔符 | VueNode | - | - |
| size | 间距大小 | [Size](#size) \| [[Size](#size), [Size](#size)] | `small` | 4.1.0 \| Array: 4.9.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| vertical | 是否垂直，和 `orientation` 同时配置以 `orientation` 优先 | boolean | false | - |
| wrap | 是否自动换行，仅在 `horizontal` 时有效 | boolean | false | 4.9.0 |

#### 插槽 {#space-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| separator | 设置分隔符 | () =&gt; VueNode | - |

### Size

`'small' | 'middle' | 'large' | number`

### SpaceCompact

当子表单组件紧密连接并且边框折叠时，使用 Space.Compact。支持的组件有：

- Button
- AutoComplete
- Cascader
- DatePicker
- Input/Input.Search
- InputNumber
- Select
- TimePicker
- TreeSelect

#### 属性 {#spacecompact-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| block | 将宽度调整为父元素宽度的选项 | boolean | false | 4.24.0 |
| orientation | 设置布局方向 | `vertical` \| `horizontal` | `horizontal` | - |
| size | 设置子组件大小 | `large` \| `middle` \| `small` | `middle` | 4.24.0 |
| vertical | 是否垂直，和 `orientation` 同时配置以 `orientation` 优先 | boolean | false | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）

<ComponentTokenTable component="Space" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
