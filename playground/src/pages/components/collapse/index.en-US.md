---
category: Components
group: Data Display
title: Collapse
description: A content area which can be collapsed and expanded.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*B7HKR5OBe8gAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*sir-TK0HkWcAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use {#when-to-use}

- Can be used to group or hide complex regions to keep the page clean.
- `Accordion` is a special kind of `Collapse`, which allows only one panel to be expanded at a time.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Collapse</demo>
  <demo src="./demo/size.vue">Size</demo>
  <demo src="./demo/accordion.vue">Accordion</demo>
  <demo src="./demo/mix.vue">Nested panel</demo>
  <demo src="./demo/borderless.vue">Borderless</demo>
  <demo src="./demo/custom.vue">Custom Panel</demo>
  <demo src="./demo/noarrow.vue">No arrow</demo>
  <demo src="./demo/extra.vue">Extra node</demo>
  <demo src="./demo/ghost.vue">Ghost Collapse</demo>
  <demo src="./demo/collapsible.vue">Collapsible</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Collapse

#### Props {#collapse-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| activeKey | Key of the active panel | Array&lt;string \| number&gt; \| string \| number | No default value. In accordion mode, it's the key of the first panel | - |
| defaultActiveKey | Key of the initial active panel | Array&lt;string \| number&gt; \| string \| number | - | - |
| accordion | If true, Collapse renders as Accordion | boolean | false | - |
| destroyOnHidden | Destroy Inactive Panel | boolean | false | - |
| rootClass | Root container class | string | - | - |
| bordered | Toggles rendering of the border around the collapse block | boolean | true | - |
| expandIcon | Allow to customize collapse icon | (panelProps: PanelProps) =&gt; any | - | - |
| expandIconPlacement | Set expand icon placement | ExpandIconPlacement | `start` | - |
| ghost | Make the collapse borderless and its background transparent | boolean | false | - |
| size | Set the size of collapse | SizeType | `middle` | - |
| collapsible | Specify how to trigger Collapse. Either by clicking icon or by clicking any area in header or disable collapse functionality itself | CollapsibleType | - | - |
| labelRender | Custom render label | (params: &#123; item: CollapseItemType, index: number &#125;) =&gt; any | - | - |
| contentRender | Custom render content | (params: &#123; item: CollapseItemType, index: number &#125;) =&gt; any | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | CollapseClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | CollapseStylesType | - | - |
| items | Collapse items content | CollapseItemType[] | - | - |

#### Events {#collapse-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback function executed when active panel is changed | (key: string[]) =&gt; void | - |

#### Slots {#collapse-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| expandIcon | Allow to customize collapse icon | (panelProps: PanelProps) =&gt; any | - |
| labelRender | - | (params: &#123; item: CollapseItemType, index: number &#125;) =&gt; any | - |
| contentRender | - | (params: &#123; item: CollapseItemType, index: number &#125;) =&gt; any | - |

### CollapsePanel {#collapsepanel}

#### Props {#collapsepanel-props}

Deprecated: when using items, prefer configuring panels with `items`.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| header | - | VueNode | - | - |
| showArrow | - | boolean | true | - |
| extra | - | VueNode | - | - |
| collapsible | Specify how to trigger Collapse. Either by clicking icon or by clicking any area in header or disable collapse functionality itself | CollapsibleType | - | - |

## Types

### ItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Semantic structure class | Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| collapsible | Specify whether the panel be collapsible or the trigger area of collapsible | CollapsibleType | - | - |
| content | Body area content | VueNode | - | - |
| extra | The extra element in the corner | VueNode | - | - |
| forceRender | Forced render of content on panel, instead of lazy rendering after clicking on header | boolean | false | - |
| key | Unique key identifying the panel from among its siblings | string \| number | - | - |
| label | Title of the panel | VueNode | - | - |
| showArrow | If false, panel will not show arrow icon. If false, collapsible can't be set as icon | boolean | true | - |
| styles | Semantic structure style | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Collapse"></ComponentTokenTable>
