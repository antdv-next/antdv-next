import type { App, CSSProperties } from 'vue'
import type throttleByAnimationFrame from '../_util/throttleByAnimationFrame'
import type { ComponentBaseProps } from '../config-provider/context'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { unrefElement, useResizeObserver } from '@vueuse/core'
import { computed, createVNode, defineComponent, isVNode, nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import throttleByAnimationFrameFn from '../_util/throttleByAnimationFrame'
import { useConfig } from '../config-provider/context'
import useStyle from './style'
import { getFixedBottom, getFixedTop, getTargetRect } from './utils'

const TRIGGER_EVENTS: (keyof WindowEventMap)[] = [
  'resize',
  'scroll',
  'touchstart',
  'touchmove',
  'touchend',
  'pageshow',
  'load',
]

function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null
}

// Affix
export interface AffixProps extends ComponentBaseProps {
  /** Triggered when the specified offset is reached from the top of the window */
  offsetTop?: number
  /** Triggered when the specified offset is reached from the bottom of the window */
  offsetBottom?: number
  /** Set the element that Affix needs to listen to its scroll event, the value is a function that returns the corresponding DOM element */
  target?: () => Window | HTMLElement | null
}

export interface AffixEmits {
  change: (affixed: boolean) => void
}

const AFFIX_STATUS_NONE = 0
const AFFIX_STATUS_PREPARE = 1

type AffixStatus = typeof AFFIX_STATUS_NONE | typeof AFFIX_STATUS_PREPARE

const affixDefaultProps = {} as any

interface AffixState {
  affixStyle?: CSSProperties
  placeholderStyle?: CSSProperties
  status: AffixStatus
  lastAffix: boolean
  prevTarget: Window | HTMLElement | null
}

export interface AffixRef {
  updatePosition: ReturnType<typeof throttleByAnimationFrame>
}

type InternalAffixProps = AffixProps & { onTestUpdatePosition?: any }

export const Affix = defineComponent<
  InternalAffixProps,
  AffixEmits,
  string
