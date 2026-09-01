---
name: Antdv Next
description: Ant Design Vue Next (antdv-next) default Light theme — a Vue 3 component library faithfully implementing the Ant Design v5 design language. This file describes the visual language, component patterns, and theme Tokens for AI design tools.
version: alpha
colors:
  primary: "#1677ff"
  primary-hover: "#4096ff"
  primary-active: "#0958d9"
  success: "#52c41a"
  warning: "#faad14"
  error: "#ff4d4f"
  info: "#1677ff"
  text: "rgba(0, 0, 0, 0.88)"
  text-secondary: "rgba(0, 0, 0, 0.65)"
  text-tertiary: "rgba(0, 0, 0, 0.45)"
  text-quaternary: "rgba(0, 0, 0, 0.25)"
  border: "#d9d9d9"
  border-secondary: "#f0f0f0"
  bg-container: "#ffffff"
  bg-layout: "#f5f5f5"
  bg-elevated: "#ffffff"
  fill: "rgba(0, 0, 0, 0.15)"
  fill-secondary: "rgba(0, 0, 0, 0.06)"
  fill-tertiary: "rgba(0, 0, 0, 0.04)"
  fill-quaternary: "rgba(0, 0, 0, 0.02)"
  on-primary: "#ffffff"
  on-success: "#ffffff"
  on-warning: "#ffffff"
  on-error: "#ffffff"
typography:
  font-family:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
  font-family-code:
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace"
  h1:
    fontFamily: "{typography.font-family.fontFamily}"
    fontSize: 38px
    fontWeight: 600
    lineHeight: 1.23
  h2:
    fontFamily: "{typography.font-family.fontFamily}"
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.35
  h3:
    fontFamily: "{typography.font-family.fontFamily}"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.35
  h4:
    fontFamily: "{typography.font-family.fontFamily}"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
  h5:
    fontFamily: "{typography.font-family.fontFamily}"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "{typography.font-family.fontFamily}"
    fontSize: 14px
    lineHeight: 1.571
  caption:
    fontFamily: "{typography.font-family.fontFamily}"
    fontSize: 12px
    lineHeight: 1.667
rounded:
  sm: 4px
  md: 6px
  lg: 8px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    height: 32px
    padding: 4px 15px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
  button-default:
    backgroundColor: "{colors.bg-container}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    height: 32px
    padding: 4px 15px
  input:
    backgroundColor: "{colors.bg-container}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    height: 32px
    padding: 4px 11px
  select:
    backgroundColor: "{colors.bg-container}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    height: 32px
    padding: 4px 11px
  card:
    backgroundColor: "{colors.bg-container}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 24px
  modal:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 20px 24px
  tag:
    backgroundColor: "{colors.fill-quaternary}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: 0 7px
---

## Overview

Antdv Next (antdv-next) is a Vue 3 component library that faithfully implements the Ant Design v5 design language. The default Light theme is a functional, high-clarity enterprise UI: white containers on a `#f5f5f5` page background, a single blue brand color (`#1677ff`) driving all primary actions, and black-based alpha text for hierarchy. Components share one control height (`32px`), one radius scale (`4/6/8px`), and a `4px` spacing grid, which keeps screens dense yet calm.

## Colors

The palette is a semantic system: one brand color plus feedback colors, layered over black-alpha neutrals.

