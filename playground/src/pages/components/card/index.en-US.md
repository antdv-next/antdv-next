---
category: Components
group: Data Display
title: Card
description: A container for displaying information.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*QXO1SKEdIzYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*5WDvQp_H7LUAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use {#when-to-use}

A card can be used to display content related to a single subject. The content can consist of multiple elements of varying types and sizes.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic card片</demo>
  <demo src="./demo/border-less.vue" background="grey">No border</demo>
  <demo src="./demo/simple.vue">Simple card</demo>
  <demo src="./demo/flexible-content.vue">Customized content</demo>
  <demo src="./demo/in-column.vue" background="grey">Card in column</demo>
  <demo src="./demo/loading.vue">Loading card</demo>
  <demo src="./demo/grid-card.vue">Grid card</demo>
  <demo src="./demo/inner.vue">Inner card</demo>
  <demo src="./demo/tabs.vue">With tabs</demo>
  <demo src="./demo/meta.vue">Support more content configuration</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Card

#### Props {#card-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Card title | VueNode | - | - |
| extra | Content to render in the top-right corner of the card | VueNode | - | - |
| bordered | Toggles rendering of the border around the card, please use `variant` instead | boolean | true | - |
| headStyle | Deprecated. | CSSProperties | - | - |
| bodyStyle | Deprecated. | CSSProperties | - | - |
| loading | Shows a loading indicator while the contents of the card are being fetched | boolean | false | - |
| hoverable | Lift up when hovering card | boolean | false | - |
| id | - | string | - | - |
| size | Size of card | CardSize | `default` | - |
| type | Card style type, can be set to `inner` or not set | CardType | - | - |
| cover | Card cover | VueNode | - | - |
| actions | The action list, shows at the bottom of the Card | VueNode[] | - | - |
| tabList | List of TabPane's head | CardTabListType[] | - | - |
| tabBarExtraContent | Extra content in tab bar | VueNode \| &#123; [key: string]: VueNode &#125; | - | - |
| activeTabKey | Current TabPane's key | string | - | - |
| defaultActiveTabKey | Initial active TabPane's key, if `activeTabKey` is not set | string | `The key of first tab` | - |
| tabProps | [Tabs](/components/tabs/#tabs) | Record&lt;string, any&gt; | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | CardClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | CardStylesType | - | - |
| variant | Variants of Card | 'borderless' \| 'outlined' | `outlined` | - |

#### Events {#card-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| tabChange | Callback when tab is switched | (key: string) =&gt; void | - |
| update:activeTabKey | - | (key: string) =&gt; void | - |

#### Slots {#card-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | Card title | () =&gt; any | - |
| extra | Content to render in the top-right corner of the card | () =&gt; any | - |
| cover | Card cover | () =&gt; any | - |
| actions | The action list, shows at the bottom of the Card | () =&gt; any | - |
| tabContentRender | - | TabsSlots['contentRender'] | - |
| tabLabelRender | - | TabsSlots['labelRender'] | - |
| tabBarExtraContent | Extra content in tab bar | () =&gt; any | - |

### CardGrid

#### Props {#card-grid-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefixCls | - | string | - | - |
| hoverable | Lift up when hovering card | boolean | false | - |

### CardMeta

#### Props {#card-meta-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefixCls | - | string | - | - |
| avatar | - | VueNode | - | - |
| title | Card title | VueNode | - | - |
| description | - | VueNode | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | CardMetaClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | CardMetaStylesType | - | - |

#### Slots {#card-meta-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| avatar | Avatar | () =&gt; any | - |
| title | Title | () =&gt; any | - |
| description | Description | () =&gt; any | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Card" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
