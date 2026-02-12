---
category: Components
group: 通用
title: FloatButton
subtitle: 悬浮按钮
description: 悬浮于页面上方的按钮。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*tXAoQqyr-ioAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*hSAwR7cnabwAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

- 用于网站上的全局功能；
- 无论浏览到何处都可以看见的按钮。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue" iframe="360">基本</demo>
  <demo src="./demo/type.vue" iframe="360">类型</demo>
  <demo src="./demo/shape.vue" iframe="360">形状</demo>
  <demo src="./demo/content.vue" iframe="360">描述</demo>
  <demo src="./demo/tooltip.vue" iframe="360">含有气泡卡片的悬浮按钮</demo>
  <demo src="./demo/group.vue" iframe="360">浮动按钮组</demo>
  <demo src="./demo/group-menu.vue" iframe="360">菜单模式</demo>
  <demo src="./demo/controlled.vue" iframe="360">受控模式</demo>
  <demo src="./demo/placement.vue" iframe="380">弹出方向</demo>
  <demo src="./demo/back-top.vue" iframe="360">回到顶部</demo>
  <demo src="./demo/badge.vue" iframe="360">徽标数</demo>
  <demo src="./demo/style-class.vue" iframe="360">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### FloatButtonGroup

#### 属性 {#floatbuttongroup-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| shape | 设置包含的 FloatButton 按钮形状 | `circle` \| `square` | `circle` | - |
| trigger | 触发方式（有触发方式为菜单模式） | `click` \| `hover` | - | - |
| open | 受控展开，需配合 trigger 一起使用 | boolean | - | - |
| closeIcon | 自定义关闭按钮 | VueNode | `<CloseOutlined />` | - |
| placement | 自定义菜单弹出位置 | `top` \| `left` \| `right` \| `bottom` | `top` | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;)=&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;)=&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |

#### 事件 {#floatbuttongroup-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| update:open | 展开收起时的回调，需配合 trigger 一起使用 | (open: boolean) =&gt; void | - |
| click | 点击按钮时的回调（仅在菜单模式中有效） | (e: MouseEvent) =&gt; void | - |

#### 插槽 {#floatbuttongroup-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| default | 子按钮内容 | () =&gt; any | - |
| icon | 触发按钮的图标 | () =&gt; any | - |
| closeIcon | 自定义关闭按钮 | () =&gt; any | - |

### FloatButton

#### 属性 {#floatbutton-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| icon | 自定义图标 | VueNode | - | - |
| content | 文字及其它内容 | VueNode | - | - |
| ~~description~~ | 请使用 `content` 代替 | VueNode | - | - |
| tooltip | 气泡卡片的内容 | VueNode \| TooltipProps | - | - |
| type | 设置按钮类型 | `default` \| `primary` | `default` | - |
| shape | 设置按钮形状 | `circle` \| `square` | `circle` | - |
| href | 点击跳转的地址，指定此属性 button 的行为和 a 链接一致 | string | - | - |
| target | 相当于 a 标签的 target 属性，href 存在时生效 | string | - | - |
| htmlType | 设置 `button` 原生的 `type` 值，可选值请参考 [HTML 标准](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button#type) | `submit` \| `reset` \| `button` | `button` | - |
| badge | 带徽标数字的悬浮按钮（不支持 `status` 以及相关属性） | [BadgeProps](/components/badge-cn#api) | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;)=&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;)=&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |

#### 事件 {#floatbutton-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| click | 点击按钮时的回调 | (e: MouseEvent) =&gt; void | - |

#### 插槽 {#floatbutton-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| default | 按钮内容 | () =&gt; any | - |
| icon | 自定义图标 | () =&gt; any | - |
| tooltip | 气泡卡片的内容 | (props?: TooltipProps) =&gt; any | - |

### FloatBackTop {#floatbacktop}

#### 属性 {#floatbacktop-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| duration | 回到顶部所需时间（ms） | number | 450 | - |
| target | 设置需要监听其滚动事件的元素 | () =&gt; HTMLElement | () =&gt; window | - |
| visibilityHeight | 滚动高度达到此参数值才出现 BackTop | number | 400 | - |
| target | 相当于 a 标签的 target 属性，href 存在时生效 | '_self' \| '_blank' \| '_parent' \| '_top' \| string | - | - |
| badge | 带徽标数字的悬浮按钮（不支持 `status` 以及相关属性） | FloatButtonBadgeProps & &#123; class?: string &#125; | - | 5.4.0 |
| htmlType | 设置 `button` 原生的 `type` 值，可选值请参考 [HTML 标准](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button#type) | ButtonHTMLType | `button` | 5.21.0 |
| ariaLabel | - | string | - | - |
| style | - | CSSProperties | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | FloatButtonClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | FloatButtonStylesType | - | - |

#### 事件 {#floatbacktop-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| click | 点击按钮的回调函数 | () =&gt; void | - |


## 语义化 DOM {#semantic-dom}

### FloatButton

<demo src="./demo/_semantic.vue" simplify></demo>


### FloatButtonGroup

<demo src="./demo/_semantic_group.vue" simplify></demo>

查看 [Semantic DOM](#semantic-dom) 说明以了解语义化结构的详细信息。


## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="FloatButton" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
