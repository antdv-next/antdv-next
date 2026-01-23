# Antdv-next Auto Import Resolver

[English](./README.md) | 简体中文

`@antdv-next/auto-import-resolver` 是 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 的一个解析器，用于实现 Antdv-next 按需引入。

### 特性

- 支持 `Vite`, `Webpack`, `Rspack`, `Vue CLI`, `Rollup`, `esbuild` 等
- 支持自动引入组件对应的 CSS 样式
- 支持 SSR（服务端渲染）

### 安装

```shell
# via npm
npm i @antdv-next/auto-import-resolver unplugin-vue-components unplugin-auto-import -D

# via yarn
yarn add @antdv-next/auto-import-resolver unplugin-vue-components unplugin-auto-import -D

# via pnpm
pnpm add @antdv-next/auto-import-resolver unplugin-vue-components unplugin-auto-import -D

# via Bun
bun add @antdv-next/auto-import-resolver unplugin-vue-components unplugin-auto-import -D
```

## 使用

### Vite

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite';
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver';

export default defineConfig({
  plugins: [
    Components({
      resolvers: [AntdvNextResolver()],
    }),
  ],
});
```

### Rollup

```ts
// rollup.config.js
import Components from 'unplugin-vue-components/rollup';
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver';

export default {
  plugins: [
    Components({
      resolvers: [AntdvNextResolver()],
    }),
  ],
};
```

### Webpack

```ts
// webpack.config.js
import Components from 'unplugin-vue-components/webpack';
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver';

module.exports = {
  plugins: [
    Components({
      resolvers: [AntdvNextResolver()],
    }),
  ],
};
```

### Rspack

```ts
// rspack.config.js
import Components from 'unplugin-vue-components/rspack';
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver';

module.exports = {
  plugins: [
    Components({
      resolvers: [AntdvNextResolver()],
    }),
  ],
};
```

### Vue CLI

```ts
// vue.config.js
import Components from 'unplugin-vue-components/webpack';
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver';

module.exports = {
  configureWebpack: {
    plugins: [
      Components({
        resolvers: [AntdvNextResolver()],
      }),
    ],
  },
};
```

### esbuild

```ts
// esbuild.config.js
import Components from 'unplugin-vue-components/esbuild';
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver';

build({
  plugins: [
    Components({
      resolvers: [AntdvNextResolver()],
    }),
  ],
});
```

