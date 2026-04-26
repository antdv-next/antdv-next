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

function isValidPaidAt(sponsor: Sponsor) {
  return Number.isFinite(getPaidAtTime(sponsor)) && getPaidAtTime(sponsor) > 0
}

function isRecentPaidSponsor(sponsor: Sponsor) {
  if (!isValidPaidAt(sponsor) || (sponsor.amount ?? 0) <= 0)
    return false

  const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  return getPaidAtTime(sponsor) >= oneMonthAgo
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

  const recentSponsors = candidates
    .filter(isRecentPaidSponsor)
    .sort((a, b) => {
      const paidAtDiff = getPaidAtTime(b) - getPaidAtTime(a)
      if (paidAtDiff !== 0)
        return paidAtDiff

      return (b.amount ?? 0) - (a.amount ?? 0)
    })
    .slice(0, limit)

  if (recentSponsors.length)
    return recentSponsors

  return sortByTimeAndAmount(candidates).slice(0, limit)
}

export function getHeaderSponsors(limit = 3, items = sponsors) {
  return getDisplaySponsors(limit, items)
}

export function getHomeSponsors(limit = 9, items = sponsors) {
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
