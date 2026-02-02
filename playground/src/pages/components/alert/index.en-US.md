---
category: Components
title: Alert
description: Display warning messages that require attention.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*QsvtS41m45UAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*gOTISoMFZV0AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
group:
  title: Feedback
  order: 6
---

## When To Use {#when-to-use}

- When you need to show alert messages to users.
- When you need a persistent static container which is closable by user actions.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/style.vue">More types</demo>
  <demo src="./demo/closable.vue">Closable</demo>
  <demo src="./demo/description.vue">Description</demo>
  <demo src="./demo/icon.vue">Icon</demo>
  <demo src="./demo/banner.vue" iframe="250">Banner</demo>
  <demo src="./demo/loop-banner.vue">Loop Banner</demo>
  <demo src="./demo/smooth-closed.vue">Smoothly Unmount</demo>
  <demo src="./demo/custom-icon.vue" debug>Custom Icon</demo>
  <demo src="./demo/action.vue">Custom action</demo>
  <demo src="./demo/component-token.vue" debug>Component Token</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

### Props {#props}

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| type | Type of Alert styles, options: `success`, `info`, `warning`, `error` | 'success' \| 'info' \| 'warning' \| 'error' | `info`, in `banner` mode default is `warning` | - |
| closable | The config of closable, &gt;=5.15.0: support `aria-*` | ClosableType | `false` | - |
| title | Content of Alert | VueNode | - | - |
| message | Content of Alert, please use `title` instead | VueNode | - | - |
| description | Additional content of Alert | VueNode | - | - |
| afterClose | Called when close animation is finished, please use `closable.afterClose` instead | () =&gt; void | - | - |
| showIcon | Whether to show icon | boolean | false, in `banner` mode default is true | - |
| role | https://www.w3.org/TR/2014/REC-html5-20141028/dom.html#aria-role-attribute | string | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function | AlertClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | AlertStylesType | - | - |
| banner | Whether to show as banner | boolean | false | - |
| icon | Custom icon, effective when `showIcon` is true | VueNode | - | - |
| closeIcon | - | VueNode | - | - |
| action | The action of Alert | VueNode | - | 4.9.0 |
| id | - | string | - | - |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| close | Callback when close Alert | (e: any) =&gt; any | - |
| mouseenter | - | (e: any) =&gt; any | - |
| mouseleave | - | (e: any) =&gt; any | - |
| click | - | (e: any) =&gt; any | - |

### Slots {#slots}

| Slot        | Description | Type | Version |
|-------------| --- | --- | --- |
| message     | Content of Alert, please use `title` instead | () =&gt; any | - |
| title       | Content of Alert| () =&gt; any | - |
| description | Additional content of Alert | () =&gt; any | - |
| icon        | Custom icon, effective when `showIcon` is true | () =&gt; any | - |
| closeIcon   | - | () =&gt; any | - |
| action      | The action of Alert | () =&gt; any | 4.9.0 |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Alert"></ComponentTokenTable>

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
