import { toCnPathname } from '@/utils/locale-path'

interface IpAddrResponse {
  code?: number
  message?: string
  data?: {
    from?: string
    ip?: string
  }
}

interface StoredPreference {
  value: GeoRedirectPreference
  time: number
}

const CN_SITE_ORIGIN = 'https://www.antdv-next.cn'
const CN_SITE_PROBE_URL = `${CN_SITE_ORIGIN}/antdv-next.png`
const CN_SITE_PROBE_TIMEOUT = 1500
const GEO_IP_API_URL = 'https://v4_dx.boce.com:44433/ipaddr'
const GEO_IP_TIMEOUT = 1200
const GEO_REDIRECT_PREFERENCE_KEY = 'cn-site-redirect-preference'
// Asking again after a month keeps the prompt useful for travellers without nagging.
const GEO_REDIRECT_REJECTED_TTL = 30 * 24 * 60 * 60 * 1000
const GEO_REDIRECT_DEBUG_VALUE = 'antdv-next'
const GEO_REDIRECT_DISABLED_SEARCH = 'cn-redirect'

const INTERNATIONAL_HOSTNAMES = ['antdv-next.com', 'www.antdv-next.com']

// Mainland-only IANA zones. Hong Kong / Macao / Taipei are excluded on purpose:
// those regions reach the international site without the mainland channel.
const MAINLAND_TIME_ZONES = [
  'Asia/Shanghai',
  'Asia/Chongqing',
  'Asia/Chungking',
  'Asia/Harbin',
  'Asia/Urumqi',
  'Asia/Kashgar',
  'PRC',
]
const NON_MAINLAND_TIME_ZONES = ['Asia/Hong_Kong', 'Asia/Macau', 'Asia/Macao', 'Asia/Taipei']
const NON_MAINLAND_LANGUAGE_REGIONS = ['hk', 'mo', 'tw', 'sg', 'hant']
const NON_MAINLAND_IP_REGIONS = ['香港', '澳门', '澳門', '台湾', '台灣']

/** Score needed to prompt without asking the IP service. */
const LOCAL_SIGNAL_CONFIDENT_SCORE = 3

export type GeoRedirectPreference = 'accepted' | 'rejected'
export type GeoRedirectDecision = 'redirect' | 'prompt' | 'skip'

let cnSiteReachablePromise: Promise<boolean> | null = null

function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/\.$/, '')
}

function isInternationalHost(hostname: string): boolean {
  return INTERNATIONAL_HOSTNAMES.includes(normalizeHostname(hostname))
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  }
  catch {
    // Storage can throw when cookies are blocked; detection must not break the page.
    return null
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  }
  catch {
    // Ignore quota / privacy-mode failures, the prompt simply shows up again.
  }
}

/** `localStorage.DEBUG = 'antdv-next'` forces the flow on, including on localhost. */
function isDebugForced(): boolean {
  return readStorage('DEBUG') === GEO_REDIRECT_DEBUG_VALUE
}

/** `?cn-redirect=off` opts a single visit out, e.g. when linking the global site on purpose. */
function isDisabledBySearch(search: string): boolean {
  return new URLSearchParams(search).get(GEO_REDIRECT_DISABLED_SEARCH) === 'off'
}

function isRedirectableHost(hostname: string): boolean {
  // Only the two canonical international hosts are redirected, so preview
  // deployments (surge / vercel / netlify / pages.dev) and localhost stay untouched.
  return isInternationalHost(hostname) || isDebugForced()
}

function getLanguageTags(): string[] {
  const { languages, language } = window.navigator

  return (languages?.length ? [...languages] : [language])
    .filter(Boolean)
    .map(tag => tag.toLowerCase())
}

function getTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''
  }
  catch {
    return ''
  }
}

function isCnDocPathname(pathname: string): boolean {
  return /-cn\/?$/.test(pathname)
}

/**
 * Cheap local heuristics, scored so a single weak hint never triggers a prompt
 * on its own. A hard veto wins over any positive signal.
 */
function getLocalSignalScore(pathname: string): number {
  const languageTags = getLanguageTags()
  const timeZone = getTimeZone()

  const vetoed = NON_MAINLAND_TIME_ZONES.includes(timeZone)
    || languageTags.some(tag => tag.startsWith('zh-')
      && NON_MAINLAND_LANGUAGE_REGIONS.some(region => tag.includes(region)))

  if (vetoed) {
    return 0
  }

  let score = 0

  if (languageTags.some(tag => tag === 'zh-cn' || tag.startsWith('zh-hans'))) {
    score += 2
  }
  else if (languageTags.some(tag => tag === 'zh' || tag.startsWith('zh-'))) {
    score += 1
  }

  if (MAINLAND_TIME_ZONES.includes(timeZone)) {
    score += 2
  }

  if (isCnDocPathname(pathname)) {
    score += 1
  }

  return score
}

