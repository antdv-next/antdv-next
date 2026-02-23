---
title: Component Changelog
---

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
