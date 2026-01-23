# Antdv-next Auto Import Resolver

English | [简体中文](./README.zh-CN.md)

`@antdv-next/auto-import-resolver` is a resolver for [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) that enables on-demand importing of [Antdv Next](https://antdv-next.com) components.

### Features

- Supports `Vite`, `Webpack`, `Rspack`, `Vue CLI`, `Rollup`, `esbuild`, and more.

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
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [AntdvNextResolver()],
    }),
  ],
})
```

### Rollup

```ts
// rollup.config.js
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
import Components from 'unplugin-vue-components/rollup'

export default {
  plugins: [
    Components({
      resolvers: [AntdvNextResolver()],
    }),
  ],
}
```

### Webpack

```ts
// webpack.config.js
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
import Components from 'unplugin-vue-components/webpack'

module.exports = {
  plugins: [
    Components({
      resolvers: [AntdvNextResolver()],
    }),
  ],
}
```

### Rspack

```ts
// rspack.config.js
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
import Components from 'unplugin-vue-components/rspack'

module.exports = {
  plugins: [
    Components({
      resolvers: [AntdvNextResolver()],
    }),
  ],
}
```

### Vue CLI

```ts
// vue.config.js
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
import Components from 'unplugin-vue-components/webpack'

module.exports = {
  configureWebpack: {
    plugins: [
      Components({
        resolvers: [AntdvNextResolver()],
      }),
    ],
  },
}
```

### esbuild

```ts
// esbuild.config.js
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
import Components from 'unplugin-vue-components/esbuild'

build({
  plugins: [
    Components({
      resolvers: [AntdvNextResolver()],
    }),
  ],
})
```

## Options

### resolveIcons

Automatically import [@antdv-next/icons](https://www.antdv-next.com/components/icon-cn) icons library.

- **Type：** `boolean`
- **Default：** `false`
- **Example：**

```ts
Components({
  resolvers: [
    AntdvNextResolver({
      resolveIcons: true,
    })
  ]
})
```

### exclude

Set the components or icons that do not require automatic import.

- **Type:** `string[]`
- **Default:** `[]`
- **Example:**

```ts
Components({
  resolvers: [
    AntdvNextResolver({
      exclude: ['Button'],
    }),
  ],
})
```
