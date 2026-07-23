---
title: FAQ
---

## 多个组件放一排时没有垂直对齐怎么办？

尝试使用 [Space](/components/space-cn) 组件来使他们对齐。

## 我的组件默认语言是英文的？如何切回中文的。

请尝试使用 [ConfigProvider](/components/config-provider-cn#config-provider-demo-locale) 组件来包裹你的应用。

如果日期组件的国际化仍未生效，请配置 `dayjs.locale('zh-cn')` 并**检查你本地的 `dayjs` 版本和 `antdv-next` 依赖的 `dayjs` 版本是否一致**。

## 为什么时间类组件的国际化 locale 设置不生效？

请检查是否正确设置了 dayjs 语言包。

```js
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
```

如果还有问题，请检查是否有两个版本的 dayjs 共存？

```jsx
npm ls dayjs
```

一般来说，如果项目中依赖的 dayjs 版本和 antdv-next 依赖的 dayjs 版本 无法兼容（semver 无法匹配，比如项目中的 dayjs 版本写死且较低），则会导致使用两个不同版本的 dayjs 实例，这样也会导致国际化失效。

## 通过 CDN（UMD 产物）使用时，`#tagRender` 等驼峰插槽 / 渲染属性不生效？

这是 Vue **DOM 内模板（in-DOM template）** 的解析限制，并非组件的问题。当你把模板直接写在页面的 HTML 里（例如写在 `<div id="app">` 内部）时，浏览器的 HTML 解析器会把标签名和属性名（包括插槽名 `#tagRender`）**强制转为小写**，组件实际收到的是 `tagrender` 而不是 `tagRender`，因此驼峰命名的插槽和渲染属性都不会生效。这对所有驼峰插槽（如 `tagRender`、`maxTagPlaceholder`、`popupRender` 等）都成立，把插槽名改成小写 `#tagrender` 同样无效。详见 Vue 官方文档 [DOM 内模板解析注意事项](https://cn.vuejs.org/guide/essentials/component-basics.html#in-dom-template-parsing-caveats)。

解决方式任选其一（前两种无需构建工具）：

**方式一：把模板写成 JS 字符串**（CDN 场景推荐，改动最小）。不要把组件写进页面 HTML，改放到 `template` 选项字符串里，Vue 运行时编译器会大小写敏感地解析：

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

**方式二：使用渲染函数 `h`**：

```js
const { h } = Vue
h(window.antd.TreeSelect, { treeData, multiple: true }, {
  tagRender: props => h('span', { style: 'color: red' }, props.label),
})
```

**方式三：使用单文件组件（`.vue`）配合 Vite / webpack 等构建工具**。正式项目推荐此方式，SFC 编译器完整保留大小写，不受该限制影响。
