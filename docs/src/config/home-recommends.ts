import rawHomeRecommends from './home-recommends.json'

export type HomeRecommendLocale = 'cn' | 'en'

export interface HomeRecommendItem {
  title: string
  description: string
  date: string
  source: string
  href: string
}

export interface HomeRecommendIcon {
  name: string
  href: string
}

export interface HomeRecommendConfig {
  items: Record<HomeRecommendLocale, HomeRecommendItem[]>
  icons: HomeRecommendIcon[]
}

export const homeRecommendConfig = rawHomeRecommends as HomeRecommendConfig

export function getHomeRecommends(locale: HomeRecommendLocale) {
  return homeRecommendConfig.items[locale]
}

export function getHomeRecommendIcons() {
  return homeRecommendConfig.icons
}
