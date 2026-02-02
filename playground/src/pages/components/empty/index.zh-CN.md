---
category: Components
group: 数据展示
title: Empty
subtitle: 空状态
description: 空状态时的展示占位图。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ZdiZSLzEV0wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*obM7S5lIxeMAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

- 当目前没有数据时，用于显式的用户提示。
- 初始化场景时的引导创建。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/simple.vue">选择图片</demo>
  <demo src="./demo/customize.vue">自定义</demo>
  <demo src="./demo/config-provider.vue">ConfigProvider</demo>
  <demo src="./demo/style-class.vue" version="6.0.0">自定义语义化结构样式</demo>
  <demo src="./demo/description.vue">无描述</demo>
</demo-group>

## API

### 属性 {#props}

通用属性参考：[通用属性](/docs/vue/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | EmptyClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | EmptyStylesType | - | - |
| image | 设置显示图片，为 string 时表示自定义图片地址。 | VueNode | `Empty.PRESENTED_IMAGE_DEFAULT` | - |
| description | 自定义描述内容 | VueNode | - | - |
| rootClass | 根元素 class | string | - | - |
| prefixCls | 类名前缀 | string | - | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| image | 设置显示图片，为 string 时表示自定义图片地址。 | () => any | - |
| description | 自定义描述内容 | () => any | - |
| default | 底部操作区域内容 | () => any | - |

## 内置图片 {#built-in-images}

- Empty.PRESENTED_IMAGE_SIMPLE

  <div class="site-empty-buildIn-img site-empty-buildIn-simple"></div>

- Empty.PRESENTED_IMAGE_DEFAULT

  <div class="site-empty-buildIn-img site-empty-buildIn-default"></div>

<style>
  .site-empty-buildIn-img {
    background-repeat: no-repeat;
    background-size: contain;
  }
  .site-empty-buildIn-simple {
    width: 55px;
    height: 35px;
    background-image: url("https://user-images.githubusercontent.com/507615/54591679-b0ceb580-4a65-11e9-925c-ad15b4eae93d.png");
  }
  .site-empty-buildIn-default {
    width: 121px;
    height: 116px;
    background-image: url("https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png");
  }
</style>

## 语义化结构 {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 设计变量 {#design-token}

<ComponentTokenTable component="Empty"></ComponentTokenTable>

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用 Design Token。
