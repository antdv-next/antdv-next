---
title: FAQ
---

## 多个组件放一排时没有垂直对齐怎么办？ {#components-are-not-vertically-aligned-when-placed-in-single-row}

尝试使用 [Space](/components/space-cn) 组件来使他们对齐。

## 为什么第三方 SVG 图标设置了 margin-block-end？ {#faq-icon-margin-block-end}

Breadcrumb、Collapse、Segmented、Tabs、Tag 等组件会对相应图标插槽直接传入的 `<svg>` 设置 `display: inline-block`、`vertical-align: middle` 和 `margin-block-end: 0.2em`，用于调整图标与文字的视觉对齐。

在行内布局中，SVG 没有文字基线，默认按底部边缘参与基线对齐，容易显得比文字偏高。`display: inline-block` 让图标保持在行内参与排版，`vertical-align: middle` 则将图标外边距盒的中心对齐到父元素基线上方半个 x-height（小写字母 x 的高度）的位置，使对齐不依赖图标自身的高度。

但 x-height 的中心通常低于大写字母的中心，因此还需要一点向上的视觉补偿。`margin-block-end: 0.2em` 在图标底部增加外边距，外边距盒居中后，图标本身便会向上移动约 `0.1em`，更接近常见字体的大写字母中心。`0.2em` 是基于常见字体中大写字母与小写字母 x 的高度差所做的近似补偿，使用 `em` 使补偿量随字号缩放。

这套样式针对直接传入的 SVG；`@antdv-next/icons` 的 SVG 有额外容器包裹，使用自身的对齐样式。不同字体、图标内部留白或图标自带的 `vertical-align` 都可能影响最终效果。如果图标已经自行处理对齐，或纯图标场景无需文字对齐补偿，可以局部覆盖对应 SVG 的 `margin-block-end: 0`，并结合图标自身样式调整。

## 我的组件默认语言是英文的？如何切回中文的。 {#how-to-switch-the-default-locale-to-chinese}

请尝试使用 [ConfigProvider](/components/config-provider-cn#config-provider-demo-locale) 组件来包裹你的应用。

如果日期组件的国际化仍未生效，请配置 `dayjs.locale('zh-cn')` 并**检查你本地的 `dayjs` 版本和 `antdv-next` 依赖的 `dayjs` 版本是否一致**。

## 为什么时间类组件的国际化 locale 设置不生效？ {#date-related-components-locale-is-not-working}

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

## 为什么有些空内容仍然会渲染 DOM？ {#vue-renderable}

antdv-next 在判断是否需要创建内容的包裹 DOM 时，采用内部的 `isRenderable` 工具函数。它的设计目标是做兼容性的“内容存在性”检查，而不是验证一个值是否为合法的 Vue 节点，也不会递归预测 Vue 最终能否渲染出可见内容。

`isRenderable` 只将 `null`、`undefined`、`false` 和空字符串 `''` 判定为无内容，其他值均判定为有内容。因此，在由它控制包裹 DOM 是否渲染的场景中：

| 传入值 | `isRenderable` | 渲染结果 |
| --- | --- | --- |
| `null`、`undefined`、`false`、`''` | `false` | 不创建包裹 DOM，也不渲染内容 |
| `true` | `true` | 创建包裹 DOM，但 Vue 不会为 `true` 渲染文本内容 |
| `0` | `true` | 创建包裹 DOM，并正常渲染 `0` |
| 非空字符串、其他数字、VNode 等 | `true` | 创建包裹 DOM，并交由 Vue 渲染内容 |

其中 `false` 被视为显式的无内容标记，而 `true` 则表示内容已提供。虽然 `true` 本身不会产生文本节点，但包裹 DOM 仍然会被创建。类似地，空数组、空 Fragment 或最终返回 `null` 的组件也会通过检查。数字 `0` 则不会被误判为空内容，会被正常渲染。

## 通过 CDN（UMD 产物）使用时，`#tagRender` 等驼峰插槽 / 渲染属性不生效？ {#camelcase-slots-render-props-e-g-tagrender-don-t-work-when-using-the-cdn-umd-build}

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

## 为什么弹层没有动画，或者打开时先闪到视口边缘再归位？ {#popup-animation-missing-with-reduced-motion}

这通常不是组件的问题，而是页面里的「减弱动效」全局样式在起作用。很多项目会从样板代码里复制下面这段 CSS：

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

它只在操作系统开启了「减少动态效果」时生效，这是系统设置，不在浏览器里：

- Windows 11：设置 → 辅助功能 → 视觉效果，关闭「动画效果」时生效（Windows 10 对应设置 → 轻松使用 → 显示 →「在 Windows 中显示动画」）。远程桌面、虚拟机，以及性能选项选择了「调整为最佳性能」时，这个开关也常常是关闭的。
- macOS：系统设置 → 辅助功能 → 显示，开启「减少动态效果」时生效，默认关闭。

因此问题看起来像是「只在部分 Windows 电脑上出现」。这段样式生效后：

1. `animation-duration` 会把 Dropdown、Select、Tooltip 等弹层的进出场动画（CSS keyframes）压缩到 0.01ms，看起来就是没有动画。
2. `transition-property` 的默认值是 `all`，所以 `transition-duration` 会让每个元素都凭空获得一个过渡，也包括弹层的定位属性。靠右或靠下对齐的弹层（如 `bottomRight` 的下拉菜单、`top` 的 Tooltip）可能因此在打开的第一帧出现在视口边缘，随后才跳到正确位置。

**排查方法**：在浏览器控制台执行 `matchMedia('(prefers-reduced-motion: reduce)').matches`，返回 `true` 说明系统开启了减少动态效果。在其他电脑上可以通过 Chrome DevTools 的 Rendering 面板，把 `prefers-reduced-motion` 模拟为 `reduce` 来复现。

**处理方式**：

- 如果希望所有设备上的动画保持一致，删除这段全局样式，只为自己需要的元素单独编写减弱动效规则。antdv-next 的组件本身不跟随这个系统设置，这与 antd 的行为一致。
- 如果希望保留全局规则，但让弹层照常播放动画，把弹层的根节点排除在外。若修改过 `prefixCls`，请把 `ant` 替换为对应的前缀：

```css
@media (prefers-reduced-motion: reduce) {
  *:not(.ant-dropdown, .ant-select-dropdown, .ant-cascader-dropdown, .ant-picker-dropdown, .ant-tooltip, .ant-popover),
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
