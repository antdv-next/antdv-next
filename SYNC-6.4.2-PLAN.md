# antdv-next 同步 ant-design 6.4.2 升级计划

> Baseline: ant-design `6.3.7`（antdv-next 1.2.2 commit `ab040310 feat: sync antd@6.3.7`）
> Target:   ant-design `6.4.2`
> 工作分支: `feat/sync-642`（antdv-next）/ `feat/sync-642`（vue-components）

## 一、整体策略

1. **先 vue-components，再 antdv-next**。涉及到 rc 包升级的组件，先把 `@v-c/*` 升好版本，发布到 `next` channel；然后 antdv-next 端 `pnpm up @v-c/<pkg>@latest`。
2. 每个 vc 包独立 PR（命名 `feat(<pkg>): sync rc-<pkg>@<x.y.z>`），便于回滚和 review。
3. antdv-next 端按 changelog 项粒度拆 PR，便于追溯到上游 PR。

## 二、rc 依赖差异（6.3.7 → 6.4.2）

| ant-design rc 包 | 6.3.7 | 6.4.2 | vue-components 对应包 | 当前 vc 版本 | 行动 |
|---|---|---|---|---|---|
| @rc-component/notification | ~1.2.0 | ~2.0.6 | `notification` | 1.0.0 | **major 重构** |
| @rc-component/input | ~1.1.2 | ~1.3.0 | `input` | 1.0.3 | 升级 |
| @rc-component/mentions | ~1.6.0 | ~1.9.0 | `mentions` | 1.0.0 | 升级 |
| @rc-component/tabs | ~1.7.0 | ~1.9.0 | `tabs` | 1.0.2 | 升级 |
| @rc-component/tree | ~1.2.4 | ~1.3.1 | `tree` | 1.0.6 | 升级 |
| @rc-component/tree-select | ~1.8.0 | ~1.9.0 | `tree-select` | 1.0.3 | 升级 |
| @rc-component/menu | ~1.2.0 | ~1.3.0 | `menu` | 1.0.14 | 升级 |
| @rc-component/picker | ~1.9.1 | ~1.10.0 | `picker` | 1.0.4 | 升级 |
| @rc-component/table | ~1.9.1 | ~1.10.0 | `table` | 1.0.7 | 升级 |
| @rc-component/dialog | ~1.8.4 | ~1.9.0 | `dialog` | 1.0.3 | 升级 |
| @rc-component/cascader | ~1.14.0 | ~1.15.0 | `cascader` | 1.0.3 | 升级 |
| @rc-component/tour | ~2.3.0 | ~2.4.0 | `tour` | 1.0.3 | 升级 |
| @rc-component/textarea | ~1.1.2 | **删除** | `textarea` | 1.0.4 | 合并入 input |

## 三、PR 清单

### Phase 1 — vue-components 升级（按风险从低到高）

| 序号 | PR 标题 | 关联上游 PR | 风险 |
|---|---|---|---|
| vc-PR-01 | `feat(cascader): sync rc-cascader@1.15.0` | #56725, #57540 | 中 |
| vc-PR-02 | `feat(dialog): sync rc-dialog@1.9.0` | #57314 | 中 |
| vc-PR-03 | `feat(menu): sync rc-menu@1.3.0` | #57818, #57823 | 中 |
| vc-PR-04 | `feat(tour): sync rc-tour@2.4.0` | #57268 | 低 |
| vc-PR-05 | `feat(picker): sync rc-picker@1.10.0` | #57706, #57400 | 中 |
| vc-PR-06 | `feat(tree): sync rc-tree@1.3.1` | #57281, #57329 | 中 |
| vc-PR-07 | `feat(tree-select): sync rc-tree-select@1.9.0` | #57281, #57954 | 中 |
| vc-PR-08 | `feat(tabs): sync rc-tabs@1.9.0` | #57267 | 中 |
| vc-PR-09 | `feat(table): sync rc-table@1.10.0` | #57594 | 高 |
| vc-PR-10 | `feat(mentions): sync rc-mentions@1.9.0` | #57330, #57873 | 中 |
| vc-PR-11 | `feat(input): sync rc-input@1.3.0` + textarea 合并策略 | #57240, #57328, #57391, #57256, #57271 | 高 |
| vc-PR-12 | `feat(notification): sync rc-notification@2.0` (major) | #57824, #57821 | **最高** |

### Phase 2 — antdv-next 升级

