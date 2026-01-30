---
title: 从 Ant Design Vue 迁移到 Antdv Next
---

本文档将帮助你从`ant-design-vue`迁移到`antdv-next`。

`antdv-next`原本对`ant-design-vue`做了一些兼容处理，但是仍然存在部分的`api`无法直接兼容的情况。在升级前您需要确保您的环境满足新的要求。

## 升级准备

1. 请升级到最新的`ant-design-vue@4`的版本，以确保您使用的是最新的antdv的`api`。
2. 建议升级vue3到`3.5.x`的版本。

```shell
pnpm add antdv-next

# 或
npm install antdv-next

# 或
yarn add antdv-next
```

## 有哪些不兼容的变化

### @ant-design/icons-vue替换

-  ⚠️ **重要：**`@ant-design/icons-vue`本身是对`antdv-next`没有适配的，所以可能会导致切换主题和`layer`模式不生效，请确保安装并使用`@antdv-next/icons`。

```shell
pnpm add @antdv-next/icons
# 或
npm install @antdv-next/icons
# 或
yarn add @antdv-next/icons
```

### DOM结构调整

- antdv-next对大量组件的DOM结构进行了升级优化，以提升可维护性和一致性。
- 对于大多数正常使用`ant-design-vue`样式的项目，这不会产生太大的影响。
- ⚠️ 如果你的项目中存在针对组件内部 DOM 节点的自定义样式（例如依赖特定选择器或层级结构），升级后可能需要手动检查并调整样式。

### API调整

⚠️ 下列 API 已被标记为**废弃（Deprecated）**。尽管这些属性当前仍可使用，但控制台会提示弃用警告，并将在 2.0 中被移除。为保持代码的可维护性和兼容性，**建议尽快迁移到对应的替代属性**。

- `Alert`
    - `closeText` 弃用，变为 `closable.closeIcon`。
    - `message` 弃用，变为 `title`。

- `Anchor`
    - `Anchor children` 弃用，变为 `items`。

- `AutoComplete`
    - `dropdownMatchSelectWidth` 弃用，变为 `popupMatchSelectWidth`。
    - `dropdownStyle` 弃用，变为 `styles.popup.root`。
    - `dropdownClassName` 弃用，变为 `classes.popup.root`。
    - `popupClassName` 弃用，变为 `classes.popup.root`。
    - `dropdownRender` 弃用，变为 `popupRender`。
    - `onDropdownVisibleChange` 弃用，变为 `onOpenChange`。
    - `dataSource` 弃用，变为 `options`。

- `Avatar.Group`
    - `maxCount` 弃用，变为 `:max="{count: number}"`。
    - `maxStyle` 弃用，变为 `:max="{style: CSSProperties}"`。
    - `maxPopoverPlacement` 弃用，变为 `:max="{popover: PopoverProps}"`。
    - `maxPopoverTrigger` 弃用，变为 `:max="{popover: PopoverProps}"`。

- `BackTop`
    - `BackTop` 弃用，变为 `FloatButton.BackTop`。

- `Breadcrumb`
    - `routes` 弃用，变为 `items`。
    - `Breadcrumb.Item` 和 `Breadcrumb.Separator` 弃用，变为 `items`。

- `Button.Group`
    - `Button.Group` 弃用，变为 `Space.Compact`。

- `Button`
    - `iconPosition` 弃用，变为 `iconPlacement`。

- `Calendar`
    - `dateFullCellRender` 弃用，变为 `fullCellRender`。
    - `dateCellRender` 弃用，变为 `cellRender`。
    - `monthFullCellRender` 弃用，变为 `fullCellRender`。
    - `monthCellRender` 弃用，变为 `cellRender`。

- `Card`
    - `headStyle` 弃用，变为 `styles.header`。
    - `bodyStyle` 弃用，变为 `styles.body`。
    - `bordered` 弃用，变为 `variant`。

- `Carousel`
    - `dotPosition` 弃用，变为 `dotPlacement`。

- `Cascader`
    - `dropdownClassName` 弃用，变为 `classes.popup.root`。
    - `dropdownStyle` 弃用，变为 `styles.popup.root`。
    - `dropdownRender` 弃用，变为 `popupRender`。
    - `dropdownMenuColumnStyle` 弃用，变为 `popupMenuColumnStyle`。
    - `onDropdownVisibleChange` 弃用，变为 `onOpenChange`。
    - `onPopupVisibleChange` 弃用，变为 `onOpenChange`。
    - `bordered` 弃用，变为 `variant`。

- `Collapse`
    - `destroyInactivePanel` 弃用，变为 `destroyOnHidden`。
    - `expandIconPosition` 弃用，变为 `expandIconPlacement`。

- `Collapse.Panel`
    - `disabled` 弃用，变为 `collapsible="disabled"`。

- `ConfigProvider`
    - `dropdownMatchSelectWidth` 弃用，变为 `popupMatchSelectWidth`。

