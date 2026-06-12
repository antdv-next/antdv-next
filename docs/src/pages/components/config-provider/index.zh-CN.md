---
category: Components
subtitle: 全局化配置
group: 其他
title: ConfigProvider
description: 为组件提供统一的全局化配置。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NVKORa7BCVwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YC4ERpGAddoAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

为应用内组件提供统一配置，例如国际化、方向、尺寸、主题或波纹效果。

## 使用 {#usage}

ConfigProvider 使用 Vue 的 provide/inject 特性，只需在应用外围包裹一次即可全局生效。

```vue
<template>
  <a-config-provider direction="rtl">
    <App />
  </a-config-provider>
</template>
```

### 内容安全策略（CSP）{#csp}

部分组件为了支持波纹效果，使用了动态样式。如果开启了 Content Security Policy (CSP)，你可以通过 `csp` 属性来进行配置：

```vue
<template>
  <a-config-provider :csp="{ nonce: 'YourNonceCode' }">
    <a-button>My Button</a-button>
  </a-config-provider>
</template>
```

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/locale.vue">国际化</demo>
  <demo src="./demo/direction.vue">方向</demo>
  <demo src="./demo/size.vue">组件尺寸</demo>
  <demo src="./demo/theme.vue">主题</demo>
  <demo src="./demo/wave.vue">自定义波纹</demo>
  <demo src="./demo/holder-render.vue">静态方法</demo>
  <demo src="./demo/use-config.vue">获取配置</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| componentDisabled | 设置 antd 组件禁用状态 | boolean | - | - |
