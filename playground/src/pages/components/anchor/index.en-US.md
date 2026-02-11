---
category: Components
title: Anchor
description: Hyperlinks to scroll on one page.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ufP1TLS5VvIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_9_eTrgvHNQAAAAAAAAAAAAADrJ8AQ/original
demo:
group:
  title: Navigation
  order: 3
---

## When To Use {#when-to-use}

For displaying anchor hyperlinks on page and jumping between them.

> Notes for developers
>
> After version `4.24.0`, we rewrite Anchor use FC, Some methods of obtaining `ref` and calling internal instance methods will invalid.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue" iframe="200">Basic</demo>
  <demo src="./demo/horizontal.vue" iframe="200">Horizontal Anchor</demo>
  <demo src="./demo/static.vue">Static Anchor</demo>
  <demo src="./demo/onClick.vue">Customize the onClick event</demo>
  <demo src="./demo/customizeHighlight.vue">Customize the anchor highlight</demo>
  <demo src="./demo/targetOffset.vue" iframe=200>Set Anchor scroll offset</demo>
  <demo src="./demo/onChange.vue">Listening for anchor link change</demo>
  <demo src="./demo/replace.vue" iframe="200">Replace href in history</demo>
  <demo src="./demo/style-class.vue" iframe="200">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Anchor

#### Props {#anchor-props}

| Property | Description | Type | Default | Version |
| --- | --- |---| --- | --- |
| affix | Fixed mode of Anchor | boolean \| Omit&lt;AffixProps, 'offsetTop' \| 'target' \| 'children'&gt; | true | |
| bounds | Bounding distance of anchor area | number | 5 | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;)=&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| getContainer | Scrolling container | () =&gt; HTMLElement | () =&gt; window | - |
| getCurrentAnchor | Customize the anchor highlight | (activeLink: string) =&gt; string | - | - |
| offsetTop | Pixels to offset from top when calculating position of scroll | number | - | - |
| showInkInFixed | Whether show ink-square when `affix={false}` | boolean| false | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;)=&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| targetOffset | Anchor scroll offset, default as `offsetTop`, [example](#anchor-demo-targetoffset) | number | - | - |
| items | Data configuration option content, support nesting through children | &#123; key, href, title, target, children &#125;\[] [see](#anchoritem) | - |  |
| direction | Set Anchor direction | `vertical` \| `horizontal`| `vertical` |  |
| replace | Replace items' href in browser history instead of pushing it | boolean | false |  |

#### Events {#anchor-events}

| Event | Description | Type                                                                 | Version |
| --- | --- |----------------------------------------------------------------------| --- |
| click | Set the handler to handle `click` event | (e: MouseEvent, link: &#123; title: VueNode, href: string &#125;) =&gt; void | - |
| change | Listening for anchor link change | (currentActiveLink: string) =&gt; void                               | - |

#### Slots {#anchor-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| item | Customize anchor item rendering | (item: AnchorItem) =&gt; any | - |

## Types

### AnchorItem

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | The unique identifier of the Anchor Link | string \| number | - | - |
| href | The target of hyperlink | string | - | - |
| target | Specifies where to display the linked URL | string | - | - |
| title | The content of hyperlink | VueNode | - | - |
| children | Nested Anchor Link, `Attention: This attribute does not support horizontal orientation` | [AnchorItem](#anchoritem)\[] | - | - |
| replace | Replace item href in browser history instead of pushing it | boolean | false | |

#### AnchorItemLink

We recommend using the items form instead.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| href | The target of hyperlink | string | - | - |
| target | Specifies where to display the linked URL | string | - | - |
| title | The content of hyperlink | VueNode | - | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Anchor" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.

## FAQ

### In version `5.25.0+`, the `:target` pseudo-class of the destination element does not take effect as expected after anchor navigation. {#faq-target-pseudo-class}

For the purpose of page performance optimization, the implementation of anchor navigation has been changed from `window.location.href` to `window.history.pushState/replaceState`. Since `pushState/replaceState` does not trigger a page reload, the browser will not automatically update the matching state of the `:target` pseudo-class. To resolve this issue, you can manually construct the full URL: `href = window.location.origin + window.location.pathname + '#xxx'`.

Related issues: [#53143](https://github.com/ant-design/ant-design/issues/53143) [#54255](https://github.com/ant-design/ant-design/issues/54255)