- `DatePicker.RangePicker`
    - `dropdownClassName` 弃用，变为 `classes.popup.root`。
    - `popupClassName` 弃用，变为 `classes.popup.root`。
    - `popupStyle` 弃用，变为 `styles.popup.root`。
    - `bordered` 弃用，变为 `variant`。
    - `onSelect` 弃用，变为 `onCalendarChange`。

- `DatePicker`
    - `dropdownClassName` 弃用，变为 `classes.popup.root`。
    - `popupClassName` 弃用，变为 `classes.popup.root`。
    - `popupStyle` 弃用，变为 `styles.popup.root`。
    - `bordered` 弃用，变为 `variant`。
    - `onSelect` 弃用，变为 `onCalendarChange`。

- `Descriptions`
    - `labelStyle` 弃用，变为 `styles.label`。
    - `contentStyle` 弃用，变为 `styles.content`。

- `Divider`
    - `type` 弃用，变为 `orientation`。
    - `orientationMargin` 弃用，变为 `styles.content.margin`。

- `Drawer`
    - `headerStyle` 弃用，变为 `styles.header`。
    - `bodyStyle` 弃用，变为 `styles.body`。
    - `footerStyle` 弃用，变为 `styles.footer`。
    - `contentWrapperStyle` 弃用，变为 `styles.wrapper`。
    - `maskStyle` 弃用，变为 `styles.mask`。
    - `drawerStyle` 弃用，变为 `styles.section`。
    - `destroyInactivePanel` 弃用，变为 `destroyOnHidden`。
    - `width` 弃用，变为 `size`。
    - `height` 弃用，变为 `size`。

- `Dropdown.Button`
    - `Dropdown.Button` 弃用，变为 `Space.Compact + Dropdown + Button`。

- `Dropdown`
    - `dropdownRender` 弃用，变为 `popupRender`。
    - `destroyPopupOnHide` 弃用，变为 `destroyOnHidden`。
    - `overlayClassName` 弃用，变为 `classes.root`。
    - `overlayStyle` 弃用，变为 `styles.root`。
    - `placement: xxxCenter` 弃用，变为 `placement: xxx`。

- `Empty`
    - `imageStyle` 弃用，变为 `styles.image`。

- `FloatButton`
    - `description` 弃用，变为 `content`。

- `Image`
    - `wrapperStyle` 弃用，变为 `styles.root`。
    - `visible` 弃用，变为 `open`。
    - `onVisibleChange` 弃用，变为 `onOpenChange`。
    - `maskClassName` 弃用，变为 `classes.cover`。
    - `rootClassName` 弃用，变为 `classes.root`。
    - `toolbarRender` 弃用，变为 `actionsRender`。

- `Input.Group`
    - `Input.Group` 弃用，变为 `Space.Compact`。

- `InputNumber`
    - `bordered` 弃用，变为 `variant`。
    - `addonAfter` 弃用，变为 `Space.Compact`。
    - `addonBefore` 弃用，变为 `Space.Compact`。

- `Mentions`
    - `Mentions.Option` 弃用，变为 `options`。

- `Menu`
    - `children` 弃用，变为 `items`。

- `Modal`
    - `bodyStyle` 弃用，变为 `styles.body`。
    - `maskStyle` 弃用，变为 `styles.mask`。
    - `destroyOnClose` 弃用，变为 `destroyOnHidden`。

- `Notification`
    - `btn` 弃用，变为 `actions`。
    - `message` 弃用，变为 `title`。

- `Progress`
    - `strokeWidth` 弃用，变为 `size`。
    - `width` 弃用，变为 `size`。
    - `trailColor` 弃用，变为 `railColor`。
    - `gapPosition` 弃用，变为 `gapPlacement`。

- `Select`
    - `dropdownMatchSelectWidth` 弃用，变为 `popupMatchSelectWidth`。
    - `dropdownStyle` 弃用，变为 `styles.popup.root`。
    - `dropdownClassName` 弃用，变为 `classes.popup.root`。
    - `popupClassName` 弃用，变为 `classes.popup.root`。
    - `dropdownRender` 弃用，变为 `popupRender`。
    - `onDropdownVisibleChange` 弃用，变为 `onOpenChange`。
    - `bordered` 弃用，变为 `variant`。

- `Slider`
    - `tooltipPrefixCls` 弃用，变为 `tooltip.prefixCls`。
    - `getTooltipPopupContainer` 弃用，变为 `tooltip.getPopupContainer`。
    - `tipFormatter` 弃用，变为 `tooltip.formatter`。
    - `tooltipPlacement` 弃用，变为 `tooltip.placement`。
    - `tooltipVisible` 弃用，变为 `tooltip.open`。

- `Space.Compact`
    - `direction` 弃用，变为 `orientation`。

- `Space`
    - `direction` 弃用，变为 `orientation`。
    - `split` 弃用，变为 `separator`。

