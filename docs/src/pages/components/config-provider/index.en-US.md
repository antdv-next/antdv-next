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

Setting `Modal`, `Message`, `Notification` static config. Does not work on hooks.

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

The following config keys set common props for corresponding components or global effects. See the related APIs for details:

- `alert`: [Alert](/components/alert#api)
- `anchor`: [Anchor](/components/anchor#api)
- `app`: [App](/components/app#api)
- `avatar`: [Avatar](/components/avatar#api)
- `badge`: [Badge](/components/badge#api)
- `borderBeam`: [BorderBeam](/components/border-beam#api)
- `breadcrumb`: [Breadcrumb](/components/breadcrumb#api)
- `button`: [Button](/components/button#api)
- `calendar`: [Calendar](/components/calendar#api)
- `card`: [Card](/components/card#api)
- `cardMeta`: [Card.Meta](/components/card#cardmeta)
- `carousel`: [Carousel](/components/carousel#api)
- `cascader`: [Cascader](/components/cascader#api)
- `checkbox`: [Checkbox](/components/checkbox#api)
- `collapse`: [Collapse](/components/collapse#api)
- `colorPicker`: [ColorPicker](/components/color-picker#api)
- `datePicker`: [DatePicker](/components/date-picker#api)
- `descriptions`: [Descriptions](/components/descriptions#api)
- `divider`: [Divider](/components/divider#api)
- `drawer`: [Drawer](/components/drawer#api)
- `dropdown`: [Dropdown](/components/dropdown#api)
- `empty`: [Empty](/components/empty#api)
- `flex`: [Flex](/components/flex#api)
- `floatButton`: [FloatButton](/components/float-button#api)
- `floatButtonGroup`: [FloatButton.Group](/components/float-button#floatbuttongroup)
- `form`: [Form](/components/form#api)
- `image`: [Image](/components/image#api)
- `input`: [Input](/components/input#input)
- `inputNumber`: [InputNumber](/components/input-number#api)
- `inputSearch`: [Input.Search](/components/input#input-search)
- `layout`: [Layout](/components/layout#api)
- `masonry`: [Masonry](/components/masonry#api)
- `mentions`: [Mentions](/components/mentions#api)
- `menu`: [Menu](/components/menu#api)
- `message`: [Message](/components/message#api)
- `modal`: [Modal](/components/modal#api)
- `notification`: [Notification](/components/notification#api)
- `otp`: [Input.OTP](/components/input#input-otp)
- `pagination`: [Pagination](/components/pagination#api)
- `popconfirm`: [Popconfirm](/components/popconfirm#api)
- `popover`: [Popover](/components/popover#api)
- `progress`: [Progress](/components/progress#api)
- `qrcode`: [QRCode](/components/qr-code#api)
- `radio`: [Radio](/components/radio#api)
- `rangePicker`: [RangePicker](/components/date-picker#rangepicker)
- `rate`: [Rate](/components/rate#api)
- `result`: [Result](/components/result#api)
- `ribbon`: [Badge.Ribbon](/components/badge#api)
- `segmented`: [Segmented](/components/segmented#api)
- `select`: [Select](/components/select#api)
- `skeleton`: [Skeleton](/components/skeleton#api)
- `slider`: [Slider](/components/slider#api)
- `space`: [Space](/components/space#api)
- `spin`: [Spin](/components/spin#api)
- `splitter`: [Splitter](/components/splitter#api)
- `statistic`: [Statistic](/components/statistic#api)
- `steps`: [Steps](/components/steps#api)
- `switch`: [Switch](/components/switch#api)
- `table`: [Table](/components/table#api)
- `tabs`: [Tabs](/components/tabs#api)
- `tag`: [Tag](/components/tag#api)
- `textArea`: [Input.TextArea](/components/input#input-textarea)
- `timeline`: [Timeline](/components/timeline#api)
- `timePicker`: [TimePicker](/components/time-picker#api)
- `tooltip`: [Tooltip](/components/tooltip#api)
- `tour`: [Tour](/components/tour#api)
- `transfer`: [Transfer](/components/transfer#api)
- `tree`: [Tree](/components/tree#api)
- `treeSelect`: [TreeSelect](/components/tree-select#api)
- `typography`: [Typography](/components/typography#api)
- `upload`: [Upload](/components/upload#api)
- `wave`: [WaveConfig](#api)

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
