---
group: 反馈
category: Components
title: Result
subtitle: 结果
description: 用于反馈一系列操作任务的处理结果。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-e2IRroDJyEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-0kxQrbHx2kAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

当有重要操作需告知用户处理结果，且反馈内容较为复杂时使用。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/success.vue">Success</demo>
  <demo src="./demo/info.vue">Info</demo>
  <demo src="./demo/warning.vue">Warning</demo>
  <demo src="./demo/403.vue">403</demo>
  <demo src="./demo/404.vue">404</demo>
  <demo src="./demo/500.vue">500</demo>
  <demo src="./demo/error.vue">Error</demo>
  <demo src="./demo/customIcon.vue">自定义 icon</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 自定义组件内部各语义化结构的类名。支持对象或函数 | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - |  |
| extra | 操作区 | VueNode | - |  |
| icon | 自定义 icon | VueNode | - |  |
| status | 结果的状态，决定图标和颜色 | `success` \| `error` \| `info` \| `warning` \| `404` \| `403` \| `500` | `info` |
| styles | 自定义组件内部各语义化结构的内联样式。支持对象或函数 | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  |
| subTitle | subTitle 文字 | VueNode | - |  |
| title | title 文字 | VueNode | - |  |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| icon | 自定义 icon | () =&gt; any | - |
| title | title 文字 | () =&gt; any | - |
| subTitle | subTitle 文字 | () =&gt; any | - |
| extra | 操作区 | () =&gt; any | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Result"></ComponentTokenTable>