- **Primary (#1677ff):** brand and interaction color — primary buttons, links, focus rings, active menu items. Hover `#4096ff`, active `#0958d9`.
- **Success (#52c41a) / Warning (#faad14) / Error (#ff4d4f):** feedback semantics for results, alerts, form validation, badges.
- **Text:** black at alpha steps — `rgba(0,0,0,0.88)` primary, `0.65` secondary, `0.45` tertiary (placeholders), `0.25` quaternary (disabled).
- **Borders:** `#d9d9d9` for controls and separators, `#f0f0f0` for lighter dividers and card edges.
- **Fills:** black at low alphas — `0.15` (selected), `0.06` (hover), `0.04` (active/hover-row), `0.02` (header/alter backgrounds, `#fafafa` on white).

## Typography

System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`) at `14px` body size, `1.571` line height, `600` weight for headings. Headings scale `38/30/24/20/16px` (h1–h5). Code uses a monospace stack (`SFMono-Regular`, Consolas, Menlo, ...). Numeric density is controlled by Ant Design's `font-variant-numeric: tabular-nums` convention for tables and statistics.

## Layout

Spacing is a `4px` grid (`sizeUnit`/`sizeStep = 4`): `4/8/16/24/32px` steps for padding, margins, and component gaps. Controls are `32px` tall by default with `4px 11px` padding; dense layouts may use `24px` controls. Content columns are `16px` apart; card padding is `24px`. Page background `#f5f5f5`, container surfaces `#ffffff`.

## Elevation & Depth

Elevation is expressed with black-alpha box shadows rather than borders:

- **Tertiary (cards):** `0 1px 2px 0 rgba(0,0,0,0.05), 0 1px 6px -1px rgba(0,0,0,0.03), 0 2px 4px 0 rgba(0,0,0,0.03)`
- **Primary (popovers, dropdowns, tooltips):** `0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)`
- **Secondary (modals, drawers):** same shadow as primary but reserved for the highest surfaces; drawers add directional offset (`-6px 0 16px` right-side).
- Floating surfaces (`bg-elevated`) sit on `#ffffff`.

## Shapes

Radii follow a 3-step scale: `4px` (SM — tags, checkboxes, small controls), `6px` (MD — default controls, buttons, inputs), `8px` (LG — cards, modals, large containers). Controls are fully rectangular only in `wireframe` mode; default mode rounds everything. Do not mix radii within one control.

## Components

Shared component patterns — Tokens combine exactly as follows:

- **Button:** `32px` height, `6px` radius, `4px 15px` padding. Primary: blue background, white text; hover/active shift to `#4096ff`/`#0958d9`. Default: white background, `rgba(0,0,0,0.88)` text, `#d9d9d9` border; hover tints border and text blue. Disabled: `rgba(0,0,0,0.25)` text on `rgba(0,0,0,0.04)` background.
- **Input / Select:** white surface, `#d9d9d9` border, `6px` radius, `32px` height, `4px 11px` padding. Hover border `#4096ff`; focus border `#1677ff` with `2px` blue outline (`outline-offset: 1px`). Placeholder text is tertiary.
- **Card:** white surface, `#f0f0f0` border, `8px` radius, `24px` padding; optional tertiary shadow when elevated.
- **Modal / Drawer:** elevated white surface, `8px` radius, secondary shadow, `20px 24px` body padding; header `16px` title text, footer aligned right.
- **Tag:** `4px` radius, `0 7px` padding, `12px` text, fill from the semantic color scale at low alpha.
- **Table:** `#fafafa` header background with `600` weight `14px` text, row hover `rgba(0,0,0,0.04)`, dividers `#f0f0f0`, `16px` cell padding.
- **Menu (side):** selected item uses the blue primary background wash (`rgba(0,0,0,0.06)` default hover, `#e6f4ff`-style blue tint for active) with a `3px` left indicator bar in primary.
- **Form:** labels `14px` tertiary text above or inline, controls `32px`, validation error text `#ff4d4f` at `14px`, error border `#ff4d4f` with red focus outline.

## Do's and Don'ts

**Do:**
- Use `#1677ff` for every primary action, active link, and focus state — never a different blue.
- Apply the semantic colors only for their meaning: success, warning, error, info.
- Keep to the `4px` spacing grid; prefer `8/16/24` for rhythm.
- Use `32px` control height in default density, `24px` in compact.
- Use the fixed radius per component type (SM/MD/LG) and stay consistent within a screen.
- Express elevation with shadows, not borders; reserve the highest shadow for modals and popovers.
- Use tertiary text for placeholders and helper copy, quaternary only for disabled.

**Don't:**
- Don't invent new accent colors; the brand palette is blue-only.
- Don't place primary buttons on colored or photographic backgrounds without a solid container.
- Don't use borderless surfaces for interactive controls — inputs and buttons need an edge or a fill.
- Don't mix radius scales inside one component or card.
- Don't apply text alpha below `0.25` — it fails readability.
- Don't use elevation shadows on flat in-page containers (use the tertiary shadow at most).
