# @antdv-next/unocss

为 AntDv Next 提供的 UnoCSS 预设，提供映射到 Ant Design CSS 变量的工具类。

## 安装

```bash
pnpm add -D @antdv-next/unocss
```

## 预设

本包提供两个预设：

### 1. `presetAntd`（默认）

标准预设，兼容 UnoCSS Wind3 风格，适用于大多数项目。

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      prefix: 'a',      // class 前缀，默认: 'a'
      antPrefix: 'ant', // CSS 变量前缀，默认: 'ant'
    }),
  ],
})
```

**主题键名：**
- `colors` - 颜色调色板
- `spacing` - 内外边距值
- `borderRadius` - 边框圆角值
- `fontSize` - 字体大小值
- `boxShadow` - 阴影值

### 2. `presetAntdTailwind4`（新）

Tailwind 4 兼容预设，与最新的 Tailwind CSS v4 主题结构对齐。

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntdTailwind4 } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntdTailwind4({
      prefix: 'a',      // class 前缀，默认: 'a'
      antPrefix: 'ant', // CSS 变量前缀，默认: 'ant'
    }),
  ],
})
```

**主题键名（Tailwind 4 风格）：**
- `colors` - 颜色调色板
- `spacing` - 统一间距（取代独立的 width/height/padding/margin）
- `radius` - 边框圆角（从 `borderRadius` 重命名）
- `text` - 文本配置（包含 fontSize、lineHeight、letterSpacing）
- `shadow` - 盒阴影（从 `boxShadow` 重命名）
- `defaults` - 重置样式的默认值

## 主要差异

| 特性 | presetAntd | presetAntdTailwind4 |
|------|-----------|---------------------|
| 主题风格 | UnoCSS Wind3 | Tailwind CSS v4 |
| 边框圆角键名 | `borderRadius` | `radius` |
| 阴影键名 | `boxShadow` | `shadow` |
| 字体大小 | `fontSize` | `text.*.fontSize` |
| Defaults 支持 | ❌ | ✅ `defaults` |
| CSS 层 | 标准 | `properties`、`theme`、`base` |

## 使用示例

两个预设都支持相同的工具类模式：

```vue
<template>
  <!-- 颜色 -->
  <div class="a-bg-primary a-color-white">主色背景</div>
  <div class="a-bg-container a-color-text">容器背景</div>

  <!-- 间距 -->
  <div class="a-p-lg a-m-sm">内边距和外边距</div>
  <div class="a-px-md a-py-xs">方向性间距</div>

  <!-- 边框 -->
  <div class="a-border-primary a-rounded-lg">边框和圆角</div>
  <div class="a-border-t-success">顶部边框颜色</div>

  <!-- 阴影 -->
  <div class="a-shadow-card">卡片阴影</div>

  <!-- 文字 -->
  <div class="a-text-lg a-color-primary">大号文字</div>
</template>
```

## 如何选择？

### 使用 `presetAntd` 如果：
- 你正在使用其他 UnoCSS 预设（Wind3、Attributify 等）
- 你偏好标准的 UnoCSS 主题结构
- 你需要与现有 UnoCSS 配置保持兼容

### 使用 `presetAntdTailwind4` 如果：
- 你正在从 Tailwind CSS v4 迁移或与其配合使用
- 你希望与最新的 Tailwind CSS 约定保持一致
- 你偏好新的 `radius`、`shadow` 和 `text` 主题键名
- 你需要用于重置样式的 `defaults` 配置

## 支持的工具类

### 颜色工具类
- `a-color-{color}` / `a-c-{color}` - 文字颜色
- `a-bg-{color}` - 背景颜色
- `a-border-{color}` / `a-b-{color}` - 边框颜色
- 方向性边框：`a-border-t-{color}`、`a-border-r-{color}` 等

### 间距工具类
- `a-m-{size}` - 外边距
- `a-mt-{size}`、`a-mr-{size}`、`a-mb-{size}`、`a-ml-{size}` - 方向性外边距
- `a-mx-{size}`、`a-my-{size}` - 水平/垂直外边距
- `a-p-{size}` - 内边距
- `a-pt-{size}`、`a-pr-{size}`、`a-pb-{size}`、`a-pl-{size}` - 方向性内边距
- `a-px-{size}`、`a-py-{size}` - 水平/垂直内边距

