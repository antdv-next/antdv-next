import type { DefaultComponentDefinition } from './types'

export const defaultComponents: DefaultComponentDefinition[] = [
  {
    componentName: 'MenuItem',
    tagName: 'a-menu-item',
    description: 'Menu item used as a child of Menu or SubMenu.',
    lang: 'both',
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
    componentName: 'SubMenu',
    tagName: 'a-sub-menu',
    description: 'Submenu container used to group related menu items.',
    lang: 'both',
    attributes: [
      { name: 'disabled', description: 'Whether the submenu is disabled.', type: 'boolean', default: 'false' },
      { name: 'icon', description: 'Icon of the submenu.', type: 'VueNode' },
      { name: 'title', description: 'Title content of the submenu.', type: 'VueNode' },
      { name: 'popupClassName', description: 'Submenu popup class name. Not effective when `mode=\"inline\"`.', type: 'string' },
      { name: 'popupOffset', description: 'Submenu popup offset. Not effective when `mode=\"inline\"`.', type: '[number, number]' },
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
    componentName: 'MenuDivider',
    tagName: 'a-menu-divider',
    description: 'Divider line between menu items.',
    lang: 'both',
    attributes: [
      { name: 'dashed', description: 'Whether the divider line is dashed.', type: 'boolean', default: 'false' },
    ],
  },
  {
    componentName: 'MenuItemGroup',
    tagName: 'a-menu-item-group',
    description: 'Group container for related menu items.',
    lang: 'both',
    attributes: [
      { name: 'title', description: 'Title content of the menu item group.', type: 'VueNode' },
    ],
    slots: [
      { name: 'default', description: 'Grouped menu items.' },
      { name: 'title', description: 'Custom group title. Takes priority over the `title` prop.' },
    ],
  },
  {
    componentName: 'StyleProvider',
    tagName: 'a-style-provider',
    description: 'Provide CSS-in-JS context for styling configuration.',
    lang: 'both',
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
