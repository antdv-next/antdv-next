import type { VNodeChild } from 'vue'
import type { AnyObject, VueNode } from './type.ts'
import { isFragment } from '@v-c/util/dist/Children/isFragment'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { cloneVNode, Fragment, h, isVNode, Text } from 'vue'

export {
  isFragment,
}

type RenderProps = AnyObject | ((originProps: AnyObject) => AnyObject | undefined)

export function replaceElement(element: VNodeChild, replacement: VNodeChild, props?: RenderProps) {
  if (!isVNode(element)) {
    return replacement
  }
  return cloneVNode(element, typeof props === 'function' ? props(element.props || {}) : props)
}

export function cloneElement(element: VNodeChild, props?: RenderProps) {
  return replaceElement(element, element, props)
}

export function getVNode(node: VueNode) {
  if (typeof node === 'function') {
    return node?.()
  }
  return node
}

export function checkRenderNode(node: any) {
  if (!node) {
    return undefined
  }
  const child = Array.isArray(node) ? node : [node]
  const pureChild = filterEmpty(child)
  if (pureChild.length > 0) {
    if (pureChild.length === 1) {
      return pureChild[0]
    }
    else {
      return h(Fragment, null, pureChild)
    }
  }

  return undefined
}

export function getTextByNode(node: any) {
  if (isVNode(node) && node.type === Text) {
    return node.children
  }
  else if ((typeof node === 'object' && node !== null) && (typeof node.children === 'string' || typeof node.children === 'number')) {
    return node.children
  }
  return node
}

export function getTextNodeArr(nodes: any[]) {
  const res: any[] = []
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    res.push(getTextByNode(node))
  }
  return res
}

export type EmitToProps<T extends Record<string, any>> = {
  [K in keyof T as `on${Capitalize<K & string>}`]: T[K]
}
