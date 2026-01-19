---
category: Components
group: 数据展示
title: Tag
subtitle: 标签
description: 进行标记和分类的小标签。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_SBsSrKLg00AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JPNAQYrVkYkAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

<DocHeading></DocHeading>

## 何时使用 {#when-to-use}

- 用于标记事物的属性和维度。
- 进行分类。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/colorful.vue">多彩标签</demo>
  <demo src="./demo/control.vue">动态添加和删除</demo>
  <demo src="./demo/checkable.vue">可选择标签</demo>
  <demo src="./demo/icon.vue">图标按钮</demo>
  <demo src="./demo/status.vue">预设状态的标签</demo>
  <demo src="./demo/customize.vue">自定义关闭按钮</demo>
  <demo src="./demo/disabled.vue">禁用标签</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

### 属性 {#property}

通用属性参考：[通用属性](/docs/vue/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| checked | It is an absolute controlled component and has no uncontrolled mode.  .zh-cn 该组件为完全受控组件，不支持非受控用法。 | boolean | - | - |
| icon | 设置图标 | VueNode | - | - |
| disabled | 是否禁用标签 | boolean | false | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| close | 关闭时的回调（可通过 `e.preventDefault()` 来阻止默认行为） | (e: MouseEvent) =&gt; void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| icon | 设置图标 | () =&gt; any | - |
| closeIcon | 自定义关闭按钮。5.7.0：设置为 `null` 或 `false` 时隐藏关闭按钮 | () =&gt; any | - |
