# Antdv-next Auto Import Resolver

English | [简体中文](./README.zh-CN.md)

`@antdv-next/auto-import-resolver` is a resolver for [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) that enables on-demand importing of Antdv-next components.

### Features

- Supports `Vite`, `Webpack`, `Rspack`, `Vue CLI`, `Rollup`, `esbuild`, and more.
- Automatically imports the corresponding CSS styles for the components.
- Supports SSR (Server-Side Rendering).

### Installation

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

## Usage

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
