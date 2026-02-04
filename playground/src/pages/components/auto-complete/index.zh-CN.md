---
category: Components
title: AutoComplete
subtitle: 自动完成
description: 输入框自动完成功能。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*g8THS4NpV6sAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WERTQ6qvgEYAAAAAAAAAAAAADrJ8AQ/original
group:
  title: 数据录入
  order: 4
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

- 需要一个输入框而不是选择器。
- 需要输入建议/辅助提示。

和 Select 的区别是：

- AutoComplete 是一个带提示的文本输入框，用户可以自由输入，关键词是辅助**输入**。
- Select 是在限定的可选项中进行选择，关键词是**选择**。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本使用</demo>
  <demo src="./demo/options.vue">自定义选项</demo>
  <demo src="./demo/custom.vue">自定义输入组件</demo>
  <demo src="./demo/non-case-sensitive.vue">不区分大小写</demo>
  <demo src="./demo/certain-category.vue">查询模式 - 确定类目</demo>
  <demo src="./demo/uncertain-category.vue">查询模式 - 不确定类目</demo>
  <demo src="./demo/status.vue">自定义状态</demo>
  <demo src="./demo/variant.vue">多种形态</demo>
  <demo src="./demo/allowClear.vue">自定义清除按钮</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

### 属性 {#props}

通用属性参考：[通用属性](/docs/vue/common-props)

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 支持清除 | boolean \| &#123; clearIcon?: VueNode &#125; | false | - |
| backfill | 使用键盘选择选项的时候把选中项回填到输入框中 | boolean | false | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| defaultActiveFirstOption | 是否默认高亮第一个选项 | boolean | true | - |
| disabled | 是否禁用 | boolean | false | - |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位 | (triggerNode: HTMLElement) =&gt; HTMLElement | () =&gt; document.body | - |
| notFoundContent | 当下拉列表为空时显示的内容 | VueNode | - | - |
| open | 是否展开下拉菜单 | boolean | - | - |
| options | 数据化配置选项内容，相比 jsx 定义会获得更好的渲染性能 | &#123; label: VueNode; value: string &#125;[] | - | - |
| placeholder | 输入框提示 | string | - | - |
| popupMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动 | boolean \| number | true | - |
| popupRender | 自定义下拉框内容 | (menu: VueNode) =&gt; VueNode | - | - |
| showSearch | 搜索配置 | boolean \| [SearchConfig](#showsearch) | true | - |
| size | 控件大小 | `large` \| `middle` \| `small` | - | - |
| status | 设置校验状态 | `error` \| `warning` | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| value | 指定当前选中的条目，支持 `v-model:value` | string | - | - |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | - |
| virtual | 设置 false 时关闭虚拟滚动 | boolean | true | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| blur | 失去焦点时的回调 | (e: FocusEvent) =&gt; void | - |
| change | 选中 option，或 input 的 value 变化时，调用此函数 | (value: string) =&gt; void | - |
| clear | 清除内容时的回调 | () =&gt; void | - |
| focus | 获得焦点时的回调 | (e: FocusEvent) =&gt; void | - |
| inputKeydown | 按键按下时回调 | (e: KeyboardEvent) =&gt; void | - |
| openChange | 展开下拉菜单的回调 | (open: boolean) =&gt; void | - |
| popupScroll | 下拉列表滚动时的回调 | (e: UIEvent) =&gt; void | - |
| search | 搜索补全项的时候调用 | (value: string) =&gt; void | - |
| select | 被选中时调用，参数为选中项的 value 值 | (value: string, option: Option) =&gt; void | - |

## 类型 {#types}

### showSearch {#showsearch}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| filterOption | 是否根据输入项进行筛选。当其为一个函数时，会接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 true，反之则返回 false | boolean \| (inputValue: string, option?: Option) =&gt; boolean | true | - |
| onSearch | 搜索补全项的时候调用 | (value: string) =&gt; void | - | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）

<ComponentTokenTable component="Select" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。

## FAQ

### 为何受控状态下使用 onSearch 无法输入中文？ {#faq-controlled-onsearch-composition}

请使用 `onChange` 进行受控管理。`onSearch` 触发于搜索输入，与 `onChange` 时机不同。此外，点击选项时也不会触发 `onSearch` 事件。

相关 issue：[#18230](https://github.com/ant-design/ant-design/issues/18230) [#17916](https://github.com/ant-design/ant-design/issues/17916)

### 为何 options 为空时，受控 open 展开不会显示下拉菜单？ {#faq-empty-options-controlled-open}

AutoComplete 组件本质上是 Input 输入框的一种扩展，当 `options` 为空时，显示空文本会让用户误以为该组件不可操作，实际上它仍然可以进行文本输入操作。因此，为了避免给用户带来困惑，当 `options` 为空时，`open` 属性为 `true` 也不会展示下拉菜单，需要与 `options` 属性配合使用。
