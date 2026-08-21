import type { Ref } from 'vue'
import type { BorderWidth } from '../util'
import { shallowRef, watch } from 'vue'
import { isNumber } from '../../_util/is'
import { isSameBorderWidth } from '../util'

const DEFAULT_BORDER_WIDTH: BorderWidth = [0, 0, 0, 0]

function normalizeValue(val: string): number {
  const size = Number.parseFloat(val)
  return isNumber(size) ? size : 0
}

export default function useBorderSize(domNode: Ref<HTMLElement | SVGElement | null | undefined>) {
  const borderWidth = shallowRef<BorderWidth>(DEFAULT_BORDER_WIDTH)

  const setBorderWidth = (next: BorderWidth) => {
    if (!isSameBorderWidth(borderWidth.value, next)) {
      borderWidth.value = next
    }
  }

  watch(
    domNode,
    (node) => {
      if (!node) {
        setBorderWidth(DEFAULT_BORDER_WIDTH)
        return
      }
      // `getComputedStyle` may throw in non-browser environments (e.g. jsdom
      // fails to fold border longhands back into a `var()`-based shorthand).
      // Fall back to the default so the beam never breaks the host tree.
      let computedStyle: CSSStyleDeclaration
      try {
        computedStyle = getComputedStyle(node)
      }
      catch {
        setBorderWidth(DEFAULT_BORDER_WIDTH)
        return
      }
      const { borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth } = computedStyle
      setBorderWidth([
        normalizeValue(borderTopWidth),
        normalizeValue(borderRightWidth),
        normalizeValue(borderBottomWidth),
        normalizeValue(borderLeftWidth),
      ])
    },
    { immediate: true, flush: 'post' },
  )

  return borderWidth
}
