---
category: Components
group: 数据展示
title: Carousel
subtitle: 走马灯
description: 一组轮播的区域。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*bPMSSqbaTMkAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a-58QpYnqOsAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---



## 何时使用 {#when-to-use}

- 当有一组平级的内容。
- 当内容空间不足时，可以用走马灯的形式进行收纳，进行轮播展现。
- 常用于一组图片或卡片轮播。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/placement.vue">位置</demo>
  <demo src="./demo/autoplay.vue">自动切换</demo>
  <demo src="./demo/fade.vue">渐显</demo>
  <demo src="./demo/arrows.vue">切换箭头</demo>
  <demo src="./demo/dot-duration.vue">进度条</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| effect | 动画效果函数 | CarouselEffect | `scrollx` | - |
| id | - | string | - | - |
| slickGoTo | - | number | - | - |
| dotPosition | 面板指示点位置，可选 `top` `bottom` `left` `right` `start` `end`，请使用 `dotPlacement` 替换 | DotPlacement \| 'left' \| 'right' | `bottom` | - |
| dotPlacement | 面板指示点位置，可选 `top` `bottom` `start` `end` | DotPlacement | `bottom` | - |
| dots | 是否显示面板指示点，如果为 `object` 则可以指定 `dotsClass` | boolean \| &#123; class?: string &#125; | true | - |
| waitForAnimate | 是否等待切换动画 | boolean | false | - |
| autoplay | 是否自动切换，如果为 object 可以指定 `dotDuration` 来展示指示点进度条 | boolean \| &#123; dotDuration?: boolean &#125; | false | - |
| prevArrow | - | VueNode | - | - |
| nextArrow | - | VueNode | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| init | - | NonNullable&lt;Settings['onInit']&gt; | - |
| reInit | - | NonNullable&lt;Settings['onReInit']&gt; | - |
| edge | - | NonNullable&lt;Settings['onEdge']&gt; | - |
| swipe | - | NonNullable&lt;Settings['onSwipe']&gt; | - |
| lazyLoad | - | NonNullable&lt;Settings['onLazyLoad']&gt; | - |
| lazyLoadError | - | NonNullable&lt;Settings['onLazyLoadError']&gt; | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| prevArrow | - | () =&gt; any | - |
| nextArrow | - | () =&gt; any | - |

### 方法 {#methods}

| 方法 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| goTo | - | (slide: number, dontAnimate?: boolean) =&gt; void | - |
| next | - | () =&gt; void | - |
| prev | - | () =&gt; void | - |
| autoPlay | - | (playType?: 'update' \| 'leave' \| 'blur') =&gt; void | - |
| innerSlider | - | any | - |

## 主题变量（Design Token）

<ComponentTokenTable component="Carousel" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。
