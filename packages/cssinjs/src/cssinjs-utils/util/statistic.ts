import type { TokenMap } from '../interface'

declare const CSSINJS_STATISTIC: any

const enableStatistic = process.env.NODE_ENV !== 'production' || typeof CSSINJS_STATISTIC !== 'undefined'

let recording = true

export function merge<CompTokenMap extends TokenMap>(
  ...objs: Partial<CompTokenMap>[]
): CompTokenMap {
  if (!enableStatistic) {
    return Object.assign({}, ...objs)
  }

  recording = false

  const ret = {} as CompTokenMap

  objs.forEach((obj) => {
    if (!obj || typeof obj !== 'object') {
      return
    }

    Object.keys(obj).forEach((key) => {
      Object.defineProperty(ret, key, {
        configurable: true,
        enumerable: true,
        get: () => (obj as any)[key],
      })
    })
  })

  recording = true
  return ret
}

export const statistic: Record<string, { global: string[], component: Record<string, string | number> }> = {}

export const _statistic_build_: typeof statistic = {}

function noop() {}

function statisticToken<CompTokenMap extends TokenMap>(token: CompTokenMap) {
  let tokenKeys: Set<string> | undefined
  let proxy = token
  let flush: (component: string, componentToken: Record<string, string | number>) => void = noop

  if (enableStatistic && typeof Proxy !== 'undefined') {
    tokenKeys = new Set<string>()

    proxy = new Proxy(token as any, {
      get(obj, prop) {
        if (recording) {
          tokenKeys?.add(String(prop))
        }
        return obj[prop as keyof typeof obj]
      },
    })

    flush = (componentName, componentToken) => {
      statistic[componentName] = {
        global: Array.from(tokenKeys!),
        component: {
          ...statistic[componentName]?.component,
          ...componentToken,
        },
      }
    }
  }

  return { token: proxy, keys: tokenKeys, flush }
}

export default statisticToken
