# Antdv-next Auto Import Resolver

[English](./README.md) | 简体中文

`@antdv-next/auto-import-resolver` 是 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 的一个解析器，用于实现 [Antdv Next](https://antdv-next.com) 按需引入。

### 特性

- 支持 `Vite`, `Webpack`, `Rspack`, `Vue CLI`, `Rollup`, `esbuild` 等

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
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
// vite.config.ts
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
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
// rollup.config.js
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
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
// webpack.config.js
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
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
// rspack.config.js
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
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
// vue.config.js
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
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
// esbuild.config.js
import Components from 'unplugin-vue-components/esbuild'

build({
  plugins: [
    Components({
      resolvers: [AntdvNextResolver()],
    }),
  ],
})
```

## 选项

### resolveIcons

自动引入 [@antdv-next/icons](https://www.antdv-next.com/components/icon-cn) 图标库

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

设置不自动引入的组件或图标。

- **Type：** `string[]`
- **Default：** `[]`
- **Example：**

```ts
Components({
  resolvers: [
    AntdvNextResolver({
      exclude: ['Button'],
    }),
  ],
})
```
