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

## Version Compatibility

`@antdv-next/unocss` ships in lockstep with `antdv-next`. Pick the matching version from the table below:

| `antdv-next` | `@antdv-next/unocss` | Notes |
| --- | --- | --- |
| `>=1.3.0` | `^1.1.0` | **Current recommended.** Spacing tokens are aligned with antdv 1.3.0 (`p-xxl`, `p-xxxl`, `m-xxxl` are removed) and many new semantic tokens are added (`primary-text`, `success-bg-hover`, `text-placeholder`, `bg-solid`, …). Also introduces the namespace-safe mode (`bg-ant-primary`). |
| `<1.3.0` | `<1.1.0` | antdv before 1.3.0 still exposes the old spacing tokens. Pinning `@antdv-next/unocss@<1.1.0` avoids generating utilities that point at variables which no longer exist. |

> When you bump `antdv-next` to 1.3.0, bump `@antdv-next/unocss` to `>=1.1.0` together. If you are still on antdv-next 1.2.x or earlier, pin `@antdv-next/unocss` to the 1.0.x line.

## Package Info

- Package: `@antdv-next/unocss`
- `peerDependencies`: `unocss >= 66.0.0`

## Installation

For antdv-next 1.3.0+:

```bash
pnpm add -D unocss @antdv-next/unocss@^1.1.0
```

For antdv-next 1.2.x and earlier:

```bash
pnpm add -D unocss @antdv-next/unocss@~1.0
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

The default preset. It follows the regular UnoCSS Wind3-style structure and works for most UnoCSS projects.

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      prefix: 'a',                  // class prefix, default: 'a'
      allowPrefixedUtilities: true, // keep a-* utilities, default: true
      allowUnprefixed: true,        // keep legacy bare classes like bg-primary, default: true
      antPrefix: 'ant',             // CSS variable prefix, default: 'ant'
      tokenPrefix: 'ant',           // namespace prefix, default: 'ant' (empty disables)
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
      allowPrefixedUtilities: true,
      allowUnprefixed: true,
      antPrefix: 'ant',
      tokenPrefix: 'ant',
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

## Three Utility Patterns (since 1.1.0)

Both presets emit three parallel utility forms that can be toggled independently:

| Mode | Example | Control | Use when |
| --- | --- | --- | --- |
| **Prefixed (stable)** | `a-bg-primary`, `a-p-lg` | `allowPrefixedUtilities` (default `true`) | Most projects; clearly isolates antdv utilities |
| **Namespace-safe (preferred replacement for the legacy bare form)** | `bg-ant-primary`, `p-ant-lg` | `tokenPrefix` (default `'ant'`, empty disables) | You want short class names without polluting UnoCSS native tokens |
| **Legacy bare (back-compat)** | `bg-primary`, `p-lg` | `allowUnprefixed` (default `true`; will flip to `false` next major) | Existing projects only |

Example:

```vue
<template>
  <!-- Stable prefixed API -->
  <div class="a-bg-primary a-color-white a-p-lg a-rounded-lg a-shadow-card">
    Prefixed
  </div>

  <!-- Namespace-safe API (recommended) -->
  <div class="bg-ant-primary color-ant-white p-ant-lg rounded-ant-lg shadow-ant-card">
    Namespace safe
  </div>

  <!-- Legacy bare form (still works, but risks collisions) -->
  <div class="bg-primary color-white p-lg rounded-lg shadow-card">
    Legacy bare
  </div>
</template>
```

Important details:

- Text color uses `color-primary` or `c-primary` (or `color-ant-primary` / `c-ant-primary` in namespace mode)
- `text-*` is primarily for font size, e.g. `text-lg`, `text-h1` (in namespace mode: `text-ant-lg`)

If you want to allow only `a-*` and `*-ant-*` utilities while disabling the legacy bare form:

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      allowUnprefixed: false, // disables bg-primary / text-sm style classes
      // allowPrefixedUtilities: true and tokenPrefix: 'ant' remain in effect
    }),
  ],
})
```

