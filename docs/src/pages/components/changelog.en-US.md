---
title: Component Changelog
---

## V1.2.1

Release Date: 2026-04-20

This release focuses on **fixing interaction and rendering issues across Drawer, Transfer, Affix, layer-mode icon colors, and static method locale support**, while also **improving the docs site, syncing Transfer examples and migration docs, and adding related links together with updated test snapshots**.

**🐞 Fixes**

* fix(drawer): fix `afterOpenChange` being triggered twice during initial mount by @selicens in [#466](https://github.com/antdv-next/antdv-next/pull/466)
* fix(Transfer): fix the Transfer default slot rendering empty content when used on a node without a specified `direction` by @jiangrong-devops in [#471](https://github.com/antdv-next/antdv-next/pull/471)
* fix(drawer): preserve Esc-to-close behavior when `getContainer` is `false` by @ffgenius in [#470](https://github.com/antdv-next/antdv-next/pull/470)
* fix(affix): use content height for the placeholder to fix incorrect placeholder sizing by @william-xue in [#478](https://github.com/antdv-next/antdv-next/pull/478)
* fix: fix layer-mode icon colors not taking effect and static methods not supporting locale by @aibayanyu20 in [#481](https://github.com/antdv-next/antdv-next/pull/481)

**📝 Documentation**

* docs: optimize the docs site by @selicens in [#467](https://github.com/antdv-next/antdv-next/pull/467)
* docs(Transfer): sync the antd Transfer component example docs by @jiangrong-devops in [#476](https://github.com/antdv-next/antdv-next/pull/476)
* docs: update the `migration-antdv-next` docs by @think-gem in [#474](https://github.com/antdv-next/antdv-next/pull/474)
* docs: revert the migration docs update by @selicens in [#480](https://github.com/antdv-next/antdv-next/pull/480)
* docs: add related links by @aibayanyu20 in [#486](https://github.com/antdv-next/antdv-next/pull/486)

**🛠 Refactor & Maintenance**

* test(image): update snapshots for the `alt` attribute fix by @cc-hearts in [#479](https://github.com/antdv-next/antdv-next/pull/479)

---

**👏 New Contributors**

Thanks to the following contributor for their first contribution:

* @think-gem in [#474](https://github.com/antdv-next/antdv-next/pull/474)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.2.0...antdv-next@1.2.1

## V1.2.0

Release Date: 2026-04-15

This release focuses on **exposing missing Select instance methods, syncing the latest antd-related implementation, and fixing type, layout, and interaction issues across Breadcrumb, Space, Tree, Upload, and ConfigProvider**, while also **improving the Spin migration docs, icon/message doc copy, the LLMs docs generation workflow, and static asset maintenance**.

**✨ Features**

* feat(select): expose `blur`, `focus`, and `scrollTo` methods by @selicens in [#448](https://github.com/antdv-next/antdv-next/pull/448)
* feat: sync antd by @aibayanyu20 in [#460](https://github.com/antdv-next/antdv-next/pull/460)

**🐞 Fixes**

* fix: fix Breadcrumb slot typing by @aibayanyu20 in [#447](https://github.com/antdv-next/antdv-next/pull/447)
* fix(space): prevent `Space.Addon` content from wrapping by @selicens in [#452](https://github.com/antdv-next/antdv-next/pull/452)
* fix(Tree): fix checkbox alignment when the parent node content spans multiple lines in Tree by @jiangrong-devops in [#431](https://github.com/antdv-next/antdv-next/pull/431)
* fix: fix Upload link navigation and update dependencies by @aibayanyu20 in [#453](https://github.com/antdv-next/antdv-next/pull/453)
* fix: fix Select `getPopupContainer` from ConfigProvider not taking effect by @aibayanyu20 in [#456](https://github.com/antdv-next/antdv-next/pull/456)
* fix: fix ConfigProvider extended props not taking effect by @aibayanyu20 in [#459](https://github.com/antdv-next/antdv-next/pull/459)

**📝 Documentation**

* perf(docs): improve the LLMs docs generation workflow path by @cc-hearts in [#444](https://github.com/antdv-next/antdv-next/pull/444)
* docs(spin): add Description API and migration docs by @selicens in [#449](https://github.com/antdv-next/antdv-next/pull/449)
* fix: fix icon and message display copy in docs by @cc-hearts in [#454](https://github.com/antdv-next/antdv-next/pull/454)
* fix: correct a zh-CN typo in the Timeline docs by @jasonren0403 in [#457](https://github.com/antdv-next/antdv-next/pull/457)

**🛠 Refactor & Maintenance**

* chore(image): update image source paths by @selicens in [#445](https://github.com/antdv-next/antdv-next/pull/445)

---

**👏 New Contributors**

Thanks to the following contributor for their first contribution:

* @jasonren0403 in [#457](https://github.com/antdv-next/antdv-next/pull/457)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.9...antdv-next@1.2.0


## V1.1.9

This release focuses on **fixing class duplication, missing styles, and form label behavior across Tabs, Menu, FormItem, and Image**, while also **improving style completeness in SSR rendering scenarios and optimizing type performance**.

**🐞 Fixes**

* fix(tabs): fix duplicated class names by @selicens in [#435](https://github.com/antdv-next/antdv-next/pull/435)
* fix: fix missing Menu styles in SSR rendering mode by @aibayanyu20 in [#437](https://github.com/antdv-next/antdv-next/pull/437)
* fix: fix FormItem label not taking effect by @aibayanyu20 in [#441](https://github.com/antdv-next/antdv-next/pull/441)

**🛠 Refactor & Maintenance**

* chore(image): update image source paths by @selicens in [#436](https://github.com/antdv-next/antdv-next/pull/436)
* perf: optimize type performance by @aibayanyu20 in [#442](https://github.com/antdv-next/antdv-next/pull/442)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.8...antdv-next@1.1.9


## V1.1.8

This release focuses on **fixing IME input handling, style/class passthrough, and touch interactions across Input, ConfigProvider, Image, and TimePicker**, while also **improving docs layout, Tabs examples, release announcement content, and GitHub edit links**. It also introduces the initial Pro project setup and adds Claude Code collaboration guidance together with related CI workflows.

**✨ Features**

* feat: initialize the Pro project by @aibayanyu20 in [#422](https://github.com/antdv-next/antdv-next/pull/422)

**🐞 Fixes**

* fix(input): add an IME composition guard for Input and support the `changeOnComposing` prop by @shiqkuangsan in [#417](https://github.com/antdv-next/antdv-next/pull/417)
* fix: fix `style` and `class` passthrough in ConfigProvider by @aibayanyu20 in [#420](https://github.com/antdv-next/antdv-next/pull/420)
* fix(image): fix abnormal button styles in the image preview footer by @selicens in [#430](https://github.com/antdv-next/antdv-next/pull/430)
* fix: fix TimePicker columns not scrolling on touch devices by @aibayanyu20 in [#433](https://github.com/antdv-next/antdv-next/pull/433)

**📝 Documentation**

* docs(tabs): update the draggable Tabs documentation example by @jiangrong-devops in [#412](https://github.com/antdv-next/antdv-next/pull/412)
* docs(blog): optimize the release announcement content and English translation by @TAYUN in [#413](https://github.com/antdv-next/antdv-next/pull/413)
* fix(docs): correct the GitHub edit path in the documentation by @lonewolfyx in [#415](https://github.com/antdv-next/antdv-next/pull/415)
* fix(docs): fix left alignment in the documentation layout by @ouyang108 in [#425](https://github.com/antdv-next/antdv-next/pull/425)
* fix(docs): align dark theme tokens and background styles for the docs sider menu by @ffgenius in [#428](https://github.com/antdv-next/antdv-next/pull/428)

**🛠 Refactor & Maintenance**

* chore: update dependencies by @aibayanyu20 in [#416](https://github.com/antdv-next/antdv-next/pull/416)
* chore: add `CLAUDE.md` for Claude Code collaboration guidance by @shiqkuangsan in [#418](https://github.com/antdv-next/antdv-next/pull/418)
* ci: add Claude Code workflows by @shiqkuangsan in [#419](https://github.com/antdv-next/antdv-next/pull/419)

---

**👏 New Contributors**

Thanks to the following contributors for their first contributions:

* @lonewolfyx in [#415](https://github.com/antdv-next/antdv-next/pull/415)
* @TAYUN in [#413](https://github.com/antdv-next/antdv-next/pull/413)
* @ouyang108 in [#425](https://github.com/antdv-next/antdv-next/pull/425)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.7...antdv-next@1.1.8


## V1.1.7

This release focuses on **fixing rendering, styling, and interaction details across cssinjs, Tree, Transfer, Image, Table, and Menu**, while also **improving mobile responsiveness in the docs site, icon search interaction, and several documentation descriptions and repository links**. It also syncs part of the behavior with antd 6.3.4.

**🐞 Fixes**

* fix(cssinjs): fix cssinjs render delay and sync related cssinjs implementation by @aibayanyu20 in [#403](https://github.com/antdv-next/antdv-next/pull/403)
* fix: fix invalid i18n for icon category titles by @selicens in [#404](https://github.com/antdv-next/antdv-next/pull/404)
* fix(popconfirm): fix invalid padding in the `style-class` demo container by @selicens in [#405](https://github.com/antdv-next/antdv-next/pull/405)
* fix(Tree): sync antd 6.3.4 and correct the custom `switcherIcon` class when `showLine` is enabled by @selicens in [#407](https://github.com/antdv-next/antdv-next/pull/407)
* fix(transfer): sync antd 6.3.4 and handle non-string `render` results when rendering items by @selicens in [#408](https://github.com/antdv-next/antdv-next/pull/408)
* fix: sync antd 6.3.4 and apply custom hover color to SubMenu parent items by @selicens in [#409](https://github.com/antdv-next/antdv-next/pull/409)
* fix(image): sync antd 6.3.4 and support `fetchPriority` prop passthrough by @selicens in [#410](https://github.com/antdv-next/antdv-next/pull/410)
* fix(table): fix controlled Popover in column titles being rendered twice when scroll is enabled by @aibayanyu20 in [#411](https://github.com/antdv-next/antdv-next/pull/411)

**📝 Documentation**

* docs: update key descriptions from React to Vue and add column key notes by @jiangrong-devops in [#399](https://github.com/antdv-next/antdv-next/pull/399)
* feat(docs): add mobile responsive adaptation for the docs site by @william-xue in [#400](https://github.com/antdv-next/antdv-next/pull/400)
* docs(icon): scroll to the icon list after searching by @z-kunf in [#401](https://github.com/antdv-next/antdv-next/pull/401)
* docs: update the documentation repository URL by @ayangweb in [#406](https://github.com/antdv-next/antdv-next/pull/406)

---

**👏 New Contributors**

Thanks to the following contributors for their first contributions:

* @william-xue in [#400](https://github.com/antdv-next/antdv-next/pull/400)
* @ayangweb in [#406](https://github.com/antdv-next/antdv-next/pull/406)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.6...antdv-next@1.1.7


## V1.1.6

This release focuses on **fixing styling and interaction details across Menu, Divider, and Image**, while also **improving the Modal docs, dark-mode contrast logic, and the theme preview experience**. It also adds dark-themed payment QR codes to the sponsor page to expand community support options.

**✨ Features**

* feat(sponsor): add darkingtail payment QR codes with dark-theme presentation by @darkingtail in [#395](https://github.com/antdv-next/antdv-next/pull/395)
* feat(preview-theme): use `antdv-style` for theme preview and support copying theme code by @ffgenius in [#397](https://github.com/antdv-next/antdv-next/pull/397)

**🐞 Fixes**

* fix(menu): align collapsed icons when using custom `collapsedIconSize` by @wxfengg in [#385](https://github.com/antdv-next/antdv-next/pull/385)
* fix: fix focus trap by @aibayanyu20 in [#389](https://github.com/antdv-next/antdv-next/pull/389)
* fix(divider): fix `class` attrs not being applied correctly when passed through attrs by @cc-hearts in [#394](https://github.com/antdv-next/antdv-next/pull/394)
* fix: fix initial Menu highlight state by @aibayanyu20 in [#396](https://github.com/antdv-next/antdv-next/pull/396)
* fix(image): fix mask blur behavior when `mask` is `true` by @448847482 in [#398](https://github.com/antdv-next/antdv-next/pull/398)

**📝 Documentation**

* docs: fix missing Modal documentation parameters by @jauqasx in [#388](https://github.com/antdv-next/antdv-next/pull/388)
* fix(docs): refine theme picker contrast logic for dark mode by @wxfengg in [#392](https://github.com/antdv-next/antdv-next/pull/392)

---

**👏 New Contributors**

Thanks to the following contributors for their first contributions:

* @wxfengg in [#385](https://github.com/antdv-next/antdv-next/pull/385)
* @448847482 in [#398](https://github.com/antdv-next/antdv-next/pull/398)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.5...antdv-next@1.1.6


## V1.1.5

This release focuses on **fixing rendering, styling, and interaction issues across Select, Layout, Grid, Form, and Image**, while also **improving local Playground debugging and expanding documentation content**. It also adds a WeChat official account QR code entry and includes documentation description updates together with a dynamic placeholder fix.

**✨ Features**

* feat(playground): add `VC_LOCAL` mode for local `@v-c/*` package debugging by @shiqkuangsan in [#371](https://github.com/antdv-next/antdv-next/pull/371)
* feat: add WeChat official account QR code by @selicens in [#380](https://github.com/antdv-next/antdv-next/pull/380)

**🐞 Fixes**

* fix: fix Select render error by @aibayanyu20 in [#370](https://github.com/antdv-next/antdv-next/pull/370)
* fix(style): improve Link `focus-visible` outline for accessibility by @darkingtail in [#376](https://github.com/antdv-next/antdv-next/pull/376)
* fix(grid): add `xxxl` breakpoint to media size mapping by @darkingtail in [#378](https://github.com/antdv-next/antdv-next/pull/378)
* fix(form): remove hardcoded SimSun font from required mark by @darkingtail in [#377](https://github.com/antdv-next/antdv-next/pull/377)
* fix(image): improve preview mask blur transition and movable cursor styles by @darkingtail in [#375](https://github.com/antdv-next/antdv-next/pull/375)
* fix: fix duplicate Layout class application by @aibayanyu20 in [#379](https://github.com/antdv-next/antdv-next/pull/379)
* fix: fix dynamic placeholder by @Rascal-Coder in [#383](https://github.com/antdv-next/antdv-next/pull/383)

**📝 Documentation**

* docs(table): document Table props performance notes by @cc-hearts in [#373](https://github.com/antdv-next/antdv-next/pull/373)
* docs: sync and fix index page descriptions (zh-CN & en-US) by @jauqasx in [#374](https://github.com/antdv-next/antdv-next/pull/374)

---

**👏 New Contributors**

Thanks to the following contributor for their first contribution:

* @jauqasx in [#374](https://github.com/antdv-next/antdv-next/pull/374)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.4...antdv-next@1.1.5


## V1.1.4

This release focuses on **adding SFC usage examples for Menu and Collapse together with a theme editor integration**, **fixing interaction and style issues in Input.Search and TreeSelect**, and **improving SSR performance while upgrading parts of the tooling stack**. It also includes several documentation rendering and compatibility fixes.

**✨ Features**

* feat(editor): use antd theme editor by @ffgenius in [#365](https://github.com/antdv-next/antdv-next/pull/365)
* feat: add SFC usage for Menu and Collapse by @aibayanyu20 in [#366](https://github.com/antdv-next/antdv-next/pull/366)

**🐞 Fixes**

* fix: fix TreeSelect hover style by @aibayanyu20 in [#362](https://github.com/antdv-next/antdv-next/pull/362)
* fix: fix Input.Search triggering the clear event twice by @aibayanyu20 in [#361](https://github.com/antdv-next/antdv-next/pull/361)

**📝 Documentation**

* docs(input): supplement `clearIcon` slot docs by @selicens in [#355](https://github.com/antdv-next/antdv-next/pull/355)
* docs: fix compatibility notes for lower Chrome versions by @aibayanyu20 in [#357](https://github.com/antdv-next/antdv-next/pull/357)
* docs(table): fix Table docs render error by @cc-hearts in [#363](https://github.com/antdv-next/antdv-next/pull/363)
* docs(drawer/tabs/time-picker/upload): fix render errors in related docs by @cc-hearts in [#364](https://github.com/antdv-next/antdv-next/pull/364)
* docs: fix and update documentation content by @aibayanyu20 in [#367](https://github.com/antdv-next/antdv-next/pull/367)

**🛠 Refactor & Maintenance**

* perf: improve SSR performance by @aibayanyu20 in [#356](https://github.com/antdv-next/antdv-next/pull/356)
* chore: bump Vite version and update dependencies by @cc-hearts in [#359](https://github.com/antdv-next/antdv-next/pull/359)
* chore: bump Vitest version by @cc-hearts in [#360](https://github.com/antdv-next/antdv-next/pull/360)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.3...antdv-next@1.1.4


## V1.1.3

This release focuses on **fixing behavior issues in Select, Form, InputNumber, and Splitter**, while also **syncing Timeline details with antd 6.3.2**. It also improves the docs site with a direct entry to open demos in Playground for easier debugging and inspection.

**✨ Features**

* feat: sync Timeline `showLine` alignment with custom `titleHeight` from antd 6.3.2 by @selicens in [#346](https://github.com/antdv-next/antdv-next/pull/346)

**🐞 Fixes**

* fix: fix Select abnormal value handling by @aibayanyu20 in [#340](https://github.com/antdv-next/antdv-next/pull/340)
* fix: fix Select class parsing in DOM attributes by @aibayanyu20 in [#343](https://github.com/antdv-next/antdv-next/pull/343)
* fix(splitter): fix incorrect size calculation when partially controlled by @darkingtail in [#347](https://github.com/antdv-next/antdv-next/pull/347)
* fix: fix InputNumber cursor restore not taking effect in `format` scenarios by @aibayanyu20 in [#352](https://github.com/antdv-next/antdv-next/pull/352)
* fix: fix Form `rules.validateTrigger` errors and support the new `tel` rule by @aibayanyu20 in [#350](https://github.com/antdv-next/antdv-next/pull/350)

**📝 Documentation**

* docs: add an entry to open demos in Playground from the docs site by @aibayanyu20 in [#339](https://github.com/antdv-next/antdv-next/pull/339)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.1...antdv-next@1.1.3


## V1.1.1

This release focuses on **improving API parity with Ant Design**, **expanding slot/SFC support for more components**, and **fixing behavior issues across Modal, Menu, Tree, Slider, Switch, Skeleton, and more**. It also adds broader unit test coverage and updates the documentation site.

**✨ Features**

* feat: support SFC item components for Timeline / Descriptions / Breadcrumb, and enhance Menu slot rendering with docs/tests by @aibayanyu20 in [#295](https://github.com/antdv-next/antdv-next/pull/295)
* feat: Form.Item now supports `tooltip` / `help` / `label` / `extra` slots by @aibayanyu20 in [#301](https://github.com/antdv-next/antdv-next/pull/301)
* feat: add `MaskType` by @mengxianghan in [#318](https://github.com/antdv-next/antdv-next/pull/318)
* feat: sync Progress and theme preview behavior with antd by @han1548772930 in [#329](https://github.com/antdv-next/antdv-next/pull/329)
* feat: sync `sizeType` by @aibayanyu20 in [#338](https://github.com/antdv-next/antdv-next/pull/338)

**🐞 Fixes**

* fix(tour): preserve step-level semantic classes in `panelRender` by @shiqkuangsan in [#291](https://github.com/antdv-next/antdv-next/pull/291)
* fix(slider): correct `tabindex` prop name to `tabIndex` by @shiqkuangsan in [#296](https://github.com/antdv-next/antdv-next/pull/296)
* fix: validate Message uses label correctly by @Rascal-Coder in [#305](https://github.com/antdv-next/antdv-next/pull/305)
* fix: fix Menu keyPath order being reversed by @aibayanyu20 in [#311](https://github.com/antdv-next/antdv-next/pull/311)
* fix(modal): fix default blur mode not taking effect and update related description by @mengxianghan in [#314](https://github.com/antdv-next/antdv-next/pull/314)
* fix: fix Tooltip icon rendering by @aibayanyu20 in [#313](https://github.com/antdv-next/antdv-next/pull/313)
* fix(modal): add `KeyboardEvent` support to `onCancel` type by @utianhuan666 in [#324](https://github.com/antdv-next/antdv-next/pull/324)
* fix: fix Form.Item ref inheritance by @aibayanyu20 in [#325](https://github.com/antdv-next/antdv-next/pull/325)
* fix: fix Switch controlled mode by @aibayanyu20 in [#328](https://github.com/antdv-next/antdv-next/pull/328)
* fix: fix Tree `checkedKeys` object handling by @aibayanyu20 in [#333](https://github.com/antdv-next/antdv-next/pull/333)
* fix: fix Segmented motion by @aibayanyu20 in [#334](https://github.com/antdv-next/antdv-next/pull/334)
* fix: fix Skeleton size not taking effect by @aibayanyu20 in [#337](https://github.com/antdv-next/antdv-next/pull/337)

**🧪 Tests**

This release adds unit tests for Tabs, Tour, ColorPicker, cssinjs, Slider, Table, Image, FloatButton, and TimePicker.

* test(tabs): add unit tests by @shiqkuangsan in [#290](https://github.com/antdv-next/antdv-next/pull/290)
* test: add ColorPicker unit tests and cssinjs unit tests by @aibayanyu20 in [#292](https://github.com/antdv-next/antdv-next/pull/292)
* test(tour): add unit tests by @shiqkuangsan in [#294](https://github.com/antdv-next/antdv-next/pull/294)
* test(slider): add unit tests by @shiqkuangsan in [#298](https://github.com/antdv-next/antdv-next/pull/298)
* test(table): add unit tests by @shiqkuangsan in [#302](https://github.com/antdv-next/antdv-next/pull/302)
* test(image): add unit tests by @darkingtail in [#307](https://github.com/antdv-next/antdv-next/pull/307)
* test(float-button): add unit tests by @darkingtail in [#306](https://github.com/antdv-next/antdv-next/pull/306)
* test(time-picker): add unit tests by @shiqkuangsan in [#308](https://github.com/antdv-next/antdv-next/pull/308)

**📝 Documentation**

* docs: add SEO performance improvements by @aibayanyu20 in [#293](https://github.com/antdv-next/antdv-next/pull/293)
* docs(covers): correct the QRCode property name to `QrCode` (camel case) by @utianhuan666 in [#299](https://github.com/antdv-next/antdv-next/pull/299)
* docs: update docs and LLM script by @aibayanyu20 in [#322](https://github.com/antdv-next/antdv-next/pull/322)
* docs(table): add column documentation by @cc-hearts in [#336](https://github.com/antdv-next/antdv-next/pull/336)

**🛠 Refactor & Maintenance**

* chore(cascader): bump version by @cc-hearts in [#304](https://github.com/antdv-next/antdv-next/pull/304)
* fix: remove duplicate `initMotionCommonLeave` function by @utianhuan666 in [#323](https://github.com/antdv-next/antdv-next/pull/323)
* fix(deps): bump `@v-c/select` to `^1.0.17` by @shiqkuangsan in [#326](https://github.com/antdv-next/antdv-next/pull/326)

---

**👏 New Contributors**

Thanks to the following contributor for their first contribution:

* @mengxianghan in [#314](https://github.com/antdv-next/antdv-next/pull/314)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.1.0...antdv-next@1.1.1


## V1.1.0

This release focuses on **syncing with antd v6.3.1**, **fixing component behavior and accessibility issues**, and **expanding unit test coverage** across more components. It also includes documentation updates, CI/script maintenance, and sponsor/readme improvements.

**✨ Features**

* feat(sponsor): optimize the style of the custom amount input box by @ffgenius in [#250](https://github.com/antdv-next/antdv-next/pull/250)
* feat: sync antd 6.3.1 by @ffgenius in [#269](https://github.com/antdv-next/antdv-next/pull/269)
* feat(readme): change contributor image to Open Collective link by @ffgenius in [#274](https://github.com/antdv-next/antdv-next/pull/274)
* feat: perf prop types by @aibayanyu20 in [#278](https://github.com/antdv-next/antdv-next/pull/278)

**🐞 Fixes**

* fix(cascader): add missing deprecated warning for `popupClassName` by @darkingtail in [#242](https://github.com/antdv-next/antdv-next/pull/242)
* fix(collapse): use `prefixCls.value` in CollapsePanel no-arrow class by @shiqkuangsan in [#244](https://github.com/antdv-next/antdv-next/pull/244)
* fix: fix form directive not effect & add test unit by @aibayanyu20 in [#243](https://github.com/antdv-next/antdv-next/pull/243)
* fix(tree): relax `treeData` type to accept custom data nodes by @darkingtail in [#260](https://github.com/antdv-next/antdv-next/pull/260)
* fix(pagination): fix change event trigger by @cc-hearts in [#265](https://github.com/antdv-next/antdv-next/pull/265)
* fix(image): cover slot not rendered when preview mask is configured by @shiqkuangsan in [#272](https://github.com/antdv-next/antdv-next/pull/272)
* fix(skeleton): synchronise the DOM element styles of Skeleton by @utianhuan666 in [#258](https://github.com/antdv-next/antdv-next/pull/258)
* fix(checkbox): support controlled state for checkbox by @cc-hearts in [#275](https://github.com/antdv-next/antdv-next/pull/275)
* fix(notification): correct expose key mismatch for `classNames` by @shiqkuangsan in [#279](https://github.com/antdv-next/antdv-next/pull/279)
* fix(a11y): apply `prefers-reduced-motion` to Radio and Segmented by @darkingtail in [#281](https://github.com/antdv-next/antdv-next/pull/281)
* fix(auto-complete): fix default display of custom input placeholder by @cc-hearts in [#283](https://github.com/antdv-next/antdv-next/pull/283)
* fix(tabs): fix dead onPrevClick/onNextClick deprecation warning by @shiqkuangsan in [#287](https://github.com/antdv-next/antdv-next/pull/287)
* fix(tabs): fix `renderTabBar` prop variable shadowing by @shiqkuangsan in [#286](https://github.com/antdv-next/antdv-next/pull/286)
* fix: fix slick height by @aibayanyu20 in [#288](https://github.com/antdv-next/antdv-next/pull/288)
* fix: fix table loading & no data empty state by @aibayanyu20 in [#289](https://github.com/antdv-next/antdv-next/pull/289)

**🧪 Tests**

This release adds unit tests for DatePicker, Progress, Collapse, Popconfirm, Drawer, Message, Dropdown, Mentions, and Notification.

* test(date-picker): add unit test by @aibayanyu20 in [#233](https://github.com/antdv-next/antdv-next/pull/233)
* test(progress): add unit tests for Progress component by @darkingtail in [#246](https://github.com/antdv-next/antdv-next/pull/246)
* test(collapse): add unit tests for Collapse component by @shiqkuangsan in [#247](https://github.com/antdv-next/antdv-next/pull/247)
* test(popconfirm): add unit tests for Popconfirm component by @darkingtail in [#248](https://github.com/antdv-next/antdv-next/pull/248)
* test(drawer): add unit tests for Drawer component by @darkingtail in [#252](https://github.com/antdv-next/antdv-next/pull/252)
* test(message): add unit tests for Message component by @darkingtail in [#263](https://github.com/antdv-next/antdv-next/pull/263)
* test(dropdown): add unit tests for Dropdown component by @shiqkuangsan in [#266](https://github.com/antdv-next/antdv-next/pull/266)
* test(mentions): add unit tests for Mentions component by @shiqkuangsan in [#270](https://github.com/antdv-next/antdv-next/pull/270)
* test(notification): add unit tests for Notification component by @shiqkuangsan in [#284](https://github.com/antdv-next/antdv-next/pull/284)

**📝 Documentation**

* fix(docs): adjust scrollbar width styling for modal lock by @han1548772930 in [#245](https://github.com/antdv-next/antdv-next/pull/245)
* docs: add examples for browser import by @selicens in [#255](https://github.com/antdv-next/antdv-next/pull/255)
* docs(typography): fix formatting of `enterIcon` prop description by @wujighostking in [#262](https://github.com/antdv-next/antdv-next/pull/262)
* docs(cascader): supplement semantic DOM and add unit tests by @ffgenius in [#261](https://github.com/antdv-next/antdv-next/pull/261)
* chore(docs): add sponsor qrcode for shiqkuangsan by @shiqkuangsan in [#271](https://github.com/antdv-next/antdv-next/pull/271)

**🛠 Refactor & Maintenance**

* ci: change docs scripts generate by @aibayanyu20 in [#249](https://github.com/antdv-next/antdv-next/pull/249)
* chore(select/image/util): bump version by @cc-hearts in [#277](https://github.com/antdv-next/antdv-next/pull/277)

---

**👏 New Contributors**

Thanks to the following contributors for their first contributions:

* @han1548772930 in [#245](https://github.com/antdv-next/antdv-next/pull/245)
* @utianhuan666 in [#258](https://github.com/antdv-next/antdv-next/pull/258)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.0.5...antdv-next@1.1.0


## V1.0.5

This release focuses on **fixing component interaction and data flow issues**, while also **expanding unit test coverage** for more components. It includes fixes for Tooltip, DatePicker, Autocomplete, Select, Descriptions, and app-level class/style handling.

**🐞 Fixes**

* fix: passive clear of `v-model` value not working by @aibayanyu20 in [#228](https://github.com/antdv-next/antdv-next/pull/228)
* fix(tooltip): fix incorrect position calculation when arrow is displayed by @cc-hearts in [#231](https://github.com/antdv-next/antdv-next/pull/231)
* fix: improve two-way binding and one-way data flow handling by @aibayanyu20 in [#230](https://github.com/antdv-next/antdv-next/pull/230)
* fix: fix app class & style ref deconstruction by @aibayanyu20 in [#232](https://github.com/antdv-next/antdv-next/pull/232)
* fix: Autocomplete input clears automatically when pressing Enter by @aibayanyu20 in [#234](https://github.com/antdv-next/antdv-next/pull/234)
* fix(descriptions): render `id` prop on root element by @shiqkuangsan in [#236](https://github.com/antdv-next/antdv-next/pull/236)
* fix: DatePicker manual clear not working by @aibayanyu20 in [#237](https://github.com/antdv-next/antdv-next/pull/237)
* fix: fix Select `showSearchConfig` by @aibayanyu20 in [#240](https://github.com/antdv-next/antdv-next/pull/240)

**🧪 Tests**

This release adds unit tests for Splitter, Steps, and Popover to improve regression protection.

* test(splitter): add unit test by @cc-hearts in [#227](https://github.com/antdv-next/antdv-next/pull/227)
* test(steps): add unit tests by @z-kunf in [#222](https://github.com/antdv-next/antdv-next/pull/222)
* test(popover): add unit tests for Popover component by @shiqkuangsan in [#239](https://github.com/antdv-next/antdv-next/pull/239)

---

**👏 New Contributors**

Thanks to the following contributors for their first contributions:

* @z-kunf in [#222](https://github.com/antdv-next/antdv-next/pull/222)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.0.4...antdv-next@1.0.5


## V1.0.4

This release focuses on **expanding unit test coverage**, **fixing component behavior issues**, and **improving docs/playground tooling**. It also includes style sync updates, project structure refinements, and **improved Nuxt compatibility**.

**✨ Features**

* feat: add ts & js code source by @cc-hearts in [#187](https://github.com/antdv-next/antdv-next/pull/187)
* feat(playground): add playground for debugging by @cc-hearts in [#192](https://github.com/antdv-next/antdv-next/pull/192)
* feat: sync antd style by @aibayanyu20 in [#223](https://github.com/antdv-next/antdv-next/pull/223)
* Nuxt compatibility improvements (cssinjs priority / order attr fix) by @aibayanyu20 in [#217](https://github.com/antdv-next/antdv-next/pull/217)

**🐞 Fixes**

* fix(colorPicker): `arrow` is invalid by @ffgenius in [#182](https://github.com/antdv-next/antdv-next/pull/182)
* fix: resolve `verify-commit.js` failure in git worktrees by @shiqkuangsan in [#193](https://github.com/antdv-next/antdv-next/pull/193)
* fix(config-provider): add missing masonry config to `PASSED_PROPS` by @shiqkuangsan in [#198](https://github.com/antdv-next/antdv-next/pull/198)
* fix(tabs): unresponsive `content` and slot `content` behavior by @ming4762 in [#197](https://github.com/antdv-next/antdv-next/pull/197)
* fix: update `demoTest` path after playground restructure by @shiqkuangsan in [#201](https://github.com/antdv-next/antdv-next/pull/201)
* fix(calendar): use correct `Dayjs` type and `v-model:value` in select demo by @shiqkuangsan in [#202](https://github.com/antdv-next/antdv-next/pull/202)
* fix: fix select hover range by @aibayanyu20 in [#207](https://github.com/antdv-next/antdv-next/pull/207)
* fix(card): emit `update:activeTabKey` and add unit tests by @darkingtail in [#213](https://github.com/antdv-next/antdv-next/pull/213)
* fix(tree-select): avoid duplicate event transmission by @ming4762 in [#210](https://github.com/antdv-next/antdv-next/pull/210)

**🧪 Tests**

This release adds and expands unit tests for multiple components, improving overall test coverage and regression protection.

* test(skeleton): add unit tests by @shiqkuangsan in [#183](https://github.com/antdv-next/antdv-next/pull/183)
* test(typography): add wrapper and semantic tests by @shiqkuangsan in [#194](https://github.com/antdv-next/antdv-next/pull/194)
* test(statistic): add unit tests by @shiqkuangsan in [#191](https://github.com/antdv-next/antdv-next/pull/191)
* test(spin): add unit tests by @shiqkuangsan in [#189](https://github.com/antdv-next/antdv-next/pull/189)
* test(tag): add unit tests by @shiqkuangsan in [#190](https://github.com/antdv-next/antdv-next/pull/190)
* test(masonry): add unit tests by @shiqkuangsan in [#204](https://github.com/antdv-next/antdv-next/pull/204)
* test(timeline): add unit tests by @shiqkuangsan in [#205](https://github.com/antdv-next/antdv-next/pull/205)
* test(tooltip): add tooltip unit test by @cc-hearts in [#211](https://github.com/antdv-next/antdv-next/pull/211)
* test(checkbox): add unit tests for Checkbox and CheckboxGroup by @darkingtail in [#216](https://github.com/antdv-next/antdv-next/pull/216)
* test(cascader): add unit tests for Cascader and CascaderPanel by @darkingtail in [#215](https://github.com/antdv-next/antdv-next/pull/215)
* test(carousel): add unit tests for Carousel by @darkingtail in [#214](https://github.com/antdv-next/antdv-next/pull/214)
* test(grid): add unit tests for Row and Col components by @shiqkuangsan in [#218](https://github.com/antdv-next/antdv-next/pull/218)
* test(radio): add unit tests for Radio, RadioGroup, RadioButton by @shiqkuangsan in [#219](https://github.com/antdv-next/antdv-next/pull/219)
* test(descriptions): add unit tests for Descriptions component by @shiqkuangsan in [#220](https://github.com/antdv-next/antdv-next/pull/220)

**📝 Documentation**

* docs: support layer mode by @aibayanyu20 in [#186](https://github.com/antdv-next/antdv-next/pull/186)
* docs: support sponsor by @aibayanyu20 in [#208](https://github.com/antdv-next/antdv-next/pull/208)

**🛠 Refactor & Maintenance**

* refactor: optimize project structure by @ffgenius in [#195](https://github.com/antdv-next/antdv-next/pull/195)

---

**👏 New Contributors**

Thanks to the following contributors for their first contributions:

* @ming4762 in [#197](https://github.com/antdv-next/antdv-next/pull/197)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.0.3...antdv-next@1.0.4


## V1.0.3

This release mainly focuses on **improving test coverage, fixing documentation issues, and enhancing overall stability**. It also syncs with antd v6.3.0 and includes performance optimizations for css-in-js.

**✨ Features**

* Sync with **antd v6.3.0** and optimize css-in-js performance (#163)
* SSR support, and add `valueFormat` support for ColorPicker / TimePicker / DatePicker (#177)
* Sync Skeleton component (#171)
* Documentation site now supports custom themes (#166, #178)
* Add unit tests for Avatar and AvatarGroup (#126)

**🐞 Fixes**

* Fix trigger not closing on click (#134)
* Fix hidden cancel button in info/success/warning modals (#167)
* Fix TreeSelect multi-checkbox style issues (#169)
* Fix progress animation overflow (#173)
* Fix inverted responsive collapse logic in Layout Sider (#158, #155)
* Fix eslint config type errors (#142)
* Fix incorrect variable reference (#180)

**🧪 Tests**

This release significantly expands component test coverage and semantic DOM tests, including:

Avatar, Badge, Breadcrumb, Button, Calendar, Divider, Empty, Flex, Input, InputNumber, Layout, QRCode, Rate, Result, Segmented, Space, Switch, Transfer, Tree, TreeSelect, and more.

Related PRs: #128, #130, #136, #137, #140, #143, #145, #147, #148, #151, #154, #156, #159, #160, #161, #162, #172, #175, #176

**📝 Documentation**

* Fix API documentation formatting issues for DatePicker, Select, Upload, Drawer, Image, Anchor, Pagination, and more
* Update breakpoint and collapse callback types in Layout documentation
* Fix Grid documentation syntax
* Fix FloatButton API examples
* Update Button documentation links

Related PRs: #131, #132, #133, #135, #138, #139, #144, #146, #150, #153, #164, #181

---

**👏 New Contributors**

Thanks to the following contributors for their first contributions:

* @Darkingtail
* @shiqkuangsan
* @wujighostking
* @rookie-orange

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.0.2...antdv-next@1.0.3


## V1.0.2 

**Features**

* feat: Sync with Ant Design v6.2.3 by @aibayanyu20 in [#102](https://github.com/antdv-next/antdv-next/pull/102)
* feat: Add `prepare` script by @qianYuanJ in [#109](https://github.com/antdv-next/antdv-next/pull/109)
* docs: Add global search by @aibayanyu20 in [#122](https://github.com/antdv-next/antdv-next/pull/122)

**Bug Fixes**

* fix(input-number): Resolve min/max responsiveness issue and remove console output by @selicens in [#104](https://github.com/antdv-next/antdv-next/pull/104)
* fix: Correct CSS variable calculation error by @ffgenius in [#107](https://github.com/antdv-next/antdv-next/pull/107)
* fix: Restore Vue Language Tools event hints by @aibayanyu20 in [#108](https://github.com/antdv-next/antdv-next/pull/108)
* fix: Fix RangePicker issues by @aibayanyu20 in [#112](https://github.com/antdv-next/antdv-next/pull/112)
* fix(popconfirm): Fix invalid async close behavior when using Promise by @selicens in [#114](https://github.com/antdv-next/antdv-next/pull/114)
* fix: Set default menu title to avoid `null` by @aibayanyu20 in [#125](https://github.com/antdv-next/antdv-next/pull/125)

**Refactor & Maintenance**

* refactor(i18n): Centralize i18n files by @ffgenius in [#116](https://github.com/antdv-next/antdv-next/pull/116)
* chore(i18n): Extract inline locales into centralized files by @ffgenius in [#124](https://github.com/antdv-next/antdv-next/pull/124)
* chore: Update documentation by @yushi0114 in [#111](https://github.com/antdv-next/antdv-next/pull/111)

**Tests**

* test(typography): Add tests by @cc-hearts in [#115](https://github.com/antdv-next/antdv-next/pull/115)
* test(auto-complete): Add unit tests and improve semantic DOM coverage by @ffgenius in [#119](https://github.com/antdv-next/antdv-next/pull/119)
* test(select): Add unit tests and improve semantic DOM coverage by @ffgenius in [#121](https://github.com/antdv-next/antdv-next/pull/121)

**Documentation**

* docs: Fix typo in the Vite usage section by @dzzzzzy in [#118](https://github.com/antdv-next/antdv-next/pull/118)
* fix(docs): Correct typo in the i18n chapter by @dzzzzzy in [#120](https://github.com/antdv-next/antdv-next/pull/120)

**New Contributors**

* @qianYuanJ made their first contribution in [#109](https://github.com/antdv-next/antdv-next/pull/109)
* @yushi0114 made their first contribution in [#111](https://github.com/antdv-next/antdv-next/pull/111)
* @dzzzzzy made their first contribution in [#118](https://github.com/antdv-next/antdv-next/pull/118)

**Full Changelog**
[https://github.com/antdv-next/antdv-next/compare/antdv-next@1.0.1...antdv-next@1.0.2](https://github.com/antdv-next/antdv-next/compare/antdv-next@1.0.1...antdv-next@1.0.2)



## V1.0.0 - 2026-02-03

- Synchronized update to Ant Design v6.2.2
- Fixed several known issues and improved component stability
- Replaced `classNames` → `classes`
- Optimized `Select.Option` to use `options` instead, with the same optimization applied to all Select-type components
- Optimized `Checkbox.Group` to use `options` instead
- Optimized `Radio.Group` to use `options` instead
- For more details, please refer to the [Migration Guide](/docs/vue/migration-antdv-next)
