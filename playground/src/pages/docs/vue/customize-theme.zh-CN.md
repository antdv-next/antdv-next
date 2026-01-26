---
title: 定制主题
---

Antdv Next 设计规范和技术上支持灵活的样式定制，以满足业务和品牌上多样化的视觉需求，包括但不限于全局样式（主色、圆角、边框）和指定组件的视觉定制。

我们提供了一套全新的定制主题方案。有了 CSS-in-JS 的加持后，动态主题的能力也得到了加强，包括但不限于：

1. 支持动态切换主题；
2. 支持同时存在多个主题；
3. 支持针对某个/某些组件修改主题变量；
4. ...

## 配置主题

我们把影响主题的最小元素称为 **Design Token**。通过修改 Design Token，我们可以呈现出各种各样的主题或者组件。通过在 `ConfigProvider` 中传入 `theme` 属性，可以配置主题。


:::warning
`ConfigProvider` 对 `message.xxx`、`Modal.xxx`、`notification.xxx` 等静态方法不会生效，原因是在这些方法中，antdv-next 会通过 `render` 动态创建新的 Vue 实体。其 context 与当前代码所在 context 并不相同，因而无法获取 context 信息。

当你需要 context 信息（例如 ConfigProvider 配置的内容）时，可以通过 `Modal.useModal` 方法返回 modal 实体以及 contextHolder 节点，将其插入到你需要获取 context 位置即可。也可通过 [App 包裹组件](/components/app-cn) 简化 useModal 等方法需要手动植入 contextHolder 的问题。
:::


### 修改主题变量


通过 `theme` 中的 `token` 属性，可以修改一些主题变量。部分主题变量会引起其他主题变量的变化，我们把这些主题变量称为 Seed Token。

```stackblitz {title="修改主题变量"}                                                                                                                                                                                                
<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#00b96b',
        borderRadius: 2,
        colorBgContainer: '#f6ffed',
      },
    }"
  >
    <a-space>
      <a-button type="primary">Primary</a-button>
      <a-button>Default</a-button>
    </a-space>
  </a-config-provider>
</template>
```

### 使用预设算法


通过修改算法可以快速生成风格迥异的主题，我们默认提供三套预设算法，分别是:

- 默认算法 `theme.defaultAlgorithm`
- 暗色算法 `theme.darkAlgorithm`
- 紧凑算法 `theme.compactAlgorithm`

你可以通过 `theme` 中的 `algorithm` 属性来切换算法，并且支持配置多种算法，将会依次生效。


```stackblitz {title="使用预设算法"}
<template>
  <a-config-provider
    :theme="{
      algorithm: theme.darkAlgorithm,
      // 或者组合算法：
      // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
    }"
  >
    <a-space>
      <a-input placeholder="Please Input" />
      <a-button type="primary">Submit</a-button>
    </a-space>
  </a-config-provider>
</template>

<script setup lang="ts">
import { theme } from 'antdv-next'
</script>
```

### 修改组件变量


除了整体的 Design Token，各个组件也会开放自己的 Component Token 来实现针对组件的样式定制能力，不同的组件之间不会相互影响。同样地，也可以通过这种方式来覆盖组件的其他 Design Token。


:::info 组件级别的主题算法
默认情况下，所有组件变量都仅仅是覆盖，不会基于 Seed Token 计算派生变量。

在 `>= 1.0.0` 版本中，组件变量支持传入 `algorithm` 属性，可以开启派生计算或者传入其他算法。
:::


```stackblitz {title="修改组件变量"}
<template>
  <a-config-provider
    :theme="{
      components: {
        Button: {
          colorPrimary: '#00b96b',
          algorithm: true,
        },
        Input: {
          colorPrimary: '#eb2f96',
          algorithm: true,
        },
      },
    }"
  >
    <a-space>
      <div style="font-size: 14px">开启算法：</div>
      <a-input placeholder="Please Input" />
      <a-button type="primary">Submit</a-button>
    </a-space>
  </a-config-provider>

  <a-divider />

  <a-config-provider
    :theme="{
      components: {
        Button: {
          colorPrimary: '#00b96b',
        },
        Input: {
          colorPrimary: '#eb2f96',
        },
      },
    }"
  >
    <a-space>
      <div style="font-size: 14px">禁用算法：</div>
      <a-input placeholder="Please Input" />
      <a-button type="primary">Submit</a-button>
    </a-space>
  </a-config-provider>
</template>
```