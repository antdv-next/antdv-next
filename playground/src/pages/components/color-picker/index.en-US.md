---
category: Components
title: ColorPicker
description: Used for color selection.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*PpY4RYNM8UcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EHL-QYJofZsAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
group:
  title: Data Entry
---

## When To Use {#when-to-use}

Used when the user needs to make a customized color selection.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic Usage</demo>
  <demo src="./demo/size.vue">Trigger size</demo>
  <demo src="./demo/controlled.vue">controlled mode</demo>
  <demo src="./demo/line-gradient.vue">Line Gradient</demo>
  <demo src="./demo/text-render.vue">Rendering Trigger Text</demo>
  <demo src="./demo/disabled.vue">Disable</demo>
  <demo src="./demo/disabled-alpha.vue">Disabled Alpha</demo>
  <demo src="./demo/allow-clear.vue">Clear Color</demo>
  <demo src="./demo/trigger.vue">Custom Trigger</demo>
  <demo src="./demo/trigger-event.vue">Custom Trigger Event</demo>
  <demo src="./demo/format.vue">Color Format</demo>
  <demo src="./demo/presets.vue">Preset Colors</demo>
  <demo src="./demo/panel-render.vue">Custom Render Panel</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Allow clearing color selected | boolean | false | - |
| arrow | Configuration for popup arrow | boolean \| &#123; pointAtCenter: boolean &#125; | true | - |
| autoAdjustOverflow | Auto adjust placement when popup is invisible | boolean \| AdjustOverflow | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | ColorPickerClassNamesType | - | - |
| defaultFormat | Default format of color | ColorFormatType | `hex` | - |
| defaultValue | Default value of color | [ColorValueType](#colorvaluetype) | - | - |
| destroyOnHidden | Whether destroy dom when close | boolean | false | - |
| disabled | Disable ColorPicker | boolean | false | - |
| disabledAlpha | Disable Alpha | boolean | false | - |
| disabledFormat | Disable format of color | boolean | false | - |
| format | Format of color, support `v-model:format` | ColorFormatType | - | - |
| getPopupContainer | Specify container for popup | (triggerNode: HTMLElement) => HTMLElement | - | - |
| mode | Configure single or gradient color | ModeType \| ModeType[] | `single` | - |
| open | Whether to show popup, support `v-model:open` | boolean | - | - |
| placement | Placement of popup | TriggerPlacement | `bottomLeft` | - |
| presets | Preset colors | [PresetsItem](#presetsitem)[] | - | - |
| panelRender | Custom Render Panel | (params: &#123; panel: any, extra: &#123; components: &#123; Picker: any, Presets: any &#125; &#125; &#125;) => any | - | - |
| rootClass | Root container class | string | - | - |
| showText | Show color text | boolean \| ((params: &#123; color: Color &#125;) => any) | false | - |
| size | Setting the trigger size | SizeType | `middle` | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | ColorPickerStylesType | - | - |
| trigger | ColorPicker trigger mode | TriggerType | `click` | - |
| value | Value of color, support `v-model:value` | [ColorValueType](#colorvaluetype) | - | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback when `value` is changed | (value: Color, css: string) => void | - |
| clear | Called when clear | () => void | - |
| changeComplete | Called when color pick ends | (value: Color) => void | - |
| openChange | Callback when `open` is changed | (open: boolean) => void | - |
| formatChange | Callback when `format` is changed | (format?: ColorFormatType) => void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Trigger content | () => any | - |
| panelRender | Custom Render Panel | (params: &#123; panel: any, extra: &#123; components: &#123; Picker: any, Presets: any &#125; &#125; &#125;) => any | - |
| showText | Custom text rendering | (params: &#123; color: Color &#125;) => any | - |

## Types

#### ColorValueType

```ts
type ColorValueType
  = | string
    | Color
    | { color: string | Color, percent: number }[]
    | null
```

#### PresetsItem

```ts
interface PresetsItem {
  label: VueNode
  colors: ColorValueType[]
  defaultOpen?: boolean
  key?: Key
}
```

### Color

| Property | Description | Type | Version |
| --- | --- | --- | --- |
| toCssString | Convert to CSS support format | () => string | - |
| toHex | Convert to `hex` format characters, the return type like: `1677ff` | () => string | - |
| toHexString | Convert to `hex` format color string, the return type like: `#1677ff` | () => string | - |
| toHsb | Convert to `hsb` object | () => &#123; h: number, s: number, b: number, a: number &#125; | - |
| toHsbString | Convert to `hsb` format color string, the return type like: `hsb(215, 91%, 100%)` | () => string | - |
| toRgb | Convert to `rgb` object | () => &#123; r: number, g: number, b: number, a: number &#125; | - |
| toRgbString | Convert to `rgb` format color string, the return type like: `rgb(22, 119, 255)` | () => string | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="ColorPicker"></ComponentTokenTable>

## FAQ

### Questions about color assignment {#faq-color-assignment}

The value of the color selector supports both string color values and selector-generated `Color` objects. However, since there is a precision error when converting color strings of different formats to each other, it is recommended to use selector-generated `Color` objects for assignment operations in controlled scenarios, so that the precision problem can be avoided and the values are guaranteed to be accurate and the selector can work as expected.
