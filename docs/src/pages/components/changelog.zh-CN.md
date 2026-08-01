---
title: 组件更新日志
---

## V1.4.5

发布日期：2026-07-21

紧急修复 1.4.4 发布的浏览器（CDN）产物。UMD/ESM 构建引用了浏览器中并不存在的 `process.env.NODE_ENV`，导致从 unpkg/jsdelivr 加载 `dist/antd.js` 抛出 `ReferenceError: process is not defined`，整包无法加载。修复该问题后又暴露出第二个问题：`app.use(window.antd)` 完全没有注册任何组件——因为带 `install` 的插件在全局对象上多嵌套了一层。

**🐞 问题修复 Fixes**

* fix(build)：在面向浏览器的产物（`antd.js`、`antd.esm.js`、`antd-with-locales.js`、`antd-with-locales.esm.js`）中替换 `process.env.NODE_ENV`，不再引用缺失的 `process` 全局。打包器入口（`dist/index.js`）保持不动，让 tree-shaking 消费方自行决定 dev/prod 分支（[#667](https://github.com/antdv-next/antdv-next/pull/667)，修复 [#666](https://github.com/antdv-next/antdv-next/issues/666)）
* fix(build)：将 `install` / `setPrefix` 提为命名导出，使 UMD/ESM 全局（`window.antd`）在顶层直接携带 `install`；`app.use(window.antd)` 现在可直接注册全部组件，无需再取 `window.antd.default`（[#667](https://github.com/antdv-next/antdv-next/pull/667)）

**🧰 工程 Infrastructure**

* build：新增构建后校验，若任一浏览器产物出现未守卫的 `process` 全局引用则构建失败，防止该回归再次发布（[#667](https://github.com/antdv-next/antdv-next/pull/667)）

## V1.4.4

发布日期：2026-07-20

本次版本将 ant-design 上游同步从 **6.5.1** 继续推进到 `78c3d84619`（[#658](https://github.com/antdv-next/antdv-next/pull/658)、[#664](https://github.com/antdv-next/antdv-next/pull/664)）。主线是修复一批**已声明、已写进文档、但实际从未接通的 API**：Form 的 `getFieldInstance` 恒返回 `undefined`、Timeline 的三个 render 属性被完全忽略、Tree 的 `rootStyle` 被静默丢弃。同时将样式与 token 构建脚本改为直接读取组件源码，不再依赖打包产物。

**🐞 问题修复 Fixes**

* fix(form)：`getFieldInstance(name)` 现在返回渲染出的控件实例，而不再恒为 `undefined`。注册键不再经过 `getFieldId`，因此 Form 是否声明 `name` 都不影响查找；`focusField` 也改为优先调用控件自身的 `focus()`，再回落到 DOM 节点（[#665](https://github.com/antdv-next/antdv-next/pull/665)，修复 [#663](https://github.com/antdv-next/antdv-next/issues/663)）
* fix(timeline)：接通 `dotRender` / `labelRender` / `contentRender` 属性与插槽——三者此前已声明并写入文档，但 `useItems` 完全忽略，且会透传进 Steps。插槽返回值现在会做规范化处理，条件插槽渲染为空时可正确回落到 item 的 `icon` / `title` / `content`（[#656](https://github.com/antdv-next/antdv-next/pull/656)，修复 [#653](https://github.com/antdv-next/antdv-next/issues/653)）
* fix(tabs)：`labelRender` / `contentRender` 的 item 类型改为从 `items` 推断，不再硬编码为 `TabItem`；`InstanceType<typeof Tabs>` 保留暴露的 `TabsRef`（[#661](https://github.com/antdv-next/antdv-next/pull/661)，修复 [#660](https://github.com/antdv-next/antdv-next/issues/660)）
* fix(tree)：恢复 `rootStyle` 兼容——该属性虽从底层 props 继承，但会被语义化根样式静默覆盖，实际不生效。现已恢复可用，并标记为废弃，建议改用 `styles.root`（#58709）
* fix(input)：Search 自定义 `enterButton` 的 `disabled` 现在与表单上下文同步，且不再覆盖用户在自定义 Button 上传入的 `loading`（#58726）
* fix(grid)：支持 `flex` 取值为 0——`:flex="0"` 与响应式 `:xs="{ flex: 0 }"` 此前被真值判断丢弃（#58719）
* fix(tag)：关闭链接形态的标签不再触发页面跳转（#58720）
* fix(splitter)：修正基于百分比的 ARIA 取值范围（#58702）
* fix(style)：Typography、Tree、Collapse、Layout 改用 `lineWidth` / `lineType` 边框 token，不再硬编码 `1px solid`；默认主题下产出的 CSS 完全一致，仅在自定义这两个 token 时才产生差异（#58740、#58741、#58742、#58743）
* fix(segmented, radio)：移除上游从未有过的下游自有 `prefers-reduced-motion` 样式，与 React 源码保持一致（[#654](https://github.com/antdv-next/antdv-next/pull/654)）
* fix(wave)：`attachListener` 的 watch 回调不再访问全局 `window`——该回调走 Vue 异步调度，可能在运行环境销毁后才触发（[#662](https://github.com/antdv-next/antdv-next/pull/662)）

**📖 文档 Docs**

* docs(timeline)：新增 `dotRender` demo（[#656](https://github.com/antdv-next/antdv-next/pull/656)）
* docs(input-number)：新增反馈图标 suffix 的 Debug demo（#58703）
* docs(anchor)：修正 `offsetTop` 的默认值（#58710）
* docs(select)：远程搜索用户 demo 保留已输入的搜索文本（#58736）
* docs(table)：修正英文文档的 API 链接（[#657](https://github.com/antdv-next/antdv-next/pull/657)）

**🧰 工程 Infrastructure**

* refactor(build)：`build:style` 与 `build:token-statistic` 改为通过 vite SSR runner 加载组件源码，不再 import `dist/components.js`，避免陈旧的构建产物产出过时的 CSS 或 token 统计；两者产物均已验证与原基于 dist 的结果完全一致（[#654](https://github.com/antdv-next/antdv-next/pull/654)）

## V1.4.3

发布日期：2026-07-15

紧急修复 1.4.2 同步上游 [ant-design#58685](https://github.com/ant-design/ant-design/pull/58685) 时引入的样式回归：`genNoMotionStyle` 展开为 `&::before / &::after` 后，6 处本身位于伪元素选择器内部的调用点会生成 `.ant-border-beam::before::before` 这类非法双伪元素选择器——浏览器会静默丢弃这些规则（`prefers-reduced-motion` 在这些位置实际失效），基于 lightningcss 的静态 CSS 压缩则会直接构建失败。

**🐞 问题修复 Fixes**

* fix(style)：新增平铺变体 `genNoMotionRawStyle`，替换 Switch / Segmented / Radio / Checkbox / BorderBeam 中位于伪元素内部的 6 处调用，消除非法 `::before::before` 选择器，`prefers-reduced-motion` 在相应位置恢复生效（[#651](https://github.com/antdv-next/antdv-next/pull/651)）

**🧰 工程 Infrastructure**

* ci：GitHub Actions 的 node 版本升级至 24
* chore：重新生成静态样式产物

## V1.4.2

发布日期：2026-07-14

本次版本将 ant-design 上游同步推进到 **6.5.1**（[#644](https://github.com/antdv-next/antdv-next/pull/644)、[#647](https://github.com/antdv-next/antdv-next/pull/647)、[#650](https://github.com/antdv-next/antdv-next/pull/650)），重点完善 **TypeScript 类型基建**（泛型组件构造器导出、`h()` 场景类型推断），并修复 Switch 标签居中与裸属性解析、AutoComplete filled 背景叠加、Modal 惰性渲染等一批组件问题；同步升级 `@v-c/table` 1.1.8、`@v-c/util` 1.0.21 等依赖。

**✨ 新功能 Features**

* feat(types)：Transfer / Cascader / TreeSelect / Segmented 导出泛型构造器类型，`h()` 与 TSX 下可获得完整泛型推断
* feat(ecosystem)：Awesome 页面新增 antdv-next-tiptap 富文本编辑器

**🐞 问题修复 Fixes**

* fix(switch)：标签内容改为 flex 居中，修复图标类内容按文字基线对齐导致的向上偏移（#58672）
* fix(switch, checkbox)：模板中裸写 `checked` / `default-checked` 现在正确解析为 `true`（原会解析为空字符串导致不选中）
* fix(input)：修复 Search 按钮获得焦点时 focus 轮廓被相邻元素遮挡（#58615）
* fix(auto-complete)：修复 filled 形态下自定义输入组件背景色叠加两层（#58669）
* fix(motion)：`prefers-reduced-motion` 下同时禁用 `::before` / `::after` 伪元素的过渡与动画（#58685）
* fix(modal)：loading 期间默认插槽保持惰性渲染；Modal 方法调用的 `styles.body` 正确应用到 content
* fix(pagination)：修复 Form.Item 中页码尺寸切换器宽度异常
* fix(button)：修复 Card extra 中按钮图标对齐
* fix(descriptions)：恢复 shrink-to-fit 容器下的视图宽度
* fix(date-picker)：`nativeElement` 暴露为元素本身而非函数
* fix(config-provider)：组件级配置的 `classes` / `styles` 不再被静默推断为 `any`（[#642](https://github.com/antdv-next/antdv-next/pull/642)）；开启 cssinjs layer 时强制 `zeroRuntime`
* fix(locale)：补齐多语言包缺失字段
* fix(types)：修复 `h()` 用法下回调参数上下文类型丢失、`h(Table, props)` 无法解析等类型问题，清理组件源码遗留类型错误
* fix(deps)：升级 `@v-c/util` 1.0.21，修复 vue 3.5.39 下 Space.Compact 中 Select 弹层首开错位
* build：外置 `@vueuse/core`，消除 rolldown 构建告警

**📖 文档 Docs**

* docs(layout)：新增「折叠覆盖布局」demo（#58566）
* docs(grid)：补充 Col `flex` 数字与字符串取值的语义差异（#58624）
* docs(border-beam)：新增「鼠标悬浮时显示」demo（#58683）
* docs(auto-complete)：新增 filled 形态自定义输入 Debug demo（#58669）
* docs(table)：新增自适应高度 demo、性能排查 FAQ（Vue DevTools）、`change` 事件类型示例等
* docs(notification)：新增固定宽度用法 FAQ
* docs(site)：图标搜索新增「全部」筛选；主题预览新增 Serene / Dashboard；组件总览卡片 hover 效果对齐 ant-design

**🧰 依赖更新 Dependencies**

* chore(deps)：升级 `@v-c/table` ^1.1.8、`@v-c/virtual-list` ^1.1.0、`@v-c/mentions` ^1.1.2、`@v-c/util` ^1.0.21、`@antdv-next/happy-work-theme` 1.0.1

## V1.4.1

发布日期：2026-07-02

本次版本重点修复 **vue 3.5.39 兼容性问题**（[vuejs/core#14985](https://github.com/vuejs/core/pull/14985) 改变了函数 ref 的调用时机）：修复浮层组件（Tooltip/Popover/Popconfirm/Dropdown）首次打开定位异常与首帧动画丢失、message/notification 通知叠加、Masonry 布局错乱等问题；同时为组件文档页新增「组件元信息」块，并完善图标总览。

**🐞 问题修复 Fixes**

* fix：修复 vue 3.5.39 生产构建下**浮层组件首次打开定位异常/首帧动画丢失**（Tooltip / Popover / Popconfirm / Dropdown）—— 底层升级 `@v-c/trigger` 1.0.18（#623）
* fix：修复 vue 3.5.39 下 **message / notification 通知相互叠加**（首帧高度测量失败）—— 底层升级 `@v-c/notification` 2.0.2（#623）
* fix(masonry)：修复 vue 3.5.39 下 Masonry item 高度测量失败导致的布局错乱，改用 `createElementRef`（#623）
* fix(deps)：将 `@v-c/notification` 加入 overrides，消除 lock 中残留的旧版本

**📖 文档 Docs**

* docs：组件文档页新增「组件元信息」块（使用 / 反馈 / 文档 / 版本），对齐 ant-design
* docs(icon)：将新增的 AI / 品牌图标归入品牌分类、标记「1.4.0 新增」并置顶展示

**🧪 测试 Tests**

* test(drawer)：新增 Drawer 内 Watermark 继承的回归测试（vue 3.5.39）

**🧰 依赖更新 Dependencies**

* chore(deps)：升级 vue 至 `^3.5.39`；`@v-c/trigger` 1.0.18、`@v-c/notification` 2.0.2、`@v-c/util` 1.0.20 及相关工具链依赖

## V1.4.0

发布日期：2026-06-30

本次版本将 ant-design 上游同步推进到 **6.5.0**，带来一批新特性与语义化能力：**Modal `scrollLock`**、**Dropdown 左右方向 placement**、**Steps `maxCount` 折叠**、**Slider 分别禁用（Range 模式 `boolean[]`）**、**DatePicker/RangePicker `clear` 事件**、**Watermark 多行字体**、**Layout Sider 语义化 `classes`/`styles`**、**Tabs `body` 语义结构** 等；并统一了 **root 语义样式优先级**（横跨 30+ 组件）。同时同步多项上游修复，升级 `@v-c` 链路（picker 1.2.0 / select 1.1.3 / tabs 1.2.1）。

**✨ 新功能 Features**

* feat：同步 ant-design 上游变更（6.4.5 → 6.5.0）—— [#621](https://github.com/antdv-next/antdv-next/pull/621)
* feat(modal)：新增 `scrollLock` 控制打开时是否锁定 body 滚动（#58256）
* feat(dropdown)：支持 `left`/`right` 等左右方向弹出位置（#58437）
* feat(steps)：新增 `maxCount` 密集步骤折叠模式（#57987）
* feat(slider)：Range 模式支持通过 `boolean[]` 单独禁用某个滑块（#57982）
* feat(date-picker)：点击清除按钮时触发 `clear` 事件（#58403）
* feat(watermark)：`content` 支持为多行水印逐行配置字体样式（#57886）
* feat(layout)：Sider 支持语义化 `classes`/`styles`（`root`/`body`）（#57938）
* feat(tabs)：同步 `body`/`content` 语义 DOM 重命名与 `body` 语义（#58521）
* feat(collapse)：支持 header/content 的尺寸内边距 token（#58436）
* feat(badge)：`title` 设为 `null`/`false` 可移除原生 title（#58209）
* feat(input)：Password 可见性切换按钮支持 `tabIndex`（#58458）
* feat(config-provider)：支持 Form 的 `labelWrap` 配置（#58035）
* feat(config-provider)：将 `theme.zeroRuntime` 透传至图标上下文（#58517）
* feat：统一 root 语义样式优先级（30+ 组件）（#58474）

**🐞 问题修复 Fixes**

* fix(form)：恢复 `Form.Item` `help={false}` 的行为（#58558）
* fix(table)：响应式列也遵循 `defaultSortOrder`（#58008）
* fix(table)：bordered 模式保留 sticky 表头顶边框、去除右固定列多余竖线（#58451 #58516）
* fix(table)：`getCheckboxProps` 支持透传 aria 属性（#58275）
* fix(input,select)：为无边框输入框补充 focus 描边（#58250）
* fix(input)：对齐 Search 按钮高度与 compact small 控件高度（#58411 #58525）
* fix(select)：修正单选 open 态 labelRender dimming；不创建 disabled 标签；数值化弹层宽度（#58288 #58518 #58511）
* fix(float-button)：禁用的 `FloatButton.Group` 不再展开 hover 菜单（#58513）
* fix(alert)：修正带 description 时图标垂直对齐的 CSS 优先级（#57915）
* fix(upload)：默认文件/图片图标由 TwoTone 改为 Outlined，对齐上游（#58497）
* fix(config-provider)：补齐 collapse/otp/anchor/splitter 的组件级配置透传
* fix(layout)：Sider 语义回调接收生效的 collapsed 状态
* fix(watermark)：空内容时保持默认 120×64 尺寸，避免 0×0 绘制异常
* fix(locale)：修正 ja-JP Typography 展开/折叠文案（#58563）

**🧪 测试 Tests**

* test(menu)：覆盖 click/select/deselect 回调中的 `itemData`（#58197）
* test：为 root 语义样式优先级新增跨组件测试

**🧰 依赖更新 Dependencies**

* chore(deps)：升级 `@antdv-next/icons` 至 1.1.1（新增图标 + 支持 `zeroRuntime` 跳过运行时样式注入）
* chore(deps)：升级 `@v-c` 链路 —— picker 1.2.0 / select 1.1.3 / tabs 1.2.1

## V1.3.7

发布日期：2026-06-25

本次版本将 ant-design 上游同步推进到 **6.4.5**，并补齐 #58234 / #58214 / #58314 / #58371 / #58339 等遗漏修复；同时让 **Tabs 面板懒挂载**、修复 **Pagination 部分场景未触发更新事件**、**Table 合并 aria 属性时覆盖消费方 `components.header.table`** 等问题，升级 `@v-c` 链路（table 1.1.6 单元格 memo、virtual-list 1.0.9 高度性能）以提升性能。

**🐞 问题修复 Fixes**

* fix：同步 ant-design 上游变更（6.4.4 → 6.4.5）—— [#613](https://github.com/antdv-next/antdv-next/pull/613)
* fix(tabs)：通过 `@v-c/tabs` 1.1.1 懒挂载面板 —— [#612](https://github.com/antdv-next/antdv-next/pull/612)
* fix(pagination)：修复部分场景未触发更新事件
* fix(table)：合并 aria 属性时保留消费方传入的 `components.header.table`
* fix：同步 ant-design 上游修复（#58234 #58214 #58314 #58371 #58339）
* docs(locale)：补齐缺失的 nb_NO（挪威语）文案（#58439）

**🔧 类型优化 Types**

* refactor(table)：为 HeaderTable 补充类型契约

**🧪 测试 Tests**

* test：减少 demo 与测试中的冗余弃用告警
* test：更新快照

**🧰 依赖更新 Dependencies**

* chore(deps)：升级 `@v-c` 链路 —— table 1.1.6（单元格 memo）+ virtual-list 1.0.9（高度性能）—— [#609](https://github.com/antdv-next/antdv-next/pull/609)
* chore：升级依赖

## V1.3.6

发布日期：2026-06-18

本次版本主要修复 **Segmented 无图标选项仍渲染空图标节点**、**Dropdown 未透传 `menu` 的 `classes` / `styles` / `rootClass`**、**Input 重复 `class` 属性** 等问题，并将 Form 表单级 `rules` 类型放宽为递归 `RulesMap`，同时优化 DirectoryTree 类型与升级依赖。

**🐞 问题修复 Fixes**

* fix(segmented)：无 `icon` 的选项不再渲染空的 `.ant-segmented-item-icon` 节点，与 React ant-design 对齐（#600）—— [#601](https://github.com/antdv-next/antdv-next/pull/601)
* fix(dropdown)：将 `menu` 的 `classes` / `styles` / `rootClass` 透传到弹层 Menu，不再被显式语义类名覆盖（#599）—— [#601](https://github.com/antdv-next/antdv-next/pull/601)
* fix(input)：修复重复的 `class` 属性

**🔧 类型优化 Types**

* refactor(form)：将表单级 `rules` 类型放宽为递归 `RulesMap`，支持嵌套（`{ user: { email: [...] } }`）与索引（`{ list: { 0: [...] } }`）配置无需断言通过类型检查 —— [#601](https://github.com/antdv-next/antdv-next/pull/601)
* perf(tree)：优化 DirectoryTree 类型

**🧪 测试 Tests**

* test：更新 Space 与 Transfer 快照

**🧰 依赖更新 Dependencies**

* chore：升级依赖

## V1.3.5

发布日期：2026-06-13

本次版本修复 **Form.Item 在每次聚焦/失焦时以全新 meta 对象触发无变更更新导致子节点重渲染** 的问题 —— 配合内联对象属性（如 `:show-time`）会重置 DatePicker 面板内的草稿选择，使 a-form-item 内无法点击「确定」确认；同时升级 `@v-c/picker` 配套修复。

**🐞 问题修复 Fixes**

* fix(form)：跳过无变更的 meta 更新，避免重渲染 FormItem 子节点（修复 a-form-item 内 DatePicker 面板草稿选择被重置）—— [#597](https://github.com/antdv-next/antdv-next/pull/597)

**🧰 依赖更新 Dependencies**

* chore(deps)：升级 `@v-c/picker` 至 ^1.1.3，配套修复父级重渲染传入等价新属性时草稿选择被重置的问题（antdv-next #597）
* chore：更新文档站 css

## V1.3.4

发布日期：2026-06-12

本次版本将 ant-design 上游同步推进到 **6.4.4（`b32376a31b`）** —— 补齐 6.4.4 的全部遗漏修复与配套测试，并 **为全部组件 API 文档新增「全局配置」列**、简化 ConfigProvider 组件配置章节；同时新增 **Form `useForm` / `useFormInstance`** hooks，修复 **弹层在 transform 父级下定位偏移**、**Select 下拉打开瞬间回车误选** 等问题，并将 `@v-c/*` 依赖升级到已发版的同步版本。

**✨ 新功能 Features**

* feat(form)：新增 `useForm` / `useFormInstance` hooks，并将 `validateFields` 选项对齐 rc-field-form —— [#586](https://github.com/antdv-next/antdv-next/pull/586)

**🐞 问题修复 Fixes**

* fix(trigger)：修复父级存在 transform 时弹层位置偏移，并升级 `@v-c` 依赖（dialog@1.2.0 / menu@1.2.0 / pagination@1.0.1 / picker@1.1.2 / select@1.1.1 / table@1.1.4），其中 select@1.1.1 修复了下拉打开瞬间回车误选第一项的问题（#594）—— [#595](https://github.com/antdv-next/antdv-next/pull/595)
* fix(slider)：防止 Safari 中拖动滑块时选中相邻文本（antd #58024）—— [#596](https://github.com/antdv-next/antdv-next/pull/596)
* fix(splitter)：键盘聚焦折叠按钮时展示折叠条，并补充键盘折叠交互（antd #58060）—— [#596](https://github.com/antdv-next/antdv-next/pull/596)
* fix(upload)：支持消费 ConfigProvider 全局 `progress` 配置，未配置时保持默认进度条样式（antd #58126）—— [#596](https://github.com/antdv-next/antdv-next/pull/596)
* fix(notification)：`title` 为空时不再渲染标题节点，避免关闭按钮与描述内容重叠（antd #58096）—— [#596](https://github.com/antdv-next/antdv-next/pull/596)
* fix(collapse)：对齐 antd v6，使 `expandIconPlacement` 正确生效 —— [#592](https://github.com/antdv-next/antdv-next/pull/592)
* fix(modal)：升级 `@v-c/dialog` 至 1.1.1，修复 `forceRender` 不生效 —— [#582](https://github.com/antdv-next/antdv-next/pull/582)
* fix(descriptions)：修复非 bordered 模式下 label 样式未生效 —— [#580](https://github.com/antdv-next/antdv-next/pull/580)
* fix(popconfirm)：修复 `confirm` 属性值不渲染的问题 —— [#577](https://github.com/antdv-next/antdv-next/pull/577)
* fix(menu)：升级 `@v-c/menu` 至 1.1.3，修复大菜单切换卡顿并补充回归测试 —— [#587](https://github.com/antdv-next/antdv-next/pull/587) / [#589](https://github.com/antdv-next/antdv-next/pull/589)
* fix(menu)：修复折叠时图标动画跳动（antd #58271）
* fix(radio)：修复 Radio.Group button 形态在垂直布局下圆角与相邻边框展示异常（antd #58317）
* fix(tour)：修复主色模式下 hover 上一步按钮时文字可读性（antd #58311）
* fix(auto-complete)：收紧 `showSearch` 类型，防止不支持的 Select 属性泄漏（antd #58104）
* fix(popover, popconfirm)：`title` 或 `content` 为数字 `0` 时保持渲染（antd #58296）
* fix(icon)：存在多个 `iconPrefixCls` 时保持图标旋转动画（antd #58253）
* fix(locale)：`en_GB` 文案对齐 `en_US`（antd #58224）
* fix(calendar)：对齐 lunar demo 选中与面板月份颜色，并修复年份选择
* fix(docs)：生产环境隐藏 debug demo 锚点

**💄 样式 Styles**

* style：加深 `boxShadowTertiary` 阴影，提升浅色背景下的可见度，影响 Card / Tour / Segmented（antd #58205）

**🧪 测试 Tests**

* test：补齐 Descriptions 响应式 `column` 级联、ColorPicker / Tag 键盘可访问性、Transfer 根节点属性透传的上游配套测试（antd #58058 / #58040 / #58067 / #58166）—— [#596](https://github.com/antdv-next/antdv-next/pull/596)
* test(tree-select)：焦点测试对齐 `focusin` 事件语义 —— [#595](https://github.com/antdv-next/antdv-next/pull/595)

**📝 文档更新 Documentation**

* docs：为全部组件 API 表新增「全局配置」列，标记可由 ConfigProvider 组件配置设置的属性，并将 ConfigProvider 组件配置章节简化为列表（antd #58265 / #58290 / #58278）—— [#596](https://github.com/antdv-next/antdv-next/pull/596)
* docs(form)：`global-state` demo 演示嵌套路径字段在外部状态中的处理（antd #58327）—— [#596](https://github.com/antdv-next/antdv-next/pull/596)
* docs(date-picker)：basic demo 改用 Flex 布局（antd #58320）—— [#596](https://github.com/antdv-next/antdv-next/pull/596)
* docs(progress)：修正 `steps` 描述语法（antd #58325）—— [#596](https://github.com/antdv-next/antdv-next/pull/596)
* docs：同步上游文档与 demo 更新，并优化文档站翻页导航样式

## V1.3.3

发布日期：2026-06-03

本次版本主要 **将 ant-design 6.4.3 → 8b5c356f 的 fix/feat 批量同步到主包** —— Tooltip / Popover 箭头 drop-shadow、Checkbox / Modal / Result / Popconfirm / Select / DatePicker / Empty 样式、Transfer / Tree / Table / Descriptions / Tabs 行为以及多语言补充，**将 `@v-c/*` 依赖升级到已发版的同步版本**，修复 **Menu `itemData` 泄漏到 DOM** 的问题，并为文档站新增 **debug demo 机制**（开发可见、生产隐藏）。

**✨ 新功能 Features**

* feat(docs)：生产构建中隐藏 debug demo，并为 debug demo 增加紫色边框 —— [#568](https://github.com/antdv-next/antdv-next/pull/568)

**🐞 问题修复 Fixes**

* fix(tooltip, popover)：箭头改用 drop-shadow，避免与容器阴影叠加（antd #57988）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(checkbox)：避免触屏设备上残留的 hover 边框样式（antd #58085）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(modal)：修复 `confirmLoading` 为 true 时页脚按钮对齐（antd #58120）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(result, popconfirm)：修正状态图标颜色继承（antd #58157）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(select)：保持选中项 active 主题色，并避免禁用自定义输入背景叠加（antd #58069 / #58114）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(date-picker, time-picker)：让清除按钮支持键盘可访问性（antd #58132）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(empty)：使用 design token 设置 SVG 颜色以支持暗色模式（antd #58152）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(tree)：`DirectoryTree` 的 `defaultExpandParent` 默认值改为 `true`（antd #58068）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(table)：为筛选下拉容器添加 `presentation` role（antd #58164）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(descriptions)：避免在 `max-content` 容器内宽度被撑大（antd #58203）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(tabs)：修正 more 下拉菜单位置翻转时的动画方向（antd #58202）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(form)：将 `help={false}` 视为无 help（antd #58160）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(menu)：避免将 `itemData` 属性泄漏到 DOM 元素 —— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(locale)：为 `km_KH` 补充 Tour 翻译，为 `pt_BR` 补充 QRCode / ColorPicker 翻译（antd #58140 / #58188）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)

**⚡ 性能优化 Performance**

* perf(transfer)：合并 enabled key 的遍历（antd #58168）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)

**📝 文档更新 Documentation**

* docs：注册已有的 debug demo，并同步 Table / AutoComplete 示例（antd #58134 / #58114）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* docs(rate)：从 API 表中移除原生 `className` / `style` 行（antd #58196）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)
* docs：对齐 `CLAUDE.md` 与 `AGENTS.md`，保持仓库指引一致 —— [#567](https://github.com/antdv-next/antdv-next/pull/567)

**🛠 重构与维护 Refactor & Maintenance**

* build(deps)：将 `@v-c` trigger / menu / virtual-list 升级到已发版的同步版本 —— [#568](https://github.com/antdv-next/antdv-next/pull/568)

**🧪 测试 Tests**

* test(radio)：覆盖非受控 checked 状态（antd #57917）—— [#568](https://github.com/antdv-next/antdv-next/pull/568)

**完整变更日志**：[antdv-next@1.3.2...antdv-next@1.3.3](https://github.com/antdv-next/antdv-next/compare/antdv-next@1.3.2...antdv-next@1.3.3)

## V1.3.2

发布日期：2026-06-03

本次补丁版本主要 **修复一批组件问题（TimePicker / DatePicker / Pagination / Switch / Tour / Upload / Modal），同步 ant-design master 的无障碍与响应式修复**，并更新 `@v-c/table` 依赖。

**🐞 问题修复 Fixes**

* fix(time-picker)：清除值时出现的控制台报错 —— [#562](https://github.com/antdv-next/antdv-next/pull/562)
* fix(date-picker)：传入的 `inputReadonly` 属性不生效 —— [#561](https://github.com/antdv-next/antdv-next/pull/561)
* fix(pagination)：部分场景下文字换行溢出 —— [#557](https://github.com/antdv-next/antdv-next/pull/557)
* fix(switch)：从 Switch 组件派发 `click` 事件 —— [#556](https://github.com/antdv-next/antdv-next/pull/556)
* fix(tour)：从按钮 props 透传中排除 `children`，避免 Vue DOM 告警 —— [#555](https://github.com/antdv-next/antdv-next/pull/555)
* fix(upload)：`UploadDragger` 的部分插槽未正确透传 —— [#553](https://github.com/antdv-next/antdv-next/pull/553)
* fix：同步 ant-design master 的无障碍与响应式修复 —— [#549](https://github.com/antdv-next/antdv-next/pull/549)
* fix(modal)：支持全局 config 多语言 —— [#546](https://github.com/antdv-next/antdv-next/pull/546)

**📝 文档更新 Documentation**

* docs(image)：补充 `focusTrap` —— [#565](https://github.com/antdv-next/antdv-next/pull/565)
* docs(carousel)：移除缺失的组件 token 示例 —— [#564](https://github.com/antdv-next/antdv-next/pull/564)
* docs(tabs)：将 `children` 替换为 `content` —— [#559](https://github.com/antdv-next/antdv-next/pull/559)
* docs(readme)：完善贡献步骤 —— [#551](https://github.com/antdv-next/antdv-next/pull/551)

**🛠 重构与维护 Refactor & Maintenance**

* chore(deps)：将 `@v-c/table` 更新到 1.1.3 —— [#550](https://github.com/antdv-next/antdv-next/pull/550)
* chore(deps)：将 `@v-c/table` 更新到 1.1.2 —— [#548](https://github.com/antdv-next/antdv-next/pull/548)

**完整变更日志**：[antdv-next@1.3.1...antdv-next@1.3.2](https://github.com/antdv-next/antdv-next/compare/antdv-next@1.3.1...antdv-next@1.3.2)

## V1.3.1

发布日期：2026-05-20

本次补丁版本主要 **同步 ant-design 6.4.3 P1 修复（Result / DatePicker / Select）、回灌上游 6.4.3 中 Table 与 Mentions 的性能优化**，并修复 **Image 运行时告警**。

**🐞 问题修复 Fixes**

* fix：同步 ant-design 6.4.3 P1 修复（Result / DatePicker / Select）—— [#541](https://github.com/antdv-next/antdv-next/pull/541)
* fix：修复 image 告警 —— [#539](https://github.com/antdv-next/antdv-next/pull/539)

**⚡ 性能优化 Performance**

* perf(table)：同步 ant-design 6.4.3 Table 性能优化与 `FilterResetProps` 重命名 —— [#542](https://github.com/antdv-next/antdv-next/pull/542)
* perf(mentions)：同步 ant-design 6.4.3 `getMentions` 减少遍历次数 —— [#543](https://github.com/antdv-next/antdv-next/pull/543)

**🧪 测试 Tests**

* test(Table)：为 `table-demo-expand-sticky` 表格组件新增测试用例 —— [#540](https://github.com/antdv-next/antdv-next/pull/540)

**完整变更日志**：[antdv-next@1.3.0...antdv-next@1.3.1](https://github.com/antdv-next/antdv-next/compare/antdv-next@1.3.0...antdv-next@1.3.1)

## V1.3.0

发布日期：2026-05-16

本次版本主要聚焦于 **同步 ant-design 至 6.4.2、新增 BorderBeam 组件、按照 antd v2 语义化标准重构 Notification / Message / Typography 等组件，并补齐 ConfigProvider 全局配置项**，同时修复 **TypeScript bundler 模式下深层导入失败、message 动画错位、Notification 无标题关闭按钮间距、Image popup.close 语义键命名** 等问题。

> ⚠️ 本版本包含若干破坏性改动，详情见 **破坏性变更** 章节。

**✨ 新功能 Features**

* feat：同步 ant-design@6.4.2，覆盖 Calendar / Splitter / Image / Wave / Modal / Drawer / ConfigProvider / Table / Tabs / Form / Menu / Tag / Tree / Tour / Typography / Notification / Message 等组件的功能与样式更新
* feat(border-beam)：新增 BorderBeam 边框流光组件，附带文档、demo 与单元测试
* feat(typography)：迁移到 antd 6.4 的 v2 语义化结构，支持 `actions.placement` 控制操作按钮组位置；新增 `root` / `actions` / `action` / `textarea` 语义化 key
* feat(notification)：升级到 vc-notification@2，支持 `title` / `description` / `icon` / `actions` / `progress` / `close` 等完整 v2 语义化插槽；新增 `_InternalListDoNotUseOrYouWillBeFired` 内部组件供文档预览
* feat(message)：同步 antd 6.4 v2 语义化结构（`title` / `wrapper` / `list` / `listContent`），新增 `_InternalListDoNotUseOrYouWillBeFired`
* feat(form)：新增 `help` / `helpItem` / `extra` 语义化 class 与 style 支持
* feat(transfer)：新增 `source` / `target` 嵌套语义化覆盖，支持按左右单侧定制 `section` / `header` / `title` / `body` / `list` / `item` / `itemIcon` / `itemContent` / `footer`
* feat(calendar)：新增 `itemContent` 语义化 class 与 style
* feat(modal, tour, tag, popconfirm, image, statistic, tree, tree-select, input, popconfirm)：补齐 `close` / `icon` / `clear` / `value` / `itemSwitcher` 等语义化 class 与 style
* feat(config-provider)：扩展全局组件配置，支持 Select `allowClear` / `showSearch` / `loadingIcon`、DatePicker / TimePicker `allowClear` / `clearIcon`、Modal infoIcon/successIcon/warningIcon/errorIcon、Upload `progress` / `accept`、Modal / Drawer `focusable`、Mentions `allowClear`、Cascader 系列 icon 等
* feat(menu)：item extra 布局与 tooltip padding 样式更新
* feat(mentions)：弹层 z-index 接入 `useZIndex`
* feat(cascader)：支持 ConfigProvider `searchIcon` / `clearIcon` / `removeIcon` / `suffixIcon`
* feat(table)：支持 ConfigProvider 列默认值 + 按列合并
* feat：升级 vc-notification@2.0.0-rc.4、vc-input@1.1.0-rc.3、vc-picker@1.1.0-rc.3、vc-table@1.1.0-rc.2、vc-select@1.1.0-rc.1、vc-slider@1.1.0-rc.1、vc-resize-observer@1.1.0-rc.1、vc-tour@1.1.0-rc.2 等

**💥 破坏性变更 Breaking Changes**

* **typography**：`classes.copy` / `classes.edit` / `classes.expand` / `classes.content`（及对应 `styles.*`）已移除，请改用统一的 `classes.action` / `styles.action`（单按钮）和 `classes.actions` / `styles.actions`（操作组容器）
* **message**：`classes.content` / `styles.content` 已移除，请改用 `classes.title` / `styles.title`；DOM 从 `notice-description > .custom-content` 改为 `notice-title`，type 修饰类从 root 挪到 `notice-wrapper`
* **transfer**：`classes.source` / `classes.target` 从扁平字符串改为嵌套对象。原 `classes={ source: 'foo' }` 写法需迁移为 `classes={ source: { section: 'foo' } }`
* **image**：`classes.popup.closeIcon` / `styles.popup.closeIcon` 已重命名为 `popup.close` / `popup.close`，与 vc-image 的内部命名对齐

**🐞 问题修复 Fixes**

* fix(pkg)：为 `./dist/*` 子路径导出增加 `index.d.ts` fallback，修复 TypeScript `moduleResolution: bundler` / `nodenext` 下深层类型导入失败的问题
* fix(message)：从 `move-up` 改为 `fade` 动画名，恢复与 antd 6.x 一致的进出场动画
* fix(message)：图标从内嵌 description 提升到 v2 的 icon 语义槽
* fix(notification)：可关闭通知没有标题时为 description 补充 `padding-inline-end`，避免文字与关闭按钮重叠
* fix(notification)：位置改用 `--notification-top` / `--notification-bottom` CSS 变量，避免 holder 占满高度
* fix(notification, message)：补回 v1 icon-wrapper 类，保持向后兼容
* fix(notification)：从 vc-notification 拆掉 onClose array merge / 无效 TransitionGroup tag 等问题（vc-notification 2.0.0-rc.2/rc.3 跟进）
* fix(border-beam)：将 `offsetPath` 圆角从 `200px` 调整为 `100px`，避免光束在转弯处断开

**📝 文档与 Demo**

* docs：新增 Notification / Message / Typography / Form / Transfer / Tag / Tour / Modal / Image / Calendar / Statistic / Tree / TreeSelect / Input / Popconfirm 语义化 DOM 预览 demo + 多语言 locale 描述
* docs(notification, message)：style-class demo 重构成 React 6.4 同款绿色/红色函数式样式示例
* docs(border-beam)：新增中英文文档、demo 与侧边栏注册

**🔄 内部依赖 Internal**

* 升级 vc-notification 至 2.0.0-rc.4（完整 v2 语义化结构 + height patcher 修复 + 离场动画修复）
* 升级 vc-input/picker/select/table/slider/resize-observer/tour/notification 等 rc 版本，详见 catalog
* 升级 vc-overflow 至 1.1.0-rc.1（RTL logical offset 修复）

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.2.2...antdv-next@1.3.0

## V1.2.2

发布日期：2026-04-28

本次版本主要聚焦于 **新增上一页/下一页翻页能力、支持 Table 泛型模式，并同步最新 antd 实现至 6.3.7**，同时修复 **Masonry 插槽类型、Card 空内容渲染、Button 动效、Form 字段行为以及 Table 虚拟滚动表头同步** 等问题，并进一步优化文档侧边栏、Descriptions 文档、列宽调整说明与同步文档内容。

**✨ 新功能 Features**

* feat：新增上一页和下一页翻页能力 by @selicens [#491](https://github.com/antdv-next/antdv-next/pull/491)
* feat：支持 Table 泛型模式 by @aibayanyu20 [#496](https://github.com/antdv-next/antdv-next/pull/496)
* feat：同步 antd 相关实现 by @aibayanyu20 [#505](https://github.com/antdv-next/antdv-next/pull/505)
* feat：同步 antd@6.3.7 by @aibayanyu20 [#507](https://github.com/antdv-next/antdv-next/pull/507)

**🐞 问题修复 Fixes**

* fix(masonry)：为 `itemRender` 插槽数据字段增加泛型类型支持 by @ayangweb [#490](https://github.com/antdv-next/antdv-next/pull/490)
* fix(card)：无内容时跳过空的 body 包裹层渲染 by @ayangweb [#493](https://github.com/antdv-next/antdv-next/pull/493)
* fix：修复 Button 动效问题 by @aibayanyu20 [#495](https://github.com/antdv-next/antdv-next/pull/495)
* fix：修复 Form 使用原始 name 时异常的问题 by @aibayanyu20 [#498](https://github.com/antdv-next/antdv-next/pull/498)
* fix：修复 Table 虚拟模式下表头滚动未生效的问题 by @aibayanyu20 [#499](https://github.com/antdv-next/antdv-next/pull/499)
* fix：修复 Form 自动补全未生效的问题 by @aibayanyu20 [#504](https://github.com/antdv-next/antdv-next/pull/504)

**📝 文档更新 Documentation**

* docs(menu)：优化侧边栏，支持在新标签页打开链接 by @cc-hearts [#485](https://github.com/antdv-next/antdv-next/pull/485)
* docs(descriptions)：更新 Descriptions 组件文档 by @jiangrong-devops [#501](https://github.com/antdv-next/antdv-next/pull/501)
* docs：修复调整列宽时触发非预期排序的问题 by @think-gem [#502](https://github.com/antdv-next/antdv-next/pull/502)
* docs：同步文档内容 by @aibayanyu20 [#506](https://github.com/antdv-next/antdv-next/pull/506)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.2.1...antdv-next@1.2.2

## V1.2.1

发布日期：2026-04-20

本次版本主要聚焦于 **修复 Drawer、Transfer、Affix 以及 layer 模式图标颜色和静态方法国际化等交互与表现问题**，并进一步 **优化文档站点、同步 Transfer 示例与迁移文档内容，同时补充相关链接与测试快照更新**。

**🐞 问题修复 Fixes**

* fix(drawer)：修复 `afterOpenChange` 方法在初始化阶段触发两次的问题 by @selicens [#466](https://github.com/antdv-next/antdv-next/pull/466)
* fix(Transfer)：修复 Transfer 组件默认插槽在未指定 `direction` 的节点上渲染为空的问题 by @jiangrong-devops [#471](https://github.com/antdv-next/antdv-next/pull/471)
* fix(drawer)：修复 `getContainer` 为 `false` 时丢失 Esc 关闭行为的问题 by @ffgenius [#470](https://github.com/antdv-next/antdv-next/pull/470)
* fix(affix)：使用内容高度作为占位高度，修复占位高度异常问题 by @william-xue [#478](https://github.com/antdv-next/antdv-next/pull/478)
* fix：修复 layer 模式下图标颜色未生效，以及静态方法不支持国际化的问题 by @aibayanyu20 [#481](https://github.com/antdv-next/antdv-next/pull/481)

**📝 文档更新 Documentation**

* docs：优化站点文档 by @selicens [#467](https://github.com/antdv-next/antdv-next/pull/467)
* docs(Transfer)：同步 antd Transfer 组件示例文档 by @jiangrong-devops [#476](https://github.com/antdv-next/antdv-next/pull/476)
* docs：更新 `migration-antdv-next` 文档 by @think-gem [#474](https://github.com/antdv-next/antdv-next/pull/474)
* docs：回滚迁移文档更新 by @selicens [#480](https://github.com/antdv-next/antdv-next/pull/480)
* docs：补充相关链接 by @aibayanyu20 [#486](https://github.com/antdv-next/antdv-next/pull/486)

**🛠 重构与维护 Refactor & Maintenance**

* test(image)：更新快照以覆盖 `alt` 属性修复 by @cc-hearts [#479](https://github.com/antdv-next/antdv-next/pull/479)

---

**👏 新贡献者 New Contributors**

感谢以下社区贡献者的首次参与：

* @think-gem（[#474](https://github.com/antdv-next/antdv-next/pull/474)）

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.2.0...antdv-next@1.2.1

## V1.2.0

发布日期：2026-04-15

本次版本主要聚焦于 **补齐 Select 实例方法暴露、同步最新 antd 相关实现，并修复 Breadcrumb、Space、Tree、Upload 与 ConfigProvider 等组件在类型、布局和交互上的问题**，同时进一步 **完善 Spin 迁移文档、图标文案展示以及文档生成工作流与静态资源维护**。

**✨ 新功能 Features**

* feat(select)：暴露 `blur`、`focus` 与 `scrollTo` 实例方法 by @selicens [#448](https://github.com/antdv-next/antdv-next/pull/448)
* feat：同步最新 antd 相关实现 by @aibayanyu20 [#460](https://github.com/antdv-next/antdv-next/pull/460)

**🐞 问题修复 Fixes**

* fix：修复 Breadcrumb 插槽类型定义问题 by @aibayanyu20 [#447](https://github.com/antdv-next/antdv-next/pull/447)
* fix(space)：避免 `Space.Addon` 内容发生换行 by @selicens [#452](https://github.com/antdv-next/antdv-next/pull/452)
* fix(Tree)：修复 Tree 组件父节点内容多行时复选框整体未对齐的问题 by @jiangrong-devops [#431](https://github.com/antdv-next/antdv-next/pull/431)
* fix：修复 Upload 链接误跳转问题，并更新相关依赖 by @aibayanyu20 [#453](https://github.com/antdv-next/antdv-next/pull/453)
* fix：修复 Select 在 ConfigProvider 中 `getPopupContainer` 未生效的问题 by @aibayanyu20 [#456](https://github.com/antdv-next/antdv-next/pull/456)
* fix：修复 ConfigProvider 扩展属性未生效的问题 by @aibayanyu20 [#459](https://github.com/antdv-next/antdv-next/pull/459)

**📝 文档更新 Documentation**

* perf(docs)：优化 LLMs 文档生成工作流路径 by @cc-hearts [#444](https://github.com/antdv-next/antdv-next/pull/444)
* docs(spin)：补充 description API 与迁移文档说明 by @selicens [#449](https://github.com/antdv-next/antdv-next/pull/449)
* fix：修复文档中 Icon 与 Message 的展示文案问题 by @cc-hearts [#454](https://github.com/antdv-next/antdv-next/pull/454)
* fix：修正文档中 Timeline 的中文错别字 by @jasonren0403 [#457](https://github.com/antdv-next/antdv-next/pull/457)

**🛠 重构与维护 Refactor & Maintenance**

* chore(image)：更新图片资源地址 by @selicens [#445](https://github.com/antdv-next/antdv-next/pull/445)

---

**👏 新贡献者 New Contributors**

感谢以下社区贡献者的首次参与：

* @jasonren0403（[#457](https://github.com/antdv-next/antdv-next/pull/457)）

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.9...antdv-next@1.2.0


## V1.1.9

本次版本主要聚焦于 **修复 Tabs、Menu、FormItem 与 Image 等在 class、样式资源和表单标签表现上的问题**，并进一步 **优化 SSR 渲染场景下的样式完整性与类型性能表现**。

**🐞 问题修复 Fixes**

* fix(tabs)：修复 class 名重复的问题 by @selicens [#435](https://github.com/antdv-next/antdv-next/pull/435)
* fix：修复 SSR 渲染模式下 Menu 样式缺失的问题 by @aibayanyu20 [#437](https://github.com/antdv-next/antdv-next/pull/437)
* fix：修复 FormItem label 未生效的问题 by @aibayanyu20 [#441](https://github.com/antdv-next/antdv-next/pull/441)

**🛠 重构与维护 Refactor & Maintenance**

* chore(image)：更新图片资源地址 by @selicens [#436](https://github.com/antdv-next/antdv-next/pull/436)
* perf：优化类型性能 by @aibayanyu20 [#442](https://github.com/antdv-next/antdv-next/pull/442)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.8...antdv-next@1.1.9


## V1.1.8

本次版本主要聚焦于 **修复 Input、ConfigProvider、Image、TimePicker 等在输入法输入、样式透传与触屏交互上的问题**，并进一步 **优化文档站排版、Tabs 示例、发布公告内容与 GitHub 编辑链接**。同时新增 Pro 项目初始化，并补充 Claude Code 协作说明与相关 CI 工作流。

**✨ 新功能 Features**

* feat：初始化 Pro 项目 by @aibayanyu20 [#422](https://github.com/antdv-next/antdv-next/pull/422)

**🐞 问题修复 Fixes**

* fix(input)：为 Input 增加 IME 输入法组合态保护，并支持 `changeOnComposing` 属性 by @shiqkuangsan [#417](https://github.com/antdv-next/antdv-next/pull/417)
* fix：修复 ConfigProvider 的 `style` 与 `class` 透传问题 by @aibayanyu20 [#420](https://github.com/antdv-next/antdv-next/pull/420)
* fix(image)：修复图片预览底部按钮样式异常问题 by @selicens [#430](https://github.com/antdv-next/antdv-next/pull/430)
* fix：修复 TimePicker 在触摸设备上列无法滚动的问题 by @aibayanyu20 [#433](https://github.com/antdv-next/antdv-next/pull/433)

**📝 文档更新 Documentation**

* docs(tabs)：更新可拖拽 Tabs 组件文档示例 by @jiangrong-devops [#412](https://github.com/antdv-next/antdv-next/pull/412)
* docs(blog)：优化发布公告内容及英文翻译 by @TAYUN [#413](https://github.com/antdv-next/antdv-next/pull/413)
* fix(docs)：修正文档中的 GitHub 编辑链接路径 by @lonewolfyx [#415](https://github.com/antdv-next/antdv-next/pull/415)
* fix(docs)：修复文档左侧对齐问题 by @ouyang108 [#425](https://github.com/antdv-next/antdv-next/pull/425)
* fix(docs)：对齐文档侧边菜单暗色主题 token 与背景样式 by @ffgenius [#428](https://github.com/antdv-next/antdv-next/pull/428)

**🛠 重构与维护 Refactor & Maintenance**

* chore：更新依赖 by @aibayanyu20 [#416](https://github.com/antdv-next/antdv-next/pull/416)
* chore：新增 `CLAUDE.md`，补充 Claude Code 协作说明 by @shiqkuangsan [#418](https://github.com/antdv-next/antdv-next/pull/418)
* ci：新增 Claude Code 工作流 by @shiqkuangsan [#419](https://github.com/antdv-next/antdv-next/pull/419)

---

**👏 新贡献者 New Contributors**

感谢以下社区贡献者的首次参与：

* @lonewolfyx（[#415](https://github.com/antdv-next/antdv-next/pull/415)）
* @TAYUN（[#413](https://github.com/antdv-next/antdv-next/pull/413)）
* @ouyang108（[#425](https://github.com/antdv-next/antdv-next/pull/425)）

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.7...antdv-next@1.1.8


## V1.1.7

本次版本主要聚焦于 **修复 cssinjs、Tree、Transfer、Image、Table、Menu 等在渲染、样式与交互细节上的问题**，并进一步 **优化文档站移动端适配、图标搜索交互以及多处文档描述与仓库链接内容**。同时同步了 antd 6.3.4 的部分细节表现。

**🐞 问题修复 Fixes**

* fix(cssinjs)：修复 cssinjs 渲染延迟问题，并同步 cssinjs 相关实现 by @aibayanyu20 [#403](https://github.com/antdv-next/antdv-next/pull/403)
* fix：修复图标分类标题国际化未生效问题 by @selicens [#404](https://github.com/antdv-next/antdv-next/pull/404)
* fix(popconfirm)：修复 `style-class` 示例容器 padding 未生效的问题 by @selicens [#405](https://github.com/antdv-next/antdv-next/pull/405)
* fix(Tree)：同步 antd 6.3.4，修复启用 `showLine` 时自定义 `switcherIcon` class 不正确的问题 by @selicens [#407](https://github.com/antdv-next/antdv-next/pull/407)
* fix(transfer)：同步 antd 6.3.4，修复渲染条目时非字符串 `render` 结果的处理问题 by @selicens [#408](https://github.com/antdv-next/antdv-next/pull/408)
* fix：同步 antd 6.3.4，为 SubMenu 父级菜单项应用自定义 hover 颜色 by @selicens [#409](https://github.com/antdv-next/antdv-next/pull/409)
* fix(image)：同步 antd 6.3.4，支持透传 `fetchPriority` 属性 by @selicens [#410](https://github.com/antdv-next/antdv-next/pull/410)
* fix(table)：修复开启 scroll 时列标题中的受控 Popover 被重复渲染的问题 by @aibayanyu20 [#411](https://github.com/antdv-next/antdv-next/pull/411)

**📝 文档更新 Documentation**

* docs：将 key 描述从 React 更新为 Vue，并补充 column key 相关说明 by @jiangrong-devops [#399](https://github.com/antdv-next/antdv-next/pull/399)
* feat(docs)：新增文档站移动端响应式适配 by @william-xue [#400](https://github.com/antdv-next/antdv-next/pull/400)
* docs(icon)：搜索图标后自动滚动到图标列表 by @z-kunf [#401](https://github.com/antdv-next/antdv-next/pull/401)
* docs：更新文档仓库地址 by @ayangweb [#406](https://github.com/antdv-next/antdv-next/pull/406)

---

**👏 新贡献者 New Contributors**

感谢以下社区贡献者的首次参与：

* @william-xue（[#400](https://github.com/antdv-next/antdv-next/pull/400)）
* @ayangweb（[#406](https://github.com/antdv-next/antdv-next/pull/406)）

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.6...antdv-next@1.1.7


## V1.1.6

本次版本主要聚焦于 **修复 Menu / Divider / Image 等组件在样式与交互细节上的问题**，并进一步 **完善 Modal 文档、暗色主题对比度逻辑与主题预览体验**。同时新增赞助页暗色风格收款二维码，补充社区支持入口。

**✨ 新功能 Features**

* feat(sponsor)：新增 darkingtail 的收款二维码，并适配暗色风格展示 by @darkingtail [#395](https://github.com/antdv-next/antdv-next/pull/395)
* feat(preview-theme)：主题预览改用 `antdv-style`，并同步复制主题代码能力 by @ffgenius [#397](https://github.com/antdv-next/antdv-next/pull/397)

**🐞 问题修复 Fixes**

* fix(menu)：在自定义 `collapsedIconSize` 场景下对齐折叠态图标 by @wxfengg [#385](https://github.com/antdv-next/antdv-next/pull/385)
* fix：修复 focus trap 问题 by @aibayanyu20 [#389](https://github.com/antdv-next/antdv-next/pull/389)
* fix(divider)：修复通过 attrs 传入 `class` 时未正确应用的问题 by @cc-hearts [#394](https://github.com/antdv-next/antdv-next/pull/394)
* fix：修复 Menu 首次高亮状态问题 by @aibayanyu20 [#396](https://github.com/antdv-next/antdv-next/pull/396)
* fix(image)：修复 `mask` 为 `true` 时的模糊遮罩表现 by @448847482 [#398](https://github.com/antdv-next/antdv-next/pull/398)

**📝 文档更新 Documentation**

* docs：修复 Modal 文档参数缺失问题 by @jauqasx [#388](https://github.com/antdv-next/antdv-next/pull/388)
* fix(docs)：优化暗色模式下主题选择器的对比度逻辑 by @wxfengg [#392](https://github.com/antdv-next/antdv-next/pull/392)

---

**👏 新贡献者 New Contributors**

感谢以下社区贡献者的首次参与：

* @wxfengg（[#385](https://github.com/antdv-next/antdv-next/pull/385)）
* @448847482（[#398](https://github.com/antdv-next/antdv-next/pull/398)）

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.5...antdv-next@1.1.6


## V1.1.5

本次版本主要聚焦于 **修复 Select / Layout / Grid / Form / Image 等组件的渲染、样式与交互问题**，并进一步 **增强 Playground 本地联调能力与补充文档内容**。同时新增公众号二维码入口，并同步修正文档描述与动态占位符相关问题。

**✨ 新功能 Features**

* feat(playground)：新增 `VC_LOCAL` 模式，便于本地调试 `@v-c/*` 包 by @shiqkuangsan [#371](https://github.com/antdv-next/antdv-next/pull/371)
* feat：新增微信公众号二维码 by @selicens [#380](https://github.com/antdv-next/antdv-next/pull/380)

**🐞 问题修复 Fixes**

* fix：修复 Select 渲染错误 by @aibayanyu20 [#370](https://github.com/antdv-next/antdv-next/pull/370)
* fix(style)：优化 Link 在 `focus-visible` 状态下的无障碍描边样式 by @darkingtail [#376](https://github.com/antdv-next/antdv-next/pull/376)
* fix(grid)：为媒体尺寸映射补充 `xxxl` 断点 by @darkingtail [#378](https://github.com/antdv-next/antdv-next/pull/378)
* fix(form)：移除必选标记中的硬编码 SimSun 字体 by @darkingtail [#377](https://github.com/antdv-next/antdv-next/pull/377)
* fix(image)：优化预览遮罩的模糊过渡效果与可移动状态下的鼠标样式 by @darkingtail [#375](https://github.com/antdv-next/antdv-next/pull/375)
* fix：修复 Layout class 重复添加的问题 by @aibayanyu20 [#379](https://github.com/antdv-next/antdv-next/pull/379)
* fix：修复动态 placeholder 问题 by @Rascal-Coder [#383](https://github.com/antdv-next/antdv-next/pull/383)

**📝 文档更新 Documentation**

* docs(table)：补充 Table props 性能相关文档说明 by @cc-hearts [#373](https://github.com/antdv-next/antdv-next/pull/373)
* docs：同步并修正文档索引页描述（zh-CN & en-US）by @jauqasx [#374](https://github.com/antdv-next/antdv-next/pull/374)

---

**👏 新贡献者 New Contributors**

感谢以下社区贡献者的首次参与：

* @jauqasx（[#374](https://github.com/antdv-next/antdv-next/pull/374)）

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.4...antdv-next@1.1.5


## V1.1.4

本次版本主要聚焦于 **补充 Menu / Collapse 的 SFC 用法与主题编辑能力**、**修复 Input.Search 与 TreeSelect 的交互与样式问题**，并进一步 **优化 SSR 表现与升级部分工具链依赖**。同时同步修正文档中的若干渲染和兼容性问题。

**✨ 新功能 Features**

* feat(editor)：使用 antd theme editor 作为主题编辑器 by @ffgenius [#365](https://github.com/antdv-next/antdv-next/pull/365)
* feat：为 Menu 与 Collapse 补充 SFC 用法支持 by @aibayanyu20 [#366](https://github.com/antdv-next/antdv-next/pull/366)

**🐞 问题修复 Fixes**

* fix：修复 TreeSelect hover 样式问题 by @aibayanyu20 [#362](https://github.com/antdv-next/antdv-next/pull/362)
* fix：修复 Input.Search 清空时重复触发两次事件的问题 by @aibayanyu20 [#361](https://github.com/antdv-next/antdv-next/pull/361)

**📝 文档更新 Documentation**

* docs(input)：补充 `clearIcon` 插槽文档说明 by @selicens [#355](https://github.com/antdv-next/antdv-next/pull/355)
* docs：修复 Chrome 低版本浏览器兼容性说明 by @aibayanyu20 [#357](https://github.com/antdv-next/antdv-next/pull/357)
* docs(table)：修复 Table 文档渲染错误 by @cc-hearts [#363](https://github.com/antdv-next/antdv-next/pull/363)
* docs(drawer/tabs/time-picker/upload)：修复相关文档渲染错误 by @cc-hearts [#364](https://github.com/antdv-next/antdv-next/pull/364)
* docs：修复并更新文档内容 by @aibayanyu20 [#367](https://github.com/antdv-next/antdv-next/pull/367)

**🛠 重构与维护 Refactor & Maintenance**

* perf：优化 SSR 性能 by @aibayanyu20 [#356](https://github.com/antdv-next/antdv-next/pull/356)
* chore：升级 Vite 版本并更新相关依赖 by @cc-hearts [#359](https://github.com/antdv-next/antdv-next/pull/359)
* chore：升级 Vitest 版本 by @cc-hearts [#360](https://github.com/antdv-next/antdv-next/pull/360)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.3...antdv-next@1.1.4


## V1.1.3

本次版本主要聚焦于 **修复 Select / Form / InputNumber / Splitter 等组件的行为问题**，并进一步 **同步 Timeline 与 antd 6.3.2 的细节表现**。同时补充了文档站中一键打开 Playground 的能力，便于调试与示例联动查看。

**✨ 新功能 Features**

* feat：同步 antd 6.3.2 中 Timeline `showLine` 在自定义 `titleHeight` 场景下的对齐表现 by @selicens [#346](https://github.com/antdv-next/antdv-next/pull/346)

**🐞 问题修复 Fixes**

* fix：修复 Select 异常值处理问题 by @aibayanyu20 [#340](https://github.com/antdv-next/antdv-next/pull/340)
* fix：修复 Select 在 DOM attributes 中的 class 解析问题 by @aibayanyu20 [#343](https://github.com/antdv-next/antdv-next/pull/343)
* fix(splitter)：修复部分受控场景下 size 计算错误的问题 by @darkingtail [#347](https://github.com/antdv-next/antdv-next/pull/347)
* fix：修复 InputNumber `format` 场景下光标恢复未生效的问题 by @aibayanyu20 [#352](https://github.com/antdv-next/antdv-next/pull/352)
* fix：修复 Form `rules.validateTrigger` 错误，并支持新的表单规则 `tel` by @aibayanyu20 [#350](https://github.com/antdv-next/antdv-next/pull/350)

**📝 文档更新 Documentation**

* docs：新增在文档站中打开 Playground 的入口 by @aibayanyu20 [#339](https://github.com/antdv-next/antdv-next/pull/339)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.1...antdv-next@1.1.3


## V1.1.1

本次版本主要聚焦于 **增强与 Ant Design 的 API 对齐**、**为更多组件补充 slot / SFC 用法支持**，并持续 **修复 Modal、Menu、Tree、Slider、Switch、Skeleton 等组件的行为问题**。同时补充了更多单元测试覆盖，并更新了文档站点内容。

**✨ 新功能 Features**

* feat：支持 Timeline / Descriptions / Breadcrumb 使用 SFC item 组件，并增强 Menu 的 slot 渲染，同时补充文档与测试 by @aibayanyu20 [#295](https://github.com/antdv-next/antdv-next/pull/295)
* feat：Form.Item 支持 `tooltip` / `help` / `label` / `extra` 插槽 by @aibayanyu20 [#301](https://github.com/antdv-next/antdv-next/pull/301)
* feat：新增 `MaskType` by @mengxianghan [#318](https://github.com/antdv-next/antdv-next/pull/318)
* feat：同步 Progress 与主题预览行为以对齐 antd by @han1548772930 [#329](https://github.com/antdv-next/antdv-next/pull/329)
* feat：同步 `sizeType` by @aibayanyu20 [#338](https://github.com/antdv-next/antdv-next/pull/338)

**🐞 问题修复 Fixes**

* fix(tour)：在 `panelRender` 中保留步骤级语义 class by @shiqkuangsan [#291](https://github.com/antdv-next/antdv-next/pull/291)
* fix(slider)：将 `tabindex` 属性名修正为 `tabIndex` by @shiqkuangsan [#296](https://github.com/antdv-next/antdv-next/pull/296)
* fix：修复 Message 校验时 label 使用问题 by @Rascal-Coder [#305](https://github.com/antdv-next/antdv-next/pull/305)
* fix：修复 Menu `keyPath` 顺序反转问题 by @aibayanyu20 [#311](https://github.com/antdv-next/antdv-next/pull/311)
* fix(modal)：修复默认 blur 模式未生效的问题，并更新相关说明 by @mengxianghan [#314](https://github.com/antdv-next/antdv-next/pull/314)
* fix：修复 Tooltip 图标渲染问题 by @aibayanyu20 [#313](https://github.com/antdv-next/antdv-next/pull/313)
* fix(modal)：为 `onCancel` 类型补充 `KeyboardEvent` 支持 by @utianhuan666 [#324](https://github.com/antdv-next/antdv-next/pull/324)
* fix：修复 Form.Item 未继承 ref 的问题 by @aibayanyu20 [#325](https://github.com/antdv-next/antdv-next/pull/325)
* fix：修复 Switch 受控模式问题 by @aibayanyu20 [#328](https://github.com/antdv-next/antdv-next/pull/328)
* fix：修复 Tree `checkedKeys` 为对象时的处理问题 by @aibayanyu20 [#333](https://github.com/antdv-next/antdv-next/pull/333)
* fix：修复 Segmented 动画问题 by @aibayanyu20 [#334](https://github.com/antdv-next/antdv-next/pull/334)
* fix：修复 Skeleton size 未生效的问题 by @aibayanyu20 [#337](https://github.com/antdv-next/antdv-next/pull/337)

**🧪 单元测试 Tests**

本版本为 Tabs、Tour、ColorPicker、cssinjs、Slider、Table、Image、FloatButton、TimePicker 等补充单元测试，提升回归保护能力。

* test(tabs)：新增单元测试 by @shiqkuangsan [#290](https://github.com/antdv-next/antdv-next/pull/290)
* test：补充 ColorPicker 与 cssinjs 单元测试 by @aibayanyu20 [#292](https://github.com/antdv-next/antdv-next/pull/292)
* test(tour)：新增单元测试 by @shiqkuangsan [#294](https://github.com/antdv-next/antdv-next/pull/294)
* test(slider)：新增单元测试 by @shiqkuangsan [#298](https://github.com/antdv-next/antdv-next/pull/298)
* test(table)：新增单元测试 by @shiqkuangsan [#302](https://github.com/antdv-next/antdv-next/pull/302)
* test(image)：新增单元测试 by @darkingtail [#307](https://github.com/antdv-next/antdv-next/pull/307)
* test(float-button)：新增单元测试 by @darkingtail [#306](https://github.com/antdv-next/antdv-next/pull/306)
* test(time-picker)：新增单元测试 by @shiqkuangsan [#308](https://github.com/antdv-next/antdv-next/pull/308)

**📝 文档更新 Documentation**

* docs：补充 SEO 性能优化 by @aibayanyu20 [#293](https://github.com/antdv-next/antdv-next/pull/293)
* docs(covers)：将 QRCode 属性名更正为 `QrCode`（驼峰命名）by @utianhuan666 [#299](https://github.com/antdv-next/antdv-next/pull/299)
* docs：更新文档并同步更新 LLM 脚本 by @aibayanyu20 [#322](https://github.com/antdv-next/antdv-next/pull/322)
* docs(table)：补充 column 文档说明 by @cc-hearts [#336](https://github.com/antdv-next/antdv-next/pull/336)

**🛠 重构与维护 Refactor & Maintenance**

* chore(cascader)：版本升级 by @cc-hearts [#304](https://github.com/antdv-next/antdv-next/pull/304)
* fix：移除重复的 `initMotionCommonLeave` 函数 by @utianhuan666 [#323](https://github.com/antdv-next/antdv-next/pull/323)
* fix(deps)：将 `@v-c/select` 升级至 `^1.0.17` by @shiqkuangsan [#326](https://github.com/antdv-next/antdv-next/pull/326)

---

**👏 新贡献者 New Contributors**

感谢以下社区贡献者的首次参与：

* @mengxianghan（[#314](https://github.com/antdv-next/antdv-next/pull/314)）

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.0...antdv-next@1.1.1


## V1.1.0

本次版本主要聚焦于 **同步 antd v6.3.1**、**修复组件行为与可访问性问题**，并进一步 **补充更多组件的单元测试覆盖**。同时包含文档更新、CI/脚本维护以及 sponsor/readme 优化。

**✨ 新功能 Features**

* feat(sponsor)：优化自定义赞助金额输入框样式 by @ffgenius [#250](https://github.com/antdv-next/antdv-next/pull/250)
* feat：同步 antd 6.3.1 by @ffgenius [#269](https://github.com/antdv-next/antdv-next/pull/269)
* feat(readme)：将贡献者图片改为 Open Collective 链接 by @ffgenius [#274](https://github.com/antdv-next/antdv-next/pull/274)
* feat：优化 prop types 性能 by @aibayanyu20 [#278](https://github.com/antdv-next/antdv-next/pull/278)

**🐞 问题修复 Fixes**

* fix(cascader)：补充 `popupClassName` 缺失的废弃提示 warning by @darkingtail [#242](https://github.com/antdv-next/antdv-next/pull/242)
* fix(collapse)：在 CollapsePanel no-arrow class 中使用 `prefixCls.value` by @shiqkuangsan [#244](https://github.com/antdv-next/antdv-next/pull/244)
* fix：修复 form directive 不生效并补充单元测试 by @aibayanyu20 [#243](https://github.com/antdv-next/antdv-next/pull/243)
* fix(tree)：放宽 `treeData` 类型以支持自定义数据节点 by @darkingtail [#260](https://github.com/antdv-next/antdv-next/pull/260)
* fix(pagination)：修复 change 事件触发问题 by @cc-hearts [#265](https://github.com/antdv-next/antdv-next/pull/265)
* fix(image)：配置 preview mask 时 cover slot 未渲染 by @shiqkuangsan [#272](https://github.com/antdv-next/antdv-next/pull/272)
* fix(skeleton)：同步 Skeleton DOM 元素样式 by @utianhuan666 [#258](https://github.com/antdv-next/antdv-next/pull/258)
* fix(checkbox)：支持 Checkbox 受控状态 by @cc-hearts [#275](https://github.com/antdv-next/antdv-next/pull/275)
* fix(notification)：修复 `classNames` 暴露 key 不一致问题 by @shiqkuangsan [#279](https://github.com/antdv-next/antdv-next/pull/279)
* fix(a11y)：为 Radio 与 Segmented 应用 `prefers-reduced-motion` by @darkingtail [#281](https://github.com/antdv-next/antdv-next/pull/281)
* fix(auto-complete)：修复自定义输入框 placeholder 默认展示问题 by @cc-hearts [#283](https://github.com/antdv-next/antdv-next/pull/283)
* fix(tabs)：修复 onPrevClick/onNextClick 废弃警告未清理问题 by @shiqkuangsan [#287](https://github.com/antdv-next/antdv-next/pull/287)
* fix(tabs)：修复 `renderTabBar` 属性变量遮蔽问题 by @shiqkuangsan [#286](https://github.com/antdv-next/antdv-next/pull/286)
* fix：修复 slick 高度问题 by @aibayanyu20 [#288](https://github.com/antdv-next/antdv-next/pull/288)
* fix：修复 Table loading 与无数据空状态展示问题 by @aibayanyu20 [#289](https://github.com/antdv-next/antdv-next/pull/289)

**🧪 单元测试 Tests**

本版本为 DatePicker、Progress、Collapse、Popconfirm、Drawer、Message、Dropdown、Mentions、Notification 等组件补充单元测试，提升回归保护能力。

* test(date-picker)：新增单元测试 by @aibayanyu20 [#233](https://github.com/antdv-next/antdv-next/pull/233)
* test(progress)：为 Progress 组件新增单元测试 by @darkingtail [#246](https://github.com/antdv-next/antdv-next/pull/246)
* test(collapse)：为 Collapse 组件新增单元测试 by @shiqkuangsan [#247](https://github.com/antdv-next/antdv-next/pull/247)
* test(popconfirm)：为 Popconfirm 组件新增单元测试 by @darkingtail [#248](https://github.com/antdv-next/antdv-next/pull/248)
* test(drawer)：为 Drawer 组件新增单元测试 by @darkingtail [#252](https://github.com/antdv-next/antdv-next/pull/252)
* test(message)：为 Message 组件新增单元测试 by @darkingtail [#263](https://github.com/antdv-next/antdv-next/pull/263)
* test(dropdown)：为 Dropdown 组件新增单元测试 by @shiqkuangsan [#266](https://github.com/antdv-next/antdv-next/pull/266)
* test(mentions)：为 Mentions 组件新增单元测试 by @shiqkuangsan [#270](https://github.com/antdv-next/antdv-next/pull/270)
* test(notification)：为 Notification 组件新增单元测试 by @shiqkuangsan [#284](https://github.com/antdv-next/antdv-next/pull/284)

**📝 文档更新 Documentation**

* fix(docs)：调整 modal lock 场景下滚动条宽度样式 by @han1548772930 [#245](https://github.com/antdv-next/antdv-next/pull/245)
* docs：补充浏览器直接引入示例 by @selicens [#255](https://github.com/antdv-next/antdv-next/pull/255)
* docs(typography)：修复 `enterIcon` 属性描述格式 by @wujighostking [#262](https://github.com/antdv-next/antdv-next/pull/262)
* docs(cascader)：补充语义化 DOM 并新增单元测试 by @ffgenius [#261](https://github.com/antdv-next/antdv-next/pull/261)
* chore(docs)：为 shiqkuangsan 增加 sponsor 二维码 by @shiqkuangsan [#271](https://github.com/antdv-next/antdv-next/pull/271)

**🛠 重构与维护 Refactor & Maintenance**

* ci：调整 docs scripts generate 流程 by @aibayanyu20 [#249](https://github.com/antdv-next/antdv-next/pull/249)
* chore(select/image/util)：版本升级 by @cc-hearts [#277](https://github.com/antdv-next/antdv-next/pull/277)

---

**👏 新贡献者 New Contributors**

感谢以下社区贡献者的首次参与：

* @han1548772930（[#245](https://github.com/antdv-next/antdv-next/pull/245)）
* @utianhuan666（[#258](https://github.com/antdv-next/antdv-next/pull/258)）

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.0.5...antdv-next@1.1.0


## V1.0.5

本次版本主要聚焦于 **组件交互与数据流相关问题修复**，并进一步 **补充单元测试覆盖**。包含 Tooltip、DatePicker、Autocomplete、Select、Descriptions 以及应用级 class/style 处理等修复。

**🐞 问题修复 Fixes**

* fix：修复被动清空时 `v-model` 值未正确清除的问题 by @aibayanyu20 [#228](https://github.com/antdv-next/antdv-next/pull/228)
* fix(tooltip)：修复显示箭头时位置计算错误的问题 by @cc-hearts [#231](https://github.com/antdv-next/antdv-next/pull/231)
* fix：改进双向绑定与单向数据流处理 by @aibayanyu20 [#230](https://github.com/antdv-next/antdv-next/pull/230)
* fix：修复 app class 与 style ref 解构问题 by @aibayanyu20 [#232](https://github.com/antdv-next/antdv-next/pull/232)
* fix：修复 Autocomplete 按 Enter 后输入内容被自动清空的问题 by @aibayanyu20 [#234](https://github.com/antdv-next/antdv-next/pull/234)
* fix(descriptions)：在根节点渲染 `id` 属性 by @shiqkuangsan [#236](https://github.com/antdv-next/antdv-next/pull/236)
* fix：修复 DatePicker 手动清空无效的问题 by @aibayanyu20 [#237](https://github.com/antdv-next/antdv-next/pull/237)
* fix：修复 Select `showSearchConfig` 配置问题 by @aibayanyu20 [#240](https://github.com/antdv-next/antdv-next/pull/240)

**🧪 单元测试 Tests**

本版本为 Splitter、Steps 与 Popover 组件补充单元测试，提升回归保护能力。

* test(splitter)：新增单元测试 by @cc-hearts [#227](https://github.com/antdv-next/antdv-next/pull/227)
* test(steps)：新增单元测试 by @z-kunf [#222](https://github.com/antdv-next/antdv-next/pull/222)
* test(popover)：为 Popover 组件新增单元测试 by @shiqkuangsan [#239](https://github.com/antdv-next/antdv-next/pull/239)

---

**👏 新贡献者 New Contributors**

感谢以下社区贡献者的首次参与：

* @z-kunf（[#222](https://github.com/antdv-next/antdv-next/pull/222)）

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.0.4...antdv-next@1.0.5


## V1.0.4

本次版本主要聚焦于 **单元测试覆盖率提升**、**组件行为问题修复**，以及 **文档 / Playground 工具链改进**，同时包含样式同步、项目结构优化，并增强了 **Nuxt 兼容性**。

**✨ 新功能 Features**

* feat：新增 TS / JS 代码源码展示 by @cc-hearts [#187](https://github.com/antdv-next/antdv-next/pull/187)
* feat(playground)：新增用于调试的 playground by @cc-hearts [#192](https://github.com/antdv-next/antdv-next/pull/192)
* feat：同步 antd 样式 by @aibayanyu20 [#223](https://github.com/antdv-next/antdv-next/pull/223)
* 增强 Nuxt 兼容性（修复 cssinjs priority / order attr 异常）by @aibayanyu20 [#217](https://github.com/antdv-next/antdv-next/pull/217)

**🐞 问题修复 Fixes**

* fix(colorPicker)：修复 `arrow` 属性无效问题 by @ffgenius [#182](https://github.com/antdv-next/antdv-next/pull/182)
* fix：修复 git worktrees 下 `verify-commit.js` 执行失败 by @shiqkuangsan [#193](https://github.com/antdv-next/antdv-next/pull/193)
* fix(config-provider)：为 `PASSED_PROPS` 补充缺失的 masonry 配置 by @shiqkuangsan [#198](https://github.com/antdv-next/antdv-next/pull/198)
* fix(tabs)：修复 `content` 与 slot `content` 不响应问题 by @ming4762 [#197](https://github.com/antdv-next/antdv-next/pull/197)
* fix：playground 重构后更新 `demoTest` 路径 by @shiqkuangsan [#201](https://github.com/antdv-next/antdv-next/pull/201)
* fix(calendar)：在 select demo 中使用正确的 `Dayjs` 类型与 `v-model:value` by @shiqkuangsan [#202](https://github.com/antdv-next/antdv-next/pull/202)
* fix：修复 Select hover range 问题 by @aibayanyu20 [#207](https://github.com/antdv-next/antdv-next/pull/207)
* fix(card)：补充 `update:activeTabKey` 事件并新增单元测试 by @darkingtail [#213](https://github.com/antdv-next/antdv-next/pull/213)
* fix(tree-select)：修复事件重复透传问题 by @ming4762 [#210](https://github.com/antdv-next/antdv-next/pull/210)

**🧪 单元测试 Tests**

本版本为多个组件补充并扩展了单元测试，进一步提升测试覆盖率与回归保护能力。

* test(skeleton)：新增单元测试 by @shiqkuangsan [#183](https://github.com/antdv-next/antdv-next/pull/183)
* test(typography)：新增 wrapper 与语义化测试 by @shiqkuangsan [#194](https://github.com/antdv-next/antdv-next/pull/194)
* test(statistic)：新增单元测试 by @shiqkuangsan [#191](https://github.com/antdv-next/antdv-next/pull/191)
* test(spin)：新增单元测试 by @shiqkuangsan [#189](https://github.com/antdv-next/antdv-next/pull/189)
* test(tag)：新增单元测试 by @shiqkuangsan [#190](https://github.com/antdv-next/antdv-next/pull/190)
* test(masonry)：新增单元测试 by @shiqkuangsan [#204](https://github.com/antdv-next/antdv-next/pull/204)
* test(timeline)：新增单元测试 by @shiqkuangsan [#205](https://github.com/antdv-next/antdv-next/pull/205)
* test(tooltip)：新增 Tooltip 单元测试 by @cc-hearts [#211](https://github.com/antdv-next/antdv-next/pull/211)
* test(checkbox)：为 Checkbox 与 CheckboxGroup 新增单元测试 by @darkingtail [#216](https://github.com/antdv-next/antdv-next/pull/216)
* test(cascader)：为 Cascader 与 CascaderPanel 新增单元测试 by @darkingtail [#215](https://github.com/antdv-next/antdv-next/pull/215)
* test(carousel)：为 Carousel 新增单元测试 by @darkingtail [#214](https://github.com/antdv-next/antdv-next/pull/214)
* test(grid)：为 Row 与 Col 组件新增单元测试 by @shiqkuangsan [#218](https://github.com/antdv-next/antdv-next/pull/218)
* test(radio)：为 Radio / RadioGroup / RadioButton 新增单元测试 by @shiqkuangsan [#219](https://github.com/antdv-next/antdv-next/pull/219)
* test(descriptions)：为 Descriptions 组件新增单元测试 by @shiqkuangsan [#220](https://github.com/antdv-next/antdv-next/pull/220)

**📝 文档更新 Documentation**

* docs：支持 layer mode by @aibayanyu20 [#186](https://github.com/antdv-next/antdv-next/pull/186)
* docs：支持 sponsor 展示 by @aibayanyu20 [#208](https://github.com/antdv-next/antdv-next/pull/208)

**🛠 重构与维护 Refactor & Maintenance**

* refactor：优化项目结构 by @ffgenius [#195](https://github.com/antdv-next/antdv-next/pull/195)

---

**👏 新贡献者 New Contributors**

感谢以下社区贡献者的首次参与：

* @ming4762（[#197](https://github.com/antdv-next/antdv-next/pull/197)）

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.0.3...antdv-next@1.0.4


## V1.0.3

本次版本以 **测试覆盖率提升、文档修复以及稳定性优化** 为主，同时同步了 antd v6.3.0，并对 css-in-js 进行了性能优化。

**✨ 新功能 Features**

* 同步 **antd v6.3.0** 并优化 css-in-js 性能（#163）
* 支持 SSR，并为 ColorPicker / TimePicker / DatePicker 新增 `valueFormat`（#177）
* 同步 Skeleton 组件（#171）
* 文档站支持自定义主题（#166、#178）
* Avatar 与 AvatarGroup 新增单元测试（#126）

**🐞 问题修复 Fixes**

* 修复 trigger 点击无法关闭的问题（#134）
* 修复 Modal 在 info/success/warning 模式下取消按钮隐藏（#167）
* 修复 TreeSelect 多选 Checkbox 样式问题（#169）
* 修复 Progress 动画溢出问题（#173）
* 修复 Layout Sider 响应式折叠逻辑（#158、#155）
* 修复 eslint 配置类型错误（#142）
* 修复变量引用错误（#180）


**🧪 单元测试 Tests**

本版本大幅补充组件测试与语义 DOM 测试，包括：

Avatar、Badge、Breadcrumb、Button、Calendar、Divider、Empty、Flex、Input、InputNumber、Layout、QRCode、Rate、Result、Segmented、Space、Switch、Transfer、Tree、TreeSelect 等组件。

相关 PR：#128、#130、#136、#137、#140、#143、#145、#147、#148、#151、#154、#156、#159、#160、#161、#162、#172、#175、#176


**📝 文档更新 Documentation**

* 修复 DatePicker、Select、Upload、Drawer、Image、Anchor、Pagination 等 API 文档格式问题
* 更新 Layout 文档中 breakpoint 与 collapse 回调类型
* 修复 Grid 文档语法
* 修复 FloatButton API 示例
* 更新 Button 文档链接

相关 PR：#131、#132、#133、#135、#138、#139、#144、#146、#150、#153、#164、#181

---

**👏 新贡献者 New Contributors**

感谢以下社区贡献者的首次参与：

* @Darkingtail
* @shiqkuangsan
* @wujighostking
* @rookie-orange


**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.0.2...antdv-next@1.0.3


## V1.0.2

**新功能**

* feat：同步 Ant Design v6.2.3（@aibayanyu20）[#102](https://github.com/antdv-next/antdv-next/pull/102)
* feat：新增 `prepare` 脚本（@qianYuanJ）[#109](https://github.com/antdv-next/antdv-next/pull/109)
* docs：文档新增全局搜索（@aibayanyu20）[#122](https://github.com/antdv-next/antdv-next/pull/122)

**问题修复**

* fix(input-number)：修复 min/max 响应丢失问题并移除多余的 console 输出（@selicens）[#104](https://github.com/antdv-next/antdv-next/pull/104)
* fix：修复 CSS 变量计算错误（@ffgenius）[#107](https://github.com/antdv-next/antdv-next/pull/107)
* fix：修复 Vue Language Tools 事件提示缺失问题（@aibayanyu20）[#108](https://github.com/antdv-next/antdv-next/pull/108)
* fix：修复 RangePicker 相关问题（@aibayanyu20）[#112](https://github.com/antdv-next/antdv-next/pull/112)
* fix(popconfirm)：修复在 Promise 场景下异步关闭失效的问题（@selicens）[#114](https://github.com/antdv-next/antdv-next/pull/114)
* fix：修复 Menu 标题默认值为 `null` 的问题（@aibayanyu20）[#125](https://github.com/antdv-next/antdv-next/pull/125)

**重构与维护**

* refactor(i18n)：集中管理 i18n 文件（@ffgenius）[#116](https://github.com/antdv-next/antdv-next/pull/116)
* chore(i18n)：将内联语言配置抽离为统一文件（@ffgenius）[#124](https://github.com/antdv-next/antdv-next/pull/124)
* chore：更新文档（@yushi0114）[#111](https://github.com/antdv-next/antdv-next/pull/111)

**测试**

* test(typography)：新增测试用例（@cc-hearts）[#115](https://github.com/antdv-next/antdv-next/pull/115)
* test(auto-complete)：补充单元测试并完善语义化 DOM（@ffgenius）[#119](https://github.com/antdv-next/antdv-next/pull/119)
* test(select)：补充单元测试并完善语义化 DOM（@ffgenius）[#121](https://github.com/antdv-next/antdv-next/pull/121)

**文档**

* docs：修复 Vite 使用章节中的拼写问题（@dzzzzzy）[#118](https://github.com/antdv-next/antdv-next/pull/118)
* fix(docs)：修复 i18n 章节中的文档错误（@dzzzzzy）[#120](https://github.com/antdv-next/antdv-next/pull/120)

**新贡献者**

* @qianYuanJ 首次贡献（[#109](https://github.com/antdv-next/antdv-next/pull/109)）
* @yushi0114 首次贡献（[#111](https://github.com/antdv-next/antdv-next/pull/111)）
* @dzzzzzy 首次贡献（[#118](https://github.com/antdv-next/antdv-next/pull/118)）

**完整更新记录**
[https://github.com/antdv-next/antdv-next/compare/antdv-next@1.0.1...antdv-next@1.0.2](https://github.com/antdv-next/antdv-next/compare/antdv-next@1.0.1...antdv-next@1.0.2)

## V1.0.0 - 2026-02-03

- 同步更新至 Ant Design v6.2.2版本
- 修复若干已知问题，提升组件稳定性
- 替换`classNames` -> `classes`
- 优化`Select.Option`使用`options`代替，对于相关Select类型的组件都做了相同的优化处理
- 优化`Checkbox.Group`使用`options`代替
- 优化`Radio.Group`使用`options`代替
- 更多参考[升级指南](/docs/vue/migration-antdv-next)
