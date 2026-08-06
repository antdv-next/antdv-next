import type { Ref } from 'vue'
import { shallowRef, watch } from 'vue'

export type BorderWidth = readonly [number, number, number, number]

export interface BorderInfo {
  borderWidth: BorderWidth
  borderRadius: string
}

const DEFAULT_BORDER_INFO: BorderInfo = {
  borderWidth: [0, 0, 0, 0],
  borderRadius: '0px',
}

function parseBorderWidth(value: string): number {
  const size = Number.parseFloat(value)
  return Number.isFinite(size) ? size : 0
}

export default function useBorderSize(domNode: Ref<HTMLElement | SVGElement | null | undefined>) {
  const borderInfo = shallowRef<BorderInfo>(DEFAULT_BORDER_INFO)

  watch(
    domNode,
    (node) => {
      if (!node) {
        borderInfo.value = DEFAULT_BORDER_INFO
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
        borderInfo.value = DEFAULT_BORDER_INFO
        return
      }
      const { borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, borderRadius } = computedStyle
      borderInfo.value = {
        borderWidth: [
          parseBorderWidth(borderTopWidth),
          parseBorderWidth(borderRightWidth),
          parseBorderWidth(borderBottomWidth),
          parseBorderWidth(borderLeftWidth),
        ],
        borderRadius,
      }
    },
    { immediate: true, flush: 'post' },
  )

  return borderInfo
}
