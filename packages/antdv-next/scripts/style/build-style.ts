import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { createSSRApp, Fragment, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
// eslint-disable-next-line antfu/no-import-dist
import * as _antd from '../../dist/components.js'

const antd = (_antd as any).components_exports ?? _antd

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const output = path.resolve(__dirname, '../../dist/antd.css')

const blackList = ['ConfigProvider', 'Grid']

type RenderNode = ReturnType<typeof h> | Array<ReturnType<typeof h> | null> | null

type RenderFn = (component: any) => RenderNode

const ComponentCustomizeRender: Record<string, RenderFn> = {
  Affix: Affix => h(Affix, null, { default: () => h('div') }),
  BackTop: BackTop => h(BackTop),
  Cascader: Cascader => h(Fragment, null, [
    h(Cascader, { options: [] }),
    antd.CascaderPanel ? h(antd.CascaderPanel, { options: [] }) : null,
  ]),
  Dropdown: Dropdown => h(Dropdown, { menu: { items: [] } }, { default: () => h('div') }),
  Menu: Menu => h(Menu, { items: [] }),
  QRCode: QRCode => h(QRCode, { value: 'https://antdv-next.com' }),
  Tree: Tree => h(Tree, { treeData: [] }),
  Tag: Tag => h(Fragment, null, [
    h(Tag, { color: 'blue' }, { default: () => 'Tag' }),
    h(Tag, { color: 'success' }, { default: () => 'Tag' }),
  ]),
  Badge: Badge => h(Fragment, null, [
    h(Badge),
    (Badge as any).Ribbon
      ? h((Badge as any).Ribbon, { text: 'Ribbon' }, { default: () => h('div') })
      : null,
  ]),
  Space: Space => h(Fragment, null, [
    h(Space, null, { default: () => [h(antd.Button)] }),
    antd.SpaceCompact
      ? h(antd.SpaceCompact, null, {
          default: () => [
            h(antd.Button),
            antd.SpaceAddon ? h(antd.SpaceAddon, null, { default: () => '1' }) : null,
          ],
        })
      : null,
  ]),
  Input: (Input) => {
    const Group = (Input as any).Group
    const Search = (Input as any).Search
    const TextArea = (Input as any).TextArea
    const Password = (Input as any).Password
    const OTP = (Input as any).OTP

    return h(Fragment, null, [
      h(Input),
      Group
        ? h(Group, null, { default: () => [h(Input), h(Input)] })
        : null,
      Search ? h(Search) : null,
      TextArea ? h(TextArea) : null,
      Password ? h(Password) : null,
      OTP ? h(OTP) : null,
    ])
  },
  Modal: (Modal) => {
    const PureModal = (Modal as any)._InternalPanelDoNotUseOrYouWillBeFired
    return h(Fragment, null, [
      h(Modal),
      PureModal
        ? h(PureModal)
        : null,
      PureModal
        ? h(PureModal, { type: 'confirm' })
        : null,
    ])
  },
  message: (message: any) => {
    const PurePanel = message._InternalPanelDoNotUseOrYouWillBeFired
    return PurePanel ? h(PurePanel) : null
  },
  notification: (notification: any) => {
    const PurePanel = notification._InternalPanelDoNotUseOrYouWillBeFired
    return PurePanel ? h(PurePanel) : null
  },
  Layout: () => h(antd.Layout, null, {
    default: () => [
      antd.LayoutHeader ? h(antd.LayoutHeader, null, { default: () => 'Header' }) : null,
      antd.LayoutSider ? h(antd.LayoutSider, null, { default: () => 'Sider' }) : null,
      antd.LayoutContent ? h(antd.LayoutContent, null, { default: () => 'Content' }) : null,
      antd.LayoutFooter ? h(antd.LayoutFooter, null, { default: () => 'Footer' }) : null,
    ],
  }),
}

function shouldRenderComponent(name: string) {
  if (blackList.includes(name))
    return false
  return name[0] === name![0]!.toUpperCase() || name === 'message' || name === 'notification'
}

function isRenderableComponent(name: string, component: any) {
  if (!shouldRenderComponent(name))
    return false
  if (!component)
    return false
  if (typeof component === 'function')
    return true
  if (typeof component === 'object') {
    return Boolean((component as any).render || (component as any).setup || (component as any).__asyncLoader)
  }
  return false
}

function normalizeRender(node: RenderNode): ReturnType<typeof h>[] {
  if (!node)
    return []
  return Array.isArray(node)
    ? node.filter(Boolean) as ReturnType<typeof h>[]
    : [node]
}

const notHas = [
  'AutoCompleteOption',
  // 'AvatarGroup',
  // 'BadgeRibbon',
  // 'CardGrid',
  // 'CardMeta',
  // 'CascaderPanel',
  // 'CheckboxGroup',
  // 'Color',
  // 'DateMonthPicker',
  // 'DateQuarterPicker',
  // 'DateRangePicker',
  // 'DateWeekPicker',
  // 'DateYearPicker',
  // 'BackTop',
  // 'FloatButtonGroup',
  // 'FormItem',
  // 'Col',
  // 'Row',
  // 'ImagePreviewGroup',
  // 'InputGroup',
  // 'InputOTP',
  // 'InputPassword',
  // 'InputSearch',
  // 'TextArea',
  // 'LayoutContent',
  // 'LayoutFooter',
  // 'LayoutHeader',
  // 'LayoutSider',
  // 'useLayoutSider',
  // 'MentionsOption',
  // 'MenuDivider',
  // 'MenuItem',
  // 'SubMenu',
  // 'useMessage',
  // 'useModal',
  // 'useNotification',
  // 'Progress',
  // 'RadioButton',
  // 'RadioGroup',
  // 'Segmented',
  // 'SelectOptGroup',
  // 'SelectOption',
  // 'SkeletonAvatar',
  // 'SkeletonButton',
  // 'SkeletonImage',
  // 'SkeletonInput',
  // 'SkeletonNode',
  // 'SpaceAddon',
  // 'SpaceCompact',
  // 'SplitterPanel',
  // 'StatisticTimer',
  // 'TableColumn',
  // 'TableColumnGroup',
  // 'TableSummary',
  // 'TableSummaryCell',
  // 'TableSummaryRow',
  // 'TabPane',
  // 'CheckableTag',
  // 'CheckableTagGroup',
  // 'TimeRangePicker',
  // 'TypographyLink',
  // 'TypographyParagraph',
  // 'TypographyText',
  // 'TypographyTitle',
  // 'UploadDragger',
  // 'DirectoryTree',
  'UniqueProvider',
]

function defaultNode() {
  const nodes = Object.keys(antd).filter((name) => {
    return !notHas.includes(name)
  }).filter(name => isRenderableComponent(name, (antd as any)[name]) || ComponentCustomizeRender[name]).map((compName) => {
    const Comp = (antd as any)[compName]
    const renderFunc = ComponentCustomizeRender[compName]
    const rendered = renderFunc ? renderFunc(Comp) : h(Comp)
    return h(Fragment, { key: compName }, normalizeRender(rendered))
  })

  return h(Fragment, null, nodes)
}

async function extractStyleText(customTheme?: (node: ReturnType<typeof h>) => ReturnType<typeof h>) {
  const cache = createCache()
  const ConfigProvider = (antd as any).ConfigProvider || Fragment
  const app = createSSRApp({
    render: () => h(ConfigProvider, { theme: { hashed: false } }, {
      default: () => h(StyleProvider, { cache, mock: 'server' }, {
        default: () => customTheme ? customTheme(defaultNode()) : defaultNode(),
      }),
    }),
  })

  await renderToString(app)
  return extractStyle(cache, { plain: true, types: 'style' })
}

async function buildStyle() {
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.rm(output, { force: true })
  const styleText = await extractStyleText()
  await fs.writeFile(output, styleText)
  console.log(`Style output saved to dist/antd.css`)
}

async function main() {
  if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
    await buildStyle()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
