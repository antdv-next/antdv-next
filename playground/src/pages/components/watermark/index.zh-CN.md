---
category: Components
group: 反馈
title: Watermark
subtitle: 水印
description: 给页面的某个区域加上水印。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*wr1ISY50SyYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*duAQQbjHlHQAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
---

## 何时使用 {#when-to-use}

- 页面需要添加水印标识版权时使用。
- 适用于防止信息盗用。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/multi-line.vue">多行水印</demo>
  <demo src="./demo/image.vue">图片水印</demo>
  <demo src="./demo/custom.vue">自定义配置</demo>
  <demo src="./demo/portal.vue">Modal 与 Drawer</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| width | 水印的宽度，`content` 的默认值为自身的宽度 | number | 120 |  |
| height | 水印的高度，`content` 的默认值为自身的高度 | number | 64 |  |
| inherit | 是否将水印传导给弹出组件如 Modal、Drawer | boolean | true | - |
| rotate | 水印绘制时，旋转的角度，单位 `°` | number | -22 |  |
| zIndex | 追加的水印元素的 z-index | number | 9 |  |
| image | 图片源，建议导出 2 倍或 3 倍图，优先级高 (支持 base64 格式) | string | - |  |
| content | 水印文字内容 | string \| string[] | - |  |
| font | 文字样式 | [Font](#font) | [Font](#font) |  |
| gap | 水印之间的间距 | \[number, number\] | \[100, 100\] |  |
| offset | 水印距离容器左上角的偏移量，默认为 `gap/2` | \[number, number\] | \[gap\[0\]/2, gap\[1\]/2\] |  |

### 事件 {#events}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| remove | 水印因 DOM 变更被移除时触发的回调 | `() => void` | - | - |

## 类型 {#types}

### Font {#font}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| color | 字体颜色 | [CanvasFillStrokeStyles.fillStyle](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillStyle) | rgba(0,0,0,.15) | - |
| fontSize | 字体大小 | number \| string | 16 | - |
| fontWeight | 字体粗细 | `normal` \| `light` \| `weight` \| number | normal | - |
| fontFamily | 字体类型 | string | sans-serif | - |
| fontStyle | 字体样式 | `none` \| `normal` \| `italic` \| `oblique` | normal | - |
| textAlign | 指定文本对齐方向 | [CanvasTextAlign](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/textAlign) | `center` | - |

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Watermark"></ComponentTokenTable>

## FAQ

### 处理异常图片水印 {#faq-invalid-image}

当使用图片水印且图片加载异常时，可以同时添加 `content` 防止水印失效。

```vue
<template>
  <a-watermark
    :height="30"
    :width="130"
    content="Antdv Next"
    image="https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*lkAoRbywo0oAAAAAAAAAAAAADrJ8AQ/original"
  >
    <div style="height: 500px" />
  </a-watermark>
</template>
```

### 为什么添加了 `overflow: hidden` 样式？ {#faq-overflow-hidden}

在之前版本，用户可以通过开发者工具将容器高度设置为 0 来隐藏水印，为了避免这种情况，我们在容器上添加了 `overflow: hidden` 样式。当容器高度变化时，内容也一同被隐藏。你可以通过覆盖样式来修改这个行为：

```vue
<template>
  <a-watermark style="overflow: visible" />
</template>
```
