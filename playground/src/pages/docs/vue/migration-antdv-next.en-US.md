---
title: Migrating from Ant Design Vue to Antdv Next
---

This document will help you migrate from `ant-design-vue` to `antdv-next`.

`antdv-next` originally implemented some compatibility measures for `ant-design-vue`, but there are still some `API` incompatibilities that cannot be directly adapted. Before upgrading, you need to ensure that your environment meets the new requirements.

## Upgrade Preparation

1. Please upgrade to the latest version of `ant-design-vue@4` to ensure you are using the latest antdv `API`.
2. It is recommended to upgrade Vue 3 to version `3.5.x`.

```shell
pnpm add antdv-next

# or
npm install antdv-next

# or
yarn add antdv-next
```

## What are the Incompatible Changes

### Replacing @ant-design/icons-vue

-  ⚠️ **Important:** `@ant-design/icons-vue` is not adapted for `antdv-next`, which may cause theme switching and `layer` mode to not work properly. Please ensure you install and use `@antdv-next/icons`.

```shell
pnpm add @antdv-next/icons
# or
npm install @antdv-next/icons
# or
yarn add @antdv-next/icons
```

### DOM Structure Adjustments

- antdv-next has upgraded and optimized the DOM structure of many components to improve maintainability and consistency.
- For most projects that normally use `ant-design-vue` styles, this will not have a significant impact.
- ⚠️ If your project has custom styles targeting internal DOM nodes of components (such as relying on specific selectors or hierarchical structures), you may need to manually check and adjust styles after upgrading.

### API Adjustments

⚠️ The following APIs have been marked as **Deprecated**. Although these properties can still be used currently, the console will show deprecation warnings, and they will be removed in 2.0. To maintain code maintainability and compatibility, **it is recommended to migrate to the corresponding replacement properties as soon as possible**.

- `Alert`
    - `closeText` deprecated, changed to `closable.closeIcon`.
    - `message` deprecated, changed to `title`.

- `Anchor`
    - `Anchor children` deprecated, changed to `items`.

- `AutoComplete`
    - `dropdownMatchSelectWidth` deprecated, changed to `popupMatchSelectWidth`.
    - `dropdownStyle` deprecated, changed to `styles.popup.root`.
    - `dropdownClassName` deprecated, changed to `classes.popup.root`.
    - `popupClassName` deprecated, changed to `classes.popup.root`.
    - `dropdownRender` deprecated, changed to `popupRender`.
    - `onDropdownVisibleChange` deprecated, changed to `onOpenChange`.
    - `dataSource` deprecated, changed to `options`.

- `Avatar.Group`
    - `maxCount` deprecated, changed to `:max="{count: number}"`.
    - `maxStyle` deprecated, changed to `:max="{style: CSSProperties}"`.
    - `maxPopoverPlacement` deprecated, changed to `:max="{popover: PopoverProps}"`.
    - `maxPopoverTrigger` deprecated, changed to `:max="{popover: PopoverProps}"`.

- `BackTop`
    - `BackTop` deprecated, changed to `FloatButton.BackTop`.

- `Breadcrumb`
    - `routes` deprecated, changed to `items`.
    - `Breadcrumb.Item` and `Breadcrumb.Separator` deprecated, changed to `items`.

- `Button.Group`
    - `Button.Group` deprecated, changed to `Space.Compact`.

- `Button`
    - `iconPosition` deprecated, changed to `iconPlacement`.

- `Calendar`
    - `dateFullCellRender` deprecated, changed to `fullCellRender`.
    - `dateCellRender` deprecated, changed to `cellRender`.
    - `monthFullCellRender` deprecated, changed to `fullCellRender`.
    - `monthCellRender` deprecated, changed to `cellRender`.

- `Card`
    - `headStyle` deprecated, changed to `styles.header`.
    - `bodyStyle` deprecated, changed to `styles.body`.
    - `bordered` deprecated, changed to `variant`.

- `Carousel`
    - `dotPosition` deprecated, changed to `dotPlacement`.

- `Cascader`
    - `dropdownClassName` deprecated, changed to `classes.popup.root`.
    - `dropdownStyle` deprecated, changed to `styles.popup.root`.
    - `dropdownRender` deprecated, changed to `popupRender`.
    - `dropdownMenuColumnStyle` deprecated, changed to `popupMenuColumnStyle`.
    - `onDropdownVisibleChange` deprecated, changed to `onOpenChange`.
    - `onPopupVisibleChange` deprecated, changed to `onOpenChange`.
    - `bordered` deprecated, changed to `variant`.

- `Collapse`
    - `destroyInactivePanel` deprecated, changed to `destroyOnHidden`.
    - `expandIconPosition` deprecated, changed to `expandIconPlacement`.

- `Collapse.Panel`
    - `disabled` deprecated, changed to `collapsible="disabled"`.

- `ConfigProvider`
    - `dropdownMatchSelectWidth` deprecated, changed to `popupMatchSelectWidth`.

