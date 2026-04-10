import { toCnPathname } from '@/utils/locale-path'

interface IpAddrResponse {
  code?: number
  message?: string
  data?: {
    from?: string
    ip?: string
  }
}

const CN_SITE_ORIGIN = 'https://www.antdv-next.cn'
const GEO_IP_API_URL = 'https://v4_dx.boce.com:44433/ipaddr'
const GEO_IP_TIMEOUT = 1200
const GEO_REDIRECT_PREFERENCE_KEY = 'cn-site-redirect-preference'

export type GeoRedirectPreference = 'accepted' | 'rejected'
export type GeoRedirectDecision = 'redirect' | 'prompt' | 'skip'

function isComHost(hostname: string): boolean {
  const normalizedHostname = hostname.trim().toLowerCase().replace(/\.$/, '')

  return normalizedHostname === 'antdv-next.com'
    || normalizedHostname === 'www.antdv-next.com'
}

function isChinaMainlandVisit(from: string | undefined): boolean {
  if (!from) {
    return false
  }

  return from === '中国' || from.startsWith('中国/')
}

export function getGeoRedirectPreference(): GeoRedirectPreference | null {
  if (typeof window === 'undefined') {
    return null
  }

  const preference = window.localStorage.getItem(GEO_REDIRECT_PREFERENCE_KEY)

  return preference === 'accepted' || preference === 'rejected' ? preference : null
}

export function setGeoRedirectPreference(preference: GeoRedirectPreference): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(GEO_REDIRECT_PREFERENCE_KEY, preference)
}

export function buildCnRedirectUrl(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const { location } = window

  if (!isComHost(location.hostname) || location.pathname.startsWith('/~demos')) {
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

  const targetUrl = buildCnRedirectUrl()

  if (!targetUrl) {
    return 'skip'
  }

  const preference = getGeoRedirectPreference()

  if (preference === 'accepted') {
    return 'redirect'
  }

  if (preference === 'rejected') {
    return 'skip'
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), GEO_IP_TIMEOUT)

  try {
    const response = await fetch(GEO_IP_API_URL, {
      signal: controller.signal,
    })

    if (!response.ok) {
      return 'skip'
    }

    const result = await response.json() as IpAddrResponse

    return isChinaMainlandVisit(result.data?.from) ? 'prompt' : 'skip'
  }
  catch {
    // Ignore network and CORS failures to avoid blocking normal page usage.
    return 'skip'
  }
  finally {
    window.clearTimeout(timeoutId)
  }
}
