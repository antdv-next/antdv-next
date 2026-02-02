---
category: Components
group: 数据录入
title: Mentions
subtitle: 提及
description: 用于在输入中提及某人或某事。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*e4bXT7Uhi9YAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*pxR2S53P_xoAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

用于在输入中提及某人或某事，常用于发布、聊天或评论功能。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本使用</demo>
  <demo src="./demo/size.vue">尺寸</demo>
  <demo src="./demo/variant.vue">形态变体</demo>
  <demo src="./demo/async.vue">异步加载</demo>
  <demo src="./demo/form.vue">配合 Form 使用</demo>
  <demo src="./demo/prefix.vue">自定义触发字符</demo>
  <demo src="./demo/readonly.vue">无效或只读</demo>
  <demo src="./demo/placement.vue">向上展开</demo>
  <demo src="./demo/allow-clear.vue">带移除图标</demo>
  <demo src="./demo/auto-size.vue">自动大小</demo>
  <demo src="./demo/status.vue">自定义状态</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| loading | - | boolean | - | - |
| status | 设置校验状态 | InputStatus | - | - |
| options | 选项配置 | MentionsOptionProps[] | [] | - |
| popupClassName | - | string | - | - |
| variant | 形态变体 | Variant | `outlined` | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | MentionsClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | MentionsStylesType | - | - |
| size | - | SizeType | - | - |
| labelRender | - | (ctx: &#123; option: MentionsOptionProps, index: number &#125;) =&gt; any | - | - |
| allowClear | 可以点击清除图标删除内容 | boolean \| &#123;     clearIcon?: VueNode   &#125; | false | - |
| disabled | - | boolean | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| focus | 获得焦点时触发 | (event: FocusEvent) =&gt; void | - |
| blur | 失去焦点时触发 | (event: FocusEvent) =&gt; void | - |
| change | 值改变时触发 | (value: string) =&gt; void | - |
| select | 选择选项时触发 | (option: MentionsOptionProps, prefix: string) =&gt; void | - |
| popupScroll | 滚动时触发 | (event: Event) =&gt; void | - |
| search | 搜索时触发 | (text: string, prefix: string) =&gt; void | - |
| update:value | - | (value: string) =&gt; void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| suffix | - | () =&gt; any | - |
| labelRender | - | (ctx: &#123; option: MentionsOptionProps, index: number &#125;) =&gt; any | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）

<ComponentTokenTable component="Mentions" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
