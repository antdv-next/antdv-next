---
group:
  title: Advanced
order: 1
title: CSS Compatible
---

## Default Style Compatibility

Antdv Next supports the [last 2 versions of modern browsers](https://browsersl.ist/#q=defaults). By default, we use some modern CSS features to improve style maintainability and extensibility. These features may not be supported in older browsers, but we can solve this through some compatibility solutions.

| Feature | antdv-next version | Compatibility | Minimum Chrome Version | Compatibility workaround |
| --- |-------------------| --- | --- | --- |
| [:where Selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) | `>=1.0.0`         | [caniuse](https://caniuse.com/?search=%3Awhere) | Chrome 88 | `<StyleProvider hashPriority="high">` |
| [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties) | `>=1.0.0`         | [caniuse](https://caniuse.com/css-logical-props) | Chrome 89 | `<StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>` |

If you need to support older browsers, please use `@antdv-next/cssinjs` [StyleProvider](https://github.com/ant-design/cssinjs#styleprovider) for degradation handling according to your actual requirements.

## `:where` Selector

- Support Version: `>=1.0.0`
- MDN: [:where](https://developer.mozilla.org/en-US/docs/Web/CSS/:where)
- Browser Compatibility: [caniuse](https://caniuse.com/?search=%3Awhere)
- Minimum Chrome Version Supported: 88
- Default Enabled: Yes

The CSS-in-JS feature of Antdv Next uses the ":where" selector by default to lower the CSS selector specificity, reducing the additional cost of adjusting custom styles when upgrading for users. However, the compatibility of the ":where" syntax is relatively poor in older browsers ([compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/:where#browser_compatibility)). In certain scenarios, if you need to support older browsers, you can use `@antdv-next/cssinjs` to disable the default lowering of specificity (please ensure version consistency with antd).

```vue
<template>
  <!-- `hashPriority` defaults to `low`, when set to `high`, -->
  <!-- it will remove the `:where` selector wrapper -->
  <a-style-provider hash-priority="high">
    <MyApp />
  </a-style-provider>
</template>
```

It will turn `:where` to class selector:

```diff
--  :where(.css-bAMboO).ant-btn {
++  .css-bAMboO.ant-btn {
      color: #fff;
    }
```

Note: After turning off the `:where` downgrade, you may need to manually adjust the priority of some styles. Or you can **use PostCSS plugin** to raise application css selector priority. PostCSS provides many plugins can help on this. e.g:

- [postcss-scopify](https://www.npmjs.com/package/postcss-scopify)
- [postcss-increase-specificity](https://www.npmjs.com/package/postcss-increase-specificity)
- [postcss-add-root-selector](https://www.npmjs.com/package/postcss-add-root-selector)

Raise priority through plugin:

```diff
--  .my-btn {
++  #root .my-btn {
      background: red;
    }
```

## CSS Logical Properties

- Support Version: `>=1.0.0`
- MDN: [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- Browser Compatibility: [caniuse](https://caniuse.com/css-logical-props)
- Minimum Chrome Version Supported: 89
- Default Enabled: Yes

To unify LTR and RTL styles, Antdv Next uses CSS logical properties. For example, the original `margin-left` is replaced by `margin-inline-start`, so that it is the starting position spacing under both LTR and RTL. If you need to be compatible with older browsers (such as 360 Browser, QQ Browser, etc.), you can configure `transformers` through the `StyleProvider` of `@antdv-next/cssinjs`:

```vue
<script lang="ts" setup>
import { legacyLogicalPropertiesTransformer } from '@antdv-next/cssinjs'
</script>

<template>
  <!-- `transformers` provides preprocessing to transform styles -->
  <a-style-provider :transformers="[legacyLogicalPropertiesTransformer]">
    <MyApp />
  </a-style-provider>
</template>
```

When toggled, styles will downgrade CSS logical properties:

```diff
.ant-modal-root {
-- inset: 0;
++ top: 0;
++ right: 0;
++ bottom: 0;
++ left: 0;
}
```

## `@layer` Specificity Lowering

- Support Version: `>=1.0.0`
- MDN: [@layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- Browser Compatibility: [caniuse](https://caniuse.com/?search=%40layer)
- Minimum Chrome Version Supported: 99
- Default Enabled: No

Antdv Next supports configuring `@layer` for unified specificity lowering since `1.0.0`. After the downgrade, the style of antd will always be lower than the default CSS selector priority, so that users can override the style (please be sure to check the browser compatibility of `@layer`). When enable `layer`, the child element **must** wrap ConfigProvider to update the icon-related styles:

```vue
<template>
  <a-style-provider layer>
    <a-config-provider>
      <MyApp />
    </a-config-provider>
  </a-style-provider>
</template>
```

antd styles will be encapsulated in `@layer` to lower the priority:

```diff
++  @layer antd {
      :where(.css-bAMboO).ant-btn {
        color: #fff;
      }
++  }
```

⚠️ zeroRuntime Scenario Notes

When `zeroRuntime` is enabled, Antdv Next’s styles are precompiled into a standalone `antd.css` file. If you also enable the `@layer` specificity–lowering mechanism, you must ensure that `antd.css` is placed inside the same layer (e.g., `layer(antd)`). Otherwise, its specificity will be higher than the styles injected by StyleProvider, causing the lowering mechanism to fail or resulting in unexpected override behavior.

```css
/* global.css / app.css */
@layer theme, base, antd, components, utilities;

/* The precompiled antd.css output by zeroRuntime must explicitly specify a layer */
@import url(antd.css) layer(antd);
```

If you cannot use the `@import ... layer()` syntax, you may wrap the content during your build process instead:

```css
@layer antd {
  /* contents of antd.css */
}
```

## autoPrefixer

- Support Version: `>=1.0.0`
- Browser Compatibility: Automatically adds browser prefixes for wider browser support
- Default Enabled: No

Some styles rely on browser prefixes for compatibility. The `autoPrefixer` transformer can automatically add browser prefixes to styles, ensuring they work properly across different browsers.

```vue
<script lang="ts" setup>
import { autoPrefixTransformer } from '@antdv-next/cssinjs'
</script>

<template>
  <a-style-provider :transformers="[autoPrefixTransformer]">
    <MyApp />
  </a-style-provider>
</template>
```

The final transformed styles:

```diff
  .sample-box {
--  user-select: none;
++  -webkit-user-select: none;
++  -moz-user-select: none;
++  -ms-user-select: none;
++  user-select: none;
  }
```

## Rem Adaptation

In responsive web development, there is a need for a convenient and flexible way to achieve page adaptation and responsive design. The `px2remTransformer` transformer can quickly and accurately convert pixel units in style sheets to rem units relative to the root element (HTML tag), enabling the implementation of adaptive and responsive layouts.

```vue
<script lang="ts" setup>
import { px2remTransformer } from '@antdv-next/cssinjs'

const px2rem = px2remTransformer({
  rootValue: 32, // 32px = 1rem; @default 16
})
</script>

<template>
  <a-style-provider :transformers="[px2rem]">
    <MyApp />
  </a-style-provider>
</template>
```

The resulting transformed styles:

```diff
 .px2rem-box {
-  width: 400px;
+  width: 12.5rem;
   background-color: green;
-  font-size: 32px;
+  font-size: 1rem;
   border: 10PX solid #f0f;
 }

 @media only screen and (max-width: 600px) {
   .px2rem-box {
     background-color: red;
-    margin: 10px;
+    margin: 0.3125rem;
   }
 }
```

### Options

<!-- prettier-ignore -->
| Parameter | Description  | Type | Default |
| --- | --- | --- | --- |
| rootValue | Font size of the root element | `number` | 16 |
| precision | Decimal places for the converted value | `number` | 5 |
| mediaQuery | Whether to convert px in media queries | `boolean` | false |

For more details, please refer to: [px2rem.ts#Options](https://github.com/ant-design/cssinjs/blob/master/src/transformers/px2rem.ts)

## Shadow DOM Usage

Since `<style />` tag insertion is different from normal DOM in Shadow DOM scenario, you need to use `StyleProvider` of `@antdv-next/cssinjs` to configure the `container` property to set the insertion position:

```tsx
import { StyleProvider } from '@antdv-next/cssinjs'
import { render } from 'vue'

const shadowRoot = someEle.attachShadow({ mode: 'open' })
const container = document.createElement('div')
shadowRoot.appendChild(container)

render(
  <StyleProvider container={shadowRoot}>
    <MyApp />
  </StyleProvider>,
  container
)
```

## Compatible with Third-party Style Libraries

In some cases, you may need antd to coexist with other style libraries, such as `Tailwind CSS`, `Emotion`, `styled-components`, etc. Unlike traditional CSS solutions, these third-party libraries are often not easy to override antd styles by increasing CSS selector priority. You can configure `@layer` for antd to lower its CSS selector weight, and arrange `@layer` order to solve style override problems:

### antd config `@layer`

As mentioned earlier, when using StyleProvider, you must wrap ConfigProvider to update icon-related styles:

```vue
<template>
  <a-style-provider layer>
    <a-config-provider>
      <MyApp />
    </a-config-provider>
  </a-style-provider>
</template>
```

### TailwindCSS Arrange `@layer`

Before starting the following configuration, you need to enable [`@layer`](#layer) feature.

#### TailwindCSS v3

In global.css, adjust `@layer` to control the order of style override. Place `tailwind-base` before `antd`:

```less
@layer tailwind-base, antd;

@layer tailwind-base {
  @tailwind base;
}
@tailwind components;
@tailwind utilities;
```

#### TailwindCSS v4

In global.css, adjust `@layer` to control the order of style override. Place `antd` in the right position:

```less
@layer theme, base, antd, components, utilities;

@import 'tailwindcss';
```

### reset.css and antd.css

If you are using Antdv Next’s `reset.css`, you need to assign it to a specific `@layer` to prevent it from overriding the lowered-specificity antd styles. Similarly, in the `zeroRuntime` scenario, if you import `antd.css` separately, you must also place it inside `layer(antd)` to keep the layer hierarchy consistent:

```css
/* Both reset.css and antd.css must specify a layer */
@layer reset, antd;

/* reset styles */
@import url(reset.css) layer(reset);

/* antd styles */
@import url(antd.css) layer(antd);
```

This ensures that:

- reset.css will not override Antdv Next styles that have been lowered via @layer
- antd.css (in zeroRuntime mode) stays aligned with the layer injected by StyleProvider
- Layer order still works correctly with third-party styling systems such as Tailwind, Emotion, or other CSS-in-JS libraries

### With other CSS-in-JS libraries

After configuring `@layer` for antd, you don't need to do any additional configuration for other CSS-in-JS libraries. Your CSS-in-JS can completely override antd styles.

### SSR Scene

When using SSR, styles are often rendered inline in HTML through `<style />`. At this time, please make sure that the styles with the specified `@layer` priority order are loaded before `@layer` is used.

#### ❌ Wrong

```html
<head>
  <!-- SSR Injection style -->
  <style>
    @layer antd {
      /** ... */
    }
  </style>

  <!-- css file contains @layer xxx, antd; -->
  <link rel="stylesheet" href="/b9a0m0b9o0o3.css" />
  <!-- or write @layer xxx, antd; in html directly -->
  <style>
    @layer xxx, antd;
  </style>
</head>
```

#### ✅ Correct

```html
<head>
  <!-- css file contains @layer xxx, antd; -->
  <link rel="stylesheet" href="/b9a0m0b9o0o3.css" />
  <!-- or write @layer xxx, antd; in html directly -->
  <style>
    @layer xxx, antd;
  </style>

  <!-- SSR Injection style -->
  <style>
    @layer antd {
      /** ... */
    }
  </style>
</head>
```
