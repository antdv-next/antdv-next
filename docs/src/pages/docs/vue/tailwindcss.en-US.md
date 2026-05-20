---
title: Tailwind CSS
---

Before anything else, wrap the `App.vue` entry with `a-app` so the runtime has a parent style container:

```vue
<template>
  <a-app>
    <router-view />
  </a-app>
</template>
```

If you want to keep using Tailwind CSS in an `antdv-next` project while aligning utility classes with Ant Design design tokens, use `@antdv-next/tailwind`.

This plugin maps Ant Design CSS variables into Tailwind's theme system, so utilities like `bg-primary`, `shadow-card`, and `text-h1` can still follow `antdv-next` runtime theming.

## Version Compatibility

`@antdv-next/tailwind` ships in lockstep with `antdv-next`. Pick the matching version from the table below:

| `antdv-next` | `@antdv-next/tailwind` | Notes |
| --- | --- | --- |
| `>=1.3.0` | `^1.1.0` | **Current recommended.** Spacing tokens are aligned with antdv 1.3.0 (`p-xxl`, `p-xxxl`, `m-xxxl` are removed) and many new semantic tokens are added (`primary-text`, `success-bg-hover`, `text-placeholder`, `bg-solid`, …). Also introduces the v4 namespace-safe entry `compat.css`. |
| `<1.3.0` | `<1.1.0` | antdv before 1.3.0 still exposes the old spacing tokens. Pinning `@antdv-next/tailwind@<1.1.0` avoids referencing variables that no longer exist. |

> When you bump `antdv-next` to 1.3.0, bump `@antdv-next/tailwind` to `>=1.1.0` together. If you are still on antdv-next 1.2.x or earlier, pin `@antdv-next/tailwind` to the 1.0.x line.

## Package Info

- Package: `@antdv-next/tailwind`
- `peerDependencies`: `tailwindcss >= 3.0.0`

## Installation

For antdv-next 1.3.0+:

```bash
pnpm add -D tailwindcss @antdv-next/tailwind@^1.1.0
```

For antdv-next 1.2.x and earlier:

```bash
pnpm add -D tailwindcss @antdv-next/tailwind@~1.0
```

## When to use it

This package is a good fit when:

- your project already uses Tailwind CSS
- you want utilities aligned with Ant Design design tokens
- you want to keep the Tailwind workflow while integrating `antdv-next` theme variables
- you need runtime theme switching instead of fixed build-time colors

If you prefer an UnoCSS-based approach, see the [UnoCSS](/docs/vue/unocss) guide.

## Tailwind CSS v4 (Recommended)

Tailwind CSS v4 wires the theme through the `@theme` mechanism. Starting from 1.1.0, `@antdv-next/tailwind` ships **two parallel entries**:

| Entry | Utility example | When to use |
| --- | --- | --- |
| `theme.css` (classic) | `bg-primary`, `p-lg`, `text-lg`, `shadow-card` | Existing projects; accept antdv tokens occupying Tailwind's native utility namespace |
| `compat.css` (**recommended**) | `bg-ant-primary`, `p-ant-lg`, `text-ant-lg`, `shadow-ant-card` (plus optional `a-bg-primary` etc. shortcuts) | New projects; avoid clashes with Tailwind built-in tokens or project-level custom tokens |

