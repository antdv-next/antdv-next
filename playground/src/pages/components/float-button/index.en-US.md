---
category: Components
group: General
title: FloatButton
description: A button that floats at the top of the page.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*tXAoQqyr-ioAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*hSAwR7cnabwAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use

- For global functionality on the site.
- Buttons that can be seen wherever you browse.

## Examples

<demo-group>
  <demo src="./demo/basic.vue" iframe="360">Basic</demo>
  <demo src="./demo/type.vue" iframe="360">Type</demo>
  <demo src="./demo/shape.vue" iframe="360">Shape</demo>
  <demo src="./demo/content.vue" iframe="360">Content</demo>
  <demo src="./demo/tooltip.vue" iframe="360">FloatButton with tooltip</demo>
  <demo src="./demo/group.vue" iframe="360">FloatButton Group</demo>
  <demo src="./demo/group-menu.vue" iframe="360">Menu mode</demo>
  <demo src="./demo/controlled.vue" iframe="360">Controlled mode</demo>
  <demo src="./demo/placement.vue" iframe="380">placement</demo>
  <demo src="./demo/back-top.vue" iframe="360">BackTop</demo>
  <demo src="./demo/badge.vue" iframe="360">badge</demo>
  <demo src="./demo/style-class.vue" iframe="360">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### FloatButtonGroup

#### Props {#floatbuttongroup-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| shape | Setting button shape of children | `circle` \| `square` | `circle` | - |
| trigger | Which action can trigger menu open/close | `click` \| `hover` | - | - |
| open | Whether the menu is visible or not, use it with trigger | boolean | - | - |
| closeIcon | Customize close button icon | VueNode | `<CloseOutlined />` | - |
| placement | Customize menu animation placement | `top` \| `left` \| `right` \| `bottom` | `top` | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;)=&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;)=&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |

#### Events {#floatbuttongroup-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| update:open | Callback executed when active menu is changed, use it with trigger | (open: boolean) =&gt; void | - |
| click | Set the handler to handle `click` event (only work in Menu mode) | (e: MouseEvent) =&gt; void | - |

#### Slots {#floatbuttongroup-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Children buttons content | () =&gt; any | - |
| icon | Icon of trigger button | () =&gt; any | - |
| closeIcon | Customize close button icon | () =&gt; any | - |

### FloatButton

#### Props {#floatbutton-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| icon | Set the icon component of button | VueNode | - | - |
| content | Text and other | VueNode | - | - |
| ~~description~~ | Please use `content` instead | VueNode | - | - |
| tooltip | The text shown in the tooltip | VueNode \| TooltipProps | - | - |
| type | Setting button type | `default` \| `primary` | `default` | - |
| shape | Setting button shape | `circle` \| `square` | `circle` | - |
| href | The target of hyperlink | string | - | - |
| target | Specifies where to display the linked URL | string | - | - |
| htmlType | Set the original html `type` of `button`, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#type) | `submit` \| `reset` \| `button` | `button` | - |
| badge | Attach Badge to FloatButton. `status` and other props related are not supported. | [BadgeProps](/components/badge#api) | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;)=&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;)=&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |

#### Events {#floatbutton-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | Set the handler to handle `click` event | (e: MouseEvent) =&gt; void | - |

#### Slots {#floatbutton-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Button content | () =&gt; any | - |
| icon | Set the icon component of button | () =&gt; any | - |
| tooltip | The text shown in the tooltip | (props?: TooltipProps) =&gt; any | - |

### FloatBackTop {#floatbacktop}

#### Props {#floatbacktop-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| duration | Time to return to top（ms） | number | 450 | - |
| target | Specifies the scrollable area dom node | () =&gt; HTMLElement | () =&gt; window | - |
| visibilityHeight | The BackTop button will not show until the scroll height reaches this value | number | 400 | - |
| target | Specifies where to display the linked URL | '_self' \| '_blank' \| '_parent' \| '_top' \| string | - | - |
| badge | Attach Badge to FloatButton. `status` and other props related are not supported. | FloatButtonBadgeProps & &#123; class?: string &#125; | - | 5.4.0 |
| htmlType | Set the original html `type` of `button`, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#type) | ButtonHTMLType | `button` | 5.21.0 |
| ariaLabel | - | string | - | - |
| style | - | CSSProperties | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | FloatButtonClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | FloatButtonStylesType | - | - |

#### Events {#floatbacktop-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | A callback function, which can be executed when you click the button | () =&gt; void | - |

## Semantic DOM

### FloatButton

<demo src="./demo/_semantic.vue" simplify></demo>


### FloatButtonGroup

<demo src="./demo/_semantic_group.vue" simplify></demo>

Refer to [Semantic DOM](#semantic-dom) for detailed semantic structure information.

## Design Token

<ComponentTokenTable component="FloatButton" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
