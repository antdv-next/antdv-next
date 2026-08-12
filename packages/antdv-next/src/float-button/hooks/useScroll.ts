import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import getScroll, { isDocument, isWindow } from '../../_util/getScroll'
import throttleByAnimationFrame from '../../_util/throttleByAnimationFrame'

export type ScrollTarget = HTMLElement | Window | Document

export interface UseScrollOptions {
  /** Reactive getter of the scroll container */
  getTarget: Ref<() => ScrollTarget | null | undefined>
  showProgress: Ref<boolean>
  visibilityHeight: Ref<number>
}

function getScrollElement(target?: ScrollTarget | null): HTMLElement | null {
  if (!target) {
    return null
  }
  if (isWindow(target)) {
    return target.document.documentElement
  }
  if (isDocument(target as Document)) {
    return (target as Document).documentElement
  }
  if (target instanceof HTMLElement) {
    return target
  }
  return null
}

export function getScrollProgress(target?: ScrollTarget | null): number {
  const scrollElement = getScrollElement(target)
  if (!scrollElement) {
    return 0
  }
  const scrollTop = getScroll(target ?? null)
  const maxScroll = Math.max(scrollElement.scrollHeight - scrollElement.clientHeight, 0)

  return maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0
}

export default function useScroll(options: UseScrollOptions) {
  const { getTarget, showProgress, visibilityHeight } = options

  const visible = shallowRef(visibilityHeight.value === 0)
  const scrollProgress = shallowRef(0)

  // ========================= Scroll =========================
  let container: ScrollTarget | null = null
  let handleScroll: ReturnType<typeof throttleByAnimationFrame> | null = null

  const syncScrollState = () => {
    visible.value = getScroll(container) >= visibilityHeight.value
    if (showProgress.value) {
      scrollProgress.value = getScrollProgress(container)
    }
  }

  const unbindScroll = () => {
    handleScroll?.cancel()
    if (container && handleScroll) {
      container.removeEventListener('scroll', handleScroll)
    }
    container = null
    handleScroll = null
  }

  const bindScroll = () => {
    unbindScroll()
    container = getTarget.value?.() ?? null
    handleScroll = throttleByAnimationFrame(syncScrollState)
    syncScrollState()
    container?.addEventListener('scroll', handleScroll)
  }

  // ========================= Resize =========================
  let handleResize: ReturnType<typeof throttleByAnimationFrame> | null = null

  const unbindResize = () => {
    if (handleResize) {
      window.removeEventListener('resize', handleResize)
      handleResize.cancel()
      handleResize = null
    }
  }

  const bindResize = () => {
    unbindResize()
    if (!showProgress.value || typeof window === 'undefined') {
      return
    }
    handleResize = throttleByAnimationFrame(() => {
      scrollProgress.value = getScrollProgress(getTarget.value?.())
    })
    window.addEventListener('resize', handleResize)
  }

  onMounted(() => {
    bindScroll()
    bindResize()
  })

  onBeforeUnmount(() => {
    unbindScroll()
    unbindResize()
  })

  watch([getTarget, showProgress, visibilityHeight], () => {
    bindScroll()
    bindResize()
  })

  return { scrollProgress, visible }
}
