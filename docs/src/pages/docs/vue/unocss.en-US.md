---
title: UnoCSS
---

Before anything else, wrap the `App.vue` entry with `a-app` so the runtime has a parent style container:

```vue
<template>
  <a-app>
    <router-view />
  </a-app>
</template>
```

If you want to use atomic utility classes in an `antdv-next` project and have those classes map directly to Ant Design CSS variables, use `@antdv-next/unocss`.

This package provides UnoCSS presets built around Ant Design design tokens. It is a good fit when you want to keep UnoCSS / Wind-style utilities while preserving runtime theming.

## Package Info

- Package: `@antdv-next/unocss`
- `peerDependencies`: `unocss >= 66.0.0`

## Installation

```bash
pnpm add -D unocss @antdv-next/unocss
```

## When to use it

This package fits well when:

- you are already using UnoCSS
- you want to keep UnoCSS / Wind-style utility syntax
- you want colors, radius, shadows, and typography utilities to follow `antdv-next` CSS variables
- you need runtime theme switching instead of build-time fixed values

If you are using Tailwind CSS, see the [Tailwind CSS](/docs/vue/tailwindcss) guide.

## Available Presets

### `presetAntd`

This is the default preset. It follows the regular UnoCSS Wind3-style structure and works for most UnoCSS projects.

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      prefix: 'a',
      allowUnprefixed: true,
      antPrefix: 'ant',
    }),
  ],
})
```

Theme keys:

- `colors`
- `borderRadius`
- `fontSize`
- `boxShadow`

### `presetAntdTailwind4`

If you want to keep UnoCSS but prefer Tailwind CSS v4-style theme key naming, use this preset.

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntdTailwind4 } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntdTailwind4({
      prefix: 'a',
      allowUnprefixed: true,
      antPrefix: 'ant',
    }),
  ],
})
```

Theme keys:

- `colors`
- `radius`
- `text`
- `shadow`
- `defaults`

## Which one should you choose

### Choose `presetAntd`

- when you already have an UnoCSS setup
- when you want to keep the standard UnoCSS theme structure
- when you are combining it with presets like Wind3 or Attributify

### Choose `presetAntdTailwind4`

- when you prefer Tailwind CSS v4-style naming
- when you are migrating from Tailwind v4 to UnoCSS or mixing both approaches
- when you want theme keys such as `radius`, `shadow`, and `text`

## Prefixed and Unprefixed Syntax by Default

Both presets support these forms by default:

- prefixed syntax: `a-bg-primary`, `a-p-lg`, `a-rounded-lg`
- unprefixed syntax: `bg-primary`, `p-lg`, `rounded-lg`

For example:

```vue
<template>
  <div class="bg-primary color-white p-lg rounded-lg shadow-card">
    Unprefixed syntax
  </div>

  <div class="a-bg-primary a-color-white a-p-lg a-rounded-lg a-shadow-card">
    Prefixed syntax
  </div>
</template>
```

One important detail:

- text color uses `color-primary` or `c-primary`
- `text-*` is mainly for font size, such as `text-lg` and `text-h1`
- so for unprefixed text color, use `color-primary`, not `text-primary`

If you want to allow only `a-`-prefixed utilities, disable unprefixed support explicitly:

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      prefix: 'a',
      allowUnprefixed: false,
      antPrefix: 'ant',
    }),
  ],
})
```

After disabling it:

- `a-bg-primary`, `a-p-lg`, and `a-rounded-lg` still work
- `bg-primary`, `p-lg`, `rounded-lg`, and `color-primary` no longer match

## Utility Examples

```vue
<template>
  <div class="a-bg-primary a-color-white a-p-lg a-rounded-lg a-shadow-card">
    Primary card
  </div>

  <div class="a-bg-container a-color-text a-px-md a-py-sm a-border-border a-rounded-sm">
    Container content
  </div>

  <div class="a-text-lg a-color-primary a-mt-sm">
    Heading text
  </div>
</template>
```

Common utility groups include:

- colors: `a-color-*`, `a-bg-*`, `a-border-*`
- spacing: `a-m-*`, `a-p-*`, `a-mx-*`, `a-py-*`
- radius: `a-rounded-*`, `a-rd-*`
- shadows: `a-shadow-*`
- typography: `a-text-*`

When `allowUnprefixed: true`, most of the utilities above also have unprefixed counterparts.

## Common Utility Reference

### Colors and Backgrounds

| Class | Description | Typical Use |
| --- | --- | --- |
| `a-bg-primary` / `bg-primary` | Primary background color | Primary buttons, highlighted cards, emphasis areas |
| `a-bg-container` | Container background color | Cards, panels, form containers |
| `a-color-text` | Primary text color | Default body content |
| `a-color-primary` / `color-primary` | Primary text color | Links, emphasized text, highlighted titles |
| `a-color-text-secondary` | Secondary text color | Helper text and supporting content |
| `a-border-border` | Default border color | Dividers, inputs, card borders |
| `a-border-t-primary` | Top primary border color | Section accents and state markers |

### Spacing and Layout

| Class | Description | Typical Use |
| --- | --- | --- |
| `a-p-lg` / `p-lg` | Large padding | Cards, popups, layout containers |
| `a-px-md` | Medium horizontal padding | Buttons, tags, inputs |
| `a-py-sm` | Small vertical padding | Compact block elements |
| `a-mt-sm` | Small top margin | Vertical spacing between sections |
| `a-mx-lg` | Large horizontal margin | Horizontal whitespace adjustments |
| `a-my-xs` | Extra small vertical margin | Compact list items |

### Radius, Shadow, and Typography

| Class | Description | Typical Use |
| --- | --- | --- |
| `a-rounded-sm` | Small border radius | Inputs, tags, lightweight cards |
| `a-rounded-lg` / `rounded-lg` | Large border radius | Panels, cards, popup containers |
| `a-shadow-card` / `shadow-card` | Card shadow | Elevating card surfaces |
| `a-shadow-sec` | Secondary shadow | Lighter floating layers |
| `a-text-lg` / `text-lg` | Large text size | Section titles and emphasis text |
| `a-text-h1` / `text-h1` | H1 title size | Main page headings |

## Theme and Variables

These presets map utilities to Ant Design CSS variables, so colors, radius, shadows, and typography follow the active theme automatically.

In practice, make sure your app is already wired with `ConfigProvider`, and combine it with [Customize Theme](/docs/vue/customize-theme) when you need to adjust design tokens.

## Notes

- The preset mainly customizes `m-*` / `p-*` related utilities and does not override UnoCSS global spacing behavior.
- The default `prefix` is `a`, so generated classes usually look like `a-bg-primary` and `a-p-lg`.
- `allowUnprefixed` defaults to `true`, so unprefixed classes such as `bg-primary`, `p-lg`, and `color-primary` work out of the box. Set it to `false` if you want to enforce `a-*` only.
- The default `antPrefix` is `ant`. If you customize your CSS variable prefix, keep this option aligned.
