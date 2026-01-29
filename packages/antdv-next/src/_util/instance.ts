import { getCurrentInstance } from 'vue'
import { globalConfig } from '../config-provider'

export function getVueInstance() {
  const instance = getCurrentInstance()
  const global = globalConfig()

  if (!instance) {
    return global.appContext ?? null
  }
  return instance.appContext
}