### 边框圆角工具类
- `a-rounded` / `a-rd` - 边框圆角
- `a-rounded-{size}` / `a-rd-{size}` - 指定大小的边框圆角
- 角落特定：`a-rounded-tl-{size}`、`a-rounded-tr-{size}` 等
- 边侧特定：`a-rounded-t-{size}`、`a-rounded-r-{size}` 等

### 阴影工具类
- `a-shadow` - 默认阴影
- `a-shadow-{type}` - 特定阴影类型（card、drawer-r 等）

### 文字工具类
- `a-text-{size}` - 字体大小（sm、lg、xl、h1、h2、h3）

## 可用的主题标记

### 颜色
- 主色：`primary`、`primary-hover`、`primary-active`、`primary-bg`
- 状态：`success`、`warning`、`error`、`info`（+ `-bg`、`-border`、`-hover`）
- 链接：`link`、`link-hover`、`link-active`
- 文字：`text`、`text-secondary`、`text-tertiary`、`text-quat`
- 背景：`base`、`container`、`layout`、`elevated`、`mask`
- 边框：`border`、`border-sec`
- 调色板：`blue`、`purple`、`cyan`、`green`、`magenta`、`pink`、`red`、`orange`、`yellow`、`volcano`、`geekblue`、`lime`、`gold`（带 1-10 级）

### 间距
`xxs`、`xs`、`sm`、`md`、`lg`、`xl`

### 边框圆角 / Radius
`xs`、`sm`、`lg`

### 阴影 / BoxShadow
`sec`/`secondary`、`ter`/`tertiary`、`card`、`arrow`、`drawer-r`、`drawer-l`、`drawer-u`、`drawer-d`

## 完整功能列表

### 颜色类

#### 文字颜色
```html
<!-- 基础用法 -->
<div class="a-color-primary">主色文字</div>
<div class="a-c-error">错误色文字（简写）</div>

<!-- 状态颜色 -->
<div class="a-color-success">成功</div>
<div class="a-color-warning">警告</div>
<div class="a-color-error">错误</div>
<div class="a-color-info">信息</div>

<!-- 文字层级 -->
<div class="a-color-text">主文字</div>
<div class="a-color-text-secondary">次要文字</div>
<div class="a-color-text-tertiary">第三级文字</div>

<!-- 调色板 -->
<div class="a-color-blue">蓝色</div>
<div class="a-color-blue-1">蓝色-1（最浅）</div>
<div class="a-color-blue-6">蓝色-6（标准）</div>
<div class="a-color-blue-10">蓝色-10（最深）</div>
```

#### 背景颜色
```html
<!-- 基础背景 -->
<div class="a-bg-primary">主色背景</div>
<div class="a-bg-container">容器背景（通常为白色）</div>
<div class="a-bg-layout">布局背景（通常为灰色）</div>

<!-- 状态背景 -->
<div class="a-bg-success-bg">成功背景（浅色）</div>
<div class="a-bg-warning-bg">警告背景</div>
<div class="a-bg-error-bg">错误背景</div>

<!-- 调色板背景 -->
<div class="a-bg-blue-1">浅蓝背景</div>
<div class="a-bg-red-6">标准红色背景</div>
```

#### 边框颜色
```html
<!-- 基础边框 -->
<div class="a-border-border">默认边框色</div>
<div class="a-b-primary">主色边框（简写）</div>

<!-- 方向性边框 -->
<div class="a-border-t-primary">顶部边框</div>
<div class="a-bt-success">顶部边框（简写）</div>
<div class="a-border-r-error">右侧边框</div>
<div class="a-border-b-warning">底部边框</div>
<div class="a-border-l-info">左侧边框</div>

<!-- 双向边框 -->
<div class="a-border-x-primary">左右边框</div>
<div class="a-bx-primary">左右边框（简写）</div>
<div class="a-border-y-success">上下边框</div>
<div class="a-by-success">上下边框（简写）</div>
```

### 间距类

