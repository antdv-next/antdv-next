---
category: Components
subtitle: 图标
description: 语义化的矢量图形。
group: 通用
title: Icon
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*PdAYS7anRpoAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*xEDOTJx2DEkAAAAAAAAAAAAADrJ8AQ/original
---

## 使用方法 {#how-to-use}

使用图标组件，你需要安装 [@antdv-next/icons](https://www.npmjs.com/package/@antdv-next/icons) 图标组件包：

<InstallDependencies npm='npm install @antdv-next/icons' yarn='yarn add @antdv-next/icons' pnpm='pnpm install @antdv-next/icons' bun='bun add @antdv-next/icons'></InstallDependencies>

## 图标列表 {#list-of-icons}

<IconSearch></IconSearch>

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本用法</demo>
  <demo src="./demo/two-tone.vue">多色图标</demo>
  <demo src="./demo/custom.vue">自定义图标</demo>
  <demo src="./demo/iconfont.vue">使用 iconfont.cn</demo>
  <demo src="./demo/scriptUrl.vue">使用 iconfont.cn 的多个资源</demo>
</demo-group>

## API

### 通用图标 {#common-icon}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| class | 设置图标的样式名 | string | - | |
| rotate | 图标旋转角度（IE9 无效） | number | - | |
| spin | 是否有旋转动画 | boolean | false | |
| style | 设置图标的样式，例如 `fontSize` 和 `color` | CSSProperties | - | |
| twoToneColor | 仅适用双色图标。设置双色图标的主要颜色，支持设置十六进制颜色字符串 | string \| string[] | - | |

其中我们提供了三种主题的图标，不同主题的 Icon 组件名为图标名加主题做为后缀。

```vue
<script setup>
import { StarFilled, StarOutlined, StarTwoTone } from '@antdv-next/icons'
</script>

<template>
  <StarOutlined />
  <StarFilled />
  <StarTwoTone two-tone-color="#eb2f96" />
</template>
```

### 自定义 Icon {#custom-icon}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| component | 控制如何渲染图标，通常是一个渲染根标签为 `<svg>` 的 React 组件 | ComponentType&lt;CustomIconComponentProps> | - | |
| rotate | 图标旋转角度（IE9 无效） | number | - | |
| spin | 是否有旋转动画 | boolean | false | |
| style | 设置图标的样式，例如 `fontSize` 和 `color` | CSSProperties | - | |

### 关于 SVG 图标 {#about-svg-icons}

- 完全离线化使用，不需要从 CDN 下载字体文件，图标不会因为网络问题呈现方块，也无需字体文件本地部署。
- 在低端设备上 SVG 有更好的清晰度。
- 支持多色图标。
- 对于内建图标的更换可以提供更多 API，而不需要进行样式覆盖。

更多讨论可参考：[#10353](https://github.com/ant-design/ant-design/issues/10353)。

所有的图标都会以 `<svg>` 标签渲染，可以使用 `style` 和 `class` 设置图标的大小和单色图标的颜色。例如：

```js
import { MessageOutlined } from '@antdv-next/icons'

<MessageOutlined style="fontSize: 16px; color: #08c" />
```

### 双色图标主色 {#set-two-tone-color}

对于双色图标，可以通过使用 `getTwoToneColor()` 和 `setTwoToneColor(colorString)` 来全局设置图标主色。

```jsx
import { getTwoToneColor, setTwoToneColor } from '@antdv-next/icons'

setTwoToneColor('#eb2f96')
getTwoToneColor() // #eb2f96
```

### 自定义 font 图标 {#custom-font-icon}

我们提供了一个 `createFromIconfontCN` 方法，方便开发者调用在 [iconfont.cn](http://iconfont.cn/) 上自行管理的图标。

```js
import { createFromIconfontCN } from '@antdv-next/icons'

const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js', // 在 iconfont.cn 上生成
})
```

其本质上是创建了一个使用 `<use>` 标签来渲染图标的组件。

options 的配置项如下：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| extraCommonProps | 给所有的 `svg` 图标 `<Icon />` 组件设置额外的属性 | { \[key: string]: any } | {} | |
| scriptUrl | [iconfont.cn](http://iconfont.cn/) 项目在线生成的 js 地址 | string \| string\[] | - | |

在 `scriptUrl` 都设置有效的情况下，组件在渲染前会自动引入 [iconfont.cn](http://iconfont.cn/) 项目中的图标符号集，无需手动引入。

见 [iconfont.cn 使用帮助](http://iconfont.cn/help/detail?spm=a313x.7781069.1998910419.15&helptype=code) 查看如何生成 js 地址。

### 自定义 SVG 图标 {#custom-svg-icon}

如果使用 `webpack`，可以通过配置 [@svgr/webpack](https://www.npmjs.com/package/@svgr/webpack) 来将 `svg` 图标作为 `vue` 组件导入。`@svgr/webpack` 的 `options` 选项请参阅 [svgr 文档](https://github.com/smooth-code/svgr#options)。

```js
// webpack.config.js
module.exports = {
  // ... other config
  test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
  use: [
    {
      loader: 'babel-loader',
    },
    {
      loader: '@svgr/webpack',
      options: {
        babel: false,
        icon: true,
      },
    },
  ],
}
```

`Icon` 中的 `component` 组件的接受的属性如下：

| 字段      | 说明                    | 类型             | 只读值         | 版本 |
| --------- | ----------------------- | ---------------- | -------------- | ---- |
| class     | 计算后的 `svg` 类名     | string           | -              |      |
| fill      | `svg` 元素填充的颜色    | string           | `currentColor` |      |
| height    | `svg` 元素高度          | string \| number | `1em`          |      |
| style     | 计算后的 `svg` 元素样式 | CSSProperties    | -              |      |
| width     | `svg` 元素宽度          | string \| number | `1em`          |      |

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Icon"></ComponentTokenTable>

## FAQ

### 为什么有时 icon 注入的样式会引起全局样式异常？{#faq-icon-bad-style}

相关 issue：[#54391](https://github.com/ant-design/ant-design/issues/54391)

启用 `layer` 时，icon 的样式可能会使 `@layer antd` 优先级降低，并导致所有组件样式异常。

这个问题可以通过以下两步解决：

1. 使用 `@antdv-next/icons` 配合 `@antdv-next`。
2. 停止使用 `message`, `Modal` 和 `notification` 的静态方法，改为使用 hooks 版本或 App 提供的实例。

如果无法避免使用静态方法，可以在 App 组件下立刻使用任一一个 icon 组件，以规避静态方法对样式的影响。

```diff
<a-style-provider layer>
  <a-config-provider>
    <a-app>
+     {/* any icon */}
+     <RightOutlined />
      {/* your pages */}
    </a-app>
  </a-config-provider>
</a-style-provider>
```