- `DatePicker.RangePicker`
    - `dropdownClassName` deprecated, changed to `classes.popup.root`.
    - `popupClassName` deprecated, changed to `classes.popup.root`.
    - `popupStyle` deprecated, changed to `styles.popup.root`.
    - `bordered` deprecated, changed to `variant`.
    - `onSelect` deprecated, changed to `onCalendarChange`.

- `DatePicker`
    - `dropdownClassName` deprecated, changed to `classes.popup.root`.
    - `popupClassName` deprecated, changed to `classes.popup.root`.
    - `popupStyle` deprecated, changed to `styles.popup.root`.
    - `bordered` deprecated, changed to `variant`.
    - `onSelect` deprecated, changed to `onCalendarChange`.

- `Descriptions`
    - `labelStyle` deprecated, changed to `styles.label`.
    - `contentStyle` deprecated, changed to `styles.content`.

- `Divider`
    - `type` deprecated, changed to `orientation`.
    - `orientationMargin` deprecated, changed to `styles.content.margin`.

- `Drawer`
    - `headerStyle` deprecated, changed to `styles.header`.
    - `bodyStyle` deprecated, changed to `styles.body`.
    - `footerStyle` deprecated, changed to `styles.footer`.
    - `contentWrapperStyle` deprecated, changed to `styles.wrapper`.
    - `maskStyle` deprecated, changed to `styles.mask`.
    - `drawerStyle` deprecated, changed to `styles.section`.
    - `destroyInactivePanel` deprecated, changed to `destroyOnHidden`.
    - `width` deprecated, changed to `size`.
    - `height` deprecated, changed to `size`.

- `Dropdown.Button`
    - `Dropdown.Button` deprecated, changed to `Space.Compact + Dropdown + Button`.

- `Dropdown`
    - `dropdownRender` deprecated, changed to `popupRender`.
    - `destroyPopupOnHide` deprecated, changed to `destroyOnHidden`.
    - `overlayClassName` deprecated, changed to `classes.root`.
    - `overlayStyle` deprecated, changed to `styles.root`.
    - `placement: xxxCenter` deprecated, changed to `placement: xxx`.

- `Empty`
    - `imageStyle` deprecated, changed to `styles.image`.

- `FloatButton`
    - `description` deprecated, changed to `content`.

- `Image`
    - `wrapperStyle` deprecated, changed to `styles.root`.
    - `visible` deprecated, changed to `open`.
    - `onVisibleChange` deprecated, changed to `onOpenChange`.
    - `maskClassName` deprecated, changed to `classes.cover`.
    - `rootClassName` deprecated, changed to `classes.root`.
    - `toolbarRender` deprecated, changed to `actionsRender`.

- `Input.Group`
    - `Input.Group` deprecated, changed to `Space.Compact`.

- `InputNumber`
    - `bordered` deprecated, changed to `variant`.
    - `addonAfter` deprecated, changed to `Space.Compact`.
    - `addonBefore` deprecated, changed to `Space.Compact`.

- `Mentions`
    - `Mentions.Option` deprecated, changed to `options`.

- `Menu`
    - `children` deprecated, changed to `items`.

- `Modal`
    - `bodyStyle` deprecated, changed to `styles.body`.
    - `maskStyle` deprecated, changed to `styles.mask`.
    - `destroyOnClose` deprecated, changed to `destroyOnHidden`.

- `Notification`
    - `btn` deprecated, changed to `actions`.
    - `message` deprecated, changed to `title`.

- `Progress`
    - `strokeWidth` deprecated, changed to `size`.
    - `width` deprecated, changed to `size`.
    - `trailColor` deprecated, changed to `railColor`.
    - `gapPosition` deprecated, changed to `gapPlacement`.

- `Select`
    - `dropdownMatchSelectWidth` deprecated, changed to `popupMatchSelectWidth`.
    - `dropdownStyle` deprecated, changed to `styles.popup.root`.
    - `dropdownClassName` deprecated, changed to `classes.popup.root`.
    - `popupClassName` deprecated, changed to `classes.popup.root`.
    - `dropdownRender` deprecated, changed to `popupRender`.
    - `onDropdownVisibleChange` deprecated, changed to `onOpenChange`.
    - `bordered` deprecated, changed to `variant`.

- `Slider`
    - `tooltipPrefixCls` deprecated, changed to `tooltip.prefixCls`.
    - `getTooltipPopupContainer` deprecated, changed to `tooltip.getPopupContainer`.
    - `tipFormatter` deprecated, changed to `tooltip.formatter`.
    - `tooltipPlacement` deprecated, changed to `tooltip.placement`.
    - `tooltipVisible` deprecated, changed to `tooltip.open`.

- `Space.Compact`
    - `direction` deprecated, changed to `orientation`.

- `Space`
    - `direction` deprecated, changed to `orientation`.
    - `split` deprecated, changed to `separator`.

- `Splitter`
    - `layout` deprecated, changed to `orientation`.

- `Countdown`
    - `<a-statistic-countdown />` deprecated, changed to `<a-statistic-timer type="countdown" />`.

- `Statistic`
    - `valueStyle` deprecated, changed to `styles.content`.

