import type { TransitionProps } from 'vue'
import { addClass, removeClass } from '@v-c/util/dist/Dom/class'
import { defaultPrefixCls } from '../config-provider/context.ts'

export function getTransitionProps(
  name: string,
  options?: Partial<TransitionProps>,
) {
  return {
    name,
    appear: true,
    ...options,
  } as TransitionProps
}

function getCollapsedHeight(_el: Element, name?: string) {
  const el = _el as HTMLElement
  if (el) {
    el.style.height = '0px'
    el.style.opacity = '0'
    if (name) {
      addClass(el, name)
    }
  }
}
function getRealHeight(_el: Element) {
  const el = _el as HTMLElement
  const scrollHeight = el?.scrollHeight ?? 0
  if (el) {
    el.style.height = `${scrollHeight}px`
    el.style.opacity = '1'
  }
}

function getCurrentHeight(_el: Element, name?: string) {
  const el = _el as HTMLElement
  if (el) {
    if (name) {
      addClass(el, name)
    }
    const offsetHeight = el?.offsetHeight ?? 0
    el.style.height = `${offsetHeight}px`
  }
}
function skipOpacityTransition(_el: Element, name?: string) {
  const el = _el as HTMLElement
  if (el) {
    if (name) {
      removeClass(el, name)
    }
    ;(el as any).style.opacity = null
    ;(el as any).style.height = null
  }
}
function initCollapseMotion(rootCls = defaultPrefixCls, appear = true): TransitionProps {
  const name = `${rootCls}-motion-collapse`
  return {
    name,
    appear,
    css: true,
    onBeforeEnter: el => getCollapsedHeight(el, name),
    // onBeforeAppear: el => getCollapsedHeight(el, name),
    onEnter: getRealHeight,
    // onAppear: getRealHeight,
    onBeforeLeave: el => getCurrentHeight(el, name),
    onLeave: el => getCollapsedHeight(el, name),
    // onAfterAppear: el => skipOpacityTransition(el, name),
    onAfterEnter: el => skipOpacityTransition(el, name),
    onAfterLeave: el => skipOpacityTransition(el, name),
  }
}

const _SelectPlacements = ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'] as const

export type SelectCommonPlacement = (typeof _SelectPlacements)[number]

export default initCollapseMotion

export type CssUtil = any