#### 外边距（Margin）
```html
<!-- 全方向 -->
<div class="a-m-xs">超小外边距（8px）</div>
<div class="a-m-sm">小外边距（12px）</div>
<div class="a-m">默认外边距（16px）</div>
<div class="a-m-lg">大外边距（24px）</div>

<!-- 单方向 -->
<div class="a-mt-lg">上外边距</div>
<div class="a-mr-md">右外边距</div>
<div class="a-mb-sm">下外边距</div>
<div class="a-ml-xs">左外边距</div>

<!-- 双方向 -->
<div class="a-mx-lg">左右外边距</div>
<div class="a-my-sm">上下外边距</div>
```

#### 内边距（Padding）
```html
<!-- 全方向 -->
<div class="a-p-xxs">超超小内边距（4px）</div>
<div class="a-p-xs">超小内边距（8px）</div>
<div class="a-p-sm">小内边距（12px）</div>
<div class="a-p">默认内边距（16px）</div>
<div class="a-p-md">中等内边距（20px）</div>
<div class="a-p-lg">大内边距（24px）</div>
<div class="a-p-xl">超大内边距（32px）</div>

<!-- 单方向 -->
<div class="a-pt-lg">上内边距</div>
<div class="a-pr-md">右内边距</div>
<div class="a-pb-sm">下内边距</div>
<div class="a-pl-xs">左内边距</div>

<!-- 双方向 -->
<div class="a-px-lg">左右内边距</div>
<div class="a-py-sm">上下内边距</div>
```

### 圆角类

#### 全圆角
```html
<!-- 基础圆角 -->
<div class="a-rounded-xs">超小圆角</div>
<div class="a-rounded-sm">小圆角</div>
<div class="a-rounded">默认圆角</div>
<div class="a-rd">默认圆角（简写）</div>
<div class="a-rounded-lg">大圆角</div>
<div class="a-rd-lg">大圆角（简写）</div>
```

#### 方向性圆角
```html
<!-- 单边圆角 -->
<div class="a-rounded-t">上边圆角</div>
<div class="a-rd-t-lg">上边大圆角</div>
<div class="a-rounded-r">右边圆角</div>
<div class="a-rounded-b-sm">下边小圆角</div>
<div class="a-rounded-l">左边圆角</div>

<!-- 单角圆角 -->
<div class="a-rounded-tl">左上角圆角</div>
<div class="a-rd-tl-lg">左上角大圆角</div>
<div class="a-rounded-tr-sm">右上角小圆角</div>
<div class="a-rounded-br">右下角圆角</div>
<div class="a-rounded-bl-xs">左下角超小圆角</div>
```

### 阴影类

```html
<!-- 基础阴影 -->
<div class="a-shadow">默认阴影</div>
<div class="a-shadow-sec">次要阴影</div>
<div class="a-shadow-tertiary">第三级阴影</div>

<!-- 组件阴影 -->
<div class="a-shadow-card">卡片阴影</div>
<div class="a-shadow-arrow">箭头阴影</div>

<!-- 抽屉阴影 -->
<div class="a-shadow-drawer-r">右侧抽屉阴影</div>
<div class="a-shadow-drawer-l">左侧抽屉阴影</div>
<div class="a-shadow-drawer-u">上方抽屉阴影</div>
<div class="a-shadow-drawer-d">下方抽屉阴影</div>
```

### 文字类

```html
<!-- 字体大小 -->
<div class="a-text-sm">小号文字</div>
<div class="a-text">默认文字</div>
<div class="a-text-lg">大号文字</div>
<div class="a-text-xl">超大文字</div>

<!-- 标题 -->
<h1 class="a-text-h1">一级标题</h1>
<h2 class="a-text-h2">二级标题</h2>
<h3 class="a-text-h3">三级标题</h3>
```

## 实际应用示例

### 卡片组件
```vue
<template>
  <div class="a-bg-container a-rounded-lg a-shadow-card a-p-lg">
    <h3 class="a-text-h3 a-color-text a-mb-md">卡片标题</h3>
    <p class="a-color-text-secondary a-text-sm a-mb-lg">
      这是卡片的描述内容，使用次要文字颜色。
    </p>
    <button class="a-bg-primary a-color-white a-rounded a-px-lg a-py-sm">
      操作按钮
    </button>
  </div>
</template>
```

