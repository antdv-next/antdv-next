---
title: FAQ
---

## Components are not vertically aligned when placed in single row.

Try [Space](/components/space/) component to make them aligned.

## Date-related components locale is not working?

Please check whether you have imported dayjs locale correctly.

```jsx
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
```

Please check whether there are two versions of dayjs installed.

```jsx
npm ls dayjs
```

If you are using a mismatched version of dayjs with antdv-next dependent dayjs in your project. That would be a problem cause locale not working.

## Why is a DOM node still rendered for some empty content? {#vue-renderable}

antdv-next uses the internal `isRenderable` utility to determine whether a content wrapper DOM should be created. It is designed as a compatibility-oriented content presence check, not a validator for valid Vue nodes, and it does not recursively predict whether Vue will eventually produce visible content.

`isRenderable` treats only `null`, `undefined`, `false`, and the empty string `''` as having no content. All other values are treated as content. Therefore, when it controls whether a wrapper DOM is rendered:

| Value | `isRenderable` | Result |
| --- | --- | --- |
| `null`, `undefined`, `false`, `''` | `false` | Neither the wrapper DOM nor any content is rendered |
| `true` | `true` | The wrapper DOM is created, but Vue renders no text content for `true` |
| `0` | `true` | The wrapper DOM is created and `0` is rendered normally |
| Non-empty strings, other numbers, VNodes, etc. | `true` | The wrapper DOM is created and Vue handles the content |

Here, `false` is treated as an explicit no-content marker, while `true` means that content was provided. Although `true` itself produces no text node, the wrapper DOM is still created. Similarly, an empty array, an empty Fragment, or a component that eventually returns `null` passes the check. The number `0` is not mistaken for empty content and is rendered normally.

## Camelcase slots / render props (e.g. `#tagRender`) don't work when using the CDN (UMD) build?

This is a limitation of Vue **in-DOM templates**, not a component bug. When the template is written directly in the page's HTML (e.g. inside `<div id="app">`), the browser's HTML parser **lowercases** tag and attribute names — including slot names, so `#tagRender` reaches the component as `tagrender` instead of `tagRender`, and the camelCase slot never fires. This applies to every camelCase slot (`tagRender`, `maxTagPlaceholder`, `popupRender`, …), and writing `#tagrender` in lowercase does not help either. See the Vue docs on [in-DOM template parsing caveats](https://vuejs.org/guide/essentials/component-basics.html#in-dom-template-parsing-caveats).

Pick any of the following (the first two need no build tooling):

**Option 1: Write the template as a JS string** (recommended for CDN usage, smallest change). Instead of putting the markup in the page HTML, move it into the `template` option string, which Vue's runtime compiler parses case-sensitively:

```js
const App = {
  template: `
    <a-tree-select :tree-data="treeData" multiple style="width: 100%">
      <template #tagRender="tagProps">
        <span style="color: red">{{ tagProps.label }}</span>
      </template>
    </a-tree-select>
  `,
  setup() {
    return { treeData }
  },
}
Vue.createApp(App).use(window.antd).mount('#app')
```

**Option 2: Use a render function `h`**:

```js
const { h } = Vue
h(window.antd.TreeSelect, { treeData, multiple: true }, {
  tagRender: props => h('span', { style: 'color: red' }, props.label),
})
```

**Option 3: Use a Single-File Component (`.vue`) with a build tool** such as Vite / webpack. Recommended for real projects — the SFC compiler preserves case and is not affected by this limitation.
