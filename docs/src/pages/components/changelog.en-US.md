---
title: Component Changelog
---

## V1.5.3

Release Date: 2026-08-29

This release advances ant-design upstream tracking to **6.6.2** (`621b63dff5`) and brings in a focused round of stability, typing and accessibility fixes. Component work covers numeric `0` content being mistaken for empty, stale responsive Grid alignment classes, Checkbox disabled-state precedence, Select / AutoComplete popup event forwarding, GIF preview resource cleanup in Upload, Menu collapse transitions and RTL navigation in Image. The documentation site also gains CLI, MCP and AI-agent integration guides and now generates contributor data during the build.

**🐞 Fixes**

* fix: render numeric `0` correctly in Breadcrumb separators, Card titles/extras/covers and Meta, FloatButton content, Segmented labels and Tag content; Form labels no longer treat `0` as empty either ([#789](https://github.com/antdv-next/antdv-next/pull/789), [#784](https://github.com/antdv-next/antdv-next/pull/784), #59117, #59079)
* fix(grid): remove stale alignment classes when responsive `align` / `justify` moves to an unmatched breakpoint or is cleared, instead of retaining an outdated layout state ([#781](https://github.com/antdv-next/antdv-next/pull/781), #59066)
* fix(checkbox): resolve `disabled` from Checkbox itself before Checkbox.Group and then the ConfigProvider global context, allowing local settings to override their parent correctly ([#788](https://github.com/antdv-next/antdv-next/pull/788), #59109)
* fix(table): preserve custom `keydown` handlers supplied through `onHeaderCell` on sortable headers while retaining built-in keyboard sorting ([#783](https://github.com/antdv-next/antdv-next/pull/783), #59078)
* fix(transfer): disable select-all when every visible search result is disabled, avoiding an actionable-looking control that cannot select anything ([#790](https://github.com/antdv-next/antdv-next/pull/790), #59121)
* fix(upload): release the temporary canvas after generating a GIF thumbnail so repeated previews do not accumulate unused canvas resources ([#791](https://github.com/antdv-next/antdv-next/pull/791), #59137)
* fix(select, auto-complete): stop exposing or forwarding the internal `onPopupVisibleChange` callback through DOM attrs; AutoComplete now emits `openChange` or the compatible `dropdownVisibleChange` according to the listener actually provided ([#792](https://github.com/antdv-next/antdv-next/pull/792), #59142)
* fix(tag): give CheckableTag.Group's component-level `classes` / `styles` priority over inherited ConfigProvider semantic config, so local customization is not overwritten globally ([#785](https://github.com/antdv-next/antdv-next/pull/785), #59087)
* fix(dropdown, menu): when a hover-triggered Dropdown contains a SubMenu, its root popup now closes normally after the pointer leaves the submenu popup directly for empty page space; also scope the inline-collapse padding-transition override to root menu items so other Menu modes retain their existing animation ([#793](https://github.com/antdv-next/antdv-next/issues/793), [#795](https://github.com/antdv-next/antdv-next/pull/795), #59085)
* fix(image): pass direction-aware icons into PreviewGroup's merged config so RTL navigation uses a right arrow for previous and a left arrow for next ([#796](https://github.com/antdv-next/antdv-next/pull/796), #59145)
* fix(steps): mark Steps panel arrows as decorative and hide them from assistive technology, preventing meaningless screen-reader announcements ([#787](https://github.com/antdv-next/antdv-next/pull/787), #59105)
* fix(alert): narrow ConfigProvider's global Alert `closable` option to the type actually supported at runtime, removing properties that were declared but ineffective ([#786](https://github.com/antdv-next/antdv-next/pull/786), #59100)

**📖 Documentation**

* docs: add bilingual guides for the CLI, MCP integration and using the component library with AI agents, together with the corresponding documentation navigation
* docs(site): generate static contributor JSON from the GitHub API during the documentation build for a more accurate and stable contributor list ([#779](https://github.com/antdv-next/antdv-next/pull/779))
* fix(docs): repair the broken interaction in the Listy drag-sorting demo and add regression coverage ([#770](https://github.com/antdv-next/antdv-next/pull/770))
* docs: remove nonexistent `update:open` event entries from the FloatButton, Modal and Tooltip documentation

**🧰 Infrastructure & Dependencies**

* chore(sync): advance ant-design upstream tracking to **6.6.2** at `621b63dff5`, porting the fixes applicable to the Vue implementation in this release
* chore(deps): upgrade `@v-c/menu` to 1.3.1 and `@v-c/trigger` to 1.1.1 to fix hover-triggered menu collapse behavior
* test(transfer): add regression coverage ensuring pagination remains on a valid page after the result set becomes empty ([#782](https://github.com/antdv-next/antdv-next/pull/782), #59074)

## V1.5.2

Release Date: 2026-08-21

This release advances the ant-design upstream sync through **6.6.1** and onward to `e216c46b1e`. It focuses on stability and accessibility: Form fixes rapid-validation layout shifts, vertical-layout offsets and conditional children being remounted; Table, Transfer, Anchor and Radio correct duplicate callbacks or interaction semantics; and Carousel, Modal, Notification and Upload gain localized accessible labels. Published packages now also include design-token metadata for direct consumption by theming tools.

**✨ Features**

* feat(build): ship `token.json` and `token-meta.json` under `dist/version`, with `antdv-next/version/token.json` and `antdv-next/version/token-meta.json` export paths for theme editors and design tools
* feat(carousel): localize the default previous/next arrow `aria-label` values through ConfigProvider locale instead of hard-coding English `prev` / `next` (#59014)

**🐞 Fixes**

* fix(form): retain the compensated bottom margin while validation errors switch rapidly, preventing form height fluctuation (#59008); preserve Form's `labelCol.offset` in vertical layout (#58981)
* fix(form): keep the FormItem child array shape stable so conditionally rendering a sibling no longer remounts form controls or loses their input and internal state ([#764](https://github.com/antdv-next/antdv-next/pull/764))
* fix(form, locale): correct placeholders in the number, string and array `min` validation messages (#58965)
* fix(table): avoid duplicate callbacks when a filter menu closes; preserve caller-controlled close and confirm semantics for custom `filterDropdown`; restore first-row radii when the header is hidden (#59023, #57035)
* fix(transfer): honor component-level `locale.remove` for one-way removal buttons; emit `onSearch` only once when clearing the search input (#58955, #59016)
* fix(upload): preserve files added while an asynchronous removal is pending; use localized `title` and `aria-label` values for preview, download and remove actions ([#724](https://github.com/antdv-next/antdv-next/pull/724), #58953)
* fix(radio): fire an option's own `onChange` before the group-level `change` when Radio.Group renders from `options` ([#716](https://github.com/antdv-next/antdv-next/pull/716))
* fix(anchor): avoid duplicate `change` emissions when `getCurrentAnchor` is provided while retaining reactive tracking inside the function (#58834)
* fix(menu): prevent Tooltip flashes when an inline menu collapses while hovered, remove icon jitter during collapse, and resolve the conflicting `SubMenuProps.title` type (#58865, #59018, [#759](https://github.com/antdv-next/antdv-next/pull/759))
* fix(color-picker): keep color selection draggable after clearing; apply trigger description text styling from `styles.description` instead of mistakenly reading `classes.description` (#58995)
* fix(float-button): keep the BackTop scroll-progress ring visible whenever the button is shown (#58982)
* fix(notification, modal): localize close-button names and pass the global locale to the static Notification API; restore the default `24px` bottom offset instead of mistakenly using the `4.5`-second default duration ([#756](https://github.com/antdv-next/antdv-next/pull/756), #58957)
* fix(collapse, date-picker): hide decorative collapse arrows and range separators from screen readers to prevent duplicate announcements ([#741](https://github.com/antdv-next/antdv-next/pull/741), [#740](https://github.com/antdv-next/antdv-next/pull/740))
* fix(tree): handle a node key of `0` correctly in DirectoryTree range selection ([#757](https://github.com/antdv-next/antdv-next/pull/757))
* fix(select): keep customized inputs aligned while hovering the clear button ([#727](https://github.com/antdv-next/antdv-next/pull/727))

**💄 Styles**

* fix(listy): improve virtual scrollbar track hover feedback (#58964)

**📖 Documentation**

* docs(listy): add a drag-sorting demo; add a Select multiple-fields search demo ([#768](https://github.com/antdv-next/antdv-next/pull/768))
* fix(docs): prevent demo edits from being reverted after lazy HTTP loading and isolate each demo's TypeScript / JavaScript toggle state ([#765](https://github.com/antdv-next/antdv-next/pull/765), [#766](https://github.com/antdv-next/antdv-next/pull/766))
* docs: sync upstream API tables and heading anchors, clarify Form label association, Alert accessibility and the Transfer locale default, and add a Qixi festival easter-egg page

**🧰 Infrastructure & Dependencies**

* chore(sync): sync ant-design **6.6.1** and subsequent changes through `e216c46b1e`
* chore(deps): upgrade `@v-c/select` to 1.2.4 and `@v-c/pagination` to 1.1.1
* build: generate the docs site's `antd.css` at build time instead of committing the generated asset; update tsdown external-dependency configuration for the newer API

## V1.5.1

Release Date: 2026-08-14

This release advances the ant-design upstream sync to **6.6.0** (`a5bbbf962d`, [#703](https://github.com/antdv-next/antdv-next/pull/703), [#710](https://github.com/antdv-next/antdv-next/pull/710)). Two main threads: the full 6.6.0 sync — `nativeElement` refs across ~20 components, Tree `scrollTo` auto-expand, Table expandable `forceRender`, a BackTop scroll-progress ring, global tooltip delays and input variant config via ConfigProvider — and a focused round of **Form fixes and enhancements**: rule resolution and duplicate-validation fixes, aria attributes, and render-function validation messages — `message` now accepts a render function, so displayed errors update reactively on locale switch without re-validating.

**✨ Features**

* feat: expose `nativeElement` refs on ~20 components — Avatar.Group, Badge.Ribbon, Breadcrumb, Calendar, Card.Grid, Card.Meta, Carousel, Descriptions, Divider, Empty, FloatButton.Group, QRCode, Result, Skeleton, Space.Compact, Spin, Splitter, Transfer and Watermark — with the ref types exported from the entry (#58627~#58667)
* feat(form): rule `message` accepts a render function `() => VueNode`; it is kept as-is through validation and only invoked while rendering the error, so any reactive state it reads (locale, i18n, ...) updates the displayed message without re-running validators; works with form-level and computed `rules` as well ([#714](https://github.com/antdv-next/antdv-next/pull/714))
* feat(tree): `scrollTo` supports `autoExpand`, add `Tree.useTree` and export `TreeInstance` / `UseTreeConfig` (#58841)
* feat(table): support `forceRender` for expandable rows (#58860)
* feat(float-button): BackTop gains `showProgress`, rendering scroll progress as a ring (#58894)
* feat(pagination): add `components.sizeChanger` to customize the size changer (#58831)
* feat(mentions): support `popupRender` to customize the dropdown (#58582)
* feat(input): ConfigProvider variant config supports the `inputSearch` / `inputPassword` / `otp` subcomponents, each resolving its own config first (#58784)
* feat(tooltip, popover, popconfirm): `mouseEnterDelay` / `mouseLeaveDelay` configurable globally via ConfigProvider (#58892)
* feat(theme): add the `focusOutline` seed token for shared focus styles, honored by Input, Select, Rate, Splitter and Steps; Alert gains a `borderRadius` component token (#58647, #58708, #57765)
* feat(image): preview supports `wheel` to control mouse-wheel zoom (`@v-c/image@1.1.0`, #58728)
* feat(border-beam): add `count` to configure the number of beams, evenly distributed (#58691)
* feat(locale): add Albanian `sq_AL`; refine Traditional Chinese terminology and use Taiwan week wording in DatePicker (#58618, #58947, #58951)

**🐞 Fixes**

* fix(form): rules combining `required` and `type` no longer run type validation twice; FormItem `required` no longer derives a validation rule and only drives the required mark, aligning with antd
* fix(form): function rules resolve with the form instance as argument and are re-resolved on every validation, so they can read the latest external state
* fix(form): form controls now carry `aria-required` and link help and error text via `aria-describedby`
* fix(table): an explicitly placed `Table.EXPAND_COLUMN` no longer loses its identity through `ref()` / `reactive()` proxies, removing the phantom empty column (`@v-c/table@1.2.0`)
* fix(tree-select): preserve the selection state of disabled child nodes (`@v-c/tree-select@1.1.2`)
* fix(select): the clear icon is reachable by keyboard (`@v-c/select@1.2.1`)
* fix(virtual-list): `scrollTo({ key })` resolves against the latest data and retries after a data update (`@v-c/virtual-list@1.1.1`)
* fix(carousel): keep the current slide when children are added instead of resetting to the first (#58845)
* fix(drawer): support a disabled close button (#58853)
* fix: correct semantic style priority — ConfigProvider's root `style` now sits between context styles and component styles across 20+ components including Badge, Calendar, ColorPicker, DatePicker, Drawer, Dropdown and Modal; also fixes Divider spreading the whole semantic styles object onto its root, Masonry dropping component-level `styles.root`, and the message Holder merge order (#58550, #58564)
* fix(config-provider): the `inputSearch` component config previously never reached the context and was silently dead; it now applies
* fix(typography): restore the interactive ellipsis tooltip — hovering the popup no longer dismisses it (#58661, #58722)
* fix(button): align loading icon styles, dropping the redundant centering and block declarations (#58712)
* fix(types): export the missing `UploadRef`, `StatisticRef` and `SliderRef` types (#58700, #58798)
* fix(site): harden mainland China detection for the docs site switch

**💄 Styles**

* fix(select, table, tree): virtual scrollbars gain `cursor: pointer` and hover feedback (#58658, #58679)

**📖 Documentation**

* docs: add the design system documentation ([#707](https://github.com/antdv-next/antdv-next/pull/707)) and refresh the getting-started guide
* feat(docs): support multi-file demo tabs in the code panel
* docs: add demos for Avatar `overflowInFinal`, reactive Form validation messages and Tabs `more.popupRender`; document the Image preview `wheel` prop

**🧰 Dependencies**

* chore(sync): sync ant-design **6.6.0** upstream changes ([#703](https://github.com/antdv-next/antdv-next/pull/703), [#710](https://github.com/antdv-next/antdv-next/pull/710))
* chore(deps): upgrade `@v-c/virtual-list@1.1.1`, `@v-c/tree@1.2.0`, `@v-c/select@1.2.1`, `@v-c/tree-select@1.1.2`, `@v-c/table@1.2.0`, `@v-c/image@1.1.0`
* refactor: Button's delayed loading, Slider's tooltip toggle, Upload's progress reveal and Typography's copy feedback all move onto the shared `useDelayState` (#58690)

## V1.5.0

Release Date: 2026-08-07

This release advances the ant-design upstream sync to **6.5.4** (`5ade9944d6`) and introduces the experimental **Listy** virtual-list component. Listy targets long and grouped lists with virtual scrolling, sticky group headers, semantic styling and imperative scrolling, while BorderBeam gains controls for animation duration, beam width and beam size. It also fixes Layout Sider custom triggers, controlled Segmented values, invalid Checkbox options, reduced-motion behavior in BackTop and more.

**✨ Features**

* feat(listy): add the experimental Listy component with standard and virtual lists, grouped data and sticky headers, infinite-loading scenarios, semantic `classes` / `styles`, and a `scrollTo` API for scrolling to a position, item or group ([#670](https://github.com/antdv-next/antdv-next/pull/670))
* feat(border-beam): add `duration`, `lineWidth` and `size` to control animation duration, beam width and beam size respectively; add demos for these options and custom containers

**🐞 Fixes**

* fix(layout): support both a `trigger` prop and slot on Layout Sider; restore the default trigger when neither is supplied, and allow an explicit `null` to hide it
* fix(segmented): in controlled mode, keep the selected item on the controlled value when the consumer does not update `value` after `change`, instead of incorrectly switching to the clicked item; upgrade the primitive to `@v-c/segmented@1.0.4`
* fix(alert): an object-valued `closable` now enables closing even when it does not provide `closeIcon`
* fix(checkbox): Checkbox Group ignores `null` / `undefined` options and options without a valid `value`, avoiding invalid checkbox items
* fix(float-button): BackTop jumps to the top without animation when the user enables `prefers-reduced-motion`; the shared `scrollTo` utility now also supports zero-duration scrolling and cancellation of unfinished animations
* fix(app): with CSS variables and `component={false}`, only warn when root classes or styles would actually be dropped (#58876)
* fix(border-beam): fall back to default border information when `getComputedStyle` throws on the host element, preventing BorderBeam from breaking the component tree
* fix(types): correct the DatePicker semantic return value and Tour `actionsRender` declarations to match the actual component-level APIs

**📖 Documentation**

* docs(listy): add Chinese and English component docs with demos for basic usage, virtual scrolling, grouping, imperative scrolling, rich content, infinite loading and semantic styling
* perf(docs): load component demo source only when the code panel is expanded, so the browser no longer parses every demo's source and highlighted output during page initialization; development HMR remains supported and loaded source is reused across collapse and re-expand

**🧰 Dependencies**

* chore(sync): sync upstream changes from ant-design **6.5.4**
* chore(deps): add `@v-c/listy@1.0.2` and upgrade `@v-c/picker` to 1.3.2 ([#684](https://github.com/antdv-next/antdv-next/pull/684)), `@v-c/segmented` to 1.0.4 and `@v-c/table` to 1.1.9

## V1.4.6

Release Date: 2026-08-03

This release advances the ant-design sync from **6.5.1** all the way past **6.5.3** (`49c4a03cc9`) and upgrades all twelve `@v-c/*` primitives ([#668](https://github.com/antdv-next/antdv-next/pull/668), [#678](https://github.com/antdv-next/antdv-next/pull/678), [#681](https://github.com/antdv-next/antdv-next/pull/681)).

Two threads are worth calling out. The first is the **RangePicker interaction refactor**: upstream fixed "an unconfirmed range must not be submitted on blur" inside `@rc-component/picker`, so we rewrote the whole interaction state machine in `@v-c/picker@1.3.0`, which lands here with the dependency bump. The second is the chain of adjustments that followed **turning the clear affordance from a `<span>` into a `<button>`** — the browser's default control chrome had to be reset, the button had to become visible and outlined under keyboard focus, and a suffix holding focus must not be hidden. antd has not caught up here yet (its `rc-select` still renders a non-focusable `<span>`), so this repo carries the accessibility work first.

**🐞 Fixes**

* fix(date-picker): blur no longer submits an unconfirmed partial range when using `showTime` with `allowEmpty`. Comes from the RangePicker interaction-flow refactor in `@v-c/picker@1.3.0`, where every interaction is resolved into a single action before anything executes, so event sources no longer submit or reset values on their own ([#681](https://github.com/antdv-next/antdv-next/pull/681), #58803)
* fix(slider): `onFocus` / `onBlur` no longer fire more than once. Vue's `cloneVNode` merges `on*` props into an array and invokes each one — React's `cloneElement` overwrites — so an explicit dispatch on top of that duplicated the callback. The two paths are also asymmetric: `@v-c/slider`'s `Handle` declares `onFocus` as a prop but never `onBlur` ([#681](https://github.com/antdv-next/antdv-next/pull/681), #58711)
* fix(table): selecting all data no longer picks up disabled rows on other pages. It relied on `checkboxPropsMap`, which only covers the current page, so records elsewhere had no `disabled` entry and read as selectable ([#681](https://github.com/antdv-next/antdv-next/pull/681), #58843)
* fix(table): keep `dataIndex` accessible on the columns union ([#673](https://github.com/antdv-next/antdv-next/pull/673))
* fix(transfer): deselect-all is correct while filtering. It compared key counts, but filtering narrows the keys to the visible items, so a fully-checked list read as unchecked ([#681](https://github.com/antdv-next/antdv-next/pull/681), #58844)
* fix(transfer): preserve the disabled state of custom actions ([#668](https://github.com/antdv-next/antdv-next/pull/668), #58718)
* fix(input): `Input.OTP` no longer renders the original value when `mask` is a string — the mask overlay was effectively doing nothing — and an explicitly supplied `type` now wins over the mask-derived one ([#681](https://github.com/antdv-next/antdv-next/pull/681), #58805, #58835)
* fix(input): hide the `Input.TextArea` resize handle on touch devices ([#681](https://github.com/antdv-next/antdv-next/pull/681), #58812)
* fix(select): suffix icons and selected content no longer overlap the clear icon under custom theme colours ([#681](https://github.com/antdv-next/antdv-next/pull/681), #58581)
* fix(select): the clear button is reachable by keyboard — visible and outlined on focus, and a custom suffix holding focus is no longer hidden. The clear affordance is a focusable `<button>` now, and `pointer-events: none` does not take it out of the tab order ([#681](https://github.com/antdv-next/antdv-next/pull/681))
* fix(auto-complete): the disabled text colour now reaches the input — it has to be set through the CSS variable rather than `color`, which never reaches a customized input ([#681](https://github.com/antdv-next/antdv-next/pull/681), #58838)
* fix(spin): a standalone `Spin` nested inside another one is no longer pulled out of flow by the outer centring styles ([#681](https://github.com/antdv-next/antdv-next/pull/681), #58801)
* fix(typography): the editable textarea's font size now matches the content being edited ([#681](https://github.com/antdv-next/antdv-next/pull/681), #58551)
* fix(upload): default download links open with `noopener`, so newly opened tabs can no longer reach the opener page ([#681](https://github.com/antdv-next/antdv-next/pull/681), #58817)

**💄 Styles**

* fix(date-picker, select): reset the browser's default button chrome on the clear icon. It is a `<button>` now, so without the reset its grey background, border, padding and own font showed through ([#681](https://github.com/antdv-next/antdv-next/pull/681), #58403)
* fix: bare `<svg>` icons from third-party libraries now sit vertically centred with their labels in Tabs, Segmented, Breadcrumb, Collapse and Tag. An `<svg>` has no baseline of its own, so it is aligned by its bottom margin edge and rides above the text; `display: inline-block` additionally keeps it aligned under a reset that forces `svg { display: block }`, such as Tailwind Preflight ([#681](https://github.com/antdv-next/antdv-next/pull/681), #58847, #58862, #58868, #58869, #58870; Tag via [#668](https://github.com/antdv-next/antdv-next/pull/668), #58723)
* fix(style): complete the Icon base styles when `theme.zeroRuntime` or CSS layers are enabled ([#678](https://github.com/antdv-next/antdv-next/pull/678), #58763)
* fix(style): respect the `lineType` token in Button, ColorPicker, Select and Space borders ([#668](https://github.com/antdv-next/antdv-next/pull/668), #58755)
* fix(tree): respect the `margin-inline-start` design token in `showLine` ([#668](https://github.com/antdv-next/antdv-next/pull/668), #58745)
* fix(table): preserve the nested table's top border inside custom content ([#668](https://github.com/antdv-next/antdv-next/pull/668), #58746)

**📖 Documentation**

* docs(faq): note that in-DOM template lowercasing breaks camelCase slots on CDN ([#671](https://github.com/antdv-next/antdv-next/pull/671))
* feat(docs): supplement the Upload demo
* docs: add a Collapse panel-icon demo rendered through the `labelRender` slot, covering third-party bare `<svg>` icons ([#681](https://github.com/antdv-next/antdv-next/pull/681))
* docs: fix the English introduction and release blog links

**🧰 Infrastructure**

* chore: upgrade all twelve `@v-c/*` dependencies — util 1.1.0, trigger 1.1.0, tooltip 1.1.0, menu 1.3.0, dropdown 1.0.5, select 1.2.0, tabs 1.3.0, mentions 1.2.0, input-number 1.0.7, tree 1.1.3, pagination 1.1.0, picker 1.3.0 ([#681](https://github.com/antdv-next/antdv-next/pull/681))
* test: regenerate snapshots in a UTC+8 timezone. Some had absorbed the generating machine's timezone and reported spurious failures elsewhere ([#681](https://github.com/antdv-next/antdv-next/pull/681))

## V1.4.5

Release Date: 2026-07-21

Hotfix for the browser (CDN) bundles shipped in 1.4.4. The UMD/ESM builds referenced `process.env.NODE_ENV`, which does not exist in the browser, so loading `dist/antd.js` from unpkg/jsdelivr threw `ReferenceError: process is not defined` and the whole bundle failed. Fixing that surfaced a second problem: `app.use(window.antd)` never registered any components because the plugin's `install` was nested one level deeper on the global.

**🐞 Fixes**

* fix(build): define `process.env.NODE_ENV` in the browser-facing bundles (`antd.js`, `antd.esm.js`, `antd-with-locales.js`, `antd-with-locales.esm.js`) so they no longer reference the missing `process` global. The bundler entry (`dist/index.js`) is left untouched so tree-shaking consumers keep their own dev/prod branches ([#667](https://github.com/antdv-next/antdv-next/pull/667), fixes [#666](https://github.com/antdv-next/antdv-next/issues/666))
* fix(build): expose `install` / `setPrefix` as named exports so the UMD/ESM global (`window.antd`) carries `install` at the top level; `app.use(window.antd)` now registers all components directly, without reaching for `window.antd.default` ([#667](https://github.com/antdv-next/antdv-next/pull/667))

**🧰 Infrastructure**

* build: add a post-build check that fails the build if any browser bundle references the `process` global unguarded, preventing this regression from shipping again ([#667](https://github.com/antdv-next/antdv-next/pull/667))

## V1.4.4

Release Date: 2026-07-20

This release advances the ant-design upstream sync past **6.5.1** to `78c3d84619` ([#658](https://github.com/antdv-next/antdv-next/pull/658), [#664](https://github.com/antdv-next/antdv-next/pull/664)). Its main theme is **APIs that were declared and documented but never actually wired up**: Form `getFieldInstance` always returned `undefined`, Timeline's three render props were ignored, and Tree's `rootStyle` was silently discarded. It also makes the style and token build scripts read component sources directly instead of bundled output.

**🐞 Fixes**

* fix(form): `getFieldInstance(name)` now returns the rendered control instance instead of always returning `undefined`. The registry key no longer goes through `getFieldId`, so lookups work whether or not the Form declares a `name`, and `focusField` now prefers the control's own `focus()` before falling back to the DOM node ([#665](https://github.com/antdv-next/antdv-next/pull/665), fixes [#663](https://github.com/antdv-next/antdv-next/issues/663))
* fix(timeline): wire up the `dotRender` / `labelRender` / `contentRender` props and slots — they were declared and documented but ignored by `useItems`, and leaked into the Steps pass-through. Slot results are normalized so a conditional slot that renders nothing correctly falls back to the item's `icon` / `title` / `content` ([#656](https://github.com/antdv-next/antdv-next/pull/656), fixes [#653](https://github.com/antdv-next/antdv-next/issues/653))
* fix(tabs): `labelRender` / `contentRender` now infer their item type from `items` instead of hard-coding `TabItem`, and `InstanceType<typeof Tabs>` keeps the exposed `TabsRef` ([#661](https://github.com/antdv-next/antdv-next/pull/661), fixes [#660](https://github.com/antdv-next/antdv-next/issues/660))
* fix(tree): restore `rootStyle` compatibility — it was inherited from the underlying props but silently overwritten by the semantic root style, making it a no-op. It now works again and is deprecated in favour of `styles.root` (#58709)
* fix(input): a custom Search `enterButton` now syncs `disabled` with the form context, and a `loading` supplied on the custom Button is no longer overwritten (#58726)
* fix(grid): support zero `flex` values — `:flex="0"` and responsive `:xs="{ flex: 0 }"` were dropped by a truthiness check (#58719)
* fix(tag): closing a link tag no longer triggers navigation (#58720)
* fix(splitter): correct percentage-based ARIA value ranges (#58702)
* fix(style): respect the `lineWidth` / `lineType` border tokens in Typography, Tree, Collapse and Layout instead of hardcoding `1px solid`; the rendered CSS is unchanged at the default theme and only differs once those tokens are customized (#58740, #58741, #58742, #58743)
* fix(segmented, radio): drop downstream-only `prefers-reduced-motion` styles that upstream never had, restoring parity with the React sources ([#654](https://github.com/antdv-next/antdv-next/pull/654))
* fix(wave): avoid touching global `window` in the `attachListener` watch callback, which runs on Vue's async scheduler and could fire after the environment is torn down ([#662](https://github.com/antdv-next/antdv-next/pull/662))

**📖 Docs**

* docs(timeline): add a `dotRender` demo ([#656](https://github.com/antdv-next/antdv-next/pull/656))
* docs(input-number): add a feedback suffix debug demo (#58703)
* docs(anchor): correct the `offsetTop` default value (#58710)
* docs(select): preserve the typed search text in the remote users demo (#58736)
* docs(table): fix the English API links ([#657](https://github.com/antdv-next/antdv-next/pull/657))

**🧰 Infrastructure**

* refactor(build): `build:style` and `build:token-statistic` now load component sources through a vite SSR runner instead of importing `dist/components.js`, so a stale build can no longer produce outdated CSS or token statistics. Both outputs were verified identical to the dist-based runs ([#654](https://github.com/antdv-next/antdv-next/pull/654))

## V1.4.3

Release Date: 2026-07-15

Hotfix for a style regression introduced in 1.4.2 while syncing upstream [ant-design#58685](https://github.com/ant-design/ant-design/pull/58685): after `genNoMotionStyle` expanded to `&::before / &::after`, six call sites that already live inside pseudo-element selectors produced invalid double pseudo-element selectors such as `.ant-border-beam::before::before` — browsers silently drop these rules (so `prefers-reduced-motion` never took effect there), and lightningcss-based static CSS minification fails the build outright.

**🐞 Fixes**

* fix(style): add a flat `genNoMotionRawStyle` variant and use it at the six pseudo-element call sites in Switch / Segmented / Radio / Checkbox / BorderBeam, removing the invalid `::before::before` selectors and restoring `prefers-reduced-motion` behavior there ([#651](https://github.com/antdv-next/antdv-next/pull/651))

**🧰 Infrastructure**

* ci: bump node to 24 in GitHub Actions workflows
* chore: regenerate the static style output

## V1.4.2

Release Date: 2026-07-14

This release advances the ant-design upstream sync to **6.5.1** ([#644](https://github.com/antdv-next/antdv-next/pull/644), [#647](https://github.com/antdv-next/antdv-next/pull/647), [#650](https://github.com/antdv-next/antdv-next/pull/650)) and focuses on **TypeScript type infrastructure** (generic constructor exports, type inference in `h()` usage). It also fixes a batch of component issues — Switch label centering and bare attribute parsing, AutoComplete filled background stacking, Modal lazy rendering — and upgrades `@v-c/table` 1.1.8, `@v-c/util` 1.0.21 and other dependencies.

**✨ Features**

* feat(types): export generic constructor types for Transfer / Cascader / TreeSelect / Segmented, enabling full generic inference in `h()` and TSX
* feat(ecosystem): add the antdv-next-tiptap rich-text editor to the Awesome page

**🐞 Fixes**

* fix(switch): center label content with flex instead of aligning it to the text baseline, fixing the upward offset of icon content (#58672)
* fix(switch, checkbox): bare `checked` / `default-checked` template attributes now correctly resolve to `true` (previously parsed as an empty string and rendered unchecked)
* fix(input): prevent the Search button focus outline from being covered by adjacent elements (#58615)
* fix(auto-complete): avoid duplicate filled background on custom input components (#58669)
* fix(motion): `prefers-reduced-motion` now also disables transitions/animations on `::before` / `::after` pseudo elements (#58685)
* fix(modal): keep default slot rendering lazy while loading; apply `styles.body` of Modal methods to the content
* fix(pagination): keep the size changer width inside Form.Item
* fix(button): align icons inside Card extra
* fix(descriptions): restore view width in shrink-to-fit containers
* fix(date-picker): expose `nativeElement` as an element instead of a function
* fix(config-provider): component-level `classes` / `styles` config is no longer silently inferred as `any` ([#642](https://github.com/antdv-next/antdv-next/pull/642)); force `zeroRuntime` when the cssinjs layer is enabled
* fix(locale): complete missing locale fields
* fix(types): fix lost contextual callback types in `h()` usage, unresolvable `h(Table, props)`, and clean up remaining type errors in component sources
* fix(deps): bump `@v-c/util` to 1.0.21, fixing Select dropdown misalignment inside Space.Compact under vue 3.5.39
* build: externalize `@vueuse/core` to silence rolldown build warnings

**📖 Docs**

* docs(layout): add a "Collapsible overlay" demo (#58566)
* docs(grid): document the semantic difference between number and string values of Col `flex` (#58624)
* docs(border-beam): add a "Show on hover" demo (#58683)
* docs(auto-complete): add a filled custom input debug demo (#58669)
* docs(table): add an auto-height demo, a performance troubleshooting FAQ (Vue DevTools), `change` event typing examples, and more
* docs(notification): add a fixed-width usage FAQ
* docs(site): add an "All" filter to icon search; add Serene / Dashboard preview themes; align component overview card hover with ant-design

**🧰 Dependencies**

* chore(deps): bump `@v-c/table` ^1.1.8, `@v-c/virtual-list` ^1.1.0, `@v-c/mentions` ^1.1.2, `@v-c/util` ^1.0.21, `@antdv-next/happy-work-theme` 1.0.1

## V1.4.1

Release Date: 2026-07-02

This release mainly fixes **vue 3.5.39 compatibility issues** ([vuejs/core#14985](https://github.com/vuejs/core/pull/14985) changed when function refs are invoked): overlay components (Tooltip/Popover/Popconfirm/Dropdown) mis-positioning and dropping the first-open animation, message/notification notices stacking on top of each other, and Masonry layout breakage. It also adds a component meta block to the component doc pages and refines the icon overview.

**🐞 Fixes**

* fix: fix overlay components mis-positioning / losing the first-open animation under the vue 3.5.39 production build (Tooltip / Popover / Popconfirm / Dropdown) — via `@v-c/trigger` 1.0.18 (#623)
* fix: fix **message / notification notices stacking** on top of each other under vue 3.5.39 (first-frame height measurement failed) — via `@v-c/notification` 2.0.2 (#623)
* fix(masonry): fix Masonry layout breakage caused by failed item height measurement under vue 3.5.39; resolve via `createElementRef` (#623)
* fix(deps): add `@v-c/notification` to overrides to drop the stale version left in the lockfile

**📖 Docs**

* docs: add a component meta block (import / feedback / docs / version) to component doc pages, aligning with ant-design
* docs(icon): categorize the newly added AI / brand icons under the brand group, tag them as "added in 1.4.0", and surface them first

**🧪 Tests**

* test(drawer): add a regression test for Watermark inheritance inside Drawer (vue 3.5.39)

**🧰 Dependencies**

* chore(deps): bump vue to `^3.5.39`; `@v-c/trigger` 1.0.18, `@v-c/notification` 2.0.2, `@v-c/util` 1.0.20 and related toolchain deps

## V1.4.0

Release Date: 2026-06-30

This release advances the ant-design upstream sync to **6.5.0**, bringing a batch of new features and semantic capabilities: **Modal `scrollLock`**, **Dropdown left/right placements**, **Steps `maxCount` collapsing**, **Slider per-handle disabling (`boolean[]` in Range mode)**, **DatePicker/RangePicker `clear` event**, **Watermark per-line fonts**, **Layout Sider semantic `classes`/`styles`** and **Tabs `body` semantic structure**; it also unifies the **root semantic style priority** across 30+ components. Multiple upstream fixes are synced as well, and the `@v-c` chain is upgraded (picker 1.2.0 / select 1.1.3 / tabs 1.2.1).

**✨ Features**

* feat: sync ant-design upstream changes (6.4.5 → 6.5.0) — [#621](https://github.com/antdv-next/antdv-next/pull/621)
* feat(modal): add `scrollLock` to control body scroll lock while open (#58256)
* feat(dropdown): support `left`/`right` placements (#58437)
* feat(steps): add `maxCount` collapse mode for dense step items (#57987)
* feat(slider): support disabling individual handles via `boolean[]` in Range mode (#57982)
* feat(date-picker): emit `clear` when the clear button is clicked (#58403)
* feat(watermark): `content` supports per-line font styles for multi-line watermarks (#57886)
* feat(layout): support semantic `classes`/`styles` (`root`/`body`) for Sider (#57938)
* feat(tabs): sync `body`/`content` semantic DOM rename and the `body` semantic (#58521)
* feat(collapse): support size padding tokens for header/content (#58436)
* feat(badge): allow removing the native title via `title` `null`/`false` (#58209)
* feat(input): support `tabIndex` for the Password visibility toggle (#58458)
* feat(config-provider): support Form `labelWrap` configuration (#58035)
* feat(config-provider): pass `theme.zeroRuntime` to the icon context (#58517)
* feat: unify root semantic style priority across 30+ components (#58474)

**🐞 Fixes**

* fix(form): restore `Form.Item` `help={false}` behavior (#58558)
* fix(table): honor `defaultSortOrder` on responsive columns (#58008)
* fix(table): keep the sticky header top border and drop the extra fixed-right line in bordered mode (#58451 #58516)
* fix(table): support forwarding aria attributes through `getCheckboxProps` (#58275)
* fix(input,select): add a focus outline for borderless inputs (#58250)
* fix(input): align the Search button height and the compact small control height (#58411 #58525)
* fix(select): refine single-mode open-state labelRender dimming; do not create disabled tags; numeric popup width (#58288 #58518 #58511)
* fix(float-button): prevent a disabled `FloatButton.Group` from opening the hover menu (#58513)
* fix(alert): fix the CSS specificity for icon vertical alignment with description (#57915)
* fix(upload): switch default file/picture icons from TwoTone to Outlined, aligning with upstream (#58497)
* fix(config-provider): forward collapse/otp/anchor/splitter component config
* fix(layout): pass the effective collapsed state to Sider semantic callbacks
* fix(watermark): keep the default 120×64 size for empty content to avoid a 0×0 draw error
* fix(locale): correct ja-JP Typography expand/collapse labels (#58563)

**🧪 Tests**

* test(menu): cover `itemData` in click/select/deselect callbacks (#58197)
* test: add cross-component tests for root semantic style priority

**🧰 Dependencies**

* chore(deps): upgrade `@antdv-next/icons` to 1.1.1 (new icons + `zeroRuntime` support to skip runtime style injection)
* chore(deps): upgrade the `@v-c` chain — picker 1.2.0 / select 1.1.3 / tabs 1.2.1

## V1.3.7

Release Date: 2026-06-25

This release advances the ant-design upstream sync to **6.4.5** and backfills the missing fixes (#58234 / #58214 / #58314 / #58371 / #58339), makes **Tabs panes mount lazily**, fixes **Pagination not emitting the update event in some scenarios** and **Table overriding the consumer's `components.header.table` when merging aria props**, and upgrades the `@v-c` chain (table 1.1.6 cell memo, virtual-list 1.0.9 height perf) for better performance.

**🐞 Fixes**

* fix: sync ant-design upstream changes (6.4.4 → 6.4.5) — [#613](https://github.com/antdv-next/antdv-next/pull/613)
* fix(tabs): lazily mount panes via `@v-c/tabs` 1.1.1 — [#612](https://github.com/antdv-next/antdv-next/pull/612)
* fix(pagination): some scenarios did not trigger the update event
* fix(table): preserve the consumer's `components.header.table` when merging aria props
* fix: sync ant-design upstream fixes (#58234 #58214 #58314 #58371 #58339)
* docs(locale): fill missing nb_NO (Norwegian) keys (#58439)

**🔧 Types**

* refactor(table): add a typed contract to HeaderTable

**🧪 Tests**

* test: reduce spurious deprecation warnings in demos and tests
* test: update snapshots

**🧰 Dependencies**

* chore(deps): upgrade the `@v-c` chain — table 1.1.6 (cell memo) + virtual-list 1.0.9 (height perf) — [#609](https://github.com/antdv-next/antdv-next/pull/609)
* chore: upgrade dependencies

## V1.3.6

Release Date: 2026-06-18

This release fixes **Segmented rendering an empty icon node for options without an icon**, **Dropdown not forwarding `menu`'s `classes` / `styles` / `rootClass`** and **Input emitting a duplicate `class` attribute**, relaxes the Form form-level `rules` type to a recursive `RulesMap`, and refines the DirectoryTree typing while bumping dependencies.

**🐞 Fixes**

* fix(segmented): no longer render an empty `.ant-segmented-item-icon` node for options without an `icon`, aligning with React ant-design (#600) — [#601](https://github.com/antdv-next/antdv-next/pull/601)
* fix(dropdown): forward `menu`'s `classes` / `styles` / `rootClass` to the overlay Menu instead of having them overridden by the explicit semantic classes (#599) — [#601](https://github.com/antdv-next/antdv-next/pull/601)
* fix(input): fix the duplicate `class` attribute

**🔧 Types**

* refactor(form): relax the form-level `rules` type to a recursive `RulesMap` so nested (`{ user: { email: [...] } }`) and indexed (`{ list: { 0: [...] } }`) configs type-check without casts — [#601](https://github.com/antdv-next/antdv-next/pull/601)
* perf(tree): refine DirectoryTree typing

**🧪 Tests**

* test: update Space and Transfer snapshots

**🧰 Dependencies**

* chore: upgrade dependencies

## V1.3.5

Release Date: 2026-06-13

This release fixes **Form.Item triggering a no-op meta update with a fresh meta object on every focus/blur, re-rendering its child** — combined with inline object props (e.g. `:show-time`) this reset DatePicker's in-panel draft selection, making the OK confirm impossible inside a-form-item — and bumps `@v-c/picker` for the companion fix.

**🐞 Fixes**

* fix(form): skip no-op meta updates to avoid re-rendering FormItem children (fixes DatePicker in-panel draft selection being reset inside a-form-item) — [#597](https://github.com/antdv-next/antdv-next/pull/597)

**🧰 Dependencies**

* chore(deps): bump `@v-c/picker` to ^1.1.3 for the companion fix where a parent re-render passing equivalent-but-new props reset the draft selection (antdv-next #597)
* chore: update the docs-site css

## V1.3.4

Release Date: 2026-06-12

This release advances the ant-design upstream sync to **6.4.4 (`b32376a31b`)** — back-fills every fix and companion test missed from the 6.4.4 changelog, **adds a "Global Config" column to every component API doc** and simplifies the ConfigProvider component-config section. It also introduces the **Form `useForm` / `useFormInstance`** hooks, fixes **popup misplacement under transformed ancestors** and the **Enter key mis-selecting on dropdown open in Select**, and bumps the `@v-c/*` dependencies to their released sync versions.

**✨ Features**

* feat(form): add `useForm` / `useFormInstance` hooks and align `validateFields` options with rc-field-form — [#586](https://github.com/antdv-next/antdv-next/pull/586)

**🐞 Fixes**

* fix(trigger): fix popup misplacement when an ancestor has a transform, and bump `@v-c` deps (dialog@1.2.0 / menu@1.2.0 / pagination@1.0.1 / picker@1.1.2 / select@1.1.1 / table@1.1.4); select@1.1.1 fixes the Enter key mis-selecting the first option right as the dropdown opens (#594) — [#595](https://github.com/antdv-next/antdv-next/pull/595)
* fix(slider): prevent text selection on adjacent content when dragging the handle in Safari (antd #58024) — [#596](https://github.com/antdv-next/antdv-next/pull/596)
* fix(splitter): show the collapse bar when the collapse button is keyboard-focused and support keyboard collapsing (antd #58060) — [#596](https://github.com/antdv-next/antdv-next/pull/596)
* fix(upload): consume the global `progress` config from ConfigProvider and keep the default progress style when unset (antd #58126) — [#596](https://github.com/antdv-next/antdv-next/pull/596)
* fix(notification): skip rendering the title node when `title` is empty so the close button no longer overlaps the description (antd #58096) — [#596](https://github.com/antdv-next/antdv-next/pull/596)
* fix(collapse): align with antd v6 so `expandIconPlacement` takes effect — [#592](https://github.com/antdv-next/antdv-next/pull/592)
* fix(modal): bump `@v-c/dialog` to 1.1.1 to fix `forceRender` — [#582](https://github.com/antdv-next/antdv-next/pull/582)
* fix(descriptions): fix label styles not applied in non-bordered mode — [#580](https://github.com/antdv-next/antdv-next/pull/580)
* fix(popconfirm): fix the `confirm` prop value not rendering — [#577](https://github.com/antdv-next/antdv-next/pull/577)
* fix(menu): bump `@v-c/menu` to 1.1.3 to fix large-menu toggle jank, with regression tests — [#587](https://github.com/antdv-next/antdv-next/pull/587) / [#589](https://github.com/antdv-next/antdv-next/pull/589)
* fix(menu): keep the collapsed menu icon aligned before the collapse animation plays (antd #58271)
* fix(radio): fix vertical Radio.Group button radius and adjacent borders (antd #58317)
* fix(tour): keep the previous-button hover text readable in primary mode (antd #58311)
* fix(auto-complete): restrict the `showSearch` type to prevent unsupported Select props leaking (antd #58104)
* fix(popover, popconfirm): keep rendering when `title` or `content` is the number `0` (antd #58296)
* fix(icon): keep the spin animation working with multiple `iconPrefixCls` (antd #58253)
* fix(locale): align `en_GB` texts with `en_US` (antd #58224)
* fix(calendar): align lunar demo selected and panel month colors, and fix year selection
* fix(docs): hide debug demo anchors in production

**💄 Styles**

* style: deepen the `boxShadowTertiary` shadow for better visibility on light backgrounds, affecting Card / Tour / Segmented (antd #58205)

**🧪 Tests**

* test: back-fill upstream companion tests for the Descriptions responsive `column` cascade, ColorPicker / Tag keyboard accessibility and Transfer root attribute passthrough (antd #58058 / #58040 / #58067 / #58166) — [#596](https://github.com/antdv-next/antdv-next/pull/596)
* test(tree-select): align focus tests with the `focusin` event semantics — [#595](https://github.com/antdv-next/antdv-next/pull/595)

**📝 Documentation**

* docs: add a "Global Config" column to every component API table marking props configurable via the ConfigProvider component config, and simplify the ConfigProvider component-config section into a key list (antd #58265 / #58290 / #58278) — [#596](https://github.com/antdv-next/antdv-next/pull/596)
* docs(form): demonstrate nested name-path field entries in the `global-state` demo (antd #58327) — [#596](https://github.com/antdv-next/antdv-next/pull/596)
* docs(date-picker): switch the basic demo to Flex layout (antd #58320) — [#596](https://github.com/antdv-next/antdv-next/pull/596)
* docs(progress): fix grammar in the `steps` description (antd #58325) — [#596](https://github.com/antdv-next/antdv-next/pull/596)
* docs: sync upstream doc and demo updates, and polish the docs-site page-turning navigation

## V1.3.3

Release Date: 2026-06-03

This release **syncs the ant-design 6.4.3 → 8b5c356f fix/feat batch into the main package** — Tooltip / Popover arrow drop-shadow, Checkbox / Modal / Result / Popconfirm / Select / DatePicker / Empty styles, Transfer / Tree / Table / Descriptions / Tabs behavior, and locale additions — **bumps the `@v-c/*` dependencies to their released sync versions**, fixes a **Menu `itemData` DOM leak**, and introduces a **debug-demo mechanism for the docs site** (visible in development, hidden in production).

**✨ Features**

* feat(docs): hide debug demos in the production build and give debug demos a purple border — [#568](https://github.com/antdv-next/antdv-next/pull/568)

**🐞 Fixes**

* fix(tooltip, popover): use drop-shadow for the arrow so it no longer stacks with the container shadow (antd #57988) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(checkbox): avoid lingering hover border style on touch devices (antd #58085) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(modal): correct footer button alignment when `confirmLoading` is true (antd #58120) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(result, popconfirm): correct status icon color inheritance (antd #58157) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(select): keep selected option active style themed and avoid disabled customize input background stacking (antd #58069 / #58114) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(date-picker, time-picker): make the clear button keyboard accessible (antd #58132) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(empty): use design tokens for SVG colors to support dark mode (antd #58152) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(tree): default `DirectoryTree` `defaultExpandParent` to `true` (antd #58068) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(table): add `presentation` role to the filter dropdown wrapper (antd #58164) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(descriptions): avoid inflated width inside a `max-content` ancestor (antd #58203) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(tabs): correct the more-dropdown motion direction when the placement flips (antd #58202) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(form): treat `help={false}` as no help (antd #58160) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(menu): do not leak the `itemData` prop to the DOM element — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* fix(locale): add Tour translations to `km_KH` and QRCode / ColorPicker translations to `pt_BR` (antd #58140 / #58188) — [#568](https://github.com/antdv-next/antdv-next/pull/568)

**⚡ Performance**

* perf(transfer): combine enabled key iteration (antd #58168) — [#568](https://github.com/antdv-next/antdv-next/pull/568)

**📝 Documentation**

* docs: register existing debug demos, sync the Table / AutoComplete demos (antd #58134 / #58114) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* docs(rate): drop native `className` / `style` rows from the API table (antd #58196) — [#568](https://github.com/antdv-next/antdv-next/pull/568)
* docs: align `CLAUDE.md` with `AGENTS.md` to keep repo guidance consistent — [#567](https://github.com/antdv-next/antdv-next/pull/567)

**🛠 Refactor & Maintenance**

* build(deps): bump `@v-c` trigger / menu / virtual-list to their released sync versions — [#568](https://github.com/antdv-next/antdv-next/pull/568)

**🧪 Tests**

* test(radio): cover uncontrolled checked state (antd #57917) — [#568](https://github.com/antdv-next/antdv-next/pull/568)

**Full Changelog**: [antdv-next@1.3.2...antdv-next@1.3.3](https://github.com/antdv-next/antdv-next/compare/antdv-next@1.3.2...antdv-next@1.3.3)

## V1.3.2

Release Date: 2026-06-03

This patch release **fixes a batch of component issues (TimePicker / DatePicker / Pagination / Switch / Tour / Upload / Modal), syncs ant-design master accessibility and responsive fixes**, and updates the `@v-c/table` dependency.

**🐞 Fixes**

* fix(time-picker): console error when clearing values — [#562](https://github.com/antdv-next/antdv-next/pull/562)
* fix(date-picker): the `inputReadonly` property passed is invalid — [#561](https://github.com/antdv-next/antdv-next/pull/561)
* fix(pagination): text line break overflow in some scenarios — [#557](https://github.com/antdv-next/antdv-next/pull/557)
* fix(switch): emit the `click` event from the Switch component — [#556](https://github.com/antdv-next/antdv-next/pull/556)
* fix(tour): exclude `children` from the button props spread to avoid a Vue DOM warning — [#555](https://github.com/antdv-next/antdv-next/pull/555)
* fix(upload): partial slots of `UploadDragger` are not properly transmitted through — [#553](https://github.com/antdv-next/antdv-next/pull/553)
* fix: sync ant-design master accessibility and responsive fixes — [#549](https://github.com/antdv-next/antdv-next/pull/549)
* fix(modal): support global config locale — [#546](https://github.com/antdv-next/antdv-next/pull/546)

**📝 Documentation**

* docs(image): supplement `focusTrap` — [#565](https://github.com/antdv-next/antdv-next/pull/565)
* docs(carousel): remove the missing component token demo — [#564](https://github.com/antdv-next/antdv-next/pull/564)
* docs(tabs): replace `children` with `content` — [#559](https://github.com/antdv-next/antdv-next/pull/559)
* docs(readme): improve contribution steps — [#551](https://github.com/antdv-next/antdv-next/pull/551)

**🛠 Refactor & Maintenance**

* chore(deps): update `@v-c/table` to 1.1.3 — [#550](https://github.com/antdv-next/antdv-next/pull/550)
* chore(deps): update `@v-c/table` to 1.1.2 — [#548](https://github.com/antdv-next/antdv-next/pull/548)

**Full Changelog**: [antdv-next@1.3.1...antdv-next@1.3.2](https://github.com/antdv-next/antdv-next/compare/antdv-next@1.3.1...antdv-next@1.3.2)

## V1.3.1

Release Date: 2026-05-20

This patch release **syncs the ant-design 6.4.3 P1 fixes (Result / DatePicker / Select), backports the upstream 6.4.3 Table / Mentions performance improvements**, and fixes an **Image runtime warning**.

**🐞 Fixes**

* fix: sync ant-design 6.4.3 P1 fixes (Result / DatePicker / Select) — [#541](https://github.com/antdv-next/antdv-next/pull/541)
* fix: fix image warning — [#539](https://github.com/antdv-next/antdv-next/pull/539)

**⚡ Performance**

* perf(table): sync ant-design 6.4.3 Table perf and `FilterResetProps` rename — [#542](https://github.com/antdv-next/antdv-next/pull/542)
* perf(mentions): sync ant-design 6.4.3 `getMentions` reduce iteration — [#543](https://github.com/antdv-next/antdv-next/pull/543)

**🧪 Tests**

* test(Table): add a test case for the `table-demo-expand-sticky` table component — [#540](https://github.com/antdv-next/antdv-next/pull/540)

**Full Changelog**: [antdv-next@1.3.0...antdv-next@1.3.1](https://github.com/antdv-next/antdv-next/compare/antdv-next@1.3.0...antdv-next@1.3.1)

## V1.3.0

Release Date: 2026-05-16

This release focuses on **syncing ant-design to 6.4.2, introducing the new BorderBeam component, migrating Notification / Message / Typography to antd v2 semantic structure, and expanding ConfigProvider coverage**, while also fixing **TypeScript bundler deep-subpath type resolution, Message transition mismatch, Notification close button spacing when title is empty, and Image popup.close semantic key naming**.

> ⚠️ This release contains breaking changes — see the **Breaking Changes** section below.

**✨ Features**

* feat: sync ant-design@6.4.2, covering Calendar / Splitter / Image / Wave / Modal / Drawer / ConfigProvider / Table / Tabs / Form / Menu / Tag / Tree / Tour / Typography / Notification / Message
* feat(border-beam): introduce the BorderBeam glow border component with docs, demos, and unit tests
* feat(typography): migrate to antd 6.4 v2 semantic structure; add `actions.placement` for action button group position; new `root` / `actions` / `action` / `textarea` semantic keys
* feat(notification): upgrade to vc-notification@2 with full v2 semantic slots `title` / `description` / `icon` / `actions` / `progress` / `close`; add `_InternalListDoNotUseOrYouWillBeFired` internal component for doc previews
* feat(message): sync antd 6.4 v2 semantic structure (`title` / `wrapper` / `list` / `listContent`); add `_InternalListDoNotUseOrYouWillBeFired`
* feat(form): add `help` / `helpItem` / `extra` semantic class and style support
* feat(transfer): add nested `source` / `target` semantic overrides — customize `section` / `header` / `title` / `body` / `list` / `item` / `itemIcon` / `itemContent` / `footer` per side
* feat(calendar): add `itemContent` semantic class and style
* feat(modal, tour, tag, popconfirm, image, statistic, tree, tree-select, input, popconfirm): add `close` / `icon` / `clear` / `value` / `itemSwitcher` semantic class/style support
* feat(config-provider): extend global component config for Select `allowClear` / `showSearch` / `loadingIcon`, DatePicker / TimePicker `allowClear` / `clearIcon`, Modal infoIcon/successIcon/warningIcon/errorIcon, Upload `progress` / `accept`, Modal / Drawer `focusable`, Mentions `allowClear`, Cascader icons, and more
* feat(menu): refresh item extra layout and tooltip padding
* feat(mentions): wire the popup z-index through `useZIndex`
* feat(cascader): support ConfigProvider `searchIcon` / `clearIcon` / `removeIcon` / `suffixIcon`
* feat(table): support ConfigProvider column defaults with per-column merge
* feat: upgrade vc-notification@2.0.0-rc.4, vc-input@1.1.0-rc.3, vc-picker@1.1.0-rc.3, vc-table@1.1.0-rc.2, vc-select@1.1.0-rc.1, vc-slider@1.1.0-rc.1, vc-resize-observer@1.1.0-rc.1, vc-tour@1.1.0-rc.2 etc.

**💥 Breaking Changes**

* **typography**: `classes.copy` / `classes.edit` / `classes.expand` / `classes.content` (and matching `styles.*`) are removed. Migrate to the unified `classes.action` / `styles.action` (single action button) and `classes.actions` / `styles.actions` (actions container).
* **message**: `classes.content` / `styles.content` are removed — use `classes.title` / `styles.title` instead. DOM moves from `notice-description > .custom-content` to `notice-title`, and the type modifier class moves from the root to `notice-wrapper`.
* **transfer**: `classes.source` / `classes.target` change from flat strings to nested objects. The old `classes={ source: 'foo' }` becomes `classes={ source: { section: 'foo' } }`.
* **image**: `classes.popup.closeIcon` / `styles.popup.closeIcon` are renamed to `popup.close` / `popup.close`, aligning with the underlying vc-image naming.

**🐞 Fixes**

* fix(pkg): add `index.d.ts` fallback to the `./dist/*` subpath exports — resolves TypeScript `moduleResolution: bundler` / `nodenext` failing to resolve deep type imports
* fix(message): switch the transition class from `move-up` to `fade`, restoring antd 6.x enter/leave animation
* fix(message): promote the icon from inline description into the v2 icon semantic slot
* fix(notification): pad description with `padding-inline-end` when the notice is closable but has no title — prevents the close button from overlapping description text
* fix(notification): position via `--notification-top` / `--notification-bottom` CSS variables to stop the holder from spanning full height
* fix(notification, message): re-add the v1 icon-wrapper class for backward compatibility
* fix(notification): in vc-notification, drop the broken onClose array merge and the invalid TransitionGroup tag (vc-notification 2.0.0-rc.2/rc.3 follow-ups)
* fix(border-beam): adjust the `offsetPath` corner radius from `200px` to `100px` so the beam no longer breaks at corners

**📝 Documentation & Demos**

* docs: add Notification / Message / Typography / Form / Transfer / Tag / Tour / Modal / Image / Calendar / Statistic / Tree / TreeSelect / Input / Popconfirm semantic DOM preview demos with bilingual locale copy
* docs(notification, message): refactor the style-class demo to match React 6.4's green/red function-style example
* docs(border-beam): add zh-CN / en-US component docs, demos, and sidebar registration

**🔄 Internal**

* upgrade vc-notification to 2.0.0-rc.4 (full v2 semantic structure + height patcher fix + leave animation fix)
* bump vc-input / vc-picker / vc-select / vc-table / vc-slider / vc-resize-observer / vc-tour / vc-notification rc versions — see catalog for details
* upgrade vc-overflow to 1.1.0-rc.1 (RTL logical offset fix)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.2.2...antdv-next@1.3.0

## V1.2.2

Release Date: 2026-04-28

This release focuses on **adding previous/next page navigation, supporting Table generic mode, and syncing the latest antd implementation up to 6.3.7**, while also **fixing Masonry slot typing, Card empty content rendering, Button motion, Form field behavior, and Table virtual scroll header synchronization**. It also improves the docs sidebar, Descriptions docs, column resize guidance, and synchronized documentation content.

**✨ Features**

* feat: add previous and next page turning by @selicens in [#491](https://github.com/antdv-next/antdv-next/pull/491)
* feat: support Table generic mode by @aibayanyu20 in [#496](https://github.com/antdv-next/antdv-next/pull/496)
* feat: sync antd by @aibayanyu20 in [#505](https://github.com/antdv-next/antdv-next/pull/505)
* feat: sync antd@6.3.7 by @aibayanyu20 in [#507](https://github.com/antdv-next/antdv-next/pull/507)

**🐞 Fixes**

* fix(masonry): add generic type support for the `itemRender` slot data field by @ayangweb in [#490](https://github.com/antdv-next/antdv-next/pull/490)
* fix(card): skip the empty body wrapper when there is no content by @ayangweb in [#493](https://github.com/antdv-next/antdv-next/pull/493)
* fix: fix Button motion by @aibayanyu20 in [#495](https://github.com/antdv-next/antdv-next/pull/495)
* fix: fix Form using the origin name incorrectly by @aibayanyu20 in [#498](https://github.com/antdv-next/antdv-next/pull/498)
* fix: fix Table header scroll not taking effect in virtual mode by @aibayanyu20 in [#499](https://github.com/antdv-next/antdv-next/pull/499)
* fix: fix Form auto-complete not taking effect by @aibayanyu20 in [#504](https://github.com/antdv-next/antdv-next/pull/504)

**📝 Documentation**

* docs(menu): optimize the sidebar to support opening links in a new tab by @cc-hearts in [#485](https://github.com/antdv-next/antdv-next/pull/485)
* docs(descriptions): update the Descriptions component documentation by @jiangrong-devops in [#501](https://github.com/antdv-next/antdv-next/pull/501)
* docs: fix unexpected sorting when adjusting column width by @think-gem in [#502](https://github.com/antdv-next/antdv-next/pull/502)
* docs: sync docs by @aibayanyu20 in [#506](https://github.com/antdv-next/antdv-next/pull/506)

**Full Changelog**
https://github.com/antdv-next/antdv-next/compare/antdv-next@1.2.1...antdv-next@1.2.2

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
