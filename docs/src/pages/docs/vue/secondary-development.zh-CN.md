---
title: 二次开发
---

如果你希望基于 `antdv-next` 搭建自己的业务组件库、文档站和 Demo 系统，我们已经提供了一套可直接开始二次开发的模板仓库：[docs-base](https://github.com/antdv-next/docs-base)。

这个模板不是简单的脚手架示例，而是一套围绕组件库开发场景整理好的基础工程。它把组件源码、文档页面、Markdown Demo 渲染链路和打包发布能力放在同一个项目里，适合团队持续沉淀业务组件并对外发布。

## 模板仓库 {#template-repository}

- GitHub: [https://github.com/antdv-next/docs-base](https://github.com/antdv-next/docs-base)
- 中文 README: [README.zh-CN.md](https://github.com/antdv-next/docs-base/blob/main/README.zh-CN.md)

## 适合什么场景 {#when-to-use-it}

当你希望：

- 基于 `antdv-next` 扩展自己的业务组件库
- 将组件源码、示例和文档统一维护
- 输出带类型声明的 Vue 3 组件包
- 用 Markdown 写文档，同时直接嵌入真实 Vue Demo
- 同时维护中英文文档页面
- 自定义自己的主题体系，而不是继承一套固定视觉方案

那么可以直接从这个模板开始。

## 模板内置能力 {#what-is-included}

- Vue 3 + TypeScript + Vite
- 以 `antdv-next` 作为基础 UI 组件依赖
- 支持保留模块结构、Bundled ESM、UMD 三种构建产物
- 自动生成组件类型声明
- 自定义 Markdown 转 Vue 的文档渲染链路
- Demo 代码展示、源码提取与热更新
- 集成 UnoCSS、Vue Router、Pinia、Vue I18n
- 内置可直接扩展的示例组件和文档页面

## 开始之前先做一件事 {#one-thing-to-do-before-you-start}

模板默认使用 `@org/components` 作为占位包名。开始二次开发前，建议先全局搜索并替换 `@org/components`，统一改成你自己的真实包名，再继续后续开发。

## 快速开始 {#quick-start}

### 1. 克隆模板 {#_1-clone-the-template}

```bash
git clone https://github.com/antdv-next/docs-base.git
cd docs-base
```

### 2. 安装依赖 {#_2-install-dependencies}

```bash
pnpm install
```

### 3. 启动文档站 {#_3-run-the-docs-app}

```bash
pnpm docs:dev
```

本地开发地址默认是 [http://localhost:6878](http://localhost:6878)。

### 4. 构建组件库 {#_4-build-the-library}

```bash
pnpm build
```

其他常用命令：

```bash
pnpm docs:build
pnpm docs:preview
pnpm type-check
pnpm test:unit
```

## 推荐开发方式 {#recommended-workflow}

### 1. 先改包名和发布信息 {#_1-rename-the-package-and-publishing-metadata}

- 全局替换 `@org/components`
- 更新 `package.json` 中的包名与发布信息

### 2. 开发你的业务组件 {#_2-build-your-business-components}

在 `components/` 下新增或改造组件，并在 `components/index.ts` 中统一导出，保持对外 API 清晰稳定。

### 3. 编写文档页面 {#_3-write-documentation-pages}

在 `docs/src/pages/` 下新增 Markdown 文档。当前模板通过 `import.meta.glob` 自动把 `.md` 页面注册成路由。

推荐沿用以下多语言命名方式：

- `*.zh-CN.md`
- `*.en-US.md`

### 4. 为文档补充 Demo {#_4-add-demos-next-to-docs-pages}

在文档页面同级的 `demo/` 目录中放置示例文件，然后在 Markdown 中这样引用：

```md
<demo-group>
  <demo src="./demo/basic.vue">基础示例</demo>
</demo-group>
```

这样文档系统会自动完成：

- 渲染实时 Vue 示例
- 提取源码内容
- 生成高亮代码块
- 开发时热更新 Demo 元数据

## 目录结构 {#project-structure}

```text
.
├─ components/                 # 业务组件源码目录
├─ docs/                       # 文档站应用
│  ├─ src/pages/               # Markdown 页面与首页
│  ├─ src/components/demo/     # Demo 渲染与源码展示
│  └─ plugins/markdown/        # Markdown / Demo 转换插件
├─ vite.build.config.ts        # 保留模块结构的组件构建
├─ vite.esm.config.ts          # ESM 打包构建
├─ vite.umd.config.ts          # UMD 打包构建
└─ global.d.ts                 # 全局组件类型声明
```

## 主题说明 {#theme-notes}

这个模板本身不预设业务主题。你可以基于自己的品牌规范去实现颜色体系、设计 Token 和组件视觉风格。主题能力可以结合 [定制主题](/docs/vue/customize-theme) 一起使用。

## 适合怎样的团队 {#who-this-template-is-for}

如果你的目标不是单独维护一个 Demo 仓库，而是希望把：

- 组件实现
- 文档说明
- 在线示例
- 多语言页面
- 构建产物

统一放在一个仓库中管理，那么 `docs-base` 会比从零搭建更省时间。
