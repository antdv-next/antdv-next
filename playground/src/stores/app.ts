import type { DemoCodeType } from '@/composables/local-store'
import { defineStore } from 'pinia'
import {
  compactModeStore,
  darkModeStore,
  demoCodeTypeStore,
  directionStore,
  happyModeStore,
  localeStore,
} from '@/composables/local-store'
import { menusMap } from '@/config/menu'

export interface AppState {
  headerKey: string[]
  siderKey: string[]
  siderOpenKeys: string[]
  locale: 'zh-CN' | 'en-US'
  darkMode: boolean
  compactMode: boolean
  happyMode: boolean
  direction: 'ltr' | 'rtl'
  demoCodeType: DemoCodeType
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      headerKey: [],
      siderKey: [],
      siderOpenKeys: [],
      locale: localeStore.value,
      darkMode: darkModeStore.value ?? false,
      compactMode: compactModeStore.value ?? false,
      happyMode: happyModeStore.value ?? false,
      direction: directionStore.value ?? 'ltr',
      demoCodeType: demoCodeTypeStore.value ?? 'ts',
    }
  },
  actions: {
    setHeaderKey(keys: string[]) {
      this.headerKey = keys
    },
    setSiderKey(keys: string[]) {
      this.siderKey = keys
    },
    setSiderOpenKeys(keys: string[]) {
      this.siderOpenKeys = keys
    },
    setLocale(locale: AppState['locale']) {
      this.locale = locale
      localeStore.value = locale
    },
    toggleDarkMode(darkMode?: boolean) {
      this.darkMode = darkMode || !this.darkMode
      darkModeStore.value = this.darkMode
    },
    toggleCompactMode(compactMode?: boolean) {
      this.compactMode = compactMode || !this.compactMode
      compactModeStore.value = this.compactMode
    },
    toggleHappyMode(happyMode?: boolean) {
      this.happyMode = happyMode !== undefined ? happyMode : !this.happyMode
      happyModeStore.value = this.happyMode
    },
    toggleDirection(direction?: 'ltr' | 'rtl') {
      this.direction = direction || (this.direction === 'ltr' ? 'rtl' : 'ltr')
      directionStore.value = this.direction
    },
    setDemoCodeType(type: DemoCodeType) {
      this.demoCodeType = type
      demoCodeTypeStore.value = type
    },
  },
  getters: {
    siderMenus(store) {
      const currentKey = store.headerKey[0]
      if (!currentKey) {
        return []
      }
      const currentMenus = menusMap[currentKey]
      if (currentMenus) {
        return currentMenus.menus
      }
      return []
    },

    siderLocales(store) {
      const currentKey = store.headerKey[0]
      if (!currentKey) {
        return {}
      }
      const currentMenus = menusMap[currentKey]
      if (currentMenus) {
        return currentMenus.locales
      }
      return {}
    },
  },
})
