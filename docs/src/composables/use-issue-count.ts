import { computed, ref, watch } from 'vue'

export interface UseIssueCountOptions {
  repo: string
  /** Reactive getter: whether the request should run. */
  enabled?: () => boolean
  /** Reactive getter: keywords matched against issue titles. */
  titleKeywords?: () => string[]
}

/**
 * Fetch the open-issue count for a component from the GitHub search API.
 * Vue port of ant-design's `useIssueCount`.
 */
export function useIssueCount(options: UseIssueCountOptions) {
  const { repo, enabled, titleKeywords } = options

  const issueCount = ref<number | undefined>(undefined)
  const loading = ref(false)

  const keywords = computed(() => (titleKeywords?.() ?? []).filter(Boolean))

  const searchUrl = computed(() => {
    const tokens = keywords.value.map(k => encodeURIComponent(k))
    const orExpr = tokens.length > 0 ? tokens.join('%20OR%20') : ''
    const titlePart = orExpr ? `in:title+(${orExpr})` : 'in:title'
    return `https://api.github.com/search/issues?q=repo:${repo}+is:issue+is:open+${titlePart}`
  })

  const issueNewUrl = `https://github.com/${repo}/issues/new/choose`

  const issueSearchUrl = computed(() => {
    const groupExpr = keywords.value.length > 0
      ? `(${keywords.value.map(k => `is:issue in:title ${k}`).join(' OR ')})`
      : ''
    const qRaw = `is:open ${groupExpr}`.trim()
    return `https://github.com/${repo}/issues?q=${encodeURIComponent(qRaw)}`
  })

  watch(
    () => [enabled?.() ?? true, searchUrl.value] as const,
    async ([isEnabled, url]) => {
      if (typeof window === 'undefined' || !isEnabled) {
        return
      }
      loading.value = true
      try {
        const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
        const data = await res.json()
        issueCount.value = typeof data?.total_count === 'number' && !Number.isNaN(data.total_count)
          ? data.total_count
          : 0
      }
      catch {
        issueCount.value = undefined
      }
      finally {
        loading.value = false
      }
    },
    { immediate: true },
  )

  return { issueCount, loading, issueNewUrl, issueSearchUrl }
}

export default useIssueCount