- `Splitter`
    - `layout` 弃用，变为 `orientation`。

- `Countdown`
    - `<a-statistic-countdown />` 弃用，变为 `<a-statistic-timer type="countdown" />`。

- `Statistic`
    - `valueStyle` 弃用，变为 `styles.content`。

- `Steps`
    - `labelPlacement` 弃用，变为 `titlePlacement`。
    - `progressDot` 弃用，变为 `type="dot"`。
    - `direction` 弃用，变为 `orientation`。
    - `items.description` 弃用，变为 `items.content`。

- `Table`
    - `pagination.position` 弃用，变为 `pagination.placement`。
    - `onSelectInvert` 弃用，变为 `onChange`。
    - `filterDropdownOpen` 弃用，变为 `filterDropdownProps.open`。
    - `onFilterDropdownOpenChange` 弃用，变为 `filterDropdownProps.onOpenChange`。
    - `filterCheckall` 弃用，变为 `locale.filterCheckAll`。

- `Tabs`
    - `popupClassName` 弃用，变为 `classes.popup`。
    - `tabPosition` 弃用，变为 `tabPlacement`。
    - `destroyInactiveTabPane` 弃用，变为 `destroyOnHidden`。
    - `Tabs.TabPane` 弃用，变为 `items`。

- `Tag`
    - `bordered={false}` 弃用，变为 `variant="filled"`。
    - `color="xxx-inverse"` 弃用，变为 `variant="solid"`。

- `TimePicker`
    - `addon` 弃用，变为 `renderExtraFooter`。

- `Timeline`
    - `Timeline.Item` 弃用，变为 `items`。
    - `pending` 弃用，变为 `items`。
    - `pendingDot` 弃用，变为 `items`。
    - `mode=left|right` 弃用，变为 `mode=start|end`。

- `Tooltip`
    - `overlayStyle` 弃用，变为 `styles.root`。
    - `overlayInnerStyle` 弃用，变为 `styles.container`。
    - `overlayClassName` 弃用，变为 `classes.root`。
    - `destroyTooltipOnHide` 弃用，变为 `destroyOnHidden`。

- `Transfer`
    - `listStyle` 弃用，变为 `styles.section`。
    - `operationStyle` 弃用，变为 `styles.actions`。
    - `operations` 弃用，变为 `actions`。

- `TreeSelect`
    - `dropdownMatchSelectWidth` 弃用，变为 `popupMatchSelectWidth`。
    - `dropdownStyle` 弃用，变为 `styles.popup.root`。
    - `dropdownClassName` 弃用，变为 `classes.popup.root`。
    - `popupClassName` 弃用，变为 `classes.popup.root`。
    - `dropdownRender` 弃用，变为 `popupRender`。
    - `onDropdownVisibleChange` 弃用，变为 `onOpenChange`。
    - `bordered` 弃用，变为 `variant`。

### 弹层类组件（Modal、Drawer 等）

- 新增 `mask` 蒙层功能，并支持模糊效果。
- 默认开启，可通过以下方式关闭模糊：

```vue
<template>
  <a-config-privider
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
  </a-config-privider>
</template>
```

### Tag margin 调整

`antdv-next` 移除了 `Tag` 组件末尾的默认外边距（以前 Tag 末尾会额外留出一段 `margin-inline-end`）。如果你的布局或自定义样式依赖这一行为，请使用 `ConfigProvider` 的 `tag.styles` 进行补充：

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

### Tooltip调整

插槽`overlay`已被移除，改为使用`popupRender`来代替。

### Form 调整

- 去掉了`a-form-rest`取消被动收集的组件，默认情况下我们不会主动收集`a-form-item`内的组件作为表单域，需要手动通过`name`属性指定。

## 升级影响排查 Checklist

为了确保升级到 `antdv-next` 后项目正常运行，请参考以下检查清单逐项确认：

- **Vue 版本**：推荐采用`vue@3.5.x`。
- **@ant-design/icons 升级**：确认 `@ant-design/icons` 版本已升级到 `@antdv-next/icons`，与 `antdv-next` 匹配。
- **浏览器兼容性**：确认目标用户浏览器均为现代浏览器，且支持 CSS variables。
- **自定义样式检查**：如果有针对组件内部 DOM 节点的 CSS 定制，验证在 `antdv-next` 下是否依然生效。
- **弹层蒙层配置**：Modal、Drawer 等弹层是否需要关闭 `mask` 的模糊效果，如不需要可保持默认。
- **构建工具配置**：确认升级后构建无报错，CSS 变量和 CSS-in-JS 能正常工作。
- **控制台 warning**：运行应用并观察控制台，处理所有 `legacy API` 的提示。

## 遇到问题

如果您在升级过程中遇到问题，请到 [GitHub issues](https://github.com/antdv-next/antdv-next/issues/) 进行反馈。我们会尽快响应并在文档中完善相关说明。
