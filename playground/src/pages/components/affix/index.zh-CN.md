---
category: Components
title: Affix
subtitle: 固钉
description: 将页面元素钉在可视范围。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
group:
  title: 其他
  order: 7
---



## 何时使用 {#when-to-use}

当内容区域比较长，需要滚动页面时，这部分内容对应的操作或者导航需要在滚动范围内始终展现。常用于侧边菜单和按钮组合。

页面可视范围过小时，慎用此功能以免出现遮挡页面内容的情况。当页面内容较长，希望某个元素始终在可视区域内时，可以使用 Affix 固钉组件。

## 代码演示 {#examples}

<demo-group>
    <demo src="./demo/basic.vue">基本</demo>
    <demo src="./demo/on-change.vue">固定状态改变的回调</demo>
    <demo src="./demo/target.vue">滚动容器</demo>
</demo-group>

## API

### 属性 {#props}

通用属性参考：[通用属性](/docs/vue/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| offsetTop | 距离窗口顶部达到指定偏移量后触发 | number | 0 | - |
| offsetBottom | 距离窗口底部达到指定偏移量后触发 | number | - | - |
| target | 设置 `Affix` 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 | () =&gt; Window \| HTMLElement \| null | () =&gt; window | - |

### 事件 {#events}

| 事件名 | 说明 | 类型 | 版本 |
| ----- | --- | --- | --- |
| change | 固定状态改变时触发的回调函数 | (affixed?: boolean) =&gt; void | - |

### 方法 {#methods}

| 方法 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| updatePosition | - | ReturnType&lt;typeof throttleByAnimationFrame&gt; | - |

**注意：**`Affix` 内的元素不要使用绝对定位，如需要绝对定位的效果，可以直接设置 `Affix` 为绝对定位：

```html
<a-affix style="position: absolute;top: y; left: x">...</a-affix>
```

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Affix"></ComponentTokenTable>

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。

## FAQ

### Affix 使用 `target` 绑定容器时，元素会跑到容器外。 {#faq-target-container}

从性能角度考虑，我们只监听容器滚动事件。如果希望任意滚动，你可以在窗体添加滚动监听：<https://codesandbox.io/s/stupefied-maxwell-ophqnm?file=/index.js>

相关 issue：[#3938](https://github.com/ant-design/ant-design/issues/3938) [#5642](https://github.com/ant-design/ant-design/issues/5642) [#16120](https://github.com/ant-design/ant-design/issues/16120)

### Affix 在水平滚动容器中使用时， 元素 `left` 位置不正确。 {#faq-horizontal-scroll}

Affix 一般只适用于单向滚动的区域，只支持在垂直滚动容器中使用。如果希望在水平容器中使用，你可以考虑使用 原生 `position: sticky` 实现。

相关 issue: [#29108](https://github.com/ant-design/ant-design/issues/29108)
