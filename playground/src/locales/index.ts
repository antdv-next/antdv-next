import type { InnerLocale } from '@/utils/locale'
import enUS from './en-US'
import zhCN from './zh-CN'

export const locales = {
  'zh-CN': zhCN,
  'en-US': enUS,
} as const

export type Locales = typeof locales
export type LocaleMessages = Locales[InnerLocale]

export default locales
