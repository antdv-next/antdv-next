---
category: Components
group: Data Entry
title: Cascader
description: Cascade selection box.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ngTnQZNOcK0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Nt8xR7afyr0AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

- When you need to select from a set of associated data set. Such as province/city/district, company level, things classification.
- When selecting from a large data set, with multi-stage classifications separated for easy selection.
- Chooses cascade items in one float layer for better user experience.

## Examples {#examples}

<demo-group>
<demo src="./demo/multiple.vue">Multiple</demo>
<demo src="./demo/showCheckedStrategy.vue">ShowCheckedStrategy</demo>
<demo src="./demo/size.vue">Size</demo>
<demo src="./demo/custom-render.vue">Custom render</demo>
<demo src="./demo/search.vue">Search</demo>
<demo src="./demo/lazy.vue">Load Options Lazily</demo>
<demo src="./demo/fields-name.vue">Custom Field Names</demo>
<demo src="./demo/suffix.vue">Prefix and Suffix</demo>
<demo src="./demo/custom-dropdown.vue">Custom dropdown</demo>
<demo src="./demo/placement.vue">Placement</demo>
<demo src="./demo/variant.vue" >Variants</demo>
<demo src="./demo/status.vue">Status</demo>
<demo src="./demo/style-class.vue" >Custom semantic dom styling</demo>
<demo src="./demo/panel.vue">Panel</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Show clear button | boolean \| \{ clearIcon?: VueNode \} | true | - |
| changeOnSelect | Change value on each selection if set to true (always works when `multiple` is `true`) | boolean | false | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: \{ props \})=&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| disabled | Whether disabled select | boolean | false | - |
| expandTrigger | expand current item when click or hover, one of `click` `hover` | string | `click` | - |
| fieldNames | Custom field name for label and value and children | object | \{ label: `label`, value: `value`, children: `children` \} | - |
| getPopupContainer | Parent Node which the selector should be rendered to. Default to `body`. When position issues happen, try to modify it into scrollable content and position it relative. [example](https://codepen.io/afc163/pen/zEjNOy?editors=0010) | function(triggerNode) | () =&gt; document.body | - |
| loadData | To load option lazily, and it cannot work with `showSearch` | (selectedOptions) =&gt; void | - | - |
| maxTagCount | Max tag count to show. `responsive` will cost render performance | number \| `responsive` | - | - |
| maxTagPlaceholder | Placeholder for not showing tags | VueNode \| function(omittedValues) | - | - |
| maxTagTextLength | Max tag text length to show | number | - | - |
| multiple | Support multiple or not | boolean | - | - |
| open | Set visible of cascader popup | boolean | - | - |
| options | The data options of cascade | [Option](#option)\[] | - | - |
| placeholder | The input placeholder | string | - | - |
| placement | Use preset popup align config from builtinPlacements | `bottomLeft` `bottomRight` `topLeft` `topRight` | `bottomLeft` | - |
| popupMenuColumnStyle | The style of the drop-down menu column | CSSProperties | - | - |
| showCheckedStrategy | The way to show selected items in the box (only effective when `multiple` is `true`). `Cascader.SHOW_CHILD`: just show child treeNode. `Cascader.SHOW_PARENT`: just show parent treeNode (when all child treeNode under the parent treeNode are checked) | `Cascader.SHOW_PARENT` \| `Cascader.SHOW_CHILD` | `Cascader.SHOW_PARENT` | - |
| showSearch | Whether show search input in single mode | boolean \| [Object](#showsearch) | false | - |
| ~~searchValue~~ | Set search value, Need work with `showSearch` | string | - | - |
| size | The input size | `large` \| `middle` \| `small` | - | - |
| status | Set validation status | 'error' \| 'warning' | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: \{ props \})=&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| value | The selected value, support `v-model:value` | string\[] \ | number\[] | - | - |
| variant | Variants of selector | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback when finishing cascader select | (value, selectedOptions) =&gt; void | - |
| openChange | Callback when popup shown or hidden | (value) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| displayRender | The render function of displaying selected options | (label, selectedOptions) => VueNode | - |
| expandIcon | Customize the current item expand icon | VueNode | - |
| loadingIcon | The appearance of lazy loading (now is useless) | VueNode | - |
| notFoundContent | Specify content to show when no result matches | VueNode | - |
| optionRender | Customize the rendering dropdown options | (option: Option) => VueNode | - |
| popupRender | Customize dropdown content | (menus: VueNode) => VueNode | - |
| prefix | The custom prefix | VueNode | - |
| removeIcon | The custom remove icon | VueNode | - |
| suffixIcon | The custom suffix icon | VueNode | - |
| tagRender | Custom render function for tags in `multiple` mode | (\{ label: string, onClose: function, value: string \}) =&gt; VueNode | - |

### Methods

| Method | Description | Version |
| --- | --- | --- |
| blur() | Remove focus | - |
| focus() | Get focus | - |

## Types

### showSearch

Fields for showSearch when it's an object:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoClearSearchValue | Whether the current search will be cleared on selecting an item. Only applies when `multiple` is `true` | boolean | true | - |
| filter | The function will receive two arguments, inputValue and option, if the function returns true, the option will be included in the filtered set; Otherwise, it will be excluded | function(inputValue, path): boolean | - | - |
| limit | Set the count of filtered items | number \| false | 50 | - |
| matchInputWidth | Whether the width of list matches input, ([how it looks](https://github.com/ant-design/ant-design/issues/25779)) | boolean | true | - |
| render | Used to render filtered options | function(inputValue, path): VueNode | - | - |
| sort | Used to sort filtered options | function(a, b, inputValue) | - | - |
| searchValue | Set search value, Need work with `showSearch` | string | - | - |
| onSearch | The callback function triggered when input changed | (search: string) =&gt; void | - | - |

### Option

```typescript
interface Option {
  value: string | number
  label?: VueNode
  disabled?: boolean
  children?: Option[]
  // Determines if this is a leaf node(effective when `loadData` is specified).
  // `false` will force trade TreeNode as a parent node.
  // Show expand icon even if the current node has no children.
  isLeaf?: boolean
}
```

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Cascader"></ComponentTokenTable>