> For the design rationale, see [css-plugin Issue #7 (RFC)](https://github.com/antdv-next/css-plugin/issues/7).

### Option 1: Import the theme file directly

```css
@import "tailwindcss";

/* Pick one — classic entry */
@import "@antdv-next/tailwind/theme.css";

/* Or — namespace-safe entry (recommended) */
@import "@antdv-next/tailwind/compat.css";
```

### Option 2: Generate theme CSS dynamically

If you need a custom CSS variable prefix or namespace, use the generators exported from the `v4` entry:

```ts
import {
  generateCompatThemeCSS,
  generateThemeCSS,
} from '@antdv-next/tailwind/v4'

// Classic entry (default antPrefix='ant')
const css = generateThemeCSS({
  antPrefix: 'my-app',
})

// Namespace-safe entry
const compatCss = generateCompatThemeCSS({
  antPrefix: 'ant',             // antdv CSS variable prefix
  tokenPrefix: 'ant',           // produces --color-ant-primary, @utility p-ant-lg
  prefix: 'a',                  // also emits @utility a-bg-primary shortcuts
  allowPrefixedUtilities: true, // toggle the shortcuts above
})
```

### compat.css options

- `antPrefix`: the antdv-next CSS variable prefix (must match your `ConfigProvider` `prefixCls`)
- `tokenPrefix`: namespace injected into every Tailwind v4 theme token, e.g. `--color-ant-primary`, `--padding-ant-lg`, `--text-ant-lg`. Also emits `@utility p-ant-lg { padding: var(--padding-ant-lg) }` style safe directional utilities so Tailwind's native `p-*` is not overridden
- `prefix`: extra prefixed utility shortcuts (e.g. `a-bg-primary`, `a-p-lg`) bound directly to antdv variables — they do not depend on `tokenPrefix`
- `allowPrefixedUtilities`: toggle the prefixed shortcuts. Disable it to keep only the namespaced tokens in `@theme inline`

## Tailwind CSS v3

If you are still on Tailwind CSS v3, use the plugin form.

### Basic setup

```ts
import antdPlugin from '@antdv-next/tailwind'

export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [antdPlugin],
}
```

### Custom setup

```ts
import { createAntdPlugin } from '@antdv-next/tailwind'

export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [
    createAntdPlugin({
      antPrefix: 'ant',
    }),
  ],
}
```

## Usage Example

```vue
<template>
  <!-- Classic theme.css writing -->
  <div class="bg-primary text-white p-lg rounded-lg shadow-card">
    <h1 class="text-h1 text-primary">Classic theme.css</h1>
    <p class="text-text-secondary mt-sm">
      Tailwind utilities powered by Ant Design theme variables
    </p>
  </div>

  <!-- compat.css recommended writing (namespace-safe) -->
  <div class="bg-ant-primary text-ant-light-solid p-ant-lg rounded-ant-lg shadow-ant-card">
    <h1 class="text-ant-h1 color-ant-primary">Namespace safe</h1>
    <p class="color-ant-text-secondary mt-ant-sm">
      Doesn't collide with Tailwind built-in tokens
    </p>
  </div>

  <!-- compat.css also emits a-* prefixed shortcuts -->
  <div class="a-bg-primary a-color-white a-p-lg a-rounded-lg a-shadow-card">
    <h1 class="a-text-h1">Prefixed shortcut</h1>
  </div>
</template>
```

## Tailwind v4 Utility Mapping

| Category | Classic `theme.css` | Recommended `compat.css` | Shortcut |
| --- | --- | --- | --- |
| Color | `bg-primary`, `text-blue-5` | `bg-ant-primary`, `text-ant-blue-5` | `a-bg-primary`, `a-c-primary` |
| Padding | `p-lg`, `px-sm` | `p-ant-lg`, `px-ant-sm` | `a-p-lg`, `a-px-sm` |
| Margin | `m-lg`, `my-sm` | `m-ant-lg`, `my-ant-sm` | `a-m-lg`, `a-my-sm` |
| Radius | `rounded-lg` | `rounded-ant-lg` | `a-rounded-lg`, `a-rd-lg` |
| Font size | `text-h1` | `text-ant-h1` | `a-text-h1` |
| Shadow | `shadow-card` | `shadow-ant-card` | `a-shadow-card` |

## Common Utility Reference

### Colors and Backgrounds

| Classic `theme.css` | Namespace-safe `compat.css` | Description |
| --- | --- | --- |
| `bg-primary` | `bg-ant-primary` | Primary background color |
| `text-primary` | `color-ant-primary` | Primary text color |
| `bg-success` | `bg-ant-success` | Success background color |
| `text-text-secondary` | `color-ant-text-secondary` | Secondary text color |
| `bg-container` | `bg-ant-container` | Container background color |
| `border-border` | `border-ant-border` | Default border color |

### Spacing and Layout

| Classic | Namespace-safe | Description |
| --- | --- | --- |
| `p-lg` | `p-ant-lg` | Large padding |
| `px-md` | `px-ant-md` | Medium horizontal padding |
| `py-sm` | `py-ant-sm` | Small vertical padding |
| `m-md` | `m-ant-md` | Medium margin |
| `mt-sm` | `mt-ant-sm` | Small top margin |
| `rounded-lg` | `rounded-ant-lg` | Large border radius |

### Typography and Shadows

| Classic | Namespace-safe | Description |
| --- | --- | --- |
| `text-h1` | `text-ant-h1` | H1 title size |
| `text-lg` | `text-ant-lg` | Large text |
| `text-sm` | `text-ant-sm` | Small text |
| `shadow-card` | `shadow-ant-card` | Card shadow |
| `shadow-sec` | `shadow-ant-sec` | Secondary shadow |
| `shadow-ter` | `shadow-ant-ter` | Tertiary shadow |

## Spacing Tokens (aligned with antdv 1.3.0)

- Padding: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`
- Margin: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`

> Starting from 1.1.0, `p-xxl`, `p-xxxl`, and `m-xxxl` are no longer generated because antdv 1.3.0 removed the underlying CSS variables. If you are still on antdv-next 1.2.x or earlier, pin `@antdv-next/tailwind` to the 1.0.x line.

## New Tokens Added in 1.3.0 (available since 1.1.0)

The semantic token set is now fully aligned with antdv 1.3.0:

- Primary / Success / Warning / Error / Info each provide ten steps: `*-bg`, `*-bg-hover`, `*-border`, `*-border-hover`, `*-hover`, `*`, `*-active`, `*-text`, `*-text-hover`, `*-text-active`
- Error extras: `error-bg-filled-hover`, `error-bg-active`, `error-affix`
- Warning extras: `warning-affix`
- Text: `text-placeholder`, `text-disabled`, `text-heading`, `text-label`, `text-description`, `text-light-solid`
- Fill: `fill-content`, `fill-content-hover`, `fill-alter`
- Background: `container-disabled`, `spotlight`, `blur`, `solid`, `solid-hover`, `solid-active`
- Border: `border-disabled`, `border-bg`
- Icon: `icon`, `icon-hover`
- Misc: `highlight`, `white`

## Relation to Theming

This plugin relies on Ant Design CSS variables, so your app should already be wrapped with `ConfigProvider`. Combine it with [Customize Theme](/docs/vue/customize-theme) when you need to adjust tokens.

```vue
<script setup lang="ts">
import { ConfigProvider } from 'antdv-next'
</script>

<template>
  <ConfigProvider>
    <RouterView />
  </ConfigProvider>
</template>
```

## Notes

- For v4 the recommended path is importing `compat.css`: namespace-safe, no collisions with Tailwind built-in utilities. You can keep `theme.css` for existing projects.
- Starting from 1.1.0, `theme.css` no longer emits `p-xxl` / `p-xxxl` / `m-xxxl` so it stays consistent with antdv 1.3.0's actual CSS variables.
- Both v3 and v4 keep Tailwind global spacing behavior intact, so classes like `gap-*` and `max-w-*` still follow Tailwind defaults.
- If you change the CSS variable prefix, keep `antPrefix` aligned in the plugin / generator config.
- `compat.css`'s namespace defaults to `ant` (i.e. `bg-ant-primary`). Override it via `generateCompatThemeCSS({ tokenPrefix: 'antd' })` to get `bg-antd-primary` style utilities.
