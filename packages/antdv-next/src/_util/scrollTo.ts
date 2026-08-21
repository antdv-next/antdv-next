import raf from '@v-c/util/dist/raf'

import { easeInOutCubic } from './easings'
import getScroll, { isDocument, isWindow } from './getScroll'

interface ScrollToOptions {
  /** Scroll container, default as window */
  getContainer?: () => HTMLElement | Window | Document
  /** Scroll end callback */
  callback?: () => void
  /** Animation duration, default as 450 */
  duration?: number
}

export default function scrollTo(y: number, options: ScrollToOptions = {}) {
  const { getContainer = () => window, callback, duration = 450 } = options
  const container = getContainer()
  const scrollTop = getScroll(container)

  const scroll = (top: number) => {
    if (isWindow(container)) {
      container.scrollTo(window.pageXOffset, top)
    }
    else if (isDocument(container)) {
      container.documentElement.scrollTop = top
    }
    else {
      container.scrollTop = top
    }
  }

  if (duration <= 0) {
    scroll(y)
    if (typeof callback === 'function') {
      callback()
    }
    return () => {}
  }

  const startTime = Date.now()
  let rafId: number

  const frameFunc = () => {
    const timestamp = Date.now()
    const time = timestamp - startTime
    const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration)
    scroll(nextScrollTop)
    if (time < duration) {
      rafId = raf(frameFunc)
    }
    else if (typeof callback === 'function') {
      callback()
    }
  }
  rafId = raf(frameFunc)

  return () => {
    raf.cancel(rafId)
  }
}
