---
category: Components
group: General
title: Typography
description: Basic text writing, including headings, body text, lists, and more.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*MLt3R6m9huoAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*LT2jR41Uj2EAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use {#when-to-use}

- When you need to display a title or paragraph contents in Articles/Blogs/Notes.
- When you need copyable/editable/ellipsis texts.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/title.vue">Title Component</demo>
  <demo src="./demo/text.vue">Text and Link Component</demo>
  <demo src="./demo/editable.vue">Editable</demo>
  <demo src="./demo/copyable.vue">Copyable</demo>
  <demo src="./demo/ellipsis.vue">Ellipsis</demo>
  <demo src="./demo/ellipsis-controlled.vue">Controlled ellipsis expand/collapse</demo>
  <demo src="./demo/ellipsis-middle.vue">Ellipsis from middle</demo>
  <demo src="./demo/suffix.vue">suffix</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Typography {#typography}

#### Props {#typography-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| direction | Direction control | 'ltr' \| 'rtl' | - | - |

### Typography.Text {#typography-text}

#### Props {#typography-text-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| code | Code style | boolean | false | - |
| copyable | Whether to be copyable, customize it via setting an object | boolean \| [copyable](#copyable) | false | - |
| delete | Deleted line style | boolean | false | - |
| disabled | Disabled content | boolean | false | - |
| editable | If editable. Can control edit state when is object | boolean \| [editable](#editable) | false | - |
| ellipsis | Display ellipsis when text overflows, can't configure expandable, rows and onExpand by using object. Diff with Typography.Paragraph, Text do not have 100% width style which means it will fix width on the first ellipsis. If you want to have responsive ellipsis, please set width manually | boolean \| [Omit&lt;ellipsis, 'expandable' \| 'rows' \| 'onExpand'&gt;](#ellipsis) | false | - |
| keyboard | Keyboard style | boolean | false | - |
| mark | Marked style | boolean | false | - |
| strong | Bold style | boolean | false | - |
| italic | Italic style | boolean | false | - |
| type | Content type | `secondary` \| `success` \| `warning` \| `danger` | - | - |
| underline | Underlined style | boolean | false | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | TypographyClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | TypographyStylesType | - | - |

#### Events {#typography-text-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | Set the handler to handle click event | (event: MouseEvent) =&gt; void | - |

### Typography.Title {#typography-title}

#### Props {#typography-title-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| code | Code style | boolean | false | - |
| copyable | Whether to be copyable, customize it via setting an object | boolean \| [copyable](#copyable) | false | - |
| delete | Deleted line style | boolean | false | - |
| disabled | Disabled content | boolean | false | - |
| editable | If editable. Can control edit state when is object | boolean \| [editable](#editable) | false | - |
| ellipsis | Display ellipsis when text overflows, can configure rows and expandable by using object | boolean \| [ellipsis](#ellipsis) | false | - |
| level | Set content importance. Match with `h1`, `h2`, `h3`, `h4`, `h5` | number: 1, 2, 3, 4, 5 | 1 | - |
| mark | Marked style | boolean | false | - |
| italic | Italic style | boolean | false | - |
| type | Content type | `secondary` \| `success` \| `warning` \| `danger` | - | - |
| underline | Underlined style | boolean | false | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | TypographyClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | TypographyStylesType | - | - |

#### Events {#typography-title-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | Set the handler to handle click event | (event: MouseEvent) =&gt; void | - |

### Typography.Paragraph {#typography-paragraph}

#### Props {#typography-paragraph-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| code | Code style | boolean | false | - |
| copyable | Whether to be copyable, customize it via setting an object | boolean \| [copyable](#copyable) | false | - |
| delete | Deleted line style | boolean | false | - |
| disabled | Disabled content | boolean | false | - |
| editable | If editable. Can control edit state when is object | boolean \| [editable](#editable) | false | - |
| ellipsis | Display ellipsis when text overflows, can configure rows and expandable by using object | boolean \| [ellipsis](#ellipsis) | false | - |
| mark | Marked style | boolean | false | - |
| strong | Bold style | boolean | false | - |
| italic | Italic style | boolean | false | - |
| type | Content type | `secondary` \| `success` \| `warning` \| `danger` | - | - |
| underline | Underlined style | boolean | false | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | TypographyClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | TypographyStylesType | - | - |

#### Events {#typography-paragraph-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | Set the handler to handle click event | (event: MouseEvent) =&gt; void | - |
| copy | Called when copied text | (event: MouseEvent) =&gt; void | - |

## Types {#types}

### copyable {#copyable}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| format | The Mime Type of the text | 'text/plain' \| 'text/html' | - | - |
| icon | Custom copy icon: \[copyIcon, copiedIcon] | \[VueNode, VueNode] | - | - |
| text | The text to copy | string | - | - |
| tooltips | Custom tooltip text, hide when it is false | \[VueNode, VueNode] | \[`Copy`, `Copied`] | - |
| tabIndex | Set tabIndex of the copy button | number | 0 | - |

#### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| copy | Called when copied text | (event: MouseEvent) =&gt; void | - |

### editable {#editable}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoSize | `autoSize` attribute of textarea | boolean \| &#123; minRows: number, maxRows: number &#125; | - | - |
| editing | Whether to be editable | boolean | false | - |
| icon | Custom editable icon | VueNode | &lt;EditOutlined /&gt; | - |
| maxlength | `maxLength` attribute of textarea | number | - | - |
| tooltip | Custom tooltip text, hide when it is false | VueNode | `Edit` | - |
| text | Edit text, specify the editing content instead of using the children implicitly | string | - | - |
| triggerType | Edit mode trigger - icon, text or both (not specifying icon as trigger hides it) | Array&lt;`icon`\|`text`&gt; | \[`icon`] | - |
| enterIcon | Custom "enter" icon in the edit field (passing `null` removes the icon) | VueNode | `&lt;EnterOutlined /&gt;` | - |
| tabIndex | Set tabIndex of the edit button | number | 0 | - |

#### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Called when input at textarea | (value: string) =&gt; void | - |
| cancel | Called when type ESC to exit editable state | () =&gt; void | - |
| start | Called when enter editable state | () =&gt; void | - |
| end | Called when type ENTER to exit editable state | () =&gt; void | - |

### ellipsis {#ellipsis}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| expandable | Whether to be expandable | boolean \| 'collapsible' | - | - |
| rows | Max rows of content | number | - | - |
| suffix | Suffix of ellipsis content | string | - | - |
| symbol | Custom description of ellipsis | VueNode \| ((expanded: boolean) =&gt; VueNode) | `Expand` `Collapse` | - |
| tooltip | Show tooltip when ellipsis | VueNode \| [TooltipProps](/components/tooltip/#api) | - | - |
| defaultExpanded | Default expand or collapse | boolean | - | - |
| expanded | Expand or Collapse | boolean | - | - |

#### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| ellipsis | Called when enter or leave ellipsis state | (ellipsis: boolean) =&gt; void | - |
| expand | Called when expand content | (event: MouseEvent, info: &#123; expanded: boolean &#125;) =&gt; void | - |

## Design Token {#design-token}

<ComponentTokenTable component="Typography" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.
