---
group: Feedback
category: Components
title: Drawer
description: A panel that slides out from the edge of the screen.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*BD2JSKm8I-kAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*r29rQ51bNdwAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use

A Drawer is a panel that is typically overlaid on top of a page and slides in from the side. It contains a set of information or actions. Since the user can interact with the Drawer without leaving the current page, tasks can be achieved more efficiently within the same context.

- Use a Form to create or edit a set of information.
- Processing subtasks. When subtasks are too heavy for a Popover and we still want to keep the subtasks in the context of the main task, Drawer comes very handy.
- When the same Form is needed in multiple places.

> Notes for developers
>
> The `loading` prop renders Skeleton in Drawer.

## Examples

<demo-group>
  <demo src="./demo/basic-right.vue">Basic</demo>
  <demo src="./demo/placement.vue">Custom Placement</demo>
  <demo src="./demo/resizable.vue">Resizable</demo>
  <demo src="./demo/loading.vue">Loading</demo>
  <demo src="./demo/extra.vue">Extra Actions</demo>
  <demo src="./demo/render-in-current.vue">Render in current dom</demo>
  <demo src="./demo/form-in-drawer.vue">Submit form in drawer</demo>
  <demo src="./demo/user-profile.vue">Preview drawer</demo>
  <demo src="./demo/multi-level-drawer.vue">Multi-level drawer</demo>
  <demo src="./demo/size.vue">Preset size</demo>
  <demo src="./demo/mask.vue">mask</demo>
  <demo src="./demo/closable-placement.vue">Closable placement</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

### Props

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterOpenChange | Callback after the animation ends when switching drawers | (open: boolean) => void | - | - |
| classes | Customize class for each semantic structure inside the Drawer component. Supports object or function. | DrawerClassNamesType | - | - |
| closable | Whether to show a close button. The position can be configured with `placement` | boolean \| { closeIcon?: VueNode; disabled?: boolean; placement?: 'start' \| 'end' } | true | - |
| closeIcon | Custom close icon | VueNode | - | - |
| ~~destroyOnClose~~ | Whether to unmount child components on closing drawer or not | boolean | false | - |
| destroyOnHidden | Whether to unmount child components on closing drawer or not | boolean | false | - |
| extra | Extra actions area at corner | VueNode | - | - |
| footer | The footer for Drawer | VueNode | - | - |
| forceRender | Pre-render Drawer component forcibly | boolean | false | - |
| getContainer | Mounted node and display window for Drawer | string \| HTMLElement \| (() => HTMLElement) \| false | document.body | - |
| keyboard | Whether support press esc to close | boolean | true | - |
| loading | Show the Skeleton | boolean | false | - |
| mask | Mask effect | MaskType | true | - |
| maskClosable | Clicking on the mask (area outside the Drawer) to close the Drawer or not | boolean | true | - |
| placement | The placement of the Drawer | `top` \| `right` \| `bottom` \| `left` | `right` | - |
| push | Nested drawers push behavior | boolean \| { distance: string \| number } | { distance: 180 } | - |
| resizable | Enable resizable by dragging | boolean \| [ResizableConfig](#resizableconfig) | - | - |
| rootClass | Root container class | string | - | - |
| rootStyle | Style of wrapper element which contains mask | CSSProperties | - | - |
| size | Preset size of drawer, default `378px` and large `736px`, or a custom number | 'default' \| 'large' \| number | 'default' | - |
| styles | Customize inline style for each semantic structure inside the Drawer component. Supports object or function. | DrawerStylesType | - | - |
| title | The title for Drawer | VueNode | - | - |
| open | Whether the Drawer dialog is visible or not, support `v-model:open` | boolean | false | - |
| zIndex | The `z-index` of the Drawer | number | 1000 | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| afterOpenChange | Callback after the animation ends when switching drawers | (open: boolean) => void | - |
| close | Callback when drawer is closed | (e: MouseEvent \| KeyboardEvent) => void | - |
| keydown | Keyboard keydown event | (e: KeyboardEvent) => void | - |
| keyup | Keyboard keyup event | (e: KeyboardEvent) => void | - |
| mouseenter | Mouse enter event | (e: MouseEvent) => void | - |
| mouseleave | Mouse leave event | (e: MouseEvent) => void | - |
| mouseover | Mouse over event | (e: MouseEvent) => void | - |
| click | Click event | (e: MouseEvent) => void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | Title | () => any | - |
| footer | Footer | () => any | - |
| extra | Extra actions | () => any | - |
| closeIcon | Custom close icon | () => any | - |
| default | Drawer content | () => any | - |

## Types

### ResizableConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| onResizeStart | Callback when resize starts | () => void | - | - |
| onResize | Callback during resizing | (size: number) => void | - | - |
| onResizeEnd | Callback when resize ends | () => void | - | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token {#design-token}

<ComponentTokenTable component="Drawer"></ComponentTokenTable>
