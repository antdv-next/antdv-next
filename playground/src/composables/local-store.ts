import { useStorage } from '@vueuse/core'

export const localeStore = useStorage<'zh-CN' | 'en-US'>('locale', 'zh-CN')

export const darkModeStore = useStorage<boolean>('dark-mode', false)

export const compactModeStore = useStorage<boolean>('compact-mode', false)

export const directionStore = useStorage<'ltr' | 'rtl'>('direction', 'ltr')

export type ThemeMode = 'light' | 'dark' | 'system'

export const themeModeStore = useStorage<ThemeMode>('theme-mode', 'light')
