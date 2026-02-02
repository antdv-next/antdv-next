---
category: Components
subtitle: 瀑布流
group: 布局
title: Masonry
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cELTRrM5HpAAAAAAOGAAAAgAegCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*2CxJRYJmfbIAAAAAPqAAAAgAegCCAQ/original
demo:
  cols: 1
---

瀑布流布局组件，用于展示不同高度的内容。

## 何时使用 {#when-to-use}

- 展示不规则高度的图片或卡片时
- 需要按照列数均匀分布内容时
- 需要响应式调整列数时

## 代码演示 {#examples}

<demo-group>
    <demo src="./demo/basic.vue">基础用法</demo>
    <demo src="./demo/responsive.vue">响应式</demo>
    <demo src="./demo/image.vue">图片</demo>
    <demo src="./demo/dynamic.vue">动态更新</demo>
    <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| styles | 语义化结构 style，支持对象和函数形式 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| columns | 列数，可以是固定值或响应式配置 | number \| &#123; xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number &#125; | `3` | - |
| fresh | 是否持续监听子项尺寸变化 | boolean | `false` | - |
| gutter | 间距，可以是固定值、响应式配置或水平垂直间距配置 | [Gap](#gap) \| [[Gap](#gap), [Gap](#gap)] | `0` | - |
| items | 瀑布流项 | [MasonryItem](#masonryitem)[] | - | - |
| itemRender | 自定义项渲染 | (item: MasonryItem) =&gt; VueNode | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| layoutChange | 列排序回调 | (sortInfo: &#123; key: Key; column: number &#125;[]) =&gt; void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| itemRender | 自定义项渲染插槽 | (itemInfo: MasonryItem & &#123; index: number &#125;) =&gt; VueNode | - |

## 类型 {#types}

### MasonryItem

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | string \| number | - |
| height | 高度 | number | - |
| column | 自定义所在列 | number | - |
| data | 自定义存储数据 | T | - |
| children | 自定义展示内容，相对 `itemRender` 具有更高优先级 | VueNode | - |

### Gap

Gap 是项之间的间距，可以是固定值，也可以是响应式配置。

```ts
type Gap = undefined | number | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number>>
```

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>


## 主题变量（Design Token）

<ComponentTokenTable component="Masonry" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
