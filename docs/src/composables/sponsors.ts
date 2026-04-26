import type { Sponsor } from '@/config/sponsors'
import { computed, onMounted, shallowRef } from 'vue'
import { sponsors as fallbackSponsors, getHeaderSponsors, getHomeSponsors, sponsorApiBaseUrl } from '@/config/sponsors'

interface CommercialSponsorItem {
  amount?: number | string
  sponsorName?: string
  sponsorMessage?: string
  logoUrl?: string
  websiteUrl?: string
  websiteDescription?: string
  paidAt?: string
}

const commercialSponsors = shallowRef<Sponsor[]>(fallbackSponsors)
const commercialSponsorsLoading = shallowRef(false)
const commercialSponsorsLoaded = shallowRef(false)
let pendingRequest: Promise<void> | null = null

function normalizeCommercialSponsor(item: CommercialSponsorItem): Sponsor | null {
  const logo = item.logoUrl?.trim()
  const websiteUrl = item.websiteUrl?.trim()
  const name = item.sponsorName?.trim()

  if (!logo || !websiteUrl || !name)
    return null

  const description = item.websiteDescription?.trim() || item.sponsorMessage?.trim() || ''

  return {
    name,
    logo,
    amount: Number(item.amount) || 0,
    paidAt: item.paidAt,
    url: {
      cn: websiteUrl,
      en: websiteUrl,
    },
    opencollective: websiteUrl,
    description: {
      cn: description,
      en: description,
    },
  }
}

export async function fetchCommercialSponsors(force = false) {
  if (commercialSponsorsLoaded.value && !force)
    return
  if (pendingRequest)
    return pendingRequest

  commercialSponsorsLoading.value = true
  pendingRequest = fetch(`${sponsorApiBaseUrl}/sponsor/commercial/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: 1, pageSize: 100 }),
  })
    .then(async (res) => {
      const { code, data } = await res.json()
      if (code !== 0 || !data)
        return

      const items = (data.items || [])
        .map((item: CommercialSponsorItem) => normalizeCommercialSponsor(item))
        .filter(Boolean) as Sponsor[]

      commercialSponsors.value = items.length ? items : fallbackSponsors
      commercialSponsorsLoaded.value = true
    })
    .catch((error) => {
      console.error('获取商业赞助列表失败', error)
      commercialSponsors.value = fallbackSponsors
      commercialSponsorsLoaded.value = true
    })
    .finally(() => {
      commercialSponsorsLoading.value = false
      pendingRequest = null
    })

  return pendingRequest
}

export function useCommercialSponsors() {
  onMounted(() => {
    void fetchCommercialSponsors()
  })

  const headerSponsors = computed(() => getHeaderSponsors(3, commercialSponsors.value))
  const homeSponsors = computed(() => getHomeSponsors(9, commercialSponsors.value))

  return {
    commercialSponsors,
    commercialSponsorsLoading,
    headerSponsors,
    homeSponsors,
    refreshCommercialSponsors: () => fetchCommercialSponsors(true),
  }
}
