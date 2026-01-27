---
category: Components
group: Layout
title: Grid
description: 24 Grids System.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*mfJeS6cqZrEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*DLUwQ4B2_zQAAAAAAAAAAAAADrJ8AQ/original
demo:
    class: grid-demo-box
---

## Design concept

<div class="grid-demo">
  <img draggable="false" src="https://gw.alipayobjects.com/zos/bmw-prod/9189c9ef-c601-40dc-9960-c11dbb681888.svg" alt="grid design" />
</div>

In most business situations, Antdv Next needs to solve a lot of information storage problems within the design area, so based on 12 Grids System, we divided the design area into 24 sections.

We name the divided area 'box'. We suggest four boxes for horizontal arrangement at most, one at least. Boxes are proportional to the entire screen as shown in the picture above. To ensure a high level of visual comfort, we customize the typography inside of the box based on the box unit.

## Outline

In the grid system, we define the frame outside the information area based on `row` and `column`, to ensure that every area can have stable arrangement.

Following is a brief look at how it works:

- Establish a set of `column` in the horizontal space defined by `row` (abbreviated col).
- Your content elements should be placed directly in the `col`, and only `col` should be placed directly in `row`.
- The column grid system is a value of 1-24 to represent its range spans. For example, three columns of equal width can be created by `<Col span={8} />`.
- If the sum of `col` spans in a `row` are more than 24, then the overflowing `col` as a whole will start a new line arrangement.

Our grid systems base on Flex layout to allow the elements within the parent to be aligned horizontally - left, center, right, wide arrangement, and decentralized arrangement. The Grid system also supports vertical alignment - top aligned, vertically centered, bottom-aligned. You can also define the order of elements by using `order`.

Layout uses a 24 grid layout to define the width of each "box", but does not rigidly adhere to the grid layout.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic Grid</demo>
  <demo src="./demo/gutter.vue">Grid Gutter</demo>
  <demo src="./demo/offset.vue">Column offset</demo>
  <demo src="./demo/sort.vue">Grid sort</demo>
  <demo src="./demo/flex.vue">Typesetting</demo>
  <demo src="./demo/flex-align.vue">Alignment</demo>
  <demo src="./demo/flex-order.vue">Order</demo>
  <demo src="./demo/flex-stretch.vue">Flex Stretch</demo>
  <demo src="./demo/responsive.vue">Responsive</demo>
  <demo src="./demo/responsive-flex.vue">Flex Responsive</demo>
  <demo src="./demo/responsive-more.vue">More responsive</demo>
  <demo src="./demo/playground.vue">Playground</demo>
  <demo src="./demo/useBreakpoint.vue">useBreakpoint Hook</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Row

#### Props {#row-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | Vertical alignment | `top` \| `middle` \| `bottom` \| `stretch` \| `&#123;[key in 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl']: 'top' \| 'middle' \| 'bottom' \| 'stretch'&#125;` | `top` |  |
| gutter | Spacing between grids, could be a [string CSS units](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Values_and_Units) or a object like &#123; xs: 8, sm: 16, md: 24&#125;. Or you can use array to make horizontal and vertical spacing work at the same time `[horizontal, vertical]` | number \| string \| object \| array | 0 | |
| justify | Horizontal arrangement | `start` \| `end` \| `center` \| `space-around` \| `space-between` \| `space-evenly` \| `&#123;[key in 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl']: 'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'&#125;` | `start` |  |
| wrap | Auto wrap line | boolean | true |  |

### Col

#### Props {#col-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| flex | Flex layout style | string \| number | - |  |
| offset | The number of cells to offset Col from the left | number | 0 |  |
| order | Raster order | number | 0 |  |
| pull | The number of cells that raster is moved to the left | number | 0 |  |
| push | The number of cells that raster is moved to the right | number | 0 |  |
| span | Raster number of cells to occupy, 0 corresponds to `display: none` | number | none |  |
| xs | `screen &lt; 576px` and also default setting, could be a `span` value or an object containing above props | number \| object | - |  |
| sm | `screen ≥ 576px`, could be a `span` value or an object containing above props | number \| object | - |  |
| md | `screen ≥ 768px`, could be a `span` value or an object containing above props | number \| object | - |  |
| lg | `screen ≥ 992px`, could be a `span` value or an object containing above props | number \| object | - |  |
| xl | `screen ≥ 1200px`, could be a `span` value or an object containing above props | number \| object | - |  |
| xxl | `screen ≥ 1600px`, could be a `span` value or an object containing above props | number \| object | - |  |

## Design Token

<ComponentTokenTable component="Grid" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
