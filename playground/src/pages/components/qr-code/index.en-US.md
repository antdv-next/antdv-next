---
category: Components
title: QRCode
description: Components that can convert text into QR codes, and support custom color and logo.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*cJopQrf0ncwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*M4PBTZ_n9OgAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
group:
  title: Data Display
  order: 5
---

## When To Use

Used when the text needs to be converted into a QR Code.

## Examples

<!-- prettier-ignore -->
<demo src="./demo/base.vue">base</demo>
<demo src="./demo/icon.vue">With Icon</demo>
<demo src="./demo/status.vue">other status</demo>
<demo src="./demo/customStatusRender.vue" version="5.20.0">custom status render</demo>
<demo src="./demo/type.vue">Custom Render Type</demo>
<demo src="./demo/customSize.vue">Custom Size</demo>
<demo src="./demo/customColor.vue">Custom Color</demo>
<demo src="./demo/download.vue">Download QRCode</demo>
<demo src="./demo/errorLevel.vue">Error Level</demo>
<demo src="./demo/Popover.vue">Advanced Usage</demo>
<!-- <demo src="./demo/style-class.vue" version="6.0.0">Custom semantic dom styling</demo> -->

## API

### Props

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| value | scanned text | string \| string[] | - | - |
| type | render type | `canvas` \| `svg` | `canvas` | - |
| icon | include image url (only image link are supported) | string | - | - |
| size | QRCode size | number | 160 | - |
| iconSize | include image size | number \| &#123; width: number; height: number &#125; | 40 | - |
| color | QRCode Color | string | `#000` | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| bgColor | QRCode Background Color | string | `transparent` | - |
| marginSize | Quiet zone size (in modules). `0` means no margin | number | `0` | - |
| bordered | Whether has border style | boolean | `true` | - |
| errorLevel | Error Code Level | `'L'` \| `'M'` \| `'Q'` \| `'H'` | `'M'` | - |
| boostLevel | If enabled, the Error Correction Level of the result may be higher than the specified Error Correction Level | boolean | true | - |
| status | QRCode status | `'active'` \| `'expired'` \| `'loading'` \| `'scanned'` | `'active'` | - |
| statusRender | custom status render | (info: StatusRenderInfo) =&gt; VueNode | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| refresh | Refresh the QR code | () =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| statusRender | custom status render | (info: StatusRenderInfo) =&gt; any | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="QRCode"></ComponentTokenTable>

## FAQ

### About QRCode ErrorLevel {#faq-error-correction-level}

The ErrorLevel means that the QR code can be scanned normally after being blocked, and the maximum area that can be blocked is the error correction rate.

Generally, the QR code is divided into 4 error correction levels: Level `L` can correct about `7%` errors, Level `M` can correct about `15%` errors, Level `Q` can correct about `25%` errors, and Level `H` can correct about `30%` errors. When the content encoding of the QR code carries less information, in other words, when the value link is short, set different error correction levels, and the generated image will not change.

> For more information, see the: [https://www.qrcode.com/en/about/error_correction](https://www.qrcode.com/en/about/error_correction.html)

### ⚠️⚠️⚠️ Cannot scan the QR code? {#faq-cannot-scan}

If the QR code cannot be scanned for identification, it may be because the link address is too long, which leads to too dense pixels.

You can configure the QR code to be larger through size, or shorten the link through short link services.