#### A. 新组件
- ant-PR-01 `feat(border-beam): add BorderBeam` (#57720, #57969)

#### B. ConfigProvider 全局配置
- ant-PR-02 `feat(config-provider): expand global component configs` (#56476, #56930, #57002, #57075, #57168, #57283, #57286, #57314, #57330, #57803)

#### C. 与 vc-PR-* 强耦合（必须 vc 先合并）
| PR | 依赖 vc-PR | 上游 |
|---|---|---|
| ant-PR-03 `feat(notification): sync semantic structure` | vc-PR-12 | #57824, #57821 |
| ant-PR-04 `feat(input): allowClear.disabled + clear semantic + Search.searchIcon + Password a11y` | vc-PR-11 | #57240, #57328, #57391, #57256, #57271 |
| ant-PR-05 `feat(mentions): allowClear + z-index` | vc-PR-10 | #57330, #57873 |
| ant-PR-06 `feat(table): scrollTo align + column config + filter perf + selectionColumnWidth` | vc-PR-09 | #57594, #57545, #57546, #57651, #57621 |
| ant-PR-07 `feat(tabs): remove semantic` | vc-PR-08 | #57267 |
| ant-PR-08 `feat(tree, tree-select): itemSwitcher + labelRender` | vc-PR-06, vc-PR-07 | #57281, #57329, #57954 |
| ant-PR-09 `feat(date-picker): tagRender + a11y` | vc-PR-05 | #57706, #57400 |
| ant-PR-10 `feat(tour): closeIcon semantic` | vc-PR-04 | #57268 |
| ant-PR-11 `fix(menu): item extra + ellipsis tooltip` | vc-PR-03 | #57818, #57823 |
| ant-PR-12 `feat(modal, drawer): focusable + closeIcon semantic` | vc-PR-02 | #57314, #57264 |
| ant-PR-13 `feat(cascader): searchIcon + clearIcon + removeIcon + suffixIcon` | vc-PR-01 | #56725 |

#### D. 纯 antdv-next 改造（无 vc 依赖）
| PR | 上游 |
|---|---|
| ant-PR-14 `feat(alert): variant filled/outlined + ConfigProvider` | #57764 |
| ant-PR-15 `feat(anchor): Link.targetOffset` | #57521 |
| ant-PR-16 `feat(app): ref support` | #56951 |
| ant-PR-17 `feat(badge): paddingInline token` | #57891 |
| ant-PR-18 `feat(button): solid default colors + icon centering` | #57495, #57896 |
| ant-PR-19 `feat(calendar): itemContent semantic` | #57430 |
| ant-PR-20 `fix(checkbox): Form.Item native input size` | #57714 |
| ant-PR-21 `fix(dropdown): forwardRef (assess)` | #57902 |
| ant-PR-22 `feat(float-button): disabled` | #57123 |
| ant-PR-23 `feat(form): labelAlign + help/helpItem/extra semantic + i18n` | #56979, #57607, #57038, #57045 |
| ant-PR-24 `feat(image): placeholder.progress + closable preview + closeIcon + a11y` | #57173, #57611, #57263, #57610 |
| ant-PR-25 `feat(popconfirm): icon semantic` | #57528 |
| ant-PR-26 `feat(select): config + style fixes` | #56924, #57769, #57807, #57897 |
| ant-PR-27 `feat(space): Space.Addon token` | #56915 |
| ant-PR-28 `chore(spin): size deprecation` | #57812 |
| ant-PR-29 `feat(splitter): destroyOnHidden + transition + collapsible.icon` | #56772, #56814, #57044, #57838 |
| ant-PR-30 `feat(statistic): value semantic` | #57656 |
| ant-PR-31 `feat(tag): close semantic + CheckableTagGroup className` | #57331, #57840 |
| ant-PR-32 `feat(transfer): source/target semantic` | #57101 |
| ant-PR-33 `feat(typography): actions placement + table styles + semantic` | #57440, #57633, #56971 |
| ant-PR-34 `feat(upload): avif/tif/tiff + accept + progress` | #57287, #57286, #57283 |
| ant-PR-35 `feat(wave): triggerType + transparent color` | #57402, #57859 |
| ant-PR-36 `fix(watermark): cover fixed table columns` | #57813 |
| ant-PR-37 `feat(theme): colorErrorAffix + colorWarningAffix + numeric fontSize` | #57604, #57760, #57598 |

#### E. 收尾
- ant-PR-38 `chore(release): sync antd@6.4.2` — 版本号、CHANGELOG、token 元数据、demo 校验

## 四、风险点

- **notification rc 主版本升级**：无 codemod，API 改动需逐 case 校验
- **textarea 包合并**：上游已删 `@rc-component/textarea`；vc 端保留 `textarea` 包但让 `input` re-export，避免 breaking change
- **rc-table 1.10 scrollTo align**：需验证 vc-table 现有虚拟滚动是否能直接接住
- **picker 1.10 multiple tagRender**：vc-picker 当前是否支持多选标签自定义，需 audit
- **`@ant-design/icons` 6.1 → 6.2**：Vue 侧 icon 包同步策略确认

## 五、节奏

- W1: 合 vc-PR-01/02/03/04（低风险）+ 并行 ant-PR Phase 2-D 一部分
- W2: 合 vc-PR-05~10 + 配套 ant-PR-04/05/06/08/09/13
- W3: 攻坚 vc-PR-11（input/textarea）和 vc-PR-12（notification major）
- W4: 收尾 + 全量回归（test + playground demo + token 元数据）