>(
  (props = affixDefaultProps, { slots, attrs, expose, emit }) => {
    const configContext = useConfig()

    const affixPrefixCls = computed(() => configContext.value.getPrefixCls('affix', props.prefixCls))

    const lastAffix = shallowRef(false)
    const affixStyle = shallowRef<CSSProperties>()
    const placeholderStyle = shallowRef<CSSProperties>()

    const status = shallowRef<AffixStatus>(AFFIX_STATUS_NONE)

    const prevTarget = shallowRef<Window | HTMLElement | null>(null)
    const prevListener = shallowRef<EventListener | null>(null)

    const placeholderNodeRef = shallowRef<HTMLDivElement>()
    const fixedNodeRef = shallowRef<HTMLDivElement>()
    const contextRef = shallowRef<HTMLElement>()
    const timer = shallowRef<ReturnType<typeof setTimeout> | null>(null)

    const targetFunc = computed(() => props.target ?? configContext.value.getTargetContainer ?? getDefaultTarget)

    const internalOffsetTop = computed(() => {
      const { offsetTop, offsetBottom } = props
      return offsetBottom === undefined && offsetTop === undefined ? 0 : offsetTop
    })

    // =================== Measure ===================
    const measure = () => {
      if (
        status.value !== AFFIX_STATUS_PREPARE
        || !fixedNodeRef.value
        || !placeholderNodeRef.value
        || !targetFunc.value
      ) {
        return
      }

      const targetNode = targetFunc.value()
      if (targetNode) {
        const newState: Partial<AffixState> = {
          status: AFFIX_STATUS_NONE,
        }
        const placeholderRect = getTargetRect(placeholderNodeRef.value)

        if (
          placeholderRect.top === 0
          && placeholderRect.left === 0
          && placeholderRect.width === 0
          && placeholderRect.height === 0
        ) {
          return
        }

        const targetRect = getTargetRect(targetNode)
        const fixedTop = getFixedTop(placeholderRect, targetRect, internalOffsetTop.value)
        const fixedBottom = getFixedBottom(placeholderRect, targetRect, props.offsetBottom)
        if (fixedTop !== undefined) {
          newState.affixStyle = {
            position: 'fixed',
            top: `${fixedTop}px`,
            width: `${placeholderRect.width}px`,
            height: `${placeholderRect.height}px`,
          }
          newState.placeholderStyle = {
            width: `${placeholderRect.width}px`,
            height: `${placeholderRect.height}px`,
          }
        }
        else if (fixedBottom !== undefined) {
          newState.affixStyle = {
            position: 'fixed',
            bottom: `${fixedBottom}px`,
            width: `${placeholderRect.width}px`,
            height: `${placeholderRect.height}px`,
          }
          newState.placeholderStyle = {
            width: `${placeholderRect.width}px`,
            height: `${placeholderRect.height}px`,
          }
        }

        newState.lastAffix = !!newState.affixStyle

        if (lastAffix.value !== newState.lastAffix) {
          emit('change', newState.lastAffix)
        }

        status.value = newState.status!
        affixStyle.value = newState.affixStyle
        placeholderStyle.value = newState.placeholderStyle
        lastAffix.value = newState.lastAffix
      }
    }

    const prepareMeasure = () => {
      status.value = AFFIX_STATUS_PREPARE
      measure()
    }

    const updatePosition = throttleByAnimationFrameFn(() => {
      prepareMeasure()
    })

    const lazyUpdatePosition = throttleByAnimationFrameFn(() => {
      // Check position change before measure to make Safari smooth
      if (targetFunc.value && affixStyle.value) {
        const targetNode = targetFunc.value()
        if (targetNode && placeholderNodeRef.value) {
          const targetRect = getTargetRect(targetNode)
          const placeholderRect = getTargetRect(placeholderNodeRef.value)
          const fixedTop = getFixedTop(placeholderRect, targetRect, internalOffsetTop.value)
          const fixedBottom = getFixedBottom(placeholderRect, targetRect, props.offsetBottom)

          if (
            (fixedTop !== undefined && affixStyle.value.top === fixedTop)
            || (fixedBottom !== undefined && affixStyle.value.bottom === fixedBottom)
          ) {
            return
          }
        }
      }

      // Directly call prepare measure since it's already throttled.
      prepareMeasure()
    })

    const addListeners = () => {
      const listenerTarget = targetFunc.value?.()
      if (!listenerTarget) {
        return
      }
      TRIGGER_EVENTS.forEach((eventName) => {
        if (prevListener.value) {
          prevTarget.value?.removeEventListener(eventName, prevListener.value)
        }
        listenerTarget?.addEventListener(eventName, lazyUpdatePosition)
      })
      prevTarget.value = listenerTarget
      prevListener.value = lazyUpdatePosition
    }

    const removeListeners = () => {
      const newTarget = targetFunc.value?.()
      TRIGGER_EVENTS.forEach((eventName) => {
        newTarget?.removeEventListener(eventName, lazyUpdatePosition)
        if (prevListener.value) {
          prevTarget.value?.removeEventListener(eventName, prevListener.value)
        }
      })
      updatePosition.cancel()
      lazyUpdatePosition.cancel()
    }

    expose({ updatePosition })

    // mount & unmount
    onMounted(() => {
      // [Legacy] Wait for parent component ref has its value.
      // We should use target as directly element instead of function which makes element check hard.
      timer.value = setTimeout(addListeners)
    })

    onBeforeUnmount(() => {
      if (timer.value) {
        clearTimeout(timer.value)
        timer.value = null
      }
      removeListeners()
    })

    watch([
      () => props.target,
      affixStyle,
      lastAffix,
      () => props.offsetTop,
      () => props.offsetBottom,
    ], async (_new, _old, onCleanup) => {
      await nextTick()
      addListeners()

      onCleanup(removeListeners)
    })

    watch([() => props.target, () => props.offsetTop, () => props.offsetBottom], async () => {
      await nextTick()
      updatePosition()
    })

    const [hashId, cssVarCls] = useStyle(affixPrefixCls)

    useResizeObserver(placeholderNodeRef, () => {
      updatePosition()
    })

    useResizeObserver(contextRef, () => {
      updatePosition()
    })

    return () => {
      const { rootClass } = props

      const rootCls = classNames(
        rootClass,
        hashId.value,
        affixPrefixCls.value,
        cssVarCls.value,
      )

      const mergedCls = classNames({ [rootCls]: affixStyle.value })
      const children = filterEmpty(slots?.default?.() ?? [])
      const node = children?.[0]
      let childNode: any = null
      if (isVNode(node)) {
        childNode = createVNode(node, {
          ref: (el: any) => {
            const _el = unrefElement(el)
            if (_el) {
              contextRef.value = _el as any
            }
          },
        })
      }
      return (
        <div {...attrs} ref={placeholderNodeRef}>
          {affixStyle.value && <div style={placeholderStyle.value} aria-hidden="true" />}
          <div class={mergedCls} ref={fixedNodeRef} style={affixStyle.value}>
            {childNode}
          </div>
        </div>
      )
    }
  },
  {
    name: 'AAffix',
    inheritAttrs: false,
  },
)

;(Affix as any).install = (app: App) => {
  app.component(Affix.name, Affix)
}

export default Affix