- `Steps`
    - `labelPlacement` deprecated, changed to `titlePlacement`.
    - `progressDot` deprecated, changed to `type="dot"`.
    - `direction` deprecated, changed to `orientation`.
    - `items.description` deprecated, changed to `items.content`.

- `Table`
    - `pagination.position` deprecated, changed to `pagination.placement`.
    - `onSelectInvert` deprecated, changed to `onChange`.
    - `filterDropdownOpen` deprecated, changed to `filterDropdownProps.open`.
    - `onFilterDropdownOpenChange` deprecated, changed to `filterDropdownProps.onOpenChange`.
    - `filterCheckall` deprecated, changed to `locale.filterCheckAll`.

- `Tabs`
    - `popupClassName` deprecated, changed to `classes.popup`.
    - `tabPosition` deprecated, changed to `tabPlacement`.
    - `destroyInactiveTabPane` deprecated, changed to `destroyOnHidden`.
    - `Tabs.TabPane` deprecated, changed to `items`.

- `Tag`
    - `bordered={false}` deprecated, changed to `variant="filled"`.
    - `color="xxx-inverse"` deprecated, changed to `variant="solid"`.

- `TimePicker`
    - `addon` deprecated, changed to `renderExtraFooter`.

- `Timeline`
    - `Timeline.Item` deprecated, changed to `items`.
    - `pending` deprecated, changed to `items`.
    - `pendingDot` deprecated, changed to `items`.
    - `mode=left|right` deprecated, changed to `mode=start|end`.

- `Tooltip`
    - `overlayStyle` deprecated, changed to `styles.root`.
    - `overlayInnerStyle` deprecated, changed to `styles.container`.
    - `overlayClassName` deprecated, changed to `classes.root`.
    - `destroyTooltipOnHide` deprecated, changed to `destroyOnHidden`.

- `Transfer`
    - `listStyle` deprecated, changed to `styles.section`.
    - `operationStyle` deprecated, changed to `styles.actions`.
    - `operations` deprecated, changed to `actions`.

- `TreeSelect`
    - `dropdownMatchSelectWidth` deprecated, changed to `popupMatchSelectWidth`.
    - `dropdownStyle` deprecated, changed to `styles.popup.root`.
    - `dropdownClassName` deprecated, changed to `classes.popup.root`.
    - `popupClassName` deprecated, changed to `classes.popup.root`.
    - `dropdownRender` deprecated, changed to `popupRender`.
    - `onDropdownVisibleChange` deprecated, changed to `onOpenChange`.
    - `bordered` deprecated, changed to `variant`.

### Overlay Components (Modal, Drawer, etc.)

- Added `mask` overlay functionality with blur effect support.
- Enabled by default, can be disabled with the following configuration:

```vue
<template>
  <a-config-provider
    :modal="{
      mask: {
        blur: false,
      },
    }"
    :drawer="{
      mask: {
        blur: false,
      },
    }"
  >
    <a-modal />
    <a-drawer />
  </a-config-provider>
</template>
```

### Tag Margin Adjustment

`antdv-next` removes the default margin at the end of the `Tag` component (previously, Tag had an additional `margin-inline-end` at the end). If your layout or custom styles depend on this behavior, please use the `tag.styles` option in `ConfigProvider` to supplement it:

```vue
<template>
  <a-config-provider
    :tag="{
      styles: {
        root: {
          marginInlineEnd: '8px',
        },
      },
    }"
  >
    <a-tag>Tag A</a-tag>
    <a-tag>Tag B</a-tag>
    <a-tag>Tag C</a-tag>
  </a-config-provider>
</template>
```

### Tooltip Adjustments

The `overlay` slot has been removed. Use `popupRender` instead.

### Form Adjustments

- Removed `a-form-rest` to cancel passive collection of components. By default, we do not actively collect components inside `a-form-item` as form fields, and you need to manually specify them through the `name` attribute.

## Upgrade Impact Investigation Checklist

To ensure that your project runs normally after upgrading to `antdv-next`, please refer to the following checklist and confirm each item:

- **Vue Version**: It is recommended to use `vue@3.5.x`.
- **@ant-design/icons Upgrade**: Confirm that the `@ant-design/icons` version has been upgraded to `@antdv-next/icons` to match `antdv-next`.
- **Browser Compatibility**: Confirm that the target user browsers are modern browsers and support CSS variables.
- **Custom Style Check**: If you have CSS customizations targeting internal DOM nodes of components, verify that they still work under `antdv-next`.
- **Overlay Mask Configuration**: Check if Modal, Drawer, and other overlay components need to disable the `mask` blur effect. If not needed, keep the default.
- **Build Tool Configuration**: Confirm that there are no errors after the upgrade build, and that CSS variables and CSS-in-JS work properly.
- **Console Warnings**: Run the application and observe the console, handling all `legacy API` prompts.

## Encountering Issues

If you encounter problems during the upgrade process, please provide feedback on [GitHub issues](https://github.com/antdv-next/antdv-next/issues/). We will respond as soon as possible and improve the relevant documentation.
