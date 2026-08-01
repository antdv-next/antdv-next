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
