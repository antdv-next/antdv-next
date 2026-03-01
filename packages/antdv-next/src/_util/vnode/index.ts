import type { VNode } from 'vue'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { Comment } from 'vue'

interface NormalizedProp {
  type?: any
  default?: any
  skipFactory?: boolean
  shouldCast?: boolean
  shouldCastTrue?: boolean
}

type NormalizedPropsOptions = [Record<string, NormalizedProp>, string[]] | []

const EMPTY_OBJ = Object.freeze({}) as Record<string, any>

function hasOwn(obj: object, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function'
}

function camelize(str: string) {
  return str.replace(/-(\w)/g, (_, c: string) => (c ? c.toUpperCase() : ''))
}

function hyphenate(str: string) {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}

function isBooleanType(type: unknown) {
  return isFunction(type) && type.name === 'Boolean'
}

function isStringType(type: unknown) {
  return isFunction(type) && type.name === 'String'
}

function isReservedProp(key: string) {
  return key === 'key' || key === 'ref'
}

function isComponentVNode(vnode: VNode) {
  return typeof vnode.type === 'object' || typeof vnode.type === 'function'
}

function getVNodeComponentName(vnode: VNode) {
  if (!isComponentVNode(vnode)) {
    return undefined
  }
  const type = vnode.type as any
  return type.name || type.__name || type.displayName
}

function isTargetComponent(vnode: VNode, name: string) {
  return getVNodeComponentName(vnode) === name
}

function hasTargetMarker(vnode: VNode, markerKey: string) {
  if (!isComponentVNode(vnode)) {
    return false
  }
  return Boolean((vnode.type as any)?.[markerKey])
}

function normalizePropsOptions(vnode: VNode): NormalizedPropsOptions {
  if (!isComponentVNode(vnode)) {
    return []
  }

  const raw = (vnode.type as any).props
  if (!raw) {
    return []
  }

  const normalized: Record<string, NormalizedProp> = {}
  const needCastKeys: string[] = []

  if (Array.isArray(raw)) {
    raw.forEach((key) => {
      if (typeof key !== 'string') {
        return
      }
      normalized[camelize(key)] = {}
    })
  }
  else if (typeof raw === 'object') {
    Object.keys(raw).forEach((key) => {
      const normalizedKey = camelize(key)
      const opt = raw[key]
      const prop: NormalizedProp
        = Array.isArray(opt) || isFunction(opt)
          ? { type: opt }
          : (opt ? { ...opt } : {})

      const propType = prop.type
      let shouldCast = false
      let shouldCastTrue = true

      if (Array.isArray(propType)) {
        for (let index = 0; index < propType.length; index += 1) {
          const type = propType[index]
          if (isBooleanType(type)) {
            shouldCast = true
            break
          }
          if (isStringType(type)) {
            shouldCastTrue = false
          }
        }
      }
      else {
        shouldCast = isBooleanType(propType)
      }

      prop.shouldCast = shouldCast
      prop.shouldCastTrue = shouldCastTrue
      normalized[normalizedKey] = prop

      if (shouldCast || hasOwn(prop, 'default')) {
        needCastKeys.push(normalizedKey)
      }
    })
  }

  return [normalized, needCastKeys]
}

function resolvePropValue(
  options: Record<string, NormalizedProp>,
  props: Record<string, any>,
  key: string,
  value: unknown,
  isAbsent: boolean,
) {
  const opt = options[key]
  if (!opt) {
    return value
  }

  const hasDefault = hasOwn(opt, 'default')

  if (hasDefault && value === undefined) {
    const defaultValue = opt.default
    if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
      value = defaultValue(props)
    }
    else {
      value = defaultValue
    }
  }

  if (opt.shouldCast) {
    if (isAbsent && !hasDefault) {
      value = false
    }
    else if (opt.shouldCastTrue && (value === '' || value === hyphenate(key))) {
      value = true
    }
  }

  return value
}

function normalizeSlotValue(value: any) {
  const nodes = filterEmpty(value).filter(node => node !== undefined && node !== null && (typeof node !== 'object' || (node as any).type !== Comment))

  if (nodes.length === 0) {
    return undefined
  }

  return nodes.length === 1 ? nodes[0] : nodes
}

export function resolveVNodeProps(vnode: VNode, name?: string, markerKey?: string) {
  if (markerKey && !hasTargetMarker(vnode, markerKey)) {
    return {}
  }

  if (!markerKey && name && !isTargetComponent(vnode, name)) {
    return {}
  }

  const rawProps = (vnode.props || EMPTY_OBJ) as Record<string, any>
  const normalizedPropsOptions = normalizePropsOptions(vnode)

  const resolvedProps: Record<string, any> = {}
  const attrs: Record<string, any> = {}

  if (normalizedPropsOptions.length > 0) {
    const [options, needCastKeys] = normalizedPropsOptions as [Record<string, NormalizedProp>, string[]]
    const needCastKeySet = new Set(needCastKeys)
    const rawCastValues: Record<string, any> = {}

    Object.keys(rawProps).forEach((key) => {
      if (isReservedProp(key)) {
        return
      }

      const value = rawProps[key]
      const camelKey = camelize(key)

      if (hasOwn(options, camelKey)) {
        if (!needCastKeySet.has(camelKey)) {
          resolvedProps[camelKey] = value
        }
        else {
          rawCastValues[camelKey] = value
        }
      }
      else {
        attrs[key] = value
      }
    })

    needCastKeys.forEach((key) => {
      resolvedProps[key] = resolvePropValue(
        options,
        resolvedProps,
        key,
        rawCastValues[key],
        !hasOwn(rawCastValues, key),
      )
    })
  }
  else {
    Object.keys(rawProps).forEach((key) => {
      if (isReservedProp(key)) {
        return
      }
      attrs[key] = rawProps[key]
    })
  }

  const result = {
    ...attrs,
    ...resolvedProps,
  }

  if (result.className === undefined && result.class !== undefined) {
    result.className = result.class
  }

  if (result.class === undefined && result.className !== undefined) {
    result.class = result.className
  }

  if (vnode.key != null && result.key === undefined) {
    result.key = vnode.key
  }

  if (typeof vnode.children === 'object' && vnode.children && !Array.isArray(vnode.children)) {
    Object.keys(vnode.children).forEach((slotName) => {
      if (slotName === '_') {
        return
      }

      const slotFn = (vnode.children as Record<string, any>)[slotName]
      if (!isFunction(slotFn)) {
        return
      }

      const value = normalizeSlotValue(slotFn())
      if (value === undefined) {
        return
      }

      if (slotName === 'default') {
        result.children = value
        return
      }

      result[camelize(slotName)] = value
    })
  }

  return result
}

export function resolveSlotsNode<T = any>(slots: Record<string, any>, slotName: string, name?: string, markerKey?: string) {
  if (!slots[slotName]) {
    return []
  }

  const nodes = filterEmpty(slots?.[slotName]?.() ?? []).filter((node: any) => node !== undefined && node !== null && node.type !== Comment)
  if (nodes.length === 0) {
    return []
  }

  const targetNodes = markerKey
    ? nodes.filter((node: VNode) => hasTargetMarker(node, markerKey))
    : name
      ? nodes.filter((node: VNode) => isTargetComponent(node, name))
      : nodes

  const items = targetNodes
    .map((node: VNode) => resolveVNodeProps(node, undefined, markerKey))
    .filter((item, index) => {
      if (Object.keys(item).length > 0) {
        return true
      }
      return isComponentVNode(targetNodes[index])
    })

  return items as T[]
}
