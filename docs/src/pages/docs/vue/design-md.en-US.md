---
title: Design.md
tag: New
---

`design.md` is a design language description file following the [google-labs-code/design.md](https://github.com/google-labs-code/design.md) specification. It is intended for AI design tools such as Figma Make and Google Stitch, giving them a structured understanding of the antdv-next default Light theme — visual language, component patterns, and theme Tokens — so generated UIs match the library out of the box.

## Where It Comes From

`design.md` is generated from the component library's theme Tokens by the [`@antdv-next/cli`](https://github.com/antdv-next/cli) tooling (`scripts/tokens.ts` extracts Tokens, `antdv design.md` outputs the file). The published file is the single source of truth for both the CLI and this site.

## Where to Get It

The file is available from multiple sources:

| Source | Description |
| --- | --- |
| [design.md](https://antdv-next.com/design.md) | Published raw file, readable directly by AI tools |
| `antdv design.md` | CLI command that outputs the same content ([CLI guide](/docs/vue/cli)) |
| [llms.txt](https://antdv-next.com/llms.txt) | Navigation file that links to design.md and all component docs |

## Design Tokens

The front matter of `design.md` carries machine-readable tokens. Key values of the default Light theme:

### Colors

| Token | Value | Usage |
| --- | --- | --- |
| `primary` | `#1677FF` | Brand color for primary actions, links, focus states |
| `success` / `warning` / `error` / `info` | `#52C41A` / `#FAAD14` / `#FF4D4F` / `#1677FF` | Semantic feedback colors |
| `surface` | `#FFFFFF` | Container surfaces (buttons, inputs, cards) |
| `surface-container` | `#FAFAFA` | Muted containers: table headers, tags, hovers |
| `surface-layout` | `#F5F5F5` | Page background |
| `on-surface` | `#1F1F1F` | Primary text on surfaces |
| `on-surface-variant` | `#595959` | Secondary text |
| `on-surface-disabled` | `#BFBFBF` | Disabled text |
| `outline` | `#D9D9D9` | Default borders |
| `outline-variant` | `#F0F0F0` | Lighter borders, dividers |

### Typography

| Token | Value |
| --- | --- |
| `fontFamily` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif` |
| `fontFamilyCode` | `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace` |
| `display-lg` → `body-sm` | `38px` → `12px` scale (headings `600` weight, body `400`) |

### Shapes, Spacing & Size

| Token | Value |
| --- | --- |
| `rounded` | `none 0 / sm 2 / md 4 / DEFAULT 6 / lg 8 / xl 16 / full 9999px` |
| `spacing.unit` | `4px` grid (`xs 4 / sm 8 / md 16 / lg 24 / xl 32`) |
| `control-height` | `32px` default control height |

## Component Patterns

`design.md` also describes the component layer of the design system — how Tokens combine into recurring UI patterns:

- **Button (primary)** — `#1677FF` background, white text, `6px` radius, `32px` height, `0 15px` padding; hover `#4096FF`, active `#0958D9`
- **Button (default)** — `surface` background, `on-surface` text
- **Input / Select** — `surface` background, `32px` height, `6px` radius; focus `#4096FF` border
- **Card** — `surface` background, `8px` radius, `24px` padding
- **Modal** — `surface` background, `8px` radius, `20px 24px` padding
- **Tag** — `surface-container` background, `4px` radius, `0 7px` padding, `12px` text
- **Table header** — `surface-container` background, `600` weight `14px` text, `16px` padding
- **Menu selected** — `#E6F4FF` background with primary text

## Validation

`design.md` is a formal spec — validate it, check WCAG contrast, and compare token regressions with the official CLI:

```bash
npx @google/design.md lint design.md
npx @google/design.md diff design.md design-v2.md
```

## Related

- [LLMs.txt guide](/docs/vue/llms) — structured documentation for AI tools
- [CLI guide](/docs/vue/cli) — `antdv design.md` and other offline commands
- [Customize Theme](/docs/vue/customize-theme) — theme Tokens and algorithms
