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
  const startTime = Date.now()

  const frameFunc = () => {
    const timestamp = Date.now()
    const time = timestamp - startTime
    const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration)
    if (isWindow(container)) {
      container.scrollTo(window.pageXOffset, nextScrollTop)
    }
    else if (isDocument(container)) {
      container.documentElement.scrollTop = nextScrollTop
    }
    else {
      container.scrollTop = nextScrollTop
    }
    if (time < duration) {
      raf(frameFunc)
    }
    else if (typeof callback === 'function') {
      callback()
    }
  }
  raf(frameFunc)
}
