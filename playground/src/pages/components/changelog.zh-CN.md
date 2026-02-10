---
title: 组件更新日志
---

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
