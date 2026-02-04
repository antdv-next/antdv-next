---
category: Components
group: Data Display
title: Tag
description: Used for marking and categorization.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_SBsSrKLg00AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JPNAQYrVkYkAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

- It can be used to tag by dimension or property.
- When categorizing.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/colorful.vue">Colorful Tag</demo>
  <demo src="./demo/control.vue">Add & Remove Dynamically</demo>
  <demo src="./demo/checkable.vue">Checkable</demo>
  <demo src="./demo/icon.vue">Icon</demo>
  <demo src="./demo/status.vue">Status Tag</demo>
  <demo src="./demo/customize.vue">Customize close</demo>
  <demo src="./demo/disabled.vue">Disabled</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Tag

#### Props {#tag-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| closable | Whether the Tag can be closed | boolean | false | - |
| closeIcon | Custom close icon. Setting to `null` or `false` hides the close button | VueNode | - | 4.4.0 |
| color | Color of the Tag | string | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function | TagClassNamesType | - | - |
| disabled | Whether the tag is disabled | boolean | false | 6.0.0 |
| href | The address to jump when clicking, when specified the tag will be rendered as `<a>` tag | string | - | 6.0.0 |
| icon | Set the icon of tag | VueNode | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | TagStylesType | - | - |
| target | Same as target attribute of `<a>`, works when href is specified | string | - | 6.0.0 |
| variant | Variant of the tag | `filled` \| `solid` \| `outlined` | `filled` | 6.0.0 |

#### Events {#tag-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| close | Callback executed when tag is closed (can be prevented by `e.preventDefault()`) | (e: MouseEvent) =&gt; void | - |

#### Slots {#tag-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| closeIcon | Custom close icon. Setting to `null` or `false` hides the close button | () =&gt; VueNode | 4.4.0 |
| icon | Set the icon of tag | () =&gt; VueNode | - |

### CheckableTag

#### Props {#checkable-tag-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| checked | Checked status of Tag. This is a controlled component | boolean | false | - |
| icon | Set the icon of tag | VueNode | - | - |

#### Events {#checkable-tag-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback executed when Tag is checked/unchecked | (checked: boolean) =&gt; void | - |

### CheckableTagGroup

#### Props {#checkable-tag-group-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function | Record&lt;SemanticDOM, string&gt; | - | - |
| defaultValue | Initial value | string \| number \| Array&lt;string \| number&gt; \| null | - | - |
| disabled | Disable check/uncheck | boolean | false | - |
| multiple | Multiple select mode | boolean | false | - |
| options | Option list | Array&lt;&#123; label: VueNode; value: string \| number &#125; \| string \| number&gt; | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record&lt;SemanticDOM, CSSProperties&gt; | - | - |
| value | Value of checked tag(s), support `v-model:value` | string \ | number \ | Array&lt;string \ | number&gt; \ | null | - | - |

#### Events {#checkable-tag-group-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback when Tag is checked/unchecked | (value: string \| number \| Array&lt;string \| number&gt; \| null) =&gt; void | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Tag"></ComponentTokenTable>
