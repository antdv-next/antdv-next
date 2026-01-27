export type InnerLocale = 'zh-CN' | 'en-US'

export function detectInnerLocale(fallback: InnerLocale = 'zh-CN'): InnerLocale {
  if (typeof navigator === 'undefined') {
    return fallback
  }
  const langs = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean) as string[]

  // 优先级：谁排在前面用谁
  for (const raw of langs) {
    const l = raw.toLowerCase()

    // zh / zh-cn / zh-hk / zh-tw ...
    if (l === 'zh' || l.startsWith('zh-'))
      return 'zh-CN'

    // en / en-us / en-gb / en-au ...
    if (l === 'en' || l.startsWith('en-'))
      return 'en-US'
  }

  return fallback
}
