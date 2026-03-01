import type { Frontmatter } from '@/composables/doc-page.ts'

interface SeoMeta {
  title?: string
  description?: string
  keywords?: string[] | string
}

interface RouteLike {
  path: string
  fullPath?: string
  meta?: Record<string, any>
}

interface ApplyRouteSeoOptions {
  frontmatter?: Frontmatter
}

type LocaleCode = 'zh-CN' | 'en-US'

const SITE_NAME = 'Antdv Next'

const DEFAULT_SEO: Record<LocaleCode, Required<SeoMeta>> = {
  'zh-CN': {
    title: 'Antdv Next Vue 3 组件库',
    description: 'Antdv Next 是基于 Vue 3、TypeScript 与 TSX 的企业级 UI 组件库，提供完整组件文档、示例与主题定制能力。',
    keywords: [
      'Antdv Next',
      'Vue 3 组件库',
      'Ant Design Vue',
      'UI 组件',
      'TypeScript',
      'TSX',
      '组件文档',
    ],
  },
  'en-US': {
    title: 'Antdv Next Vue 3 Component Library',
    description: 'Antdv Next is an enterprise-class Vue 3 UI component library with TypeScript and TSX support, including comprehensive docs, demos, and theme customization.',
    keywords: [
      'Antdv Next',
      'Vue 3 component library',
      'Ant Design Vue',
      'UI components',
      'TypeScript',
      'TSX',
      'documentation',
    ],
  },
}

const PATH_SEO: Record<string, Record<LocaleCode, SeoMeta>> = {
  '/': {
    'zh-CN': {
      title: 'Antdv Next Vue 3 组件库',
      description: 'Antdv Next 组件库主页，提供 Vue 3 组件、主题能力与开发资源。',
      keywords: ['Antdv Next', 'Vue 3', '组件库', '设计系统'],
    },
    'en-US': {
      title: 'Antdv Next Vue 3 Component Library',
      description: 'Antdv Next homepage for Vue 3 UI components, theme customization, and developer resources.',
      keywords: ['Antdv Next', 'Vue 3', 'Component Library', 'Design System'],
    },
  },
  '/index-cn': {
    'zh-CN': {
      title: 'Antdv Next Vue 3 组件库',
      description: 'Antdv Next 组件库主页，提供 Vue 3 组件、主题能力与开发资源。',
      keywords: ['Antdv Next', 'Vue 3', '组件库', '设计系统'],
    },
    'en-US': {},
  },
  '/sponsor': {
    'zh-CN': {
      title: '赞助 Antdv Next',
      description: '支持 Antdv Next 社区持续建设，帮助我们完善 Vue 3 组件生态与文档体验。',
      keywords: ['Antdv Next 赞助', '开源赞助', 'Vue 3 组件库'],
    },
    'en-US': {
      title: 'Sponsor Antdv Next',
      description: 'Support Antdv Next community growth and help improve the Vue 3 component ecosystem and documentation experience.',
      keywords: ['Antdv Next sponsor', 'open source sponsorship', 'Vue 3 component library'],
    },
  },
  '/sponsor-cn': {
    'zh-CN': {
      title: '赞助 Antdv Next',
      description: '支持 Antdv Next 社区持续建设，帮助我们完善 Vue 3 组件生态与文档体验。',
      keywords: ['Antdv Next 赞助', '开源赞助', 'Vue 3 组件库'],
    },
    'en-US': {},
  },
  '/sponsor/success': {
    'zh-CN': {
      title: '赞助结果',
      description: '查看 Antdv Next 赞助支付结果与订单状态。',
      keywords: ['Antdv Next', '赞助结果', '支付状态'],
    },
    'en-US': {
      title: 'Sponsorship Result',
      description: 'Check sponsorship payment results and order status for Antdv Next.',
      keywords: ['Antdv Next', 'sponsorship result', 'payment status'],
    },
  },
  '/sponsor/success-cn': {
    'zh-CN': {
      title: '赞助结果',
      description: '查看 Antdv Next 赞助支付结果与订单状态。',
      keywords: ['Antdv Next', '赞助结果', '支付状态'],
    },
    'en-US': {},
  },
}

function detectLocaleFromPath(path: string): LocaleCode {
  return path.endsWith('-cn') || path === '/index-cn' ? 'zh-CN' : 'en-US'
}

function normalizeTitle(title: string): string {
  if (!title)
    return SITE_NAME
  return title.includes(SITE_NAME) ? title : `${title} - ${SITE_NAME}`
}

function normalizeKeywords(keywords?: string[] | string): string {
  if (!keywords)
    return ''
  const keywordList = Array.isArray(keywords) ? keywords : keywords.split(',')
  return Array.from(new Set(keywordList.map(item => item.trim()).filter(Boolean))).join(', ')
}

function ensureMetaByName(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function ensureMetaByProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function ensureCanonicalLink(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

function toDocFallbackTitle(path: string) {
  if (!path.startsWith('/components/'))
    return ''
  const segment = path.split('/').filter(Boolean).at(-1) ?? ''
  if (!segment)
    return ''
  return segment
    .split('-')
    .map(str => str.charAt(0).toUpperCase() + str.slice(1))
    .join(' ')
}

export function applyRouteSeo(to: RouteLike, options: ApplyRouteSeoOptions = {}) {
  if (typeof document === 'undefined')
    return

  const locale = detectLocaleFromPath(to.path)
  const defaultSeo = DEFAULT_SEO[locale]
  const routeMetaSeo = (to.meta?.seo ?? {}) as SeoMeta
  const pathSeo = PATH_SEO[to.path]?.[locale] ?? {}
  const docTitle = options.frontmatter?.title ?? toDocFallbackTitle(to.path)
  const docKeywords = docTitle
    ? locale === 'zh-CN'
      ? [docTitle, `${docTitle} API`, `${docTitle} 组件`]
      : [docTitle, `${docTitle} API`, `${docTitle} component`]
    : []

  const title = docTitle || routeMetaSeo.title || pathSeo.title || defaultSeo.title
  const description = options.frontmatter?.description || routeMetaSeo.description || pathSeo.description || defaultSeo.description

  const keywords = normalizeKeywords([
    ...defaultSeo.keywords,
    ...(Array.isArray(pathSeo.keywords) ? pathSeo.keywords : pathSeo.keywords?.split(',') ?? []),
    ...(Array.isArray(routeMetaSeo.keywords) ? routeMetaSeo.keywords : routeMetaSeo.keywords?.split(',') ?? []),
    ...docKeywords,
  ])

  const fullTitle = normalizeTitle(title)

  document.documentElement.lang = locale
  document.title = fullTitle

  ensureMetaByName('description', description)
  ensureMetaByName('keywords', keywords)
  ensureMetaByName('robots', 'index, follow')

  ensureMetaByProperty('og:site_name', SITE_NAME)
  ensureMetaByProperty('og:type', 'website')
  ensureMetaByProperty('og:title', fullTitle)
  ensureMetaByProperty('og:description', description)
  ensureMetaByName('twitter:card', 'summary_large_image')
  ensureMetaByName('twitter:title', fullTitle)
  ensureMetaByName('twitter:description', description)

  const canonical = `${window.location.origin}${to.path}`
  ensureCanonicalLink(canonical)
  ensureMetaByProperty('og:url', canonical)
}
