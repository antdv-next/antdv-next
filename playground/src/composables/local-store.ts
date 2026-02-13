import type { InnerLocale } from '@/utils/locale'
import { useStorage } from '@vueuse/core'
import { detectInnerLocale } from '@/utils/locale'

export const localeStore = useStorage<InnerLocale>('locale', detectInnerLocale())

export const darkModeStore = useStorage<boolean>('dark-mode', false)

export const compactModeStore = useStorage<boolean>('compact-mode', false)

export const happyModeStore = useStorage<boolean>('happy-mode', false)

export const directionStore = useStorage<'ltr' | 'rtl'>('direction', 'ltr')

export type ThemeMode = 'light' | 'dark' | 'system'

export const themeModeStore = useStorage<ThemeMode>('theme-mode', 'light')

export type DemoCodeType = 'ts' | 'js'

export const demoCodeTypeStore = useStorage<DemoCodeType>('demo-code-type', 'ts')
