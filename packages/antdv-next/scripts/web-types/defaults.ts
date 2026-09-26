import type { SupplementDefinition } from './types'

/**
 * Curated data layered on top of what the markdown docs provide:
 *
 * - `extends`: inherit attributes/events/slots from another component
 *   (own items and doc items always win over inherited ones).
 * - `attributes` / `events` / `slots`: added when the docs do not list them.
 * - `description`: overrides the page-level description, which is too generic
 *   for child components such as `a-layout-header`.
 *
 * Every `component` must be declared in `global.d.ts`.
 */
export const supplements: SupplementDefinition[] = [
  // ---------------------------------------------------------------- Layout
  {
    component: 'ALayoutHeader',
    doc: 'layout',
    description: { zh: '布局的顶部区域，只能放在 Layout 中。', en: 'Header section of Layout. Must be placed inside Layout.' },
    slots: [{ name: 'default', description: 'Header content.' }],
  },
  {
    component: 'ALayoutContent',
    doc: 'layout',
    description: { zh: '布局的内容区域，只能放在 Layout 中。', en: 'Content section of Layout. Must be placed inside Layout.' },
    slots: [{ name: 'default', description: 'Main content.' }],
  },
  {
    component: 'ALayoutFooter',
    doc: 'layout',
    description: { zh: '布局的底部区域，只能放在 Layout 中。', en: 'Footer section of Layout. Must be placed inside Layout.' },
    slots: [{ name: 'default', description: 'Footer content.' }],
  },

  // ----------------------------------------------------------------- Input
  {
    component: 'AInput',
    attributes: [
      { name: 'placeholder', description: 'Placeholder text shown when the input is empty.', type: 'string' },
      { name: 'readonly', description: 'Whether the input is read-only.', type: 'boolean', default: 'false' },
    ],
  },
  {
    component: 'ATextarea',
    description: { zh: '多行文本输入框，支持自适应高度。除自身属性外，同 Input 属性。', en: 'Multi-line text input with auto size support. Accepts all Input props in addition to its own.' },
    extends: ['AInput'],
    attributes: [
      { name: 'rows', description: 'Number of visible text lines.', type: 'number' },
      { name: 'cols', description: 'Visible width of the textarea in average character widths.', type: 'number' },
    ],
  },
  {
    component: 'AInputSearch',
    description: { zh: '带有搜索按钮的输入框，同 Input 属性。', en: 'Input with a search button. Accepts all Input props.' },
    extends: ['AInput'],
  },
  {
    component: 'AInputPassword',
    description: { zh: '密码输入框，同 Input 属性。', en: 'Password input. Accepts all Input props.' },
    extends: ['AInput'],
  },
  {
    component: 'AInputGroup',
    doc: 'input',
    description: { zh: '输入框组合。已废弃，请使用 Space.Compact 代替。', en: 'Input group. Deprecated, use Space.Compact instead.' },
    attributes: [
      { name: 'size', description: 'Size of the grouped controls.', type: '`large` | `middle` | `small`', default: 'middle' },
    ],
    slots: [{ name: 'default', description: 'Grouped controls.' }],
  },

  // ----------------------------------------------------------------- Radio
  {
    component: 'ARadioButton',
    doc: 'radio',
    description: { zh: '按钮样式的单选框，需配合 RadioGroup 使用，属性同 Radio。', en: 'Button styled radio used inside RadioGroup. Same props as Radio.' },
  },

  // ------------------------------------------------------------ Typography
  {
    component: 'ATypographyLink',
    doc: 'typography',
    description: { zh: '文本链接，除自身属性外，同 Typography.Text 属性。', en: 'Link text. Accepts all Typography.Text props in addition to its own.' },
    extends: ['ATypographyText'],
    attributes: [
      { name: 'href', description: 'Target URL of the link.', type: 'string' },
      { name: 'target', description: 'Where to open the link, e.g. `_blank`.', type: 'string' },
      { name: 'rel', description: 'Relationship of the linked URL. Defaults to `noopener noreferrer` when `target="_blank"`.', type: 'string' },
    ],
  },

  // ------------------------------------------------------------------ Tabs
  {
    component: 'ATabPane',
    doc: 'tabs',
    description: { zh: '标签页面板，作为 Tabs 的子组件使用。', en: 'Tab panel, used as a child of Tabs.' },
    attributes: [
      { name: 'tab', description: 'Tab label.', type: 'VueNode' },
      { name: 'disabled', description: 'Whether the tab is disabled.', type: 'boolean', default: 'false' },
      { name: 'forceRender', description: 'Render the panel content even when it is inactive.', type: 'boolean', default: 'false' },
      { name: 'closable', description: 'Whether the tab can be closed in `editable-card` mode.', type: 'boolean', default: 'true' },
      { name: 'closeIcon', description: 'Custom close icon in `editable-card` mode.', type: 'VueNode' },
      { name: 'icon', description: 'Icon rendered before the tab label.', type: 'VueNode' },
      { name: 'destroyOnHidden', description: 'Destroy the panel content when the tab is hidden.', type: 'boolean', default: 'false' },
      { name: 'destroyInactiveTabPane', description: 'Deprecated, use `destroyOnHidden` instead.', type: 'boolean', deprecated: true },
    ],
    slots: [
      { name: 'default', description: 'Panel content.' },
      { name: 'tab', description: 'Custom tab label. Takes priority over the `tab` prop.' },
      { name: 'icon', description: 'Custom tab icon.' },
      { name: 'closeIcon', description: 'Custom close icon.' },
    ],
  },

  // --------------------------------------------------- Select / AutoComplete
  {
    component: 'ASelectOption',
    description: { zh: 'Select 的选项。', en: 'Option of Select.' },
    slots: [{ name: 'default', description: 'Option label.' }],
  },
  {
    component: 'ASelectOptGroup',
    description: { zh: 'Select 的选项分组。', en: 'Option group of Select.' },
    slots: [{ name: 'default', description: 'Options of the group.' }],
  },
  {
    component: 'AAutoCompleteOption',
    doc: 'auto-complete',
    description: { zh: 'AutoComplete 的选项，属性同 Select.Option。', en: 'Option of AutoComplete. Same props as Select.Option.' },
    extends: ['ASelectOption'],
  },

  // ----------------------------------------------------------------- Badge
  {
    component: 'ABadgeRibbon',
    doc: 'badge',
    description: { zh: '缎带形式的徽标，包裹在子元素外。', en: 'Ribbon style badge wrapping its children.' },
    attributes: [
      { name: 'text', description: 'Content inside the ribbon.', type: 'VueNode' },
      { name: 'color', description: 'Preset or custom color of the ribbon.', type: 'string' },
      { name: 'placement', description: 'Which corner the ribbon is placed at.', type: '`start` | `end`', default: 'end' },
      { name: 'classes', description: 'Semantic class names.', type: 'Record<`root` | `content` | `indicator`, string>' },
      { name: 'styles', description: 'Semantic inline styles.', type: 'Record<`root` | `content` | `indicator`, CSSProperties>' },
    ],
    slots: [
      { name: 'default', description: 'Wrapped content.' },
      { name: 'text', description: 'Custom ribbon content. Takes priority over the `text` prop.' },
    ],
  },

  // ---------------------------------------------------------- Descriptions
  {
    component: 'ADescriptionsItem',
    doc: 'descriptions',
    description: { zh: '描述列表项，作为 Descriptions 的子组件使用。', en: 'Item of Descriptions, used as a child of Descriptions.' },
    attributes: [
      { name: 'label', description: 'Label of the item.', type: 'VueNode' },
      { name: 'content', description: 'Content of the item. Takes priority over the default slot.', type: 'VueNode' },
      { name: 'span', description: 'Number of columns the item spans. `filled` fills the rest of the row.', type: 'number | `filled` | Partial<Record<Breakpoint, number>>', default: '1' },
      { name: 'classes', description: 'Semantic class names of the cell.', type: 'Record<`label` | `content`, string>' },
      { name: 'styles', description: 'Semantic inline styles of the cell.', type: 'Record<`label` | `content`, CSSProperties>' },
    ],
    slots: [
      { name: 'default', description: 'Content of the item.' },
      { name: 'label', description: 'Custom label. Takes priority over the `label` prop.' },
      { name: 'content', description: 'Custom content. Takes priority over the `content` prop.' },
    ],
  },

  // -------------------------------------------------------------- Timeline
  {
    component: 'ATimelineItem',
    doc: 'timeline',
    description: { zh: '时间轴节点，作为 Timeline 的子组件使用。', en: 'Node of Timeline, used as a child of Timeline.' },
    attributes: [
      { name: 'color', description: 'Preset or custom color of the dot.', type: 'string', default: 'blue' },
      { name: 'placement', description: 'Which side of the axis the content is placed on.', type: '`start` | `end`' },
      { name: 'position', description: 'Deprecated, use `placement` instead.', type: '`left` | `right`', deprecated: true },
      { name: 'loading', description: 'Show a loading dot.', type: 'boolean', default: 'false' },
      { name: 'title', description: 'Title of the node.', type: 'VueNode' },
      { name: 'content', description: 'Content of the node.', type: 'VueNode' },
      { name: 'label', description: 'Deprecated, use `title` instead.', type: 'VueNode', deprecated: true },
      { name: 'icon', description: 'Custom dot.', type: 'VueNode' },
      { name: 'dot', description: 'Deprecated, use `icon` instead.', type: 'VueNode', deprecated: true },
      { name: 'classes', description: 'Semantic class names.', type: 'Record<string, string>' },
      { name: 'styles', description: 'Semantic inline styles.', type: 'Record<string, CSSProperties>' },
    ],
    slots: [
      { name: 'title', description: 'Custom title.' },
      { name: 'content', description: 'Custom content.' },
      { name: 'icon', description: 'Custom dot.' },
    ],
  },

  // ------------------------------------------------------------ Breadcrumb
  {
    component: 'ABreadcrumbItem',
    doc: 'breadcrumb',
    description: { zh: '面包屑项，作为 Breadcrumb 的子组件使用。', en: 'Item of Breadcrumb, used as a child of Breadcrumb.' },
    attributes: [
      { name: 'href', description: 'Target URL of the item.', type: 'string' },
      { name: 'menu', description: 'Dropdown menu rendered for the item.', type: 'MenuProps & { items?: MenuItem[] }' },
      { name: 'dropdownProps', description: 'Props passed to the Dropdown.', type: 'DropdownProps' },
      { name: 'dropdownIcon', description: 'Custom dropdown icon.', type: 'VueNode' },
      { name: 'separator', description: 'Custom separator after this item.', type: 'VueNode' },
    ],
    events: [
      { name: 'click', description: 'Callback executed when the item is clicked.', type: '(event: MouseEvent) => void' },
    ],
    slots: [{ name: 'default', description: 'Item content.' }],
  },
  {
    component: 'ABreadcrumbSeparator',
    doc: 'breadcrumb',
    description: { zh: '自定义面包屑分隔符。', en: 'Custom separator between Breadcrumb items.' },
    slots: [{ name: 'default', description: 'Separator content.' }],
  },

  // ----------------------------------------------------------------- Space
  {
    component: 'ASpaceAddon',
    doc: 'space',
    description: { zh: 'Space.Compact 中的附加内容单元，样式与表单控件对齐。', en: 'Addon cell inside Space.Compact, styled to align with form controls.' },
    attributes: [
      { name: 'variant', description: 'Visual variant matching the sibling controls.', type: '`outlined` | `borderless` | `filled` | `underlined`', default: 'outlined' },
      { name: 'disabled', description: 'Render the addon in disabled style.', type: 'boolean', default: 'false' },
      { name: 'status', description: 'Validation status matching the sibling controls.', type: '`error` | `warning`' },
    ],
    slots: [{ name: 'default', description: 'Addon content.' }],
  },

  // ---------------------------------------------------------------- Upload
  {
    component: 'AUploadDragger',
    doc: 'upload',
    description: { zh: '拖拽上传区域，除自身属性外，同 Upload 属性。', en: 'Drag-and-drop upload area. Accepts all Upload props in addition to its own.' },
    extends: ['AUpload'],
    attributes: [
      { name: 'height', description: 'Height of the drop area.', type: 'number' },
    ],
  },

  // ----------------------------------------------------------------- Table
  {
    component: 'ATableColumn',
    description: { zh: '表格列，作为 Table 的子组件声明列。', en: 'Column declaration, used as a child of Table.' },
  },
  {
    component: 'ATableColumnGroup',
    description: { zh: '表格列分组，作为 Table 的子组件声明表头分组。', en: 'Column group declaration, used as a child of Table.' },
    slots: [{ name: 'default', description: 'Grouped columns.' }],
  },
  {
    component: 'ATableSummary',
    doc: 'table',
    description: { zh: '表格总结栏容器。', en: 'Summary container of Table.' },
    attributes: [
      { name: 'fixed', description: 'Pin the summary to the top or bottom while scrolling.', type: 'boolean | `top` | `bottom`' },
    ],
    slots: [{ name: 'default', description: 'Summary rows.' }],
  },
  {
    component: 'ATableSummaryRow',
    doc: 'table',
    description: { zh: '表格总结栏的行。', en: 'Row inside Table.Summary.' },
    events: [
      { name: 'click', description: 'Callback executed when the row is clicked.', type: '(event: MouseEvent) => void' },
    ],
    slots: [{ name: 'default', description: 'Summary cells.' }],
  },
  {
    component: 'ATableSummaryCell',
    doc: 'table',
    description: { zh: '表格总结栏的单元格。', en: 'Cell inside Table.Summary.Row.' },
    attributes: [
      { name: 'index', description: 'Column index the cell starts at.', type: 'number' },
      { name: 'colSpan', description: 'Number of columns the cell spans.', type: 'number', default: '1' },
      { name: 'rowSpan', description: 'Number of rows the cell spans.', type: 'number', default: '1' },
      { name: 'align', description: 'Text alignment of the cell.', type: '`left` | `center` | `right`' },
    ],
    slots: [{ name: 'default', description: 'Cell content.' }],
  },

  // ------------------------------------------------------ Date / Time picker
  {
    component: 'ARangePicker',
    extends: [{ component: 'ADatePicker', pick: ['events', 'slots'] }],
  },
  {
    component: 'ATimePicker',
    extends: [{ component: 'ADatePicker', pick: ['events'] }],
  },
  {
    component: 'ATimeRangePicker',
    description: { zh: '时间范围选择器，除自身属性外，同 RangePicker 属性。', en: 'Time range picker. Accepts all RangePicker props in addition to its own.' },
    extends: ['ARangePicker', { component: 'ATimePicker', pick: ['slots'] }],
  },

  // ------------------------------------------------------------------ Tree
  {
    component: 'ADirectoryTree',
    description: { zh: '文件目录样式的树，除自身属性外，同 Tree 属性。', en: 'Directory styled tree. Accepts all Tree props in addition to its own.' },
    extends: ['ATree'],
  },

  // ------------------------------------------------------------------ Menu
  {
    component: 'AMenuItem',
    doc: 'menu',
    description: 'Menu item used as a child of Menu or SubMenu.',
    attributes: [
      { name: 'danger', description: 'Display the danger style.', type: 'boolean', default: 'false' },
      { name: 'disabled', description: 'Whether the menu item is disabled.', type: 'boolean', default: 'false' },
      { name: 'icon', description: 'Icon of the menu item.', type: 'VueNode' },
      { name: 'extra', description: 'Extra content rendered at the end of the menu item.', type: 'VueNode' },
      { name: 'title', description: 'Title content used for the collapsed tooltip.', type: 'VueNode' },
    ],
    slots: [
      { name: 'default', description: 'Menu item content.' },
      { name: 'icon', description: 'Custom icon content. Takes priority over the `icon` prop.' },
      { name: 'title', description: 'Custom title content. Takes priority over the `title` prop.' },
      { name: 'extra', description: 'Custom extra content rendered at the end of the item.' },
    ],
  },
  {
    component: 'ASubMenu',
    doc: 'menu',
    description: 'Submenu container used to group related menu items.',
    attributes: [
      { name: 'disabled', description: 'Whether the submenu is disabled.', type: 'boolean', default: 'false' },
      { name: 'icon', description: 'Icon of the submenu.', type: 'VueNode' },
      { name: 'title', description: 'Title content of the submenu.', type: 'VueNode' },
      { name: 'popupClassName', description: 'Submenu popup class name. Not effective when `mode="inline"`.', type: 'string' },
      { name: 'popupOffset', description: 'Submenu popup offset. Not effective when `mode="inline"`.', type: '[number, number]' },
      { name: 'popupStyle', description: 'Inline style of the submenu popup.', type: 'CSSProperties' },
      {
        name: 'popupRender',
        description: 'Custom renderer for the current submenu popup.',
        type: '(node: VueNode, info: { item: SubMenuProps; keys: string[] }) => VueNode',
      },
      { name: 'theme', description: 'Color theme of the submenu. Inherits from Menu by default.', type: '`light` | `dark`' },
    ],
    slots: [
      { name: 'default', description: 'Submenu items.' },
      { name: 'icon', description: 'Custom icon content. Takes priority over the `icon` prop.' },
      { name: 'title', description: 'Custom title content. Takes priority over the `title` prop.' },
    ],
  },
  {
    component: 'AMenuDivider',
    doc: 'menu',
    description: 'Divider line between menu items.',
    attributes: [
      { name: 'dashed', description: 'Whether the divider line is dashed.', type: 'boolean', default: 'false' },
    ],
  },
  {
    component: 'AMenuItemGroup',
    doc: 'menu',
    description: 'Group container for related menu items.',
    attributes: [
      { name: 'title', description: 'Title content of the menu item group.', type: 'VueNode' },
    ],
    slots: [
      { name: 'default', description: 'Grouped menu items.' },
      { name: 'title', description: 'Custom group title. Takes priority over the `title` prop.' },
    ],
  },

  // --------------------------------------------------------- StyleProvider
  {
    component: 'AStyleProvider',
    description: 'Provide CSS-in-JS context for styling configuration.',
    attributes: [
      { name: 'autoClear', description: 'Clear style cache on unmount.', type: 'boolean' },
      {
        name: 'cache',
        description: 'Set when you need SSR to extract style on your own. If not provided, it auto creates <style /> on server side.',
        type: 'CacheEntity',
      },
      { name: 'defaultCache', description: 'Tell children this context is default generated context.', type: 'boolean' },
      { name: 'hashPriority', description: 'Use :where selector to reduce hashId selector priority.', type: 'HashPriority' },
      { name: 'container', description: 'Tell cssinjs where to inject style in.', type: 'Element | ShadowRoot' },
      { name: 'ssrInline', description: 'Render inline <style /> for SSR fallback. Not recommended.', type: 'boolean' },
      {
        name: 'transformers',
        description: 'Transform css before inject in document. Transformers do not support dynamic update.',
        type: 'Transformer[]',
      },
      {
        name: 'linters',
        description:
          'Linters to lint css before inject in document. Styles linted after transforming. Linters do not support dynamic update.',
        type: 'Linter[]',
      },
      { name: 'layer', description: 'Wrap css in a layer to avoid global style conflict.', type: 'boolean' },
      { name: 'autoPrefix', description: 'Hardcode here since transformer not support serialize effect.', type: 'boolean' },
    ],
  },
]
