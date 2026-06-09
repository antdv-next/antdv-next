import type { Ref } from 'vue'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { getCurrentInstance, toHandlerKey, toRef } from 'vue'

export function getSlotPropFn(slots: any, props: any, key: string) {
  // TODO: 需要考虑 function slot
  const fn = slots[key] || props[key]
  if (typeof fn === 'function') {
    return fn
  }
  return () => [fn]
}

export function getSlotPropsFnRun(slots: any, props: any, key: string, isNull = true, params?: any) {
  const fn = getSlotPropFn(slots, props, key)
  if (typeof fn === 'function') {
    let node = fn?.(params)
    if (!Array.isArray(node)) {
      node = [node]
    }
    if (node && node.length === 1 && node[0] === null) {
      return null
    }
    const nodes = filterEmpty(node).filter(node => node !== undefined && node !== null)
    if (nodes.length) {
      if (nodes.length === 1) {
        return nodes[0]
      }
      return nodes
    }
    return isNull ? null : undefined
  }
  return fn
}

export function toPropsRefs<T extends Record<string, any>, K extends keyof T>(obj: T, ...args: K[]) {
  const _res: Record<any, any> = {}
  args.forEach((key) => {
    _res[key] = toRef(obj, key)
  })
  return _res as { [key in K]-?: Ref<T[key]> }
}

/**
 * 返回一个「稳定引用」的事件转发器，调用时实时读取组件当前 vnode 上的监听器。
 *
 * 用途：解决「把 emit 事件回调按值捕获进子组件、之后才触发」导致的陈旧闭包问题。
 * 当组件实例被复用且本次更新里只有事件回调发生了变化时（典型场景：无 `rowKey` 的
 * 表格翻页后按位置复用行），Vue 的 `shouldUpdateComponent` 会把它当作「仅 emit 监听器
 * 变化」而跳过该组件的重新渲染，于是渲染期捕获的回调会停留在旧值。
 *
 * 这里通过 `instance.vnode.props` 实时取值，而该字段在跳过更新时仍会被 `updateComponent`
 * 同步为最新 vnode，因此永远拿到最新回调；同时保留处理函数的返回值（`emit` 会丢弃返回值，
 * 故无法直接用 `emit` 替代——`ActionButton` 依赖 confirm 的返回值驱动异步 loading）。
 */
export function useLiveListener<Args extends any[] = any[], R = any>(
  name: string,
): (...args: Args) => R | undefined {
  const instance = getCurrentInstance()
  const handlerKey = toHandlerKey(name)
  return (...args: Args): R | undefined => {
    const handler = (instance?.vnode.props as Record<string, any> | null | undefined)?.[handlerKey]
    if (Array.isArray(handler)) {
      let result: R | undefined
      handler.forEach((fn) => {
        if (typeof fn === 'function') {
          result = fn(...args)
        }
      })
      return result
    }
    return typeof handler === 'function' ? handler(...args) : undefined
  }
}

export const clsx = classNames
