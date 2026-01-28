---
category: Components
group: Other
title: ConfigProvider
description: Provide a uniform configuration support for components.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NVKORa7BCVwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YC4ERpGAddoAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use

Provide global configuration for components, such as locale, direction, size, theme, or wave effect.

## Usage

This component provides a configuration to all Vue components underneath itself via provide/inject.

```vue
<template>
  <a-config-provider direction="rtl">
    <App />
  </a-config-provider>
</template>
```

### Content Security Policy {#csp}

Some components use dynamic style to support wave effect. You can config `csp` prop if Content Security Policy (CSP) is enabled:

```vue
<template>
  <a-config-provider :csp="{ nonce: 'YourNonceCode' }">
    <a-button>My Button</a-button>
  </a-config-provider>
</template>
```

## Examples

<demo-group>
  <demo src="./demo/locale.vue">Locale</demo>
  <demo src="./demo/direction.vue">Direction</demo>
  <demo src="./demo/size.vue">Component size</demo>
  <demo src="./demo/theme.vue">Theme</demo>
  <demo src="./demo/wave.vue">Custom Wave</demo>
  <demo src="./demo/holder-render.vue">Static function</demo>
  <demo src="./demo/use-config.vue">useConfig</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| componentDisabled | Config antd component `disabled` | boolean | - | - |
