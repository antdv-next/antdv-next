---
title: 组件更新日志
---

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
