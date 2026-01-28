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

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| affix | 设置 Affix 组件的通用属性 | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| alert | 设置 Alert 组件的通用属性 | &#123; class?: string, style?: CSSProperties, closeIcon?: VueNode, successIcon?: VueNode, infoIcon?: VueNode, warningIcon?: VueNode, errorIcon?: VueNode &#125; | - | - |
| anchor | 设置 Anchor 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [AnchorStyleConfig["classes"]](/components/anchor-cn#semantic-dom), styles?: [AnchorStyleConfig["styles"]](/components/anchor-cn#semantic-dom) &#125; | - | - |
| avatar | 设置 Avatar 组件的通用属性 | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| badge | 设置 Badge 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [BadgeProps["classes"]](/components/badge-cn#semantic-dom), styles?: [BadgeProps["styles"]](/components/badge-cn#semantic-dom) &#125; | - | - |
| breadcrumb | 设置 Breadcrumb 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [BreadcrumbConfig["classes"]](/components/breadcrumb-cn#semantic-dom), styles?: [BreadcrumbConfig["styles"]](/components/breadcrumb-cn#semantic-dom), separator?: VueNode, dropdownIcon?: VueNode &#125; | - | - |
| button | 设置 Button 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [ButtonProps["classes"]](/components/button-cn#semantic-dom), styles?: [ButtonProps["styles"]](/components/button-cn#semantic-dom), autoInsertSpace?: boolean, variant?: ButtonVariantType, color?: ButtonColorType, shape?: [ButtonProps["shape"]](/components/button#api) &#125; | - | - |
| calendar | 设置 Calendar 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [CalendarConfig["classes"]](/components/calendar-cn#semantic-dom), styles?: [CalendarConfig["styles"]](/components/calendar-cn#semantic-dom) &#125; | - | - |
| card | 设置 Card 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [CardProps["classes"]](/components/card-cn#semantic-dom), styles?: [CardProps["styles"]](/components/card-cn#semantic-dom) &#125; | - | - |
| cardMeta | 设置 Card.Meta 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [CardMetaProps["classes"]](/components/card-cn#semantic-dom), styles?: [CardMetaProps["styles"]](/components/card-cn#semantic-dom) &#125; | - | - |
| carousel | 设置 Carousel 组件的通用属性 | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| cascader | 设置 Cascader 组件的通用属性 | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| checkbox | 设置 Checkbox 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [CheckboxConfig["classes"]](/components/checkbox-cn#semantic-dom), styles?: [CheckboxConfig["styles"]](/components/checkbox-cn#semantic-dom) &#125; | - | - |
| collapse | 设置 Collapse 组件的通用属性 | &#123; class?: string, style?: CSSProperties, expandIcon?: (props) => VueNode, classes?: [CollapseProps["classes"]](/components/collapse-cn#semantic-dom), styles?: [CollapseProps["styles"]](/components/collapse-cn#semantic-dom) &#125; | - | - |
| colorPicker | 设置 ColorPicker 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [ColorPickerConfig["classes"]](/components/color-picker-cn#semantic-dom), styles?: [ColorPickerConfig["styles"]](/components/color-picker-cn#semantic-dom) &#125; | - | - |
| datePicker | 设置 DatePicker 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [DatePickerConfig["classes"]](/components/date-picker-cn#semantic-dom), styles?: [DatePickerConfig["styles"]](/components/date-picker-cn#semantic-dom) &#125; | - | - |
| rangePicker | 设置 RangePicker 组件的通用属性 | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| descriptions | 设置 Descriptions 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [DescriptionsProps["classes"]](/components/descriptions-cn#semantic-dom), styles?: [DescriptionsProps["styles"]](/components/descriptions-cn#semantic-dom) &#125; | - | - |
| divider | 设置 Divider 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [DividerProps["classes"]](/components/divider-cn#semantic-dom), styles?: [DividerProps["styles"]](/components/divider-cn#semantic-dom) &#125; | - | - |
| drawer | 设置 Drawer 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [DrawerProps["classes"]](/components/drawer-cn#semantic-dom), styles?: [DrawerProps["styles"]](/components/drawer-cn#semantic-dom), closeIcon?: VueNode, closable?: [DrawerProps["closable"]](/components/drawer-cn#api) &#125; | - | - |
| dropdown | 设置 Dropdown 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [DropdownConfig["classes"]](/components/dropdown-cn#semantic-dom), styles?: [DropdownConfig["styles"]](/components/dropdown-cn#semantic-dom) &#125; | - | - |
| empty | 设置 Empty 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [EmptyProps["classes"]](/components/empty-cn#api), styles?: [EmptyProps["styles"]](/components/empty-cn#api), image?: VueNode &#125; | - | - |
| flex | 设置 Flex 组件的通用属性 | &#123; class?: string, style?: CSSProperties, vertical?: boolean &#125; | - | - |
| floatButton | 设置 FloatButton 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [FloatButtonProps["classes"]](/components/float-button-cn#semantic-dom), styles?: [FloatButtonProps["styles"]](/components/float-button-cn#semantic-dom), backTopIcon?: VueNode &#125; | - | - |
| floatButtonGroup | 设置 FloatButton.Group 组件的通用属性 | &#123; closeIcon?: VueNode, class?: string, style?: CSSProperties, classes?: [FloatButtonProps["classes"]](/components/float-button-cn#semantic-dom), styles?: [FloatButtonProps["styles"]](/components/float-button-cn#semantic-dom) &#125; | - | - |
| form | 设置 Form 组件的通用属性 | &#123; class?: string, style?: CSSProperties, validateMessages?: [ValidateMessages](/components/form-cn#validatemessages), requiredMark?: boolean \| `optional`, scrollToFirstError?: boolean \| [Options](https://github.com/stipsan/scroll-into-view-if-needed/tree/ece40bd9143f48caf4b99503425ecb16b0ad8249#options), classes?: [FormConfig["classes"]](/components/form-cn#semantic-dom), styles?: [FormConfig["styles"]](/components/form-cn#semantic-dom) &#125; | - | - |
| image | 设置 Image 组件的通用属性 | &#123; class?: string, style?: CSSProperties, preview?: &#123; closeIcon?: VueNode, classes?: [ImageConfig["classes"]](/components/image-cn#semantic-dom), styles?: [ImageConfig["styles"]](/components/image-cn#semantic-dom) &#125;, fallback?: string &#125; | - | - |
| input | 设置 Input 组件的通用属性 | &#123; autoComplete?: string, class?: string, style?: CSSProperties, classes?: [InputConfig["classes"]](/components/input-cn#semantic-input), styles?: [InputConfig["styles"]](/components/input-cn#semantic-input), allowClear?: boolean \| &#123; clearIcon?: VueNode &#125; &#125; | - | - |
| inputNumber | 设置 InputNumber 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [InputNumberConfig["classes"]](/components/input-number-cn#semantic-dom), styles?: [InputNumberConfig["styles"]](/components/input-number-cn#semantic-dom) &#125; | - | - |
| otp | 设置 OTP 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [OTPConfig["classes"]](/components/input-cn#semantic-otp), styles?: [OTPConfig["styles"]](/components/input-cn#semantic-otp) &#125; | - | - |
| inputSearch | 设置 Search 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [InputSearchConfig["classes"]](/components/input-cn#semantic-search), styles?: [InputSearchConfig["styles"]](/components/input-cn#semantic-search) &#125; | - | - |
| textArea | 设置 TextArea 组件的通用属性 | &#123; autoComplete?: string, class?: string, style?: CSSProperties, classes?: [TextAreaConfig["classes"]](/components/input-cn#semantic-textarea), styles?: [TextAreaConfig["styles"]](/components/input-cn#semantic-textarea), allowClear?: boolean \| &#123; clearIcon?: VueNode &#125; &#125; | - | - |
| layout | 设置 Layout 组件的通用属性 | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| list | 设置 List 组件的通用属性 | &#123; class?: string, style?: CSSProperties, item?: &#123; classes: [ListItemProps["classes"]](/components/list-cn#listitem), styles: [ListItemProps["styles"]](/components/list-cn#listitem) &#125; &#125; | - | - |
| masonry | 设置 Masonry 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [MasonryProps["classes"]](/components/masonry#semantic-dom), styles?: [MasonryProps["styles"]](/components/masonry#semantic-dom) &#125; | - | - |
| menu | 设置 Menu 组件的通用属性 | &#123; class?: string, style?: CSSProperties, expandIcon?: VueNode \| (props) => VueNode &#125; | - | - |
| mentions | 设置 Mentions 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [MentionsConfig["classes"]](/components/mentions-cn#semantic-dom), styles?: [MentionsConfig["styles"]](/components/mentions-cn#semantic-dom) &#125; | - | - |
| message | 设置 Message 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [MessageConfig["classes"]](/components/message-cn#semantic-dom), styles?: [MessageConfig["styles"]](/components/message-cn#semantic-dom) &#125; | - | - |
| modal | 设置 Modal 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [ModalProps["classes"]](/components/modal-cn#semantic-dom), styles?: [ModalProps["styles"]](/components/modal-cn#semantic-dom), closeIcon?: VueNode &#125; | - | - |
| notification | 设置 Notification 组件的通用属性 | &#123; class?: string, style?: CSSProperties, closeIcon?: VueNode, classes?: [NotificationConfig["classes"]](/components/notification-cn#semantic-dom), styles?: [NotificationConfig["styles"]](/components/notification-cn#semantic-dom) &#125; | - | - |
| pagination | 设置 Pagination 组件的通用属性 | &#123; showSizeChanger?: boolean, totalBoundaryShowSizeChanger?: number, class?: string, style?: CSSProperties, classes?: [PaginationConfig["classes"]](/components/pagination-cn#semantic-dom), styles?: [PaginationConfig["styles"]](/components/pagination-cn#semantic-dom) &#125; | - | - |
| progress | 设置 Progress 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [ProgressConfig["classes"]](/components/progress#semantic-dom), styles?: [ProgressConfig["styles"]](/components/progress#semantic-dom) &#125; | - | - |
| radio | 设置 Radio 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [RadioConfig["classes"]](/components/radio-cn#semantic-dom), styles?: [RadioConfig["styles"]](/components/radio-cn#semantic-dom) &#125; | - | - |
| rate | 设置 Rate 组件的通用属性 | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| result | 设置 Result 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [ResultProps["classes"]](/components/result-cn#semantic-dom), styles?: [ResultProps["styles"]](/components/result-cn#semantic-dom) &#125; | - | - |
| ribbon | 设置 Ribbon 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [RibbonProps["classes"]](/components/badge-cn#semantic-dom), styles?: [RibbonProps["styles"]](/components/badge-cn#semantic-dom) &#125; | - | - |
| skeleton | 设置 Skeleton 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [SkeletonProps["classes"]](/components/skeleton-cn#semantic-dom), styles?: [SkeletonProps["styles"]](/components/skeleton-cn#semantic-dom) &#125; | - | - |
| segmented | 设置 Segmented 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [SegmentedProps["classes"]](/components/segmented-cn#semantic-dom), styles?: [SegmentedProps["styles"]](/components/segmented-cn#semantic-dom) &#125; | - | - |
| select | 设置 Select 组件的通用属性 | &#123; class?: string, showSearch?: boolean, style?: CSSProperties, classes?: [SelectConfig["classes"]](/components/select-cn#semantic-dom), styles?: [SelectConfig["styles"]](/components/select-cn#semantic-dom) &#125; | - | - |
| slider | 设置 Slider 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [SliderProps["classes"]](/components/slider-cn#semantic-dom), styles?: [SliderProps["styles"]](/components/slider-cn#semantic-dom) &#125; | - | - |
| switch | 设置 Switch 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [SwitchStyleConfig["classes"]](/components/switch-cn#semantic-dom), styles?: [SwitchStyleConfig["styles"]](/components/switch-cn#semantic-dom) &#125; | - | - |
| space | 设置 Space 的通用属性，参考 [Space](/components/space-cn) | &#123; size: `small` \| `middle` \| `large` \| `number`, class?: string, style?: CSSProperties, classes?: [SpaceProps["classes"]](/components/space-cn#semantic-dom), styles?: [SpaceProps["styles"]](/components/space-cn#semantic-dom) &#125; | - | - |
| splitter | 设置 Splitter 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [Splitter["classes"]](/components/splitter-cn#semantic-dom), styles?: [Splitter["styles"]](/components/splitter-cn#semantic-dom) &#125; | - | - |
| spin | 设置 Spin 组件的通用属性 | &#123; class?: string, style?: CSSProperties, indicator?: VueNode, classes?: [SpinConfig["classes"]](/components/spin-cn#semantic-dom), styles?: [SpinConfig["styles"]](/components/spin-cn#semantic-dom) &#125; | - | - |
| statistic | 设置 Statistic 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [StatisticProps["classes"]](/components/statistic-cn#semantic-dom), styles?: [StatisticProps["styles"]](/components/statistic-cn#semantic-dom) &#125; | - | - |
| steps | 设置 Steps 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [StepsConfig["classes"]](/components/steps#semantic-dom), styles?: [StepsConfig["styles"]](/components/steps#semantic-dom) &#125; | - | - |
| table | 设置 Table 组件的通用属性 | &#123; class?: string, style?: CSSProperties, expandable?: &#123; expandIcon?: props => VueNode &#125;, classes?: [TableProps["classes"]](/components/table-cn#semantic-dom), styles?: [TableProps["styles"]](/components/table-cn#semantic-dom) &#125; | - | - |
| tabs | 设置 Tabs 组件的通用属性 | &#123; class?: string, style?: CSSProperties, indicator?: &#123; size?: GetIndicatorSize, align?: `start` \| `center` \| `end` &#125;, moreIcon?: VueNode, addIcon?: VueNode, removeIcon?: VueNode, classes?: [TabsConfig["classes"]](/components/tabs-cn#semantic-dom), styles?: [TabsConfig["styles"]](/components/tabs-cn#semantic-dom) &#125; | - | - |
| tag | 设置 Tag 组件的通用属性 | &#123; class?: string, style?: CSSProperties, closeIcon?: VueNode, classes?: [TagProps["classes"]](/components/tag-cn#semantic-dom), styles?: [TagProps["styles"]](/components/tag-cn#semantic-dom) &#125; | - | - |
| timeline | 设置 Timeline 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [TimelineConfig["classes"]](/components/timeline-cn#semantic-dom), styles?: [TimelineConfig["styles"]](/components/timeline-cn#semantic-dom) &#125; | - | - |
| timePicker | 设置 TimePicker 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [TimePickerConfig["classes"]](/components/time-picker-cn#semantic-dom), styles?: [TimePickerConfig["styles"]](/components/time-picker-cn#semantic-dom) &#125; | - | - |
| tour | 设置 Tour 组件的通用属性 | &#123; closeIcon?: VueNode, class?: string, style?: CSSProperties, classes?: [TourProps["classes"]](/components/tour-cn#semantic-dom), styles?: [TourProps["styles"]](/components/tour-cn#semantic-dom) &#125; | - | - |
| tooltip | 设置 Tooltip 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [Tooltip["classes"]](/components/tooltip-cn#semantic-dom), styles?: [Tooltip["styles"]](/components/tooltip-cn#semantic-dom), arrow: boolean \| &#123; pointAtCenter: boolean &#125;, unique?: boolean, trigger?: [Tooltip["trigger"]](/components/tooltip-cn#api) &#125; | - | - |
| popover | 设置 Popover 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [Popover["classes"]](/components/popover-cn#semantic-dom), styles?: [Popover["styles"]](/components/popover-cn#semantic-dom), arrow: boolean \| &#123; pointAtCenter: boolean &#125;, trigger?: [Popover["trigger"]](/components/popover-cn#api) &#125; | - | - |
| popconfirm | 设置 Popconfirm 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [Popconfirm["classes"]](/components/popconfirm-cn#semantic-dom), styles?: [Popconfirm["styles"]](/components/popconfirm-cn#semantic-dom), arrow: boolean \| &#123; pointAtCenter: boolean &#125;, trigger?: [Popconfirm["trigger"]](/components/popconfirm-cn#api) &#125; | - | - |
| qrcode | 设置 QRCode 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [QRCode["classes"]](/components/qr-code-cn#semantic-dom), styles?: [QRCode["styles"]](/components/qr-code-cn#semantic-dom) &#125; | - | - |
| transfer | 设置 Transfer 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [TransferConfig["classes"]](/components/transfer-cn#semantic-dom), styles?: [TransferConfig["styles"]](/components/transfer-cn#semantic-dom), selectionsIcon?: VueNode &#125; | - | - |
| tree | 设置 Tree 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [TreeConfig["classes"]](/components/tree-cn#semantic-dom), styles?: [TreeConfig["styles"]](/components/tree-cn#semantic-dom) &#125; | - | - |
| treeSelect | 设置 TreeSelect 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [TreeSelectConfig["classes"]](/components/tree-select-cn#semantic-dom), styles?: [TreeSelectConfig["styles"]](/components/tree-select-cn#semantic-dom), switcherIcon?: [TreeSelect["switcherIcon"]](/components/tree-select-cn#api) &#125; | - | - |
| typography | 设置 Typography 组件的通用属性 | &#123; class?: string, style?: CSSProperties &#125; | - | - |
| upload | 设置 Upload 组件的通用属性 | &#123; class?: string, style?: CSSProperties, classes?: [UploadConfig["classes"]](/components/upload-cn#semantic-dom), styles?: [UploadConfig["styles"]](/components/upload-cn#semantic-dom), customRequest?: [Upload["customRequest"]](/components/upload#api) &#125; | - | - |
| wave | 设置水波纹特效 | &#123; disabled?: boolean, showEffect?: (node: HTMLElement, info: &#123; className, token, component &#125;) => void &#125; | - | - |

## FAQ

### 如何增加一个新的语言包？ {#faq-add-locale}

参考[《增加语言包》](/docs/vue/i18n)。

### 为什么时间类组件的国际化 locale 设置不生效？ {#faq-locale-not-work}

参考 FAQ [Date-related-components-locale-is-not-working?](/docs/vue/faq#date-related-components-locale-is-not-working)

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
