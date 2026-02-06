import type { SlotsType, VNode, VNodeChild } from 'vue'
import type { WaveComponent } from './interface'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { unrefElement } from '@vueuse/core'
import { cloneVNode, computed, defineComponent, isVNode, onBeforeUnmount, shallowRef, watch } from 'vue'
import { useConfig } from '../../config-provider/context.ts'
import useStyle from './style'
import useWave from './useWave'

export interface WaveProps {
  disabled?: boolean
  component?: WaveComponent
  colorSource?: 'color' | 'backgroundColor' | 'borderColor' | null
}

export interface WaveEmits {
}

export interface WaveSlots {
  default?: () => any
}

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

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

    const handleClick = (event: MouseEvent) => {
      const node = containerRef.value
      if (!node || !isBrowser) {
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

      showWave(event)
    }

    watch(
      () => ({ node: containerRef.value, disabled: props.disabled }),
      ({ node, disabled }, _, onCleanup) => {
        if (!isBrowser) {
          return
        }

        if (!node || node.nodeType !== window.Node.ELEMENT_NODE || disabled) {
          return
        }
        onCleanup(() => {
          node?.removeEventListener('click', handleClick, true)
        })
        node.addEventListener('click', handleClick, true)
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      if (!isBrowser) {
        return
      }
      containerRef.value?.removeEventListener('click', handleClick, true)
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
