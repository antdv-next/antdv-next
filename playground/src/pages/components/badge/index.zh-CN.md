---
category: Components
title: Badge
subtitle: 徽标数
description: 图标右上角的圆形徽标数字。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*e0qITYqF394AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*v8EQT7KoGbcAAAAAAAAAAAAADrJ8AQ/original
group: 数据展示
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

一般出现在通知图标或头像的右上角，用于显示需要处理的消息条数，通过醒目视觉形式吸引用户注意力。

## 示例 {#examples}

<demo-group>
<demo src="./demo/basic.vue">基本</demo>
<demo src="./demo/no-wrapper.vue">独立使用</demo>
<demo src="./demo/overflow.vue">封顶数字</demo>
<demo src="./demo/dot.vue">讨嫌的小红点</demo>
<demo src="./demo/change.vue">动态</demo>
<demo src="./demo/link.vue">可点击</demo>
<demo src="./demo/offset.vue">位置偏移</demo>
<demo src="./demo/size.vue">大小</demo>
<demo src="./demo/status.vue">状态点</demo>
<demo src="./demo/colorful.vue">多彩徽标</demo>
<demo src="./demo/ribbon.vue">缎带</demo>
<demo src="./demo/style-class.vue" version="6.0.0">自定义语义结构的样式和类</demo>
<demo src="./demo/title.vue" debug>自定义标题</demo>
</demo-group>

## API

### 属性 {#props}

通用属性参考：[通用属性](/docs/vue/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| count | 展示的数字，大于 overflowCount 时显示为 `$&#123;overflowCount&#125;+`，为 0 时隐藏 | VueNode | - | - |
| showZero | 当数值为 0 时，是否展示 Badge | boolean | false | - |
| overflowCount | 展示封顶的数字值 | number | 99 | - |
| dot | 不展示数字，只有一个小红点 | boolean | false | - |
| scrollNumberPrefixCls | - | string | - | - |
| status | 设置 Badge 为状态点 | PresetStatusColorType | - | - |
| color | 自定义小圆点的颜色 | LiteralUnion&lt;PresetColorKey&gt; | - | - |
| text | 在设置了 `status` 的前提下有效，设置状态点的文本 | VueNode | - | - |
| size | 在设置了 `count` 的前提下有效，设置小圆点的大小 | 'default' \| 'small' | - | - |
| offset | 设置状态点的位置偏移 | [number \| string, number \| string] | - | - |
| title | 设置鼠标放在状态点上时显示的文字 | string | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | BadgeClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | BadgeStylesType | - | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| count | 展示的数字，大于 overflowCount 时显示为 `$&#123;overflowCount&#125;+`，为 0 时隐藏 | () =&gt; any | - |
| text | 在设置了 `status` 的前提下有效，设置状态点的文本 | () =&gt; any | - |

## 语义化 DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）

<ComponentTokenTable component="Badge" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
