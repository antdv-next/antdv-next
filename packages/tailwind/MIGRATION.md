# 从 UnoCSS 迁移到 Tailwind CSS

本指南帮助你从 `@antdv-next/unocss` 迁移到 `@antdv-next/tailwind`。

## 快速迁移

### 1. 更换依赖

```bash
# 卸载 UnoCSS
pnpm remove unocss @antdv-next/unocss

# 安装 Tailwind CSS
pnpm add -D tailwindcss postcss autoprefixer @antdv-next/tailwind
```

### 2. 配置文件

**之前 (uno.config.ts):**

```ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      prefix: 'a',
      antPrefix: 'ant',
    }),
  ],
})
```

**之后 (tailwind.config.ts):**

```ts
import type { Config } from 'tailwindcss'
import { createAntdPlugin } from '@antdv-next/tailwind'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  plugins: [
    createAntdPlugin({
      antPrefix: 'ant',
    }),
  ],
} satisfies Config
```

### 3. 入口文件

**移除 UnoCSS 导入:**

```ts
// main.ts
- import 'uno.css'
```

**添加 Tailwind CSS 指令:**

```css
/* src/style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```ts
// main.ts
import './style.css'
```

### 4. Vite 配置

**之前:**

```ts
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
  ],
})
```

**之后:**

```ts
export default defineConfig({
  plugins: [
    vue(),
  ],
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
})
```

或者创建 `postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 类名差异

大部分类名保持一致，但有一些需要注意的差异：

### UnoCSS Preset → Tailwind Plugin

| UnoCSS | Tailwind | 说明 |
|--------|----------|------|
| `a-bg-primary` | `bg-primary` | 不需要前缀（除非自定义） |
| `a-text-blue-5` | `text-blue-5` | 相同 |
| `a-p-lg` | `p-lg` | 相同 |
| `a-rounded-lg` | `rounded-lg` | 相同 |
| `a-shadow-card` | `shadow-card` | 相同 |

### 注意事项

1. **前缀处理不同**
   - UnoCSS: 通过 `prefix` 选项添加前缀到所有工具类
   - Tailwind: 前缀在 Tailwind 配置的顶层设置（影响所有工具类）

2. **按需生成**
   - UnoCSS: 扫描源码即时生成
   - Tailwind: 通过 `content` 配置扫描文件

3. **自动完成**
   - UnoCSS: 内置自动完成
   - Tailwind: 需要安装 [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) 扩展

## 完整迁移清单

- [ ] 更新依赖 (移除 UnoCSS, 添加 Tailwind CSS)
- [ ] 创建 `tailwind.config.ts`
- [ ] 创建 `postcss.config.js` (或更新 Vite 配置)
- [ ] 移除 `uno.config.ts`
- [ ] 移除 `import 'uno.css'`
- [ ] 添加 Tailwind CSS 指令到 CSS 文件
- [ ] 更新 Vite 配置
- [ ] 移除 `a-` 前缀 (如果使用了)
- [ ] 测试应用是否正常工作
- [ ] 安装 Tailwind CSS IntelliSense 扩展

## 性能对比

| 特性 | UnoCSS | Tailwind CSS |
|------|--------|--------------|
| 首次构建 | 更快 | 稍慢 |
| 热更新 | 极快 | 快 |
| 生产构建 | 极小 | 小 |
| 工具生态 | 较少 | 丰富 |
| 社区支持 | 较少 | 大量 |

## 常见问题

### Q: 为什么要迁移到 Tailwind？

A: 
- 更大的社区和生态系统
- 更多的第三方插件和工具
- 更成熟的文档和教程
- 更广泛的工具支持

### Q: 迁移会影响应用性能吗？

A: 构建时间可能略有增加，但运行时性能几乎没有差异。Tailwind CSS 的优化非常成熟。

### Q: 可以同时使用两者吗？

A: 技术上可以，但不推荐。这会导致样式冲突和包体积增加。

### Q: 迁移后主题切换还能用吗？

A: 完全可以！两者都基于相同的 Ant Design Vue CSS 变量系统，主题切换功能完全不受影响。

## 需要帮助？

如果遇到迁移问题：

1. 查看 [Tailwind CSS 文档](https://tailwindcss.com/docs)
2. 查看 [@antdv-next/tailwind 文档](./README.zh-CN.md)
3. 提交 [Issue](https://github.com/antdv-next/antdv-next/issues)
