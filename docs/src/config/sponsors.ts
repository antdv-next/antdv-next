import rawSponsorConfig from './sponsors.json'

export type SponsorLocale = 'cn' | 'en'

export interface Sponsor {
  name: string
  logo: string
  amount?: number
  paidAt?: string
  url: string | Partial<Record<SponsorLocale, string>>
  opencollective: string
  description: Partial<Record<SponsorLocale, string>>
}

export interface SponsorConfig {
  becomeSponsorUrl: string
  items: Sponsor[]
}

export const sponsorConfig = rawSponsorConfig as SponsorConfig
export const sponsors = sponsorConfig.items
export const sponsorApiBaseUrl = 'https://test-pay.lingyu.org.cn'

export function getPaidAtTime(sponsor: Sponsor) {
  return sponsor.paidAt ? new Date(sponsor.paidAt).getTime() : 0
}

function hasRealSponsor(items: Sponsor[]) {
  return items.some(sponsor => (sponsor.amount ?? 0) > 0)
}

function sortByTimeAndAmount(items: Sponsor[]) {
  return [...items].sort((a, b) => {
    const paidAtDiff = getPaidAtTime(b) - getPaidAtTime(a)
    if (paidAtDiff !== 0)
      return paidAtDiff

    return (b.amount ?? 0) - (a.amount ?? 0)
  })
}

function getDisplaySponsors(limit: number, items: Sponsor[]) {
  const candidates = hasRealSponsor(items)
    ? items.filter(sponsor => (sponsor.amount ?? 0) > 0)
    : items

  // 按「付款时间 + 金额」排序后取前 N 个：最近付款的自然排在前面，
  // 较早的付费赞助商填满剩余名额，最多展示 limit 个（对齐 ant-design 行为）。
  return sortByTimeAndAmount(candidates).slice(0, limit)
}

export function getHeaderSponsors(limit = 4, items = sponsors) {
  return getDisplaySponsors(limit, items)
}

export function getHomeSponsors(limit = 4, items = sponsors) {
  return getDisplaySponsors(limit, items)
}

export function getSponsorUrl(sponsor: Sponsor, locale: SponsorLocale) {
  if (typeof sponsor.url === 'string')
    return sponsor.url

  return sponsor.url[locale] ?? sponsor.url.en ?? ''
}

export function getSponsorDescription(sponsor: Sponsor, locale: SponsorLocale) {
  return sponsor.description[locale] ?? sponsor.description.en ?? ''
}
