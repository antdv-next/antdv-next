---
category: Components
group: Data Entry
title: Select
description: A dropdown menu for displaying choices.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*qGSbQJ0POEsAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a6ggRInInJ4AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

- A dropdown menu for displaying choices - an elegant alternative to the native `<select>` element.
- Utilizing [Radio](/components/radio) is recommended when there are fewer total options (less than 5).
- You probably need [AutoComplete](/components/auto-complete) if you're looking for an input box that can be typed or selected.

## Examples {#examples}

<!-- prettier-ignore -->
<demo-group>
  <demo src="./demo/basic.vue">Basic Usage</demo>
  <demo src="./demo/search.vue">Select with search field</demo>
  <demo src="./demo/search-filter-option.vue">Custom Search</demo>
  <demo src="./demo/multiple.vue">Multiple selection</demo>
  <demo src="./demo/size.vue">Sizes</demo>
  <demo src="./demo/option-render.vue">Custom dropdown options</demo>
  <demo src="./demo/search-sorts.vue">Search with sort</demo>
  <demo src="./demo/tags.vue">Tags</demo>
  <demo src="./demo/optgroup.vue">Option Group</demo>
  <demo src="./demo/coordinate.vue">Coordinate</demo>
  <demo src="./demo/search-box.vue">Search Box</demo>
  <demo src="./demo/label-in-value.vue">Get value of selected item</demo>
  <demo src="./demo/automatic-tokenization.vue">Automatic tokenization</demo>
  <demo src="./demo/search-users.vue">Search and Select Users</demo>
  <demo src="./demo/suffix.vue">Prefix and Suffix</demo>
  <demo src="./demo/custom-dropdown-menu.vue">Custom dropdown</demo>
  <demo src="./demo/hide-selected.vue">Hide Already Selected</demo>
  <demo src="./demo/variant.vue">Variants</demo>
  <demo src="./demo/custom-tag-render.vue">Custom Tag Render</demo>
  <demo src="./demo/custom-label-render.vue">Custom Selected Label Render</demo>
  <demo src="./demo/responsive.vue">Responsive maxTagCount</demo>
  <demo src="./demo/big-data.vue">Big Data</demo>
  <demo src="./demo/status.vue">Status</demo>
  <demo src="./demo/placement.vue">Placement</demo>
  <demo src="./demo/maxCount.vue">Max Count</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

