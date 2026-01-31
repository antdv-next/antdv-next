# @antdv-next/unocss

UnoCSS presets for AntDv Next, providing utility classes that map to Ant Design CSS variables.

## Installation

```bash
pnpm add -D @antdv-next/unocss
```

## Presets

This package provides two presets:

### 1. `presetAntd` (Default)

Standard preset compatible with UnoCSS Wind3 style, suitable for most projects.

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      prefix: 'a',      // class prefix, default: 'a'
      antPrefix: 'ant', // CSS variable prefix, default: 'ant'
    }),
  ],
})
```

**Theme Keys:**
- `colors` - Color palette
- `spacing` - Padding/Margin values
- `borderRadius` - Border radius values
- `fontSize` - Font size values
- `boxShadow` - Shadow values

### 2. `presetAntdTailwind4` (New)

Tailwind 4 compatible preset, aligned with the latest Tailwind CSS v4 theme structure.

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntdTailwind4 } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntdTailwind4({
      prefix: 'a',      // class prefix, default: 'a'
      antPrefix: 'ant', // CSS variable prefix, default: 'ant'
    }),
  ],
})
```

**Theme Keys (Tailwind 4 style):**
- `colors` - Color palette
- `spacing` - Unified spacing (replaces separate width/height/padding/margin)
- `radius` - Border radius (renamed from `borderRadius`)
- `text` - Text configuration (includes fontSize, lineHeight, letterSpacing)
- `shadow` - Box shadow (renamed from `boxShadow`)
- `defaults` - Default values for reset styles

## Key Differences

| Feature | presetAntd | presetAntdTailwind4 |
|---------|------------|---------------------|
| Theme style | UnoCSS Wind3 | Tailwind CSS v4 |
| Border radius key | `borderRadius` | `radius` |
| Shadow key | `boxShadow` | `shadow` |
| Font size | `fontSize` | `text.*.fontSize` |
| Defaults support | ❌ | ✅ `defaults` |
| CSS layers | Standard | `properties`, `theme`, `base` |

## Usage Examples

Both presets support the same utility class patterns:

```vue
<template>
  <!-- Colors -->
  <div class="a-bg-primary a-color-white">Primary Background</div>
  <div class="a-bg-container a-color-text">Container Background</div>

  <!-- Spacing -->
  <div class="a-p-lg a-m-sm">Padding & Margin</div>
  <div class="a-px-md a-py-xs">Directional Spacing</div>

  <!-- Border -->
  <div class="a-border-primary a-rounded-lg">Bordered & Rounded</div>
  <div class="a-border-t-success">Top Border Color</div>

  <!-- Shadow -->
  <div class="a-shadow-card">Card Shadow</div>

  <!-- Text -->
  <div class="a-text-lg a-color-primary">Large Text</div>
</template>
```

## When to Use Which?

### Use `presetAntd` if:
- You're using other UnoCSS presets (Wind3, Attributify, etc.)
- You prefer the standard UnoCSS theme structure
- You need compatibility with existing UnoCSS configurations

### Use `presetAntdTailwind4` if:
- You're migrating from or working with Tailwind CSS v4
- You want alignment with the latest Tailwind CSS conventions
- You prefer the new `radius`, `shadow`, and `text` theme keys
- You need the `defaults` configuration for reset styles

## Supported Utility Classes

### Color Utilities
- `a-color-{color}` / `a-c-{color}` - Text color
- `a-bg-{color}` - Background color
- `a-border-{color}` / `a-b-{color}` - Border color
- Directional borders: `a-border-t-{color}`, `a-border-r-{color}`, etc.

### Spacing Utilities
- `a-m-{size}` - Margin
- `a-mt-{size}`, `a-mr-{size}`, `a-mb-{size}`, `a-ml-{size}` - Directional margin
- `a-mx-{size}`, `a-my-{size}` - Horizontal/Vertical margin
- `a-p-{size}` - Padding
- `a-pt-{size}`, `a-pr-{size}`, `a-pb-{size}`, `a-pl-{size}` - Directional padding
- `a-px-{size}`, `a-py-{size}` - Horizontal/Vertical padding

### Border Radius Utilities
- `a-rounded` / `a-rd` - Border radius
- `a-rounded-{size}` / `a-rd-{size}` - Border radius with size
- Corner specific: `a-rounded-tl-{size}`, `a-rounded-tr-{size}`, etc.
- Side specific: `a-rounded-t-{size}`, `a-rounded-r-{size}`, etc.

### Shadow Utilities
- `a-shadow` - Default shadow
- `a-shadow-{type}` - Specific shadow type (card, drawer-r, etc.)

### Text Utilities
- `a-text-{size}` - Font size (sm, lg, xl, h1, h2, h3)

## Available Theme Tokens

### Colors
- Primary: `primary`, `primary-hover`, `primary-active`, `primary-bg`
- Status: `success`, `warning`, `error`, `info` (+ `-bg`, `-border`, `-hover`)
- Link: `link`, `link-hover`, `link-active`
- Text: `text`, `text-secondary`, `text-tertiary`, `text-quat`
- Background: `base`, `container`, `layout`, `elevated`, `mask`
- Border: `border`, `border-sec`
- Palette: `blue`, `purple`, `cyan`, `green`, `magenta`, `pink`, `red`, `orange`, `yellow`, `volcano`, `geekblue`, `lime`, `gold` (with 1-10 levels)

### Spacing
`xxs`, `xs`, `sm`, `md`, `lg`, `xl`

### Border Radius / Radius
`xs`, `sm`, `lg`

### Shadow / BoxShadow
`sec`/`secondary`, `ter`/`tertiary`, `card`, `arrow`, `drawer-r`, `drawer-l`, `drawer-u`, `drawer-d`

## License

MIT
