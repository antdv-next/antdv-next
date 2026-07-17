import type { SlotsType, VNode, VNodeChild } from 'vue'
import type { WaveColorSource, WaveComponent } from './interface'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { unrefElement } from '@vueuse/core'
import { cloneVNode, computed, defineComponent, isVNode, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { useConfig } from '../../config-provider/context.ts'
import useStyle from './style'

import useWave from './useWave'

export interface WaveProps extends
  /* @vue-ignore */
  WaveEmitsProps {
  disabled?: boolean
  component?: WaveComponent
  colorSource?: WaveColorSource
}

export interface WaveEmits {
}
export interface WaveEmitsProps {
}

export interface WaveSlots {
  default?: () => any
}

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

const TRIGGER_TYPE_TO_EVENT_MAP = {
  click: 'click',
  mousedown: 'mousedown',
  mouseup: 'mouseup',
  pointerdown: 'pointerdown',
  pointerup: 'pointerup',
} as const

function isVisible(element: HTMLElement | null) {
  if (!isBrowser) {
    return false
  }
  if (!element) {
    return false
  }
  if (element === document.body) {
    return true
  }
  if (element.offsetWidth || element.offsetHeight || element.getClientRects().length) {
    return true
  }
  const style = getComputedStyle(element)
  return style.display !== 'none' && style.visibility !== 'hidden'
}

export default defineComponent<WaveProps, WaveEmits, string, SlotsType<WaveSlots>>(
  (props, { slots }) => {
    const configCtx = useConfig()
    const containerRef = shallowRef<HTMLElement | null>(null)

    const prefixCls = computed(() => configCtx.value.getPrefixCls('wave'))
    const hashId = useStyle(prefixCls)
    const colorSource = computed(() => props.colorSource)
    const waveClassName = computed(() => classNames(prefixCls.value, hashId.value))

    const showWave = useWave(containerRef, waveClassName, computed(() => props.component), colorSource)

    const handleEvent = (event: Event) => {
      const node = containerRef.value
      if (!node) {
        return
      }

      const target = event.target as HTMLElement
      if (!isVisible(target)) {
        return
      }

      const nodeCls = typeof node.className === 'string' ? node.className : String(node.className)
      if (
        node.getAttribute?.('disabled')
        || (node as HTMLInputElement).disabled
        || (nodeCls.includes('disabled') && !nodeCls.includes('disabled:'))
        || node.getAttribute?.('aria-disabled') === 'true'
        || nodeCls.includes('-leave')
      ) {
        return
      }

      showWave(event as MouseEvent)
    }

    let teardown: (() => void) | null = null

    const attachListener = () => {
      teardown?.()
      teardown = null

      const node = containerRef.value
      // 用字面量 1(Node.ELEMENT_NODE)而非 window.Node:该回调经 watch 异步调度,
      // 可能在环境卸载后(如 vitest 拆掉 jsdom 全局)才执行,触碰 window 会抛
      // "window is not defined" 的 unhandled rejection
      if (!node || node.nodeType !== 1 || props.disabled) {
        return
      }

      const triggerType = configCtx.value.wave?.triggerType
      const eventName = triggerType && triggerType in TRIGGER_TYPE_TO_EVENT_MAP
        ? TRIGGER_TYPE_TO_EVENT_MAP[triggerType]
        : 'click'

      node.addEventListener(eventName, handleEvent, true)
      teardown = () => node.removeEventListener(eventName, handleEvent, true)
    }

    onMounted(attachListener)
    watch(
      [containerRef, () => props.disabled, () => configCtx.value.wave?.triggerType],
      attachListener,
    )
    onBeforeUnmount(() => {
      teardown?.()
      teardown = null
    })
    const mergedRef = (el: any, node: any) => {
      const _el = unrefElement(el)
      if (_el) {
        containerRef.value = _el
      }
      if (node.ref) {
        if (typeof node.ref === 'function') {
          node.ref(_el)
        }
        else if (typeof node.ref === 'object' && 'value' in node.ref?.r) {
          node.ref.r.value = _el
        }
      }
    }

    return () => {
      const children = filterEmpty(slots.default?.() ?? [])
      if (children.length !== 1) {
        return children as unknown as VNodeChild
      }

      const child = children[0]
      if (!isVNode(child)) {
        return child
      }

      return cloneVNode(child as VNode, { ref: el => mergedRef(el, child) })
    }
  },
)
