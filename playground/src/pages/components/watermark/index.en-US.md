---
category: Components
group: Feedback
title: Watermark
description: Add specific text or patterns to the page.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*wr1ISY50SyYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*duAQQbjHlHQAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
---

## When To Use {#when-to-use}

- Use when the page needs to be watermarked to identify the copyright.
- Suitable for preventing information theft.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/multi-line.vue">Multi-line watermark</demo>
  <demo src="./demo/image.vue">Image watermark</demo>
  <demo src="./demo/custom.vue">Custom configuration</demo>
  <demo src="./demo/portal.vue">Modal or Drawer</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| width | The width of the watermark, the default value of `content` is its own width | number | 120 | - |
| height | The height of the watermark, the default value of `content` is its own height | number | 64 | - |
| inherit | Pass the watermark to the pop-up component such as Modal, Drawer | boolean | true | - |
| rotate | When the watermark is drawn, the rotation angle, unit `°` | number | -22 | - |
| zIndex | The z-index of the appended watermark element | number | 9 | - |
| image | Image source, it is recommended to export 2x or 3x image, high priority (support base64 format) | string | - | - |
| content | Watermark text content | string \| string[] | - | - |
| font | Text style | [Font](#font) | [Font](#font) | - |
| gap | The spacing between watermarks | \[number, number\] | \[100, 100\] | - |
| offset | The offset of the watermark from the upper left corner of the container. The default is `gap/2` | \[number, number\] | \[gap\[0\]/2, gap\[1\]/2\] | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| remove | Callback when the watermark is removed by DOM mutation | () => void | - |

## Types {#types}

### Font {#font}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Font color | [CanvasFillStrokeStyles.fillStyle](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillStyle) | rgba(0,0,0,.15) | - |
| fontSize | Font size | number \| string | 16 | - |
| fontWeight | Font weight | `normal` \| `light` \| `weight` \| number | normal | - |
| fontFamily | Font family | string | sans-serif | - |
| fontStyle | Font style | `none` \| `normal` \| `italic` \| `oblique` | normal | - |
| textAlign | Specify the text alignment direction | [CanvasTextAlign](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/textAlign) | `center` | - |

## Design Token {#design-token}

<ComponentTokenTable component="Watermark"></ComponentTokenTable>

## FAQ

### Handle abnormal image watermarks {#faq-invalid-image}

When using an image watermark and the image loads abnormally, you can add `content` at the same time to prevent the watermark from becoming invalid.

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

### Why `overflow: hidden` style is added? {#faq-overflow-hidden}

Users can hide the watermark by setting the container height to 0 through the developer tool in previous versions. To avoid this situation, the container adds `overflow: hidden`. When the container height changes, the content is also hidden. You can override the style to modify this behavior:

```vue
<template>
  <a-watermark :style="{ overflow: 'visible' }" />
</template>
```