| componentSize | Config antd component size | `small` \| `middle` \| `large` | - | - |
| csp | Set [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) config | CSPConfig | - | - |
| direction | Set direction of layout. See [demo](#config-provider-demo-direction) | `ltr` \| `rtl` | `ltr` | - |
| getPopupContainer | To set the container of the popup element. The default is to create a `div` element in `body` | `(trigger?: HTMLElement) => HTMLElement \| ShadowRoot` | () => document.body | - |
| getTargetContainer | Config Affix, Anchor scroll target container | `() => HTMLElement \| Window \| ShadowRoot` | () => window | - |
| iconPrefixCls | Set icon prefix className | string | `anticon` | - |
| locale | Language package setting, you can find the packages in [antd/locale](http://unpkg.com/antd/locale/) | Locale | - | - |
| popupMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | - | - |
| popupOverflow | Select like component popup logic. Can set to show in viewport or follow window scroll | `viewport` \| `scroll` | `viewport` | - |
| prefixCls | Set prefix className | string | `ant` | - |
| renderEmpty | Set empty content of components. Ref [Empty](/components/empty/) | (componentName?: string) => VueNode | - | - |
| theme | Set theme, ref [Customize Theme](/docs/vue/customize-theme) | ThemeConfig | - | - |
| variant | Set variant of data entry components | `outlined` \| `filled` \| `borderless` \| `underlined` | - | - |
| virtual | Disable virtual scroll when set to `false` | boolean | - | - |
| warning | Config warning level, when `strict` is `false`, it will aggregate deprecated information into a single message | WarningContextProps | - | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| renderEmpty | Set empty content of components. Ref [Empty](/components/empty/) | (componentName?: string) => any | - |

### ConfigProvider.config() {#config}

Setting `Modal`, `Message`, `Notification` static config. Not work on hooks.

```ts
import { App, ConfigProvider } from 'antdv-next'
import { h } from 'vue'

ConfigProvider.config({
  holderRender: children => h(
    ConfigProvider,
    {
      prefixCls: 'ant',
      iconPrefixCls: 'anticon',
      theme: { token: { colorPrimary: 'red' } },
    },
    () => h(App, null, () => children),
  ),
})
```

### useConfig() {#useconfig}

Get the value of the parent `Provider`, such as `DisabledContextProvider`, `SizeContextProvider`.

```ts
import { useConfig } from 'antdv-next/config-provider/context'

const config = useConfig()
const { componentDisabled, componentSize } = config.value
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| componentDisabled | antd component disabled state | boolean | - | - |
| componentSize | antd component size state | `small` \| `middle` \| `large` | - | - |

### Component Config

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| affix | Set Affix common props | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| alert | Set Alert common props | &#123; class?: string, style?: CSSProperties, closeIcon?: VueNode, successIcon?: VueNode, infoIcon?: VueNode, warningIcon?: VueNode, errorIcon?: VueNode &#125; | - | - |
| anchor | Set Anchor common props | &#123; class?: string, style?: CSSProperties, classes?: [AnchorStyleConfig["classes"]](/components/anchor#semantic-dom), styles?: [AnchorStyleConfig["styles"]](/components/anchor#semantic-dom) &#125; | - | - |
| avatar | Set Avatar common props | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| badge | Set Badge common props | &#123; class?: string, style?: CSSProperties, classes?: [BadgeProps["classes"]](/components/badge#semantic-dom), styles?: [BadgeProps["styles"]](/components/badge#semantic-dom) &#125; | - | - |
| breadcrumb | Set Breadcrumb common props | &#123; class?: string, style?: CSSProperties, classes?: [BreadcrumbConfig["classes"]](/components/breadcrumb#semantic-dom), styles?: [BreadcrumbConfig["styles"]](/components/breadcrumb#semantic-dom), separator?: VueNode, dropdownIcon?: VueNode &#125; | - | - |
| button | Set Button common props | &#123; class?: string, style?: CSSProperties, classes?: [ButtonProps["classes"]](/components/button#semantic-dom), styles?: [ButtonProps["styles"]](/components/button#semantic-dom), autoInsertSpace?: boolean, variant?: ButtonVariantType, color?: ButtonColorType, shape?: [ButtonProps["shape"]](/components/button#api) &#125; | - | - |
| card | Set Card common props | &#123; class?: string, style?: CSSProperties, classes?: [CardProps["classes"]](/components/card#semantic-dom), styles?: [CardProps["styles"]](/components/card#semantic-dom) &#125; | - | - |
| cardMeta | Set Card.Meta common props | &#123; class?: string, style?: CSSProperties, classes?: [CardMetaProps["classes"]](/components/card#semantic-dom), styles?: [CardMetaProps["styles"]](/components/card#semantic-dom) &#125; | - | - |
| calendar | Set Calendar common props | &#123; class?: string, style?: CSSProperties, classes?: [CalendarConfig["classes"]](/components/calendar#semantic-dom), styles?: [CalendarConfig["styles"]](/components/calendar#semantic-dom) &#125; | - | - |
| carousel | Set Carousel common props | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| cascader | Set Cascader common props | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| checkbox | Set Checkbox common props | &#123; class?: string, style?: CSSProperties, classes?: [CheckboxConfig["classes"]](/components/checkbox#semantic-dom), styles?: [CheckboxConfig["styles"]](/components/checkbox#semantic-dom) &#125; | - | - |
| collapse | Set Collapse common props | &#123; class?: string, style?: CSSProperties, expandIcon?: (props) => VueNode, classes?: [CollapseProps["classes"]](/components/collapse#semantic-dom), styles?: [CollapseProps["styles"]](/components/collapse#semantic-dom) &#125; | - | - |
| colorPicker | Set ColorPicker common props | &#123; class?: string, style?: CSSProperties, classes?: [ColorPickerConfig["classes"]](/components/color-picker#semantic-dom), styles?: [ColorPickerConfig["styles"]](/components/color-picker#semantic-dom) &#125; | - | - |
| datePicker | Set DatePicker common props | &#123; class?: string, style?: CSSProperties, classes?: [DatePickerConfig["classes"]](/components/date-picker#semantic-dom), styles?: [DatePickerConfig["styles"]](/components/date-picker#semantic-dom) &#125; | - | - |
| rangePicker | Set RangePicker common props | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| descriptions | Set Descriptions common props | &#123; class?: string, style?: CSSProperties, classes?: [DescriptionsProps["classes"]](/components/descriptions#semantic-dom), styles?: [DescriptionsProps["styles"]](/components/descriptions#semantic-dom) &#125; | - | - |
| divider | Set Divider common props | &#123; class?: string, style?: CSSProperties, classes?: [DividerProps["classes"]](/components/divider#semantic-dom), styles?: [DividerProps["styles"]](/components/divider#semantic-dom) &#125; | - | - |
| drawer | Set Drawer common props | &#123; class?: string, style?: CSSProperties, classes?: [DrawerProps["classes"]](/components/drawer#semantic-dom), styles?: [DrawerProps["styles"]](/components/drawer#semantic-dom), closeIcon?: VueNode, closable?: [DrawerProps["closable"]](/components/drawer#api) &#125; | - | - |
| dropdown | Set Dropdown common props | &#123; class?: string, style?: CSSProperties, classes?: [DropdownConfig["classes"]](/components/dropdown#semantic-dom), styles?: [DropdownConfig["styles"]](/components/dropdown#semantic-dom) &#125; | - | - |
| empty | Set Empty common props | &#123; class?: string, style?: CSSProperties, classes?: [EmptyProps["classes"]](/components/empty#api), styles?: [EmptyProps["styles"]](/components/empty#api), image?: VueNode &#125; | - | - |
| flex | Set Flex common props | &#123; class?: string, style?: CSSProperties, vertical?: boolean &#125; | - | - |
| floatButton | Set FloatButton common props | &#123; class?: string, style?: CSSProperties, classes?: [FloatButtonProps["classes"]](/components/float-button#semantic-dom), styles?: [FloatButtonProps["styles"]](/components/float-button#semantic-dom), backTopIcon?: VueNode &#125; | - | - |
| floatButtonGroup | Set FloatButton.Group common props | &#123; closeIcon?: VueNode, class?: string, style?: CSSProperties, classes?: [FloatButtonProps["classes"]](/components/float-button#semantic-dom), styles?: [FloatButtonProps["styles"]](/components/float-button#semantic-dom) &#125; | - | - |
| form | Set Form common props | &#123; class?: string, style?: CSSProperties, validateMessages?: [ValidateMessages](/components/form#validatemessages), requiredMark?: boolean \| `optional`, scrollToFirstError?: boolean \| [Options](https://github.com/stipsan/scroll-into-view-if-needed/tree/ece40bd9143f48caf4b99503425ecb16b0ad8249#options), classes?: [FormConfig["classes"]](/components/form#semantic-dom), styles?: [FormConfig["styles"]](/components/form#semantic-dom) &#125; | - | - |
| image | Set Image common props | &#123; class?: string, style?: CSSProperties, preview?: &#123; closeIcon?: VueNode, classes?: [ImageConfig["classes"]](/components/image#semantic-dom), styles?: [ImageConfig["styles"]](/components/image#semantic-dom) &#125;, fallback?: string &#125; | - | - |
| input | Set Input common props | &#123; autoComplete?: string, class?: string, style?: CSSProperties, classes?: [InputConfig["classes"]](/components/input#semantic-input), styles?: [InputConfig["styles"]](/components/input#semantic-input), allowClear?: boolean \| &#123; clearIcon?: VueNode &#125; &#125; | - | - |
| inputNumber | Set InputNumber common props | &#123; class?: string, style?: CSSProperties, classes?: [InputNumberConfig["classes"]](/components/input-number#semantic-dom), styles?: [InputNumberConfig["styles"]](/components/input-number#semantic-dom) &#125; | - | - |
| otp | Set OTP common props | &#123; class?: string, style?: CSSProperties, classes?: [OTPConfig["classes"]](/components/input#semantic-otp), styles?: [OTPConfig["styles"]](/components/input#semantic-otp) &#125; | - | - |
| inputSearch | Set Search common props | &#123; class?: string, style?: CSSProperties, classes?: [InputSearchConfig["classes"]](/components/input#semantic-search), styles?: [InputSearchConfig["styles"]](/components/input#semantic-search) &#125; | - | - |
| textArea | Set TextArea common props | &#123; autoComplete?: string, class?: string, style?: CSSProperties, classes?: [TextAreaConfig["classes"]](/components/input#semantic-textarea), styles?: [TextAreaConfig["styles"]](/components/input#semantic-textarea), allowClear?: boolean \| &#123; clearIcon?: VueNode &#125; &#125; | - | - |
| layout | Set Layout common props | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| list | Set List common props | &#123; class?: string, style?: CSSProperties, item?: &#123; classes: [ListItemProps["classes"]](/components/list#listitem), styles: [ListItemProps["styles"]](/components/list#listitem) &#125; &#125; | - | - |
| masonry | Set Masonry common props | &#123; class?: string, style?: CSSProperties, classes?: [MasonryProps["classes"]](/components/masonry#semantic-dom), styles?: [MasonryProps["styles"]](/components/masonry#semantic-dom) &#125; | - | - |
| menu | Set Menu common props | &#123; class?: string, style?: CSSProperties, expandIcon?: VueNode \| (props) => VueNode &#125; | - | - |
| mentions | Set Mentions common props | &#123; class?: string, style?: CSSProperties, classes?: [MentionsConfig["classes"]](/components/mentions#semantic-dom), styles?: [MentionsConfig["styles"]](/components/mentions#semantic-dom) &#125; | - | - |
| message | Set Message common props | &#123; class?: string, style?: CSSProperties, classes?: [MessageConfig["classes"]](/components/message#semantic-dom), styles?: [MessageConfig["styles"]](/components/message#semantic-dom) &#125; | - | - |
| modal | Set Modal common props | &#123; class?: string, style?: CSSProperties, classes?: [ModalProps["classes"]](/components/modal#semantic-dom), styles?: [ModalProps["styles"]](/components/modal#semantic-dom), closeIcon?: VueNode &#125; | - | - |
| notification | Set Notification common props | &#123; class?: string, style?: CSSProperties, closeIcon?: VueNode, classes?: [NotificationConfig["classes"]](/components/notification#semantic-dom), styles?: [NotificationConfig["styles"]](/components/notification#semantic-dom) &#125; | - | - |
| pagination | Set Pagination common props | &#123; showSizeChanger?: boolean, totalBoundaryShowSizeChanger?: number, class?: string, style?: CSSProperties, classes?: [PaginationConfig["classes"]](/components/pagination#semantic-dom), styles?: [PaginationConfig["styles"]](/components/pagination#semantic-dom) &#125; | - | - |
| progress | Set Progress common props | &#123; class?: string, style?: CSSProperties, classes?: [ProgressConfig["classes"]](/components/progress#semantic-dom), styles?: [ProgressConfig["styles"]](/components/progress#semantic-dom) &#125; | - | - |
| radio | Set Radio common props | &#123; class?: string, style?: CSSProperties, classes?: [RadioConfig["classes"]](/components/radio#semantic-dom), styles?: [RadioConfig["styles"]](/components/radio#semantic-dom) &#125; | - | - |
| rate | Set Rate common props | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| result | Set Result common props | &#123; class?: string, style?: CSSProperties, classes?: [ResultProps["classes"]](/components/result#semantic-dom), styles?: [ResultProps["styles"]](/components/result#semantic-dom) &#125; | - | - |
| ribbon | Set Ribbon common props | &#123; class?: string, style?: CSSProperties, classes?: [RibbonProps["classes"]](/components/badge#semantic-dom), styles?: [RibbonProps["styles"]](/components/badge#semantic-dom) &#125; | - | - |
| skeleton | Set Skeleton common props | &#123; class?: string, style?: CSSProperties, classes?: [SkeletonProps["classes"]](/components/skeleton#semantic-dom), styles?: [SkeletonProps["styles"]](/components/skeleton#semantic-dom) &#125; | - | - |
| segmented | Set Segmented common props | &#123; class?: string, style?: CSSProperties, classes?: [SegmentedProps["classes"]](/components/segmented#semantic-dom), styles?: [SegmentedProps["styles"]](/components/segmented#semantic-dom) &#125; | - | - |
| select | Set Select common props | &#123; class?: string, showSearch?: boolean, style?: CSSProperties, classes?: [SelectConfig["classes"]](/components/select#semantic-dom), styles?: [SelectConfig["styles"]](/components/select#semantic-dom) &#125; | - | - |
| slider | Set Slider common props | &#123; class?: string, style?: CSSProperties, classes?: [SliderProps["classes"]](/components/slider#semantic-dom), styles?: [SliderProps["styles"]](/components/slider#semantic-dom) &#125; | - | - |
| switch | Set Switch common props | &#123; class?: string, style?: CSSProperties, classes?: [SwitchStyleConfig["classes"]](/components/switch#semantic-dom), styles?: [SwitchStyleConfig["styles"]](/components/switch#semantic-dom) &#125; | - | - |
| space | Set Space common props, ref [Space](/components/space) | &#123; size: `small` \| `middle` \| `large` \| `number`, class?: string, style?: CSSProperties, classes?: [SpaceProps["classes"]](/components/space#semantic-dom), styles?: [SpaceProps["styles"]](/components/space#semantic-dom) &#125; | - | - |
| splitter | Set Splitter common props | &#123; class?: string, style?: CSSProperties, classes?: [Splitter["classes"]](/components/splitter#semantic-dom), styles?: [Splitter["styles"]](/components/splitter#semantic-dom) &#125; | - | - |
| spin | Set Spin common props | &#123; class?: string, style?: CSSProperties, indicator?: VueNode, classes?: [SpinConfig["classes"]](/components/spin#semantic-dom), styles?: [SpinConfig["styles"]](/components/spin#semantic-dom) &#125; | - | - |
| statistic | Set Statistic common props | &#123; class?: string, style?: CSSProperties, classes?: [StatisticProps["classes"]](/components/statistic#semantic-dom), styles?: [StatisticProps["styles"]](/components/statistic#semantic-dom) &#125; | - | - |
| steps | Set Steps common props | &#123; class?: string, style?: CSSProperties, classes?: [StepsConfig["classes"]](/components/steps#semantic-dom), styles?: [StepsConfig["styles"]](/components/steps#semantic-dom) &#125; | - | - |
| table | Set Table common props | &#123; class?: string, style?: CSSProperties, expandable?: &#123; expandIcon?: props => VueNode &#125;, classes?: [TableProps["classes"]](/components/table#semantic-dom), styles?: [TableProps["styles"]](/components/table#semantic-dom) &#125; | - | - |
| tabs | Set Tabs common props | &#123; class?: string, style?: CSSProperties, indicator?: &#123; size?: GetIndicatorSize, align?: `start` \| `center` \| `end` &#125;, moreIcon?: VueNode, addIcon?: VueNode, removeIcon?: VueNode, classes?: [TabsConfig["classes"]](/components/tabs#semantic-dom), styles?: [TabsConfig["styles"]](/components/tabs#semantic-dom) &#125; | - | - |
| tag | Set Tag common props | &#123; class?: string, style?: CSSProperties, closeIcon?: VueNode, classes?: [TagProps["classes"]](/components/tag#semantic-dom), styles?: [TagProps["styles"]](/components/tag#semantic-dom) &#125; | - | - |
| timeline | Set Timeline common props | &#123; class?: string, style?: CSSProperties, classes?: [TimelineConfig["classes"]](/components/timeline#semantic-dom), styles?: [TimelineConfig["styles"]](/components/timeline#semantic-dom) &#125; | - | - |
| timePicker | Set TimePicker common props | &#123; class?: string, style?: CSSProperties, classes?: [TimePickerConfig["classes"]](/components/time-picker#semantic-dom), styles?: [TimePickerConfig["styles"]](/components/time-picker#semantic-dom) &#125; | - | - |
| tour | Set Tour common props | &#123; closeIcon?: VueNode, class?: string, style?: CSSProperties, classes?: [TourProps["classes"]](/components/tour#semantic-dom), styles?: [TourProps["styles"]](/components/tour#semantic-dom) &#125; | - | - |
| tooltip | Set Tooltip common props | &#123; class?: string, style?: CSSProperties, classes?: [Tooltip["classes"]](/components/tooltip#semantic-dom), styles?: [Tooltip["styles"]](/components/tooltip#semantic-dom), arrow: boolean \| &#123; pointAtCenter: boolean &#125;, unique?: boolean, trigger?: [Tooltip["trigger"]](/components/tooltip#api) &#125; | - | - |
| popover | Set Popover common props | &#123; class?: string, style?: CSSProperties, classes?: [Popover["classes"]](/components/popover#semantic-dom), styles?: [Popover["styles"]](/components/popover#semantic-dom), arrow: boolean \| &#123; pointAtCenter: boolean &#125;, trigger?: [Popover["trigger"]](/components/popover#api) &#125; | - | - |
| popconfirm | Set Popconfirm common props | &#123; class?: string, style?: CSSProperties, classes?: [Popconfirm["classes"]](/components/popconfirm#semantic-dom), styles?: [Popconfirm["styles"]](/components/popconfirm#semantic-dom), arrow: boolean \| &#123; pointAtCenter: boolean &#125;, trigger?: [Popconfirm["trigger"]](/components/popconfirm#api) &#125; | - | - |
| qrcode | Set QRCode common props | &#123; class?: string, style?: CSSProperties, classes?: [QRCode["classes"]](/components/qr-code#semantic-dom), styles?: [QRCode["styles"]](/components/qr-code#semantic-dom) &#125; | - | - |
| transfer | Set Transfer common props | &#123; class?: string, style?: CSSProperties, classes?: [TransferConfig["classes"]](/components/transfer#semantic-dom), styles?: [TransferConfig["styles"]](/components/transfer#semantic-dom), selectionsIcon?: VueNode &#125; | - | - |
| tree | Set Tree common props | &#123; class?: string, style?: CSSProperties, classes?: [TreeConfig["classes"]](/components/tree#semantic-dom), styles?: [TreeConfig["styles"]](/components/tree#semantic-dom) &#125; | - | - |
| treeSelect | Set TreeSelect common props | &#123; class?: string, style?: CSSProperties, classes?: [TreeSelectConfig["classes"]](/components/tree-select#semantic-dom), styles?: [TreeSelectConfig["styles"]](/components/tree-select#semantic-dom), switcherIcon?: [TreeSelect["switcherIcon"]](/components/tree-select#api) &#125; | - | - |
| typography | Set Typography common props | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| upload | Set Upload common props | &#123; class?: string, style?: CSSProperties, classes?: [UploadConfig["classes"]](/components/upload#semantic-dom), styles?: [UploadConfig["styles"]](/components/upload#semantic-dom), customRequest?: [Upload["customRequest"]](/components/upload#api) &#125; | - | - |
| wave | Config wave effect | &#123; disabled?: boolean, showEffect?: (node: HTMLElement, info: &#123; className, token, component &#125;) => void &#125; | - | - |

## FAQ

### How to contribute a new language? {#faq-add-locale}

See [Adding new language](/docs/vue/i18n).

### Date-related components locale is not working? {#faq-locale-not-work}

See FAQ [Date-related-components-locale-is-not-working?](/docs/vue/faq#date-related-components-locale-is-not-working)

### Modal throw error when setting `getPopupContainer`? {#faq-get-popup-container}

Related issue: <https://github.com/ant-design/ant-design/issues/19974>

When you config `getPopupContainer` to parentNode globally, Modal will throw error of `triggerNode is undefined` because it did not have a triggerNode. You can try the fix below.

```diff
 <ConfigProvider
-  getPopupContainer={triggerNode => triggerNode.parentNode}
+  getPopupContainer={node => {
+    if (node) {
+      return node.parentNode
+    }
+    return document.body
+  }}
 >
   <App />
 </ConfigProvider>
```

### Why can't ConfigProvider props (like `prefixCls` and `theme`) affect VueNode inside `message.info`, `notification.open`, `Modal.confirm`? {#faq-message-inherit}

Static methods create independent instances which cannot consume ConfigProvider context. Please prefer the hooks or App-provided instances.

### Locale is not working with Vite in production mode? {#faq-vite-locale-not-work}

Related issue: [#39045](https://github.com/ant-design/ant-design/issues/39045)

In production mode of Vite, default exports from cjs file should be used like this: `enUS.default`. So you can directly import locale from `es/` directory like `import enUS from 'antdv-next/es/locale/en_US'` to make dev and production have the same behavior.

### `prefixCls` priority(The former is covered by the latter) {#faq-prefixcls-priority}

1. ConfigProvider.config with prefixCls = prefix-1
2. ConfigProvider.config with holderRender (wraps ConfigProvider prefix-2)
3. message.config with prefixCls = prefix-3
