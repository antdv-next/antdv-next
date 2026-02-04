---
category: Components
group: 通用
title: Typography
subtitle: 排版
description: 文本的基本格式。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*MLt3R6m9huoAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*LT2jR41Uj2EAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

- 当需要展示标题、段落、列表内容时使用，如文章/博客/日志的文本样式。
- 当需要一列基于文本的基础操作时，如拷贝/省略/可编辑。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/title.vue">标题组件</demo>
  <demo src="./demo/text.vue">文本与超链接组件</demo>
  <demo src="./demo/editable.vue">可编辑</demo>
  <demo src="./demo/copyable.vue">可复制</demo>
  <demo src="./demo/ellipsis.vue">省略号</demo>
  <demo src="./demo/ellipsis-controlled.vue">受控省略展开/收起</demo>
  <demo src="./demo/ellipsis-middle.vue">省略中间</demo>
  <demo src="./demo/suffix.vue">后缀</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### Typography

#### 属性 {#typography-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| direction | 方向控制 | 'ltr' \| 'rtl' | - | - |

### TypographyText

#### 属性 {#typographytext-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| code | 添加代码样式 | boolean | false |  |
| copyable | 是否可拷贝，为对象时可进行各种自定义 | boolean \| [copyable](#copyable) | false |  |
| delete | 添加删除线样式 | boolean | false |  |
| disabled | 禁用文本 | boolean | false |  |
| editable | 是否可编辑，为对象时可对编辑进行控制 | boolean \| [editable](#editable) | false |  |
| ellipsis | 自动溢出省略，为对象时可设置省略行数、是否可展开、添加后缀等 | boolean \| [ellipsis](#ellipsis) | false |  |
| level | 重要程度，相当于 `h1`、`h2`、`h3`、`h4`、`h5` | number: 1, 2, 3, 4, 5 | 1 |  |
| mark | 添加标记样式 | boolean | false |  |
| italic | 是否斜体 | boolean | false |  |
| type | 文本类型 | `secondary` \| `success` \| `warning` \| `danger` | - | |
| underline | 添加下划线样式 | boolean | false |  |

#### 事件 {#typographytext-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击时的回调 | (event: MouseEvent) =&gt; void |

### TypographyTitle

#### 属性 {#typographytitle-props}

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| code | 添加代码样式 | boolean | false |
| copyable | 是否可拷贝，为对象时可进行各种自定义 | boolean \| [copyable](#copyable) | false |
| delete | 添加删除线样式 | boolean | false |
| disabled | 禁用文本 | boolean | false |
| editable | 是否可编辑，为对象时可对编辑进行控制 | boolean \| [editable](#editable) | false |
| ellipsis | 自动溢出省略，为对象时可设置省略行数、是否可展开、添加后缀等 | boolean \| [ellipsis](#ellipsis) | false |
| level | 重要程度，相当于 `h1`、`h2`、`h3`、`h4`、`h5` | number: 1, 2, 3, 4, 5 | 1 |
| mark | 添加标记样式 | boolean | false |
| italic | 是否斜体 | boolean | false |
| type | 文本类型 | `secondary` \| `success` \| `warning` \| `danger` | - |
| underline | 添加下划线样式 | boolean | false |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | TypographyClassNamesType | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | TypographyStylesType | - |

#### 事件 {#typographytitle-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击时的回调 | (event: MouseEvent) =&gt; void |

### TypographyParagraph

#### 属性 {#typographyparagraph-props}

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| code | 添加代码样式 | boolean | false |
| copyable | 是否可拷贝，为对象时可进行各种自定义 | boolean \| [copyable](#copyable) | false |
| delete | 添加删除线样式 | boolean | false |
| disabled | 禁用文本 | boolean | false |
| editable | 是否可编辑，为对象时可对编辑进行控制 | boolean \| [editable](#editable) | false |
| ellipsis | 自动溢出省略，为对象时可设置省略行数、是否可展开、添加后缀等 | boolean \| [ellipsis](#ellipsis) | false |
| mark | 添加标记样式 | boolean | false |
| strong | 是否加粗 | boolean | false |
| italic | 是否斜体 | boolean | false |
| type | 文本类型 | `secondary` \| `success` \| `warning` \| `danger` | - |
| underline | 添加下划线样式 | boolean | false |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | TypographyClassNamesType | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | TypographyStylesType | - |

#### 事件 {#typographyparagraph-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击时的回调 | (event: MouseEvent) =&gt; void |
| copy | 拷贝成功的回调函数 | (event: MouseEvent) =&gt; void |

## 类型 {#types}

### copyable

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| format | 剪切板数据的 Mime Type | 'text/plain' \| 'text/html' | - |
| icon | 自定义拷贝图标：\[默认图标, 拷贝后的图标] | \[VueNode, VueNode] | - |
| text | 拷贝到剪切板里的文本 | string | - |
| tooltips | 自定义提示文案，为 false 时隐藏文案 | \[VueNode, VueNode] | \[`复制`, `复制成功`] |
| tabIndex | 自定义复制按钮的 tabIndex | number | 0 |

#### 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| copy | 拷贝成功的回调函数 | (event: MouseEvent) =&gt; void |

### editable

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoSize | `autoSize` 属性的 textarea | boolean \| &#123; minRows: number, maxRows: number &#125; | - |
| editing | 控制是否是编辑中状态 | boolean | false |
| icon | 自定义编辑图标 | VueNode | &lt;EditOutlined /&gt; |
| maxlength | 编辑中文本域最大长度 | number | - |
| tooltip | 自定义提示文本，为 false 时关闭 | VueNode | `编辑` |
| text | 显式地指定编辑文案，为空时将隐式地使用 children | string | - |
| triggerType | 编辑模式触发器类型，图标、文本或者两者都设置（不设置图标作为触发器时它会隐藏） | Array&lt;`icon`\|`text`&gt; | \[`icon`] |
| enterIcon | 在编辑段中自定义"enter"图标（传递"null"将删除图标） | VueNode | `&lt;EnterOutlined /&gt;` |
| tabIndex | 自定义编辑按钮的 tabIndex | number | 0 |

#### 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 文本域编辑时触发 | (value: string) =&gt; void |
| cancel | 按 ESC 退出编辑状态时触发 | () =&gt; void |
| start | 进入编辑中状态时触发 | () =&gt; void |
| end | 按 ENTER 结束编辑状态时触发 | () =&gt; void |

### ellipsis

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| expandable | 是否可展开 | boolean \| 'collapsible' | - |
| rows | 最多显示的行数 | number | - |
| suffix | 自定义省略内容后缀 | string | - |
| symbol | 自定义展开描述文案 | VueNode \| ((expanded: boolean) =&gt; VueNode) | `展开` `收起` |
| tooltip | 省略时，展示提示信息 | VueNode \| [TooltipProps](/components/tooltip-cn/#api) | - |
| defaultExpanded | 默认展开或收起 | boolean | - |
| expanded | 展开或收起 | boolean | - |

#### 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| ellipsis | 触发省略时的回调 | (ellipsis: boolean) =&gt; void |
| expand | 点击展开或收起时的回调 | (event: MouseEvent, info: &#123; expanded: boolean &#125;) =&gt; void |

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Typography" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