| componentSize | 设置 antd 组件大小 | `small` \| `middle` \| `large` | - | - |
| csp | 设置 [Content Security Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP) 配置 | CSPConfig | - | - |
| direction | 设置文本展示方向。 [示例](#config-provider-demo-direction) | `ltr` \| `rtl` | `ltr` | - |
| getPopupContainer | 弹出框（Select, Tooltip, Menu 等等）渲染父节点，默认渲染到 body 上。 | `(trigger?: HTMLElement) => HTMLElement \| ShadowRoot` | () => document.body | - |
| getTargetContainer | 配置 Affix、Anchor 滚动监听容器。 | `() => HTMLElement \| Window \| ShadowRoot` | () => window | - |
| iconPrefixCls | 设置图标统一样式前缀 | string | `anticon` | - |
| locale | 语言包配置，语言包可到 [antd/locale](http://unpkg.com/antd/locale/) 目录下寻找 | Locale | - | - |
| popupMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。`false` 时会关闭虚拟滚动 | boolean \| number | - | - |
| popupOverflow | Select 类组件弹层展示逻辑，默认为可视区域滚动，可配置成滚动区域滚动 | `viewport` \| `scroll` | `viewport` | - |
| prefixCls | 设置统一样式前缀 | string | `ant` | - |
| renderEmpty | 自定义组件空状态。参考 [空状态](/components/empty-cn) | (componentName?: string) => VueNode | - | - |
| theme | 设置主题，参考 [定制主题](/docs/vue/customize-theme) | ThemeConfig | - | - |
| variant | 设置全局输入组件形态变体 | `outlined` \| `filled` \| `borderless` \| `underlined` | - | - |
| virtual | 设置 `false` 时关闭虚拟滚动 | boolean | - | - |
| warning | 设置警告等级，`strict` 为 `false` 时会将废弃相关信息聚合为单条信息 | WarningContextProps | - | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| renderEmpty | 自定义组件空状态。参考 [空状态](/components/empty-cn) | (componentName?: string) => any | - |

### ConfigProvider.config() {#config}

设置 `Modal`、`Message`、`Notification` 静态方法配置，只会对非 hooks 的静态方法调用生效。

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

获取父级 `Provider` 的值，如 `DisabledContextProvider`、`SizeContextProvider`。

```ts
import { useConfig } from 'antdv-next/config-provider/context'

const config = useConfig()
const { componentDisabled, componentSize } = config.value
```

| 返回值 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| componentDisabled | antd 组件禁用状态 | boolean | - | - |
| componentSize | antd 组件大小状态 | `small` \| `middle` \| `large` | - | - |

### 组件配置 {#component-config}

以下配置项用于设置对应组件的通用属性或全局效果配置，具体 API 见链接：

- `alert`：[Alert](/components/alert-cn#api)
- `anchor`：[Anchor](/components/anchor-cn#api)
- `app`：[App](/components/app-cn#api)
- `avatar`：[Avatar](/components/avatar-cn#api)
- `badge`：[Badge](/components/badge-cn#api)
- `borderBeam`：[BorderBeam](/components/border-beam-cn#api)
- `breadcrumb`：[Breadcrumb](/components/breadcrumb-cn#api)
- `button`：[Button](/components/button-cn#api)
- `calendar`：[Calendar](/components/calendar-cn#api)
- `card`：[Card](/components/card-cn#api)
- `cardMeta`：[Card.Meta](/components/card-cn#cardmeta)
- `carousel`：[Carousel](/components/carousel-cn#api)
- `cascader`：[Cascader](/components/cascader-cn#api)
- `checkbox`：[Checkbox](/components/checkbox-cn#api)
- `collapse`：[Collapse](/components/collapse-cn#api)
- `colorPicker`：[ColorPicker](/components/color-picker-cn#api)
- `datePicker`：[DatePicker](/components/date-picker-cn#api)
- `descriptions`：[Descriptions](/components/descriptions-cn#api)
- `divider`：[Divider](/components/divider-cn#api)
- `drawer`：[Drawer](/components/drawer-cn#api)
- `dropdown`：[Dropdown](/components/dropdown-cn#api)
- `empty`：[Empty](/components/empty-cn#api)
- `flex`：[Flex](/components/flex-cn#api)
- `floatButton`：[FloatButton](/components/float-button-cn#api)
- `floatButtonGroup`：[FloatButton.Group](/components/float-button-cn#floatbuttongroup)
- `form`：[Form](/components/form-cn#api)
- `image`：[Image](/components/image-cn#api)
- `input`：[Input](/components/input-cn#input)
- `inputNumber`：[InputNumber](/components/input-number-cn#api)
- `inputSearch`：[Input.Search](/components/input-cn#input-search)
- `layout`：[Layout](/components/layout-cn#api)
- `masonry`：[Masonry](/components/masonry-cn#api)
- `mentions`：[Mentions](/components/mentions-cn#api)
- `menu`：[Menu](/components/menu-cn#api)
- `message`：[Message](/components/message-cn#api)
- `modal`：[Modal](/components/modal-cn#api)
- `notification`：[Notification](/components/notification-cn#api)
- `otp`：[Input.OTP](/components/input-cn#input-otp)
- `pagination`：[Pagination](/components/pagination-cn#api)
- `popconfirm`：[Popconfirm](/components/popconfirm-cn#api)
- `popover`：[Popover](/components/popover-cn#api)
- `progress`：[Progress](/components/progress-cn#api)
- `qrcode`：[QRCode](/components/qr-code-cn#api)
- `radio`：[Radio](/components/radio-cn#api)
- `rangePicker`：[RangePicker](/components/date-picker-cn#rangepicker)
- `rate`：[Rate](/components/rate-cn#api)
- `result`：[Result](/components/result-cn#api)
- `ribbon`：[Badge.Ribbon](/components/badge-cn#api)
- `segmented`：[Segmented](/components/segmented-cn#api)
- `select`：[Select](/components/select-cn#api)
- `skeleton`：[Skeleton](/components/skeleton-cn#api)
- `slider`：[Slider](/components/slider-cn#api)
- `space`：[Space](/components/space-cn#api)
- `spin`：[Spin](/components/spin-cn#api)
- `splitter`：[Splitter](/components/splitter-cn#api)
- `statistic`：[Statistic](/components/statistic-cn#api)
- `steps`：[Steps](/components/steps-cn#api)
- `switch`：[Switch](/components/switch-cn#api)
- `table`：[Table](/components/table-cn#api)
- `tabs`：[Tabs](/components/tabs-cn#api)
- `tag`：[Tag](/components/tag-cn#api)
- `textArea`：[Input.TextArea](/components/input-cn#input-textarea)
- `timeline`：[Timeline](/components/timeline-cn#api)
- `timePicker`：[TimePicker](/components/time-picker-cn#api)
- `tooltip`：[Tooltip](/components/tooltip-cn#api)
- `tour`：[Tour](/components/tour-cn#api)
- `transfer`：[Transfer](/components/transfer-cn#api)
- `tree`：[Tree](/components/tree-cn#api)
- `treeSelect`：[TreeSelect](/components/tree-select-cn#api)
- `typography`：[Typography](/components/typography-cn#api)
- `upload`：[Upload](/components/upload-cn#api)
- `wave`：[WaveConfig](#api)

## FAQ

### 如何增加一个新的语言包？ {#faq-add-locale}

参考[《增加语言包》](/docs/vue/i18n)。

### 为什么时间类组件的国际化 locale 设置不生效？ {#faq-locale-not-work}

参考 FAQ [Date-related-components-locale-is-not-working?](/docs/vue/faq#为什么时间类组件的国际化-locale-设置不生效)

### 配置 `getPopupContainer` 导致 Modal 报错？ {#faq-get-popup-container}

相关 issue：<https://github.com/ant-design/ant-design/issues/19974>

当如下全局设置 `getPopupContainer` 为触发节点的 parentNode 时，由于 Modal 的用法不存在 `triggerNode`，这样会导致 `triggerNode is undefined` 的报错，需要增加一个判断条件。

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

### 为什么 `message.info`、`notification.open`、`Modal.confirm` 里的 VueNode 不能继承 ConfigProvider 的配置？ {#faq-message-inherit}

静态方法会创建独立实例，无法消费 ConfigProvider 上下文。请优先使用 hooks 或 App 提供的实例。

### Vite 生产环境下 locale 不生效？ {#faq-vite-locale-not-work}

相关 issue: [#39045](https://github.com/ant-design/ant-design/issues/39045)

Vite 生产模式下 cjs 默认导出需要使用 `enUS.default`。你可以直接从 `es/` 目录引入，如 `import enUS from 'antdv-next/locale/en_US'`，保证开发和生产一致。

### `prefixCls` 的优先级（前者会被后者覆盖） {#faq-prefixcls-priority}

1. ConfigProvider.config 设置 prefixCls 为 prefix-1
2. ConfigProvider.config 设置 holderRender（内部包裹 ConfigProvider 并设置 prefix-2）
3. message.config 设置 prefixCls 为 prefix-3
