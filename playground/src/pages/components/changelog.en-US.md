---
title: Component Changelog
---

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