### 表单布局
```vue
<template>
  <form class="a-bg-container a-p-xl a-rounded-lg">
    <div class="a-mb-lg">
      <label class="a-color-text a-text-sm a-mb-xs">用户名</label>
      <input 
        class="a-border-border a-rounded a-p-sm a-bg-base"
        type="text"
      />
    </div>
    
    <div class="a-mb-lg">
      <label class="a-color-text a-text-sm a-mb-xs">密码</label>
      <input 
        class="a-border-border a-rounded a-p-sm a-bg-base"
        type="password"
      />
    </div>
    
    <button class="a-bg-primary a-color-white a-rounded a-px-lg a-py-sm a-mt-md">
      登录
    </button>
  </form>
</template>
```

### 状态标签
```vue
<template>
  <div class="a-p-lg">
    <span class="a-bg-success-bg a-color-success a-border-success-border a-rounded a-px-sm a-py-xxs a-text-sm">
      成功
    </span>
    <span class="a-bg-warning-bg a-color-warning a-border-warning-border a-rounded a-px-sm a-py-xxs a-text-sm a-ml-sm">
      警告
    </span>
    <span class="a-bg-error-bg a-color-error a-border-error-border a-rounded a-px-sm a-py-xxs a-text-sm a-ml-sm">
      错误
    </span>
    <span class="a-bg-info-bg a-color-info a-border-info-border a-rounded a-px-sm a-py-xxs a-text-sm a-ml-sm">
      信息
    </span>
  </div>
</template>
```

### 布局容器
```vue
<template>
  <div class="a-bg-layout" style="min-height: 100vh;">
    <!-- 头部 -->
    <header class="a-bg-container a-shadow-sec a-p-lg">
      <h1 class="a-text-h1 a-color-primary">应用标题</h1>
    </header>
    
    <!-- 主体内容 -->
    <main class="a-p-xl">
      <div class="a-bg-container a-rounded-lg a-p-lg a-mb-lg">
        <h2 class="a-text-h2 a-color-text a-mb-md">内容区域</h2>
        <p class="a-color-text-secondary">主要内容...</p>
      </div>
    </main>
    
    <!-- 页脚 -->
    <footer class="a-bg-container a-border-t-border a-p-lg a-text-center">
      <p class="a-color-text-tertiary a-text-sm">© 2026 版权所有</p>
    </footer>
  </div>
</template>
```

## 高级用法

### 自定义前缀

如果你想使用不同的 class 前缀：

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      prefix: 'antd', // 使用 'antd' 作为前缀
      antPrefix: 'ant',
    }),
  ],
})
```

使用时：
```html
<div class="antd-bg-primary antd-p-lg">自定义前缀</div>
```

### 自定义 CSS 变量前缀

如果你的 Ant Design 使用了自定义的 `prefixCls`：

```ts
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetAntd } from '@antdv-next/unocss'

export default defineConfig({
  presets: [
    presetAntd({
      prefix: 'a',
      antPrefix: 'my-app', // 匹配 ConfigProvider 的 prefixCls
    }),
  ],
})
```

这将生成：
```css
.a-bg-primary {
  background-color: var(--my-app-color-primary);
}
```

### 与 Ant Design Vue 配合使用

```vue
<script setup lang="ts">
import { ConfigProvider } from 'antdv-next'

const theme = {
  token: {
    colorPrimary: '#1890ff',
  },
}
</script>

<template>
  <ConfigProvider :theme="theme">
    <!-- Ant Design 组件 -->
    <a-button type="primary">按钮</a-button>
    
    <!-- 使用 UnoCSS 工具类的自定义组件 -->
    <div class="a-bg-primary a-color-white a-p-lg a-rounded">
      这个 div 的样式会自动跟随主题色变化
    </div>
  </ConfigProvider>
</template>
```

## 最佳实践

### 1. 保持一致性
在项目中统一使用 Ant Design 的设计标记，避免硬编码颜色和尺寸：

```vue
<!-- ✅ 推荐 -->
<div class="a-bg-primary a-p-lg a-rounded-lg">内容</div>

<!-- ❌ 不推荐 -->
<div class="bg-blue-500 p-6 rounded-lg">内容</div>
```

### 2. 语义化颜色
使用语义化的颜色名称而不是调色板：

```vue
<!-- ✅ 推荐 - 语义清晰 -->
<div class="a-bg-success-bg a-color-success">成功提示</div>
<div class="a-bg-error-bg a-color-error">错误提示</div>

