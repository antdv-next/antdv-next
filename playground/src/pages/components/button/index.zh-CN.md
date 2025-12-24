---
title: Button
subtitle: 按钮
description: 按钮用于开始一个即时操作。
demo:
  cols: 2
---

<DocHeading :frontmatter></DocHeading>

## 何时使用 {#when-to-use}

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

在 Ant Design 中我们提供了五种按钮。

- 🔵 主按钮：用于主行动点，一个操作区域只能有一个主按钮。
- ⚪️ 默认按钮：用于没有主次之分的一组行动点。
- 😶 虚线按钮：常用于添加操作。
- 🔤 文本按钮：用于最次级的行动点。
- 🔗 链接按钮：一般用于链接，即导航至某位置。

以及四种状态属性与上面配合使用。

- ⚠️ 危险：删除/移动/修改权限等危险操作，一般需要二次确认。
- 👻 幽灵：用于背景色比较复杂的地方，常用在首页/产品页等展示场景。
- 🚫 禁用：行动点不可用的时候，一般需要文案解释。
- 🔃 加载中：用于异步操作等待反馈的时候，也可以避免多次提交。


## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">语法糖</demo>
  <demo src="./demo/color-variant.vue" version="5.21.0">颜色与变体</demo>
  <demo src="./demo/icon.vue">按钮图标</demo>
  <demo src="./demo/disabled.vue">不可用状态</demo>
  <demo src="./demo/loading.vue">加载中状态</demo>
  <demo src="./demo/ghost.vue">幽灵按钮</demo>
  <demo src="./demo/danger.vue">危险按钮</demo>
  <demo src="./demo/block.vue">Block 按钮</demo>
  <demo src="./demo/chinese-space.vue" version="5.17.0">移除两个汉字之间的空格</demo>
</demo-group>