> `allowUnprefixed: false` only disables legacy bare classes — it **does not** rewrite theme keys. `a-bg-primary` and `bg-ant-primary` continue to work.

## Spacing Tokens (aligned with antdv 1.3.0)

- Padding: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`
- Margin: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`

> Starting from 1.1.0, `p-xxl`, `p-xxxl`, and `m-xxxl` are no longer generated because antdv 1.3.0 removed the underlying CSS variables. If you are still on antdv-next 1.2.x or earlier, pin `@antdv-next/unocss` to the 1.0.x line.

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

Common utility groups (each has `a-*`, `*-ant-*`, and bare forms):

- colors: `color-*`, `bg-*`, `border-*` (plus shorthand `b-*` and directional `bt-`, `bx-`, etc.)
- spacing: `m-*`, `p-*`, `mx-*`, `py-*`
- radius: `rounded-*`, `rd-*`
- shadows: `shadow-*`
- typography: `text-*`

## Common Utility Reference

### Colors and Backgrounds

| Prefixed | Namespace-safe | Description |
| --- | --- | --- |
| `a-bg-primary` | `bg-ant-primary` | Primary background |
| `a-bg-container` | `bg-ant-container` | Container background |
| `a-bg-success-bg` | `bg-ant-success-bg` | Light success background |
| `a-color-primary` | `color-ant-primary` | Primary text color |
| `a-color-text` | `color-ant-text` | Default text color |
| `a-color-text-secondary` | `color-ant-text-secondary` | Secondary text |
| `a-border-border` | `border-ant-border` | Default border |
| `a-border-t-primary` | `border-t-ant-primary` | Top primary border |

### Spacing and Layout

| Prefixed | Namespace-safe | Description |
| --- | --- | --- |
| `a-p-lg` | `p-ant-lg` | 24px padding |
| `a-px-md` | `px-ant-md` | 20px horizontal padding |
| `a-py-sm` | `py-ant-sm` | 12px vertical padding |
| `a-mt-sm` | `mt-ant-sm` | 12px top margin |
| `a-mx-lg` | `mx-ant-lg` | 24px horizontal margin |
| `a-my-xs` | `my-ant-xs` | 8px vertical margin |

### Radius, Shadow, Typography

| Prefixed | Namespace-safe | Description |
| --- | --- | --- |
| `a-rounded-sm` | `rounded-ant-sm` | Small radius |
| `a-rounded-lg` | `rounded-ant-lg` | Large radius |
| `a-rounded` | `rounded-ant` | Default radius |
| `a-shadow-card` | `shadow-ant-card` | Card shadow |
| `a-shadow` | `shadow-ant` | Default shadow |
| `a-text-lg` | `text-ant-lg` | Large text |
| `a-text-h1` | `text-ant-h1` | H1 title size |

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

## Theme and Variables

These presets map utilities to Ant Design CSS variables, so colors, radius, shadows, and typography follow the active theme automatically.

In practice, make sure your app is already wired with `ConfigProvider`, and combine it with [Customize Theme](/docs/vue/customize-theme) when you need to adjust design tokens.

## Notes

- The preset mainly customizes `m-*` / `p-*` related utilities and does not override UnoCSS global spacing behavior (`w-*`, `max-w-*`, `gap-*` keep their UnoCSS defaults).
- The default `prefix` is `a`, so generated classes usually look like `a-bg-primary` and `a-p-lg`.
- `allowUnprefixed` defaults to `true` today but will flip to `false` in the next major. Migrate to `a-*` or `*-ant-*` writers early.
- `allowUnprefixed: false` only disables the legacy bare form — it **does not** rewrite theme keys (`colors.primary` stays `colors.primary`).
- The default `antPrefix` is `ant`. If you customize your CSS variable prefix, keep this option aligned.
- The default `tokenPrefix` is `ant`. Override it (for example `'antd'`) to customize the namespace, or pass an empty string to disable namespace mode.
