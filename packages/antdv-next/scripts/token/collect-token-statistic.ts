import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cliProgress from 'cli-progress'
import fs from 'fs-extra'
import { createSSRApp, Fragment, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

type RenderNode = ReturnType<typeof h> | Array<ReturnType<typeof h> | null> | null

type RenderFn = (component: any) => RenderNode

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../../../')
const output = path.resolve(repoRoot, 'playground/src/assets/token.json')

let antd: Record<string, any> = {}
let statistic: Record<string, { global: string[], component: Record<string, string | number> }> = {}
let createCache: typeof import('@antdv-next/cssinjs').createCache
let StyleProvider: typeof import('@antdv-next/cssinjs').StyleProvider

const bar = new cliProgress.SingleBar(
  {
    format: 'Collecting by component: [{bar}] {component} | {value}/{total}',
  },
  cliProgress.Presets.rect,
)

const blackList = ['ConfigProvider', 'Grid']

const ComponentCustomizeRender: Record<string, RenderFn> = {
  Affix: Affix => h(Affix, null, { default: () => h('div') }),
  BackTop: BackTop => h(BackTop),
  Cascader: Cascader => h(Fragment, null, [
    h(Cascader, { options: [] }),
    (antd as any).CascaderPanel ? h((antd as any).CascaderPanel, { options: [] }) : null,
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
    h(Space, null, { default: () => [h((antd as any).Button)] }),
    (antd as any).SpaceCompact
      ? h((antd as any).SpaceCompact, null, {
          default: () => [
            h((antd as any).Button),
            (antd as any).SpaceAddon ? h((antd as any).SpaceAddon, null, { default: () => '1' }) : null,
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
  Modal: Modal => h(Fragment, null, [
    h(Modal),
    (Modal as any)._InternalPanelDoNotUseOrYouWillBeFired
      ? h((Modal as any)._InternalPanelDoNotUseOrYouWillBeFired)
      : null,
    (Modal as any)._InternalPanelDoNotUseOrYouWillBeFired
      ? h((Modal as any)._InternalPanelDoNotUseOrYouWillBeFired, { type: 'confirm' })
      : null,
  ]),
  message: (message: any) => {
    const PurePanel = message._InternalPanelDoNotUseOrYouWillBeFired
    return PurePanel ? h(PurePanel) : null
  },
  notification: (notification: any) => {
    const PurePanel = notification._InternalPanelDoNotUseOrYouWillBeFired
    return PurePanel ? h(PurePanel) : null
  },
  Layout: () => h((antd as any).Layout, null, {
    default: () => [
      (antd as any).LayoutHeader ? h((antd as any).LayoutHeader, null, { default: () => 'Header' }) : null,
      (antd as any).LayoutSider ? h((antd as any).LayoutSider, null, { default: () => 'Sider' }) : null,
      (antd as any).LayoutContent ? h((antd as any).LayoutContent, null, { default: () => 'Content' }) : null,
      (antd as any).LayoutFooter ? h((antd as any).LayoutFooter, null, { default: () => 'Footer' }) : null,
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

async function renderComponent(compName: string, component: any, theme: any) {
  const cache = createCache()
  const ConfigProvider = (antd as any).ConfigProvider || Fragment
  const renderFunc = ComponentCustomizeRender[compName]
  const rendered = renderFunc ? renderFunc(component) : h(component)

  const app = createSSRApp({
    render: () => h(ConfigProvider, { theme }, {
      default: () => h(StyleProvider, { cache, mock: 'server' }, {
        default: () => h(Fragment, null, normalizeRender(rendered)),
      }),
    }),
  })

  await renderToString(app)
}

function resetStatistic() {
  Object.keys(statistic).forEach((key) => {
    delete statistic[key]
  })
}

async function collect(theme: any, label: string) {
  const components = Object.keys(antd)
    .filter(name => ComponentCustomizeRender[name] || isRenderableComponent(name, (antd as any)[name]))

  console.log(`Collecting token statistics (${label})`)
  bar.start(components.length, 0, { component: '' })

  for (const name of components) {
    bar.increment({ component: name })
    try {
      await renderComponent(name, (antd as any)[name], theme)
    }
    catch (error) {
      console.error(`Failed to render ${name}`)
      console.error(error)
    }
  }

  bar.stop()
}

async function main() {
  if (process.env.CSSINJS_STATISTIC) {
    ;(globalThis as any).CSSINJS_STATISTIC = true
  }

  const cssinjs = await import('@antdv-next/cssinjs')
  createCache = cssinjs.createCache
  StyleProvider = cssinjs.StyleProvider

  const cssinjsUtils = await import('@antdv-next/cssinjs/cssinjs-utils')
  statistic = cssinjsUtils.statistic

  const antdModule = await import('../../dist/components.js')
  antd = (antdModule as any).components_exports ?? antdModule

  resetStatistic()
  await collect({ hashed: false }, 'default')
  await collect({ hashed: false, token: { wireframe: true } }, 'wireframe')
  fs.ensureDirSync(path.dirname(output))
  fs.writeJsonSync(output, statistic, 'utf8')
  console.log(`Collected token statistics successfully, check it in ${output}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
