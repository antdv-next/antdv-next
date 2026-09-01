---
title: Design.md
tag: New
---

`design.md` is a design language description file following the [google-labs-code/design.md](https://github.com/google-labs-code/design.md) specification. It is intended for AI design tools such as Figma Make and Google Stitch, giving them a structured understanding of the antdv-next default Light theme — visual language, component patterns, and theme Tokens — so generated UIs match the library out of the box.

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
| `colorPrimary` | `#1677ff` | Brand color for primary actions, links, focus states |
| `colorSuccess` | `#52c41a` | Success feedback |
| `colorWarning` | `#faad14` | Warning feedback |
| `colorError` | `#ff4d4f` | Error feedback |
| `colorInfo` | `#1677ff` | Neutral information |
| `colorText` | `rgba(0, 0, 0, 0.88)` | Primary text |
| `colorTextSecondary` | `rgba(0, 0, 0, 0.65)` | Secondary text |
| `colorTextTertiary` | `rgba(0, 0, 0, 0.45)` | Tertiary text, placeholders |
| `colorBorder` | `#d9d9d9` | Default borders |
| `colorBorderSecondary` | `#f0f0f0` | Lighter borders, dividers |
| `colorBgContainer` | `#ffffff` | Container backgrounds |
| `colorBgLayout` | `#f5f5f5` | Page background |
| `colorFillSecondary` | `rgba(0, 0, 0, 0.06)` | Hover fills |

### Typography

| Token | Value |
| --- | --- |
| `fontFamily` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` |
| `fontFamilyCode` | `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace` |
| `fontSize` | `14px` |

### Shapes, Spacing & Size

| Token | Value |
| --- | --- |
| `borderRadius` | `6px` (SM `4px`, LG `8px`) |
| `sizeUnit` / `sizeStep` | `4px` spacing grid |
| `controlHeight` | `32px` default control height |

## Component Patterns

`design.md` also describes the component layer of the design system — how Tokens combine into recurring UI patterns:

- **Button (primary)** — `#1677ff` background, white text, `6px` radius, `32px` height; hover `#4096ff`, active `#0958d9`
- **Button (default)** — white background, `rgba(0, 0, 0, 0.88)` text, `#d9d9d9` border
- **Input / Select** — white background, `#d9d9d9` border, `6px` radius, `32px` height, focus border `#1677ff` with `2px` outline
- **Card** — white background, `#f0f0f0` border, `8px` radius, `24px` padding
- **Modal / Drawer** — elevated white surface, `8px` radius, `box-shadow` elevation
- **Tag** — `4px` radius, subtle fill from the semantic color scale
- **Table** — `#fafafa` header background, row hover `rgba(0, 0, 0, 0.04)`, divider `#f0f0f0`

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