function isChinaMainlandVisit(from: string | undefined): boolean {
  if (!from) {
    return false
  }

  if (NON_MAINLAND_IP_REGIONS.some(region => from.includes(region))) {
    return false
  }

  return from === '中国' || from.startsWith('中国/')
}

/** Secondary confirmation, only used when the local signals are inconclusive. */
async function lookupChinaMainland(): Promise<boolean> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), GEO_IP_TIMEOUT)

  try {
    const response = await fetch(GEO_IP_API_URL, { signal: controller.signal })

    if (!response.ok) {
      return false
    }

    const result = await response.json() as IpAddrResponse

    return isChinaMainlandVisit(result.data?.from)
  }
  catch {
    // Ignore network and CORS failures to avoid blocking normal page usage.
    return false
  }
  finally {
    window.clearTimeout(timeoutId)
  }
}

/**
 * Never send visitors to a channel that cannot answer. An image request needs no
 * CORS headers, so this works even though the two sites are different origins.
 */
function probeCnSiteReachable(): Promise<boolean> {
  cnSiteReachablePromise ??= new Promise<boolean>((resolve) => {
    const image = new Image()
    let settled = false

    const settle = (reachable: boolean) => {
      if (!settled) {
        settled = true
        resolve(reachable)
      }
    }

    image.onload = () => settle(true)
    image.onerror = () => settle(false)
    image.src = CN_SITE_PROBE_URL

    window.setTimeout(() => settle(false), CN_SITE_PROBE_TIMEOUT)
  })

  return cnSiteReachablePromise
}

export function getGeoRedirectPreference(): GeoRedirectPreference | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = readStorage(GEO_REDIRECT_PREFERENCE_KEY)

  if (!raw) {
    return null
  }

  // Plain strings are what earlier versions stored, keep honouring them.
  if (raw === 'accepted' || raw === 'rejected') {
    return raw
  }

  let stored: StoredPreference | null = null

  try {
    stored = JSON.parse(raw) as StoredPreference
  }
  catch {
    return null
  }

  if (stored?.value !== 'accepted' && stored?.value !== 'rejected') {
    return null
  }

  if (stored.value === 'rejected' && Date.now() - stored.time > GEO_REDIRECT_REJECTED_TTL) {
    return null
  }

  return stored.value
}

export function setGeoRedirectPreference(preference: GeoRedirectPreference): void {
  if (typeof window === 'undefined') {
    return
  }

  writeStorage(
    GEO_REDIRECT_PREFERENCE_KEY,
    JSON.stringify({ value: preference, time: Date.now() } satisfies StoredPreference),
  )
}

export function buildCnRedirectUrl(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const { location } = window

  if (!isRedirectableHost(location.hostname) || location.pathname.startsWith('/~demos')) {
    return null
  }

  const targetUrl = new URL(CN_SITE_ORIGIN)
  targetUrl.pathname = toCnPathname(location.pathname)
  targetUrl.search = location.search
  targetUrl.hash = location.hash

  return targetUrl.href === location.href ? null : targetUrl.href
}

export function redirectToCnSite(): void {
  const targetUrl = buildCnRedirectUrl()

  if (targetUrl) {
    window.location.replace(targetUrl)
  }
}

export async function getChinaMainlandRedirectDecision(): Promise<GeoRedirectDecision> {
  if (typeof window === 'undefined') {
    return 'skip'
  }

  if (isDisabledBySearch(window.location.search) || !buildCnRedirectUrl()) {
    return 'skip'
  }

  const preference = getGeoRedirectPreference()

  if (preference === 'rejected') {
    return 'skip'
  }

  if (preference === 'accepted') {
    return await probeCnSiteReachable() ? 'redirect' : 'skip'
  }

  const score = isDebugForced()
    ? LOCAL_SIGNAL_CONFIDENT_SCORE
    : getLocalSignalScore(window.location.pathname)

  // No local hint at all: stay silent and spend no request on the IP service.
  if (score <= 0) {
    return 'skip'
  }

  if (score < LOCAL_SIGNAL_CONFIDENT_SCORE && !await lookupChinaMainland()) {
    return 'skip'
  }

  return await probeCnSiteReachable() ? 'prompt' : 'skip'
}
