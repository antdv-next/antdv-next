import type { RouteRecordRaw } from 'vue-router'
import type { AntdvMenuItem } from '@/config/menu/interface'
import { docsMenus } from '@/config/menu/docs'

const cnDocs = import.meta.glob('/src/pages/components/*/index.zh-CN.md')
const enDocs = import.meta.glob('/src/pages/components/*/index.en-US.md')
const otherDocs = import.meta.glob([
  '/src/pages/**/*.zh-CN.md',
  '/src/pages/**/*.en-US.md',
  '!/src/pages/components/*/index.zh-CN.md',
  '!/src/pages/components/*/index.en-US.md',
])

function normalizeCustomDocRoutePath(path: string) {
  const routePath = path.replace('/src/pages', '')

  if (routePath.endsWith('/index.en-US.md')) {
    return routePath.replace('/index.en-US.md', '')
  }

  if (routePath.endsWith('/index.zh-CN.md')) {
    return `${routePath.replace('/index.zh-CN.md', '')}-cn`
  }

  return routePath
    .replace('.en-US.md', '')
    .replace('.zh-CN.md', '-cn')
}

export function generateDocRoutes() {
  const routes: RouteRecordRaw[] = []
  // 处理中文文档
  for (const path in enDocs) {
    // 去掉路径和后缀，得到请求的路由
    const routePath = path.replace('/index.en-US.md', '').replace('/src/pages', '').toLowerCase()
    routes.push({
      path: routePath,
      component: enDocs[path] as any,
    })
    const cnPath = path.replace('index.en-US.md', 'index.zh-CN.md')
    if (cnDocs[cnPath]) {
      routes.push({
        path: `${routePath}-cn`,
        component: cnDocs[cnPath] as any,
      })
    }
  }
  return routes
}

function generateCustomDocRoutes() {
  const routes: RouteRecordRaw[] = []

  for (const path in otherDocs) {
    const routePath = normalizeCustomDocRoutePath(path)
    const component = otherDocs[path] as any
    if (component) {
      routes.push({
        path: routePath,
        component,
      })
    }
  }

  return routes
}

function flattenMenuKeys(items: AntdvMenuItem[]) {
  const result: string[] = []
  items.forEach((item) => {
    if (!item)
      return
    if (item.type === 'group' && item.children) {
      result.push(...flattenMenuKeys(item.children))
      return
    }
    if (typeof item.key === 'string' && item.key.startsWith('/'))
      result.push(item.key)
  })
  return result
}

function buildRouteMap(routes: RouteRecordRaw[]) {
  return routes.reduce<Record<string, RouteRecordRaw>>((acc, route) => {
    if (route.path)
      acc[route.path] = route
    return acc
  }, {})
}

function getRouteGroupChildren(
  prefix: string,
  menuKeys: string[],
  routeMap: Record<string, RouteRecordRaw>,
) {
  const ordered: RouteRecordRaw[] = []
  const used = new Set<string>()

  menuKeys.forEach((menuKey) => {
    const route = routeMap[menuKey]
    if (route && !used.has(menuKey)) {
      ordered.push(route)
      used.add(menuKey)
    }
    const cnKey = `${menuKey}-cn`
    const cnRoute = routeMap[cnKey]
    if (cnRoute && !used.has(cnKey)) {
      ordered.push(cnRoute)
      used.add(cnKey)
    }
  })

  const extras = Object.keys(routeMap)
    .filter(path => path.startsWith(prefix) && !used.has(path))
    .sort((a, b) => a.localeCompare(b))
    .map(path => routeMap[path]!)

  return [...ordered, ...extras]
}

function getDocsRootRedirect(
  menuPrefixes: string[],
  menuKeyMap: Record<string, string[]>,
  routeMap: Record<string, RouteRecordRaw>,
) {
  for (const prefix of menuPrefixes) {
    const keys = menuKeyMap[prefix] || []
    for (const key of keys) {
      if (routeMap[key])
        return key
      if (routeMap[`${key}-cn`])
        return `${key}-cn`
    }
  }
  const fallback = Object.keys(routeMap).sort()[0]
  return fallback ?? '/docs/vue/introduce'
}

function getGroupRedirect(children: RouteRecordRaw[], prefix: string, locale: 'en-US' | 'zh-CN') {
  if (locale === 'zh-CN') {
    return children.find(route => typeof route.path === 'string' && route.path.endsWith('-cn'))?.path
      || `${prefix}-cn`
  }

  return children.find(route => typeof route.path === 'string' && !route.path.endsWith('-cn'))?.path
    || prefix
}

function generateGroupedDocRoutes() {
  const allRoutes = [
    ...generateCustomDocRoutes(),
    ...generateDocRoutes(),
  ]
  const routeMap = buildRouteMap(allRoutes)
  const menuPrefixes = Object.keys(docsMenus)
  const menuKeyMap = menuPrefixes.reduce<Record<string, string[]>>((acc, prefix) => {
    acc[prefix] = flattenMenuKeys(docsMenus[prefix] || [])
    return acc
  }, {})

  return {
    groups: menuPrefixes.flatMap((prefix) => {
      const children = getRouteGroupChildren(prefix, menuKeyMap[prefix]!, routeMap)
      return [
        {
          path: prefix,
          redirect: getGroupRedirect(children, prefix, 'en-US'),
          children,
        },
        {
          path: `${prefix}-cn`,
          redirect: getGroupRedirect(children, prefix, 'zh-CN'),
        },
      ]
    }),
    rootRedirect: getDocsRootRedirect(menuPrefixes, menuKeyMap, routeMap),
  }
}

const docGroups = generateGroupedDocRoutes()

export default [
  {
    path: '/docs',
    redirect: docGroups.rootRedirect,
    component: () => import('@/layouts/docs/index.vue'),
    children: docGroups.groups,
  },
] as RouteRecordRaw[]