<!-- ❌ 不推荐 - 不够语义化 -->
<div class="a-bg-green-1 a-color-green-6">成功提示</div>
<div class="a-bg-red-1 a-color-red-6">错误提示</div>
```

### 3. 间距系统
使用设计系统定义的间距值：

```vue
<!-- ✅ 推荐 -->
<div class="a-p-lg a-mb-md">内容</div>

<!-- ❌ 不推荐 -->
<div style="padding: 24px; margin-bottom: 20px;">内容</div>
```

### 4. 响应式设计
结合 UnoCSS 的响应式变体使用：

```vue
<template>
  <div class="a-p-sm md:a-p-lg lg:a-p-xl">
    响应式内边距
  </div>
</template>
```

## 常见问题

### Q: 为什么选择 UnoCSS 而不是 Tailwind CSS？
A: UnoCSS 具有以下优势：
- ⚡️ 更快的构建速度
- 🎨 更灵活的自定义规则
- 📦 更小的包体积
- 🔧 更好的 Vite 集成

### Q: 可以同时使用两个预设吗？
A: 不建议。虽然技术上可行，但会导致重复的 CSS 规则。请根据项目需求选择其中一个。

### Q: 如何处理与其他 UnoCSS 预设的冲突？
A: 将 `presetAntd` 放在预设数组的后面，这样它的规则会有更高的优先级：

```ts
export default defineConfig({
  presets: [
    presetWind(),
    presetAntd(), // 后加载，优先级更高
  ],
})
```

### Q: 生成的 CSS 变量在哪里定义？
A: CSS 变量由 Ant Design Vue 的 `ConfigProvider` 和 `@antdv-next/cssinjs` 自动注入到 DOM 中。

### Q: 支持暗色模式吗？
A: 是的！当 Ant Design 切换到暗色模式时，CSS 变量会自动更新，所有使用这些工具类的元素也会相应改变。

```vue
<script setup lang="ts">
import { ConfigProvider, theme } from 'antdv-next'
import { ref } from 'vue'

const isDark = ref(false)
</script>

<template>
  <ConfigProvider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <div class="a-bg-container a-color-text">
      会自动适应明暗主题
    </div>
  </ConfigProvider>
</template>
```

## 迁移指南

### 从 Tailwind CSS 迁移

如果你的项目使用 Tailwind CSS，可以这样迁移：

| Tailwind CSS | @antdv-next/unocss |
|--------------|-------------------|
| `bg-blue-500` | `a-bg-blue-5` 或 `a-bg-primary` |
| `text-gray-600` | `a-color-text-secondary` |
| `p-4` | `a-p-sm` |
| `rounded-lg` | `a-rounded-lg` |
| `shadow-md` | `a-shadow` 或 `a-shadow-card` |

### 从内联样式迁移

| 内联样式 | @antdv-next/unocss |
|---------|-------------------|
| `style="color: #1890ff"` | `class="a-color-primary"` |
| `style="background: #fff"` | `class="a-bg-container"` |
| `style="padding: 24px"` | `class="a-p-lg"` |
| `style="border-radius: 8px"` | `class="a-rounded-lg"` |

## 性能优化

### 按需生成
UnoCSS 只会生成你实际使用的工具类，无需担心包体积：

```vue
<!-- 只有这些类会被生成 -->
<template>
  <div class="a-bg-primary a-p-lg a-rounded">
    内容
  </div>
</template>
```

### 开发体验
在开发模式下，UnoCSS 提供：
- 🔥 热模块替换（HMR）
- 🎯 精确的类名提示（配合 IDE 插件）
- 🐛 详细的错误信息

## 相关资源

- [Ant Design Vue Next 文档](https://antdv-next.com)
- [UnoCSS 官方文档](https://unocss.dev)
- [Tailwind CSS v4 文档](https://tailwindcss.com/docs)
- [Ant Design 设计规范](https://ant.design/docs/spec/introduce-cn)

## 许可证

MIT

---

## 贡献

欢迎提交 Issue 和 Pull Request！

如果你发现了 bug 或有功能建议，请在 [GitHub Issues](https://github.com/antdv-next/antdv-next/issues) 中告诉我们。
