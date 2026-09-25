---
title: FAQ
---

## Components are not vertically aligned when placed in single row.

Try [Space](/components/space/) component to make them aligned.

## Why do third-party SVG icons have margin-block-end? {#faq-icon-margin-block-end}

Components such as Breadcrumb, Collapse, Segmented, Tabs, and Tag apply `display: inline-block`, `vertical-align: middle`, and `margin-block-end: 0.2em` to SVGs rendered directly in the corresponding icon slots to adjust their visual alignment with text.

In inline layout, an SVG has no text baseline, so its bottom edge participates in baseline alignment by default, which can make it appear too high next to text. `display: inline-block` keeps the icon in the inline flow, while `vertical-align: middle` aligns the center of its margin box to the parent's baseline plus half its x-height (the height of a lowercase x), making the alignment independent of the icon's height.

However, the center of the x-height is usually lower than the center of capital letters, so a small upward optical adjustment is needed. `margin-block-end: 0.2em` adds a margin below the icon. Once the margin box is centered, the icon itself moves up by about `0.1em`, bringing it closer to the center of capital letters in common fonts. The `0.2em` value approximates the difference between cap height and x-height in common fonts, and using `em` makes the adjustment scale with the font size.

These styles target directly rendered SVGs. Icons from `@antdv-next/icons` wrap their SVG in an extra container and use their own alignment styles. Different fonts, internal icon whitespace, or an icon's own `vertical-align` can affect the result. If an icon already handles its own alignment, or an icon-only use case does not need text alignment compensation, you can locally override the corresponding SVG with `margin-block-end: 0` and adjust its own styles as needed.

## My component's default locale is English, how do I switch back to Chinese? {#how-to-switch-the-default-locale-to-chinese}

Try wrapping your app with the [ConfigProvider](/components/config-provider#config-provider-demo-locale) component.

If the locale of date components still does not take effect, set `dayjs.locale('zh-cn')` and **check whether the `dayjs` version in your project matches the `dayjs` version required by `antdv-next`**.

## Date-related components locale is not working?

Please check whether you have imported dayjs locale correctly.

```jsx
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
```

Please check whether there are two versions of dayjs installed.

```jsx
npm ls dayjs
```

If you are using a mismatched version of dayjs with antdv-next dependent dayjs in your project. That would be a problem cause locale not working.

## Why is a DOM node still rendered for some empty content? {#vue-renderable}

antdv-next uses the internal `isRenderable` utility to determine whether a content wrapper DOM should be created. It is designed as a compatibility-oriented content presence check, not a validator for valid Vue nodes, and it does not recursively predict whether Vue will eventually produce visible content.

`isRenderable` treats only `null`, `undefined`, `false`, and the empty string `''` as having no content. All other values are treated as content. Therefore, when it controls whether a wrapper DOM is rendered:

| Value | `isRenderable` | Result |
| --- | --- | --- |
| `null`, `undefined`, `false`, `''` | `false` | Neither the wrapper DOM nor any content is rendered |
| `true` | `true` | The wrapper DOM is created, but Vue renders no text content for `true` |
| `0` | `true` | The wrapper DOM is created and `0` is rendered normally |
| Non-empty strings, other numbers, VNodes, etc. | `true` | The wrapper DOM is created and Vue handles the content |

Here, `false` is treated as an explicit no-content marker, while `true` means that content was provided. Although `true` itself produces no text node, the wrapper DOM is still created. Similarly, an empty array, an empty Fragment, or a component that eventually returns `null` passes the check. The number `0` is not mistaken for empty content and is rendered normally.

## Camelcase slots / render props (e.g. `#tagRender`) don't work when using the CDN (UMD) build?

This is a limitation of Vue **in-DOM templates**, not a component bug. When the template is written directly in the page's HTML (e.g. inside `<div id="app">`), the browser's HTML parser **lowercases** tag and attribute names — including slot names, so `#tagRender` reaches the component as `tagrender` instead of `tagRender`, and the camelCase slot never fires. This applies to every camelCase slot (`tagRender`, `maxTagPlaceholder`, `popupRender`, …), and writing `#tagrender` in lowercase does not help either. See the Vue docs on [in-DOM template parsing caveats](https://vuejs.org/guide/essentials/component-basics.html#in-dom-template-parsing-caveats).

Pick any of the following (the first two need no build tooling):

**Option 1: Write the template as a JS string** (recommended for CDN usage, smallest change). Instead of putting the markup in the page HTML, move it into the `template` option string, which Vue's runtime compiler parses case-sensitively:

```js
const App = {
  template: `
    <a-tree-select :tree-data="treeData" multiple style="width: 100%">
      <template #tagRender="tagProps">
        <span style="color: red">{{ tagProps.label }}</span>
      </template>
    </a-tree-select>
  `,
  setup() {
    return { treeData }
  },
}
Vue.createApp(App).use(window.antd).mount('#app')
```

**Option 2: Use a render function `h`**:

```js
const { h } = Vue
h(window.antd.TreeSelect, { treeData, multiple: true }, {
  tagRender: props => h('span', { style: 'color: red' }, props.label),
})
```

**Option 3: Use a Single-File Component (`.vue`) with a build tool** such as Vite / webpack. Recommended for real projects — the SFC compiler preserves case and is not affected by this limitation.

## Why do popups have no animation, or flash at the viewport edge before settling? {#popup-animation-missing-with-reduced-motion}

This is usually not a component issue but a global "reduced motion" style on the page. Many projects copy this CSS from boilerplate:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

It only takes effect when the operating system asks for reduced motion. This is an OS setting, not a browser one:

- Windows 11: Settings → Accessibility → Visual effects, when "Animation effects" is turned off (on Windows 10: Settings → Ease of Access → Display → "Show animations in Windows"). It is also often off over Remote Desktop, in virtual machines, and when the performance options are set to "Adjust for best performance".
- macOS: System Settings → Accessibility → Display, when "Reduce motion" is turned on. It is off by default.

That is why the problem looks like it "only happens on some Windows machines". Once the style applies:

1. `animation-duration` shortens the enter/leave animations (CSS keyframes) of popups such as Dropdown, Select and Tooltip to 0.01ms, so they look like they have no animation.
2. `transition-property` defaults to `all`, so `transition-duration` gives every element a transition it never declared, including the popup's position properties. Popups aligned to the right or bottom (e.g. a `bottomRight` dropdown or a `top` Tooltip) may then appear at the viewport edge in the first frame after opening and jump into place afterwards.

**How to check**: run `matchMedia('(prefers-reduced-motion: reduce)').matches` in the browser console. `true` means the OS asks for reduced motion. On another machine you can reproduce it by emulating `prefers-reduced-motion: reduce` in the Rendering panel of Chrome DevTools.

**How to fix**:

- If animations should look the same on every device, remove the global style and write reduced-motion rules only for the elements that need them. antdv-next components do not follow this OS setting themselves, which matches antd.
- If you want to keep the global rule but let popups animate as usual, exclude the popup root elements from it. If you changed `prefixCls`, replace `ant` with your prefix:

```css
@media (prefers-reduced-motion: reduce) {
  *:not(.ant-dropdown, .ant-select-dropdown, .ant-cascader-dropdown, .ant-picker-dropdown, .ant-tooltip, .ant-popover),
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