### Property {#property}

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Show clear button | boolean \| &#123; clearIcon?: VueNode &#125; | false | - |
| autoClearSearchValue | Whether the current search will be cleared on selecting an item. Only applies when `mode` is set to `multiple` or `tags` | boolean | true | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function | Record&lt;[SemanticDOM](#semantic-dom), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), string&gt; | - | - |
| defaultActiveFirstOption | Whether active first option by default | boolean | true | - |
| disabled | Whether disabled select | boolean | false | - |
| dropdownClassName | The className of dropdown menu, **Deprecated. Use `classes.popup.root` instead** | string | - | - |
| dropdownMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width, **Deprecated. Use `popupMatchSelectWidth` instead** | boolean \| number | - | - |
| dropdownRender | Customize dropdown content, **Deprecated. Use `popupRender` instead** | (originNode: VueNode) =&gt; VueNode | - | - |
| dropdownStyle | The style of dropdown menu, **Deprecated. Use `styles.popup.root` instead** | CSSProperties | - | - |
| fieldNames | Customize node label, value, options, groupLabel field name | object | &#123; label: 'label', value: 'value', options: 'options', groupLabel: 'label' &#125; | - |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns true, the option will be included in the filtered set; Otherwise, it will be excluded | boolean \| (inputValue: string, option?: Option) =&gt; boolean | true | - |
| filterSort | Sort function for search options sorting, see Array.sort's compareFunction | (optionA: Option, optionB: Option, info: &#123; searchValue: string &#125;) =&gt; number | - | - |
| getPopupContainer | Parent Node which the selector should be rendered to. Default to body. When position issues happen, try to modify it into scrollable content and position it relative | (triggerNode: HTMLElement) =&gt; HTMLElement | () =&gt; document.body | - |
| labelInValue | Whether to embed label in value, turn the format of value from `string` to `&#123; value: string, label: VueNode &#125;` | boolean | false | - |
| listHeight | Config popup height | number | 256 | - |
| loading | Indicate loading state | boolean | false | - |
| maxCount | The max number of items can be selected, only applies when `mode` is `multiple` or `tags` | number | - | - |
| maxTagCount | Max tag count to show. `responsive` will cost render performance | number \| 'responsive' | - | - |
| maxTagPlaceholder | Placeholder for not showing tags | VueNode \| (omittedValues: LabeledValue[]) =&gt; VueNode | - | - |
| maxTagTextLength | Max tag text length to show | number | - | - |
| menuItemSelectedIcon | The custom menuItemSelected icon with multiple options | VueNode | - | - |
| mode | Set mode of Select | 'multiple' \| 'tags' | - | - |
| notFoundContent | Specify content to show when no result matches | VueNode | `Not Found` | - |
| open | Controlled open state of dropdown | boolean | - | - |
| optionFilterProp | Which prop value of option will be used for filter if filterOption is true. If options is set, it should be set to label. When a string[] is provided, multiple fields are searched using OR matching | string \| string[] | value | - |
| options | Select options. Will get better perf than jsx definition | &#123; label: VueNode; value: string &#125;[] | - | - |
| optionRender | Customize the rendering dropdown options | (option: FlattenOptionData&lt;BaseOptionType&gt;, info: &#123; index: number &#125;) =&gt; VueNode | - | - |
| placeholder | The placeholder of select | string | - | - |
| placement | The position where the selection box pops up | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft | - |
| popupClassName | The className of dropdown menu, use `classes.popup.root` instead | string | - | - |
| popupMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | true | - |
| popupRender | Customize dropdown content | (originNode: VueNode) =&gt; VueNode | - | - |
| prefix | The custom prefix | VueNode | - | - |
| removeIcon | The custom remove icon | VueNode | - | - |
| searchValue | The current input "search" text | string | - | - |
| showSearch | Whether select is searchable | boolean \| Object | single: false, multiple: true | - |
| size | Size of Select input | `large` \| `middle` \| `small` | - | - |
| status | Set validation status | 'error' \| 'warning' | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-dom), CSSProperties&gt; | - | - |
| suffixIcon | The custom suffix icon. Customize icon will not response click open to avoid icon designed to do other interactive. You can use `pointer-events: none` style to bypass | VueNode | `<DownOutlined />` | - |
| tagRender | Customize tag render, only applies when `mode` is set to `multiple` or `tags` | (props) =&gt; VueNode | - | - |
| labelRender | Customize selected label render | (props: LabelInValueType) =&gt; VueNode | - | - |
| tokenSeparators | Separator used to tokenize, only applies when `mode="tags"` | string[] | - | - |
| value | Current selected option (considered as a immutable array), support `v-model:value` | string \| string[] \| number \| number[] | - | - |
| variant | Variants of selector | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | - |
| virtual | Disable virtual scroll when set to false | boolean | true | - |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| active | Called when keyboard or mouse interaction occurs | (value: string \| number) =&gt; void | - |
| blur | Called when blur | (event: FocusEvent) =&gt; void | - |
| change | Called when select an option or input value change | (value, option: Option \| Array&lt;Option&gt;) =&gt; void | - |
| clear | Called when clear | () =&gt; void | - |
| deselect | Called when an option is deselected, param is the selected option's value. Only called for `multiple` or `tags`, effective in multiple or tags mode only | (value: string \| number) =&gt; void | - |
| dropdownVisibleChange | Called when dropdown open, **Deprecated. Use `openChange` instead** | (open: boolean) =&gt; void | - |
| focus | Called when focus | (event: FocusEvent) =&gt; void | - |
| inputKeydown | Called when key pressed | (event: KeyboardEvent) =&gt; void | - |
| openChange | Called when dropdown open | (open: boolean) =&gt; void | - |
| popupScroll | Called when dropdown scrolls | (event: UIEvent) =&gt; void | - |
| search | Callback function that is fired when input changed | (value: string) =&gt; void | - |
| select | Called when an option is selected, the params are option's value (or key) and option instance | (value: string \| number, option: Option) =&gt; void | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| labelRender | Customize selected label render | (props: LabelInValueType) =&gt; VueNode | - |
| maxTagPlaceholder | Placeholder for not showing tags | (omittedValues: LabeledValue[]) =&gt; VueNode | - |
| menuItemSelectedIcon | The custom menuItemSelected icon with multiple options | VueNode | - |
| notFoundContent | Specify content to show when no result matches | VueNode | - |
| optionRender | Customize the rendering dropdown options | (option: FlattenOptionData&lt;BaseOptionType&gt;, info: &#123; index: number &#125;) =&gt; VueNode | - |
| popupRender | Customize dropdown content | (originNode: VueNode) =&gt; VueNode | - |
| prefix | The custom prefix | VueNode | - |
| removeIcon | The custom remove icon | VueNode | - |
| suffixIcon | The custom suffix icon. Customize icon will not response click open to avoid icon designed to do other interactive. You can use `pointer-events: none` style to bypass | VueNode | - |
| tagRender | Customize tag render, only applies when `mode` is set to `multiple` or `tags` | (props) =&gt; VueNode | - |

### Select Methods {#methods}

| Name | Description | Version |
| --- | --- | --- |
| blur() | Remove focus | - |
| focus() | Get focus | - |

### showSearch {#showsearch}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoClearSearchValue | Whether the current search will be cleared on selecting an item. Only applies when `mode` is set to `multiple` or `tags` | boolean | true | - |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns true, the option will be included in the filtered set; Otherwise, it will be excluded | boolean \| (inputValue: string, option?: Option) =&gt; boolean | true | - |
| filterSort | Sort function for search options sorting, see Array.sort's compareFunction | (optionA: Option, optionB: Option, info: &#123; searchValue: string &#125;) =&gt; number | - | - |
| optionFilterProp | Which prop value of option will be used for filter if filterOption is true. If options is set, it should be set to label. When a string[] is provided, multiple fields are searched using OR matching | string \| string[] | value | - |
| searchValue | The current input "search" text | string | - | - |
| onSearch | Callback function that is fired when input changed | (value: string) =&gt; void | - | - |

### Option props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabled | Disable this option | boolean | false | - |
| title | title attribute of Select Option | string | - | - |
| value | Default to filter with this property | string \| number | - | - |

### OptGroup props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | Group key | string | - | - |
| label | Group label | string \| VueNode | - | - |
| title | title attribute of Select Option | string | - | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Select"></ComponentTokenTable>

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.

## FAQ

### Why sometimes search will show 2 same option when in `tags` mode? {#faq-tags-mode-duplicate}

It's caused by option with different `label` and `value`. You can use `optionFilterProp="label"` to change filter logic instead.

### When I click elements in popupRender, the select dropdown will not be closed? {#faq-popup-not-close}

You can control it by `open` prop.

### I don't want dropdown close when click inside `popupRender`? {#faq-popup-keep-open}

Select will close when it lose focus. You can prevent event to handle this:

```html
  <a-select>
    <template #popupRender>
      <div
        @mousedown="(e) => {
          e.preventDefault()
          e.stopPropagation()
        }"
      >
        Some Content
      </div>
    </template>
  </a-select>
```

### Why sometimes customize Option cause scroll break? {#faq-custom-option-scroll}

Virtual scroll internal set item height as `24px`. You need to adjust `listItemHeight` when your option height is less and `listHeight` config list container height:

```html
  <a-select :list-item-height="10" :list-height="250" />
```

Note: `listItemHeight` and `listHeight` are internal props. Please only modify when necessary.

### Why a11y test report missing `aria-` props? {#faq-aria-attribute}

Select only create a11y auxiliary node when operating on. Please open Select and retry. For `aria-label` & `aria-labelledby` miss warning, please add related prop to Select with your own requirement.

Default virtual scrolling will create a mock element to simulate an accessible binding. If a screen reader needs to fully access the entire list, you can set `:virtual="false"` to disable virtual scrolling and the accessibility option will be bound to the actual element.

### Custom tags generated using `tagRender` slot will pop up a drop-down box when clicked to close {#faq-tagrender-dropdown}

If you don't want a drop-down menu to appear automatically after clicking on an element (such as a close icon), you can prevent the `mousedown` event from propagating on it.

```html
  <a-select>
    <template #tagRender="{ closable, label, onClose }">
      <span class="border">
        &#123;&#123; label &#125;&#125;
        <span
          v-if="closable"
          class="cursor-pointer"
          @mousedown.stop
          @click="onClose"
        >
          ❎
        </span>
      </span>
    </template>
  </a-select>
```
