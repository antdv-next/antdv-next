---
category: Components
group: Navigation
title: Dropdown
description: A dropdown list.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*gTBySYX11WcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*k619RJ_7bKEAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use

When there are more than a few options to choose from, you can wrap them in a `Dropdown`. By hovering or clicking on the trigger, a dropdown menu will appear, which allows you to choose an option and execute the relevant action.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/extra.vue">Extra node</demo>
  <demo src="./demo/placement.vue">Placement</demo>
  <demo src="./demo/arrow.vue">Arrow</demo>
  <demo src="./demo/item.vue">Other elements</demo>
  <demo src="./demo/arrow-center.vue">Arrow pointing at the center</demo>
  <demo src="./demo/trigger.vue">Trigger mode</demo>
  <demo src="./demo/event.vue">Click event</demo>
  <demo src="./demo/dropdown-button.vue">Button with dropdown menu</demo>
  <demo src="./demo/custom-dropdown.vue">Custom dropdown</demo>
  <demo src="./demo/sub-menu.vue">Cascading menu</demo>
  <demo src="./demo/overlay-open.vue">The way of hiding menu</demo>
  <demo src="./demo/context-menu.vue">Context Menu</demo>
  <demo src="./demo/loading.vue">Loading</demo>
  <demo src="./demo/selectable.vue">Selectable Menu</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

### Props

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the Dropdown component. Supports object or function | DropdownClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the Dropdown component. Supports object or function | DropdownStylesType | - | - |
| menu | The menu props | MenuProps & &#123; activeKey?: VcMenuProps['activeKey'], onClick?: MenuEmits['click'] &#125; | - | - |
| autoFocus | Focus the first menu item when opened | boolean | - | - |
| arrow | Whether the dropdown arrow should be visible. Supports `pointAtCenter` | boolean \| DropdownArrowOptions | false | - |
| trigger | The trigger mode which executes the dropdown action. Note that hover can't be used on touchscreens | ('click' \| 'hover' \| 'contextmenu')[] | ['hover'] | - |
| popupRender | Customize popup content | (menu: VueNode) =&gt; VueNode | - | - |
| open | Whether the dropdown menu is currently open | boolean | - | - |
| disabled | Whether the dropdown menu is disabled | boolean | - | - |
| destroyOnHidden | Whether destroy dropdown when hidden | boolean | false | - |
| align | Popup align config | AlignType | - | - |
| getPopupContainer | To set the container of the dropdown menu. The default is to create a div element in body, but you can reset it to the scrolling area and make a relative reposition. [Example on CodePen](https://codepen.io/afc163/pen/zEjNOy?editors=0010) | (triggerNode: HTMLElement) =&gt; HTMLElement | () =&gt; document.body | - |
| prefixCls | Customize prefix class name | string | - | - |
| transitionName | Motion name of dropdown | string | - | - |
| placement | Placement of popup menu: `bottom` `bottomLeft` `bottomRight` `top` `topLeft` `topRight` | Placement | `bottomLeft` | - |
| forceRender | Force render dropdown overlay | boolean | - | - |
| mouseEnterDelay | Delay in seconds before showing dropdown | number | 0.15 | - |
| mouseLeaveDelay | Delay in seconds before hiding dropdown | number | 0.1 | - |
| openClassName | Class added to trigger when dropdown is open | string | - | - |
| autoAdjustOverflow | Whether to adjust dropdown placement automatically when dropdown is off screen | boolean \| AdjustOverflow | true | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| openChange | Called when the open state is changed. Not trigger when hidden by click item | (open: boolean, info: &#123; source: 'trigger' \| 'menu' &#125;) =&gt; void | - |
| menuClick | Callback when menu item clicked | MenuEmits['click'] | - |

### Slots

| Slot        | Description             | Type                      | Version |
|-------------|-------------------------|---------------------------| ---     |
| popupRender | Customize popup content | (menu: VueNode) =&gt; any | -       |
| labelRender | Customize label content | (item: Item) =&gt; any    | -       |

Dropdown also supports Menu slots (such as `labelRender`) via the Dropdown slots.

## Note

Please ensure that the child node of `Dropdown` accepts `mouseenter`, `mouseleave`, `focus`, `click` events.

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Dropdown" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.

## FAQ

### How to prevent Dropdown from being squeezed when it exceeds the screen horizontally? {#faq-dropdown-squeezed}

You can use `width: max-content` style to handle this. ref [#43025](https://github.com/ant-design/ant-design/issues/43025#issuecomment-1594394135).
