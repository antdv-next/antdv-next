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

/**
 * 当传入值是 VNode 时返回一个全新的克隆，数组会逐项处理，其余值原样返回。
 *
 * 用于模块级共享的默认 vnode（图标 / 图片等）。一旦原始 vnode 被真正挂载，
 * Vue 会把 el / component 写回它身上；而模块级常量是常驻的 GC Root，Vue 在
 * unmount 时又不会清空这些字段，于是这条引用会把已卸载页面的整条实例链一直
 * 保留下来，造成内存泄漏。渲染前克隆可让模块原始 vnode 永远保持未挂载
 * （el 恒为 null），从而彻底切断该引用链。
 */
export function cloneIfVNode<T>(node: T): T {
  if (Array.isArray(node)) {
    return node.map(item => cloneIfVNode(item)) as unknown as T
  }
  if (!isVNode(node)) {
    return node
  }
  const cloned = cloneVNode(node)
  if (Array.isArray(cloned.children)) {
    cloned.children = cloned.children.map(item => cloneIfVNode(item))
  }
  return cloned as unknown as T
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
