---
category: Components
title: BorderBeam
description: Decorative component that renders a moving beam along a container border.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*wr1ISY50SyYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*duAQQbjHlHQAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
group:
  title: Other
  order: 7
tag: 1.3.0
---

## When To Use

- Use when a container needs stronger visual emphasis without introducing business state semantics.
- Suitable for login panels, recommendation cards, AI modules, and key CTA blocks.
- As a decorative effect, it should not replace focus rings, validation borders, or status feedback.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/hover.vue">Show on hover</demo>
  <demo src="./demo/count.vue">Multiple beams</demo>
  <demo src="./demo/custom-container.vue">Custom Container</demo>
  <demo src="./demo/customized-color.vue">Gradients</demo>
  <demo src="./demo/duration.vue">Duration</demo>
  <demo src="./demo/size.vue">Size</demo>
  <demo src="./demo/line-width.vue">Line Width</demo>
  <demo src="./demo/non-uniform-radius.vue" debug>Non-uniform radius</demo>
  <demo src="./demo/component-token.vue" debug>Component Token</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version | [Global Config](/components/config-provider#component-config) |
| --- | --- | --- | --- | --- | --- |
| color | Beam color configuration. Supports a single color string or gradient stops. `percent` uses the `0 ~ 100` input range and BorderBeam reserves tail space for the transparent fade | `string \| { color: string, percent: number }[]` | - | - | × |
| count | Number of beams | number | 1 | - | × |
| duration | Time in seconds for the beam to complete one loop | number | 6 | - | × |
| lineWidth | Width of the beam line. Numbers are treated as pixels | `number \| string` | `1px` | - | × |
| outset | Outset distance of the beam layer from the container edge. Set to `0` for clipped containers | `number \| string` | - | - | × |
| size | Size of the visible beam segment. Numbers are treated as pixels | `number \| string` | 100 | - | × |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Decorated content. Must be a single DOM element or a Vue component that forwards its ref to a DOM element | () => any | - |

## Design Token

<ComponentTokenTable component="BorderBeam"></ComponentTokenTable>

## FAQ

### How does BorderBeam behave when reduced motion is enabled? {#faq-reduced-motion}

`BorderBeam` treats the beam as a decorative effect. When `prefers-reduced-motion: reduce` is active, the beam effect is hidden.

### What does `percent` mean in `color`? {#faq-color-percent}

`percent` represents the authored stop position and accepts values from `0` to `100`. BorderBeam maps those stops into the visible beam segment and reserves the trailing area for transparent fade-out so the moving tail stays visible.

### `size` limits {#faq-size-limit}

`BorderBeam` creates the beam with a square gradient layer whose side length is `size`. The layer travels around the container border, and a mask exposes the areas where it overlaps the border. `size` sets the side length independently of the border path length.

Along a horizontal edge, the gradient layer extends about `size / 2` to either side of the edge. If `size` approaches or exceeds twice the mask overlay height, the square can cover both the top and bottom edges. The same geometry applies to the width while the beam travels along a vertical edge.

Keep `size` well below twice the shorter side of the mask overlay: `size < 2 × min(width, height)`. The mask overlay is usually close in size to the decorated container, while `outset` changes its dimensions. Border radius, `lineWidth`, and transparent areas in the gradient also affect the point at which the overlap becomes visible.

### Why is `BorderBeam` not working? {#faq-not-working}

`BorderBeam` needs to resolve the actual DOM node from the default slot and insert the beam layer into that node. Make sure the slot content is a native DOM element, or a Vue component that correctly forwards its `ref` to a DOM element. Otherwise BorderBeam cannot locate the real container and the beam cannot be rendered.

The beam layer is positioned with `position: absolute`, so the resolved DOM node also needs to provide a positioning context. In most cases, set `position: relative` on the wrapped element. BorderBeam does not inspect or patch the child positioning style for you.

For performance reasons, whether the slot can host the beam and its positioning information are resolved during initialization, and are not continuously updated when the child structure or positioning styles change later.

### How do I keep the beam radius aligned with my container? {#faq-radius}

`BorderBeam` renders the beam layer as a child of the actual container and directly inherits its radius through `border-radius: inherit`. For a single-container child such as `Card`, the beam automatically follows the container radius. For more complex child trees, make sure the radius is set on the actual container root.

The radius stays in sync through CSS inheritance, without being read or measured during initialization. Later changes made through `class`, responsive styles, or CSS variables are automatically reflected by the beam layer.
