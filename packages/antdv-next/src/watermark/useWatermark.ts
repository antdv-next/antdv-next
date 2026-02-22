import type { ComputedRef, CSSProperties, Ref } from 'vue'
import { reactive } from 'vue'
import { getStyleStr } from './utils.ts'

/**
 * Base size of the canvas, 1 for parallel layout and 2 for alternate layout
 * Only alternate layout is currently supported
 */
export const BaseSize = 2
export const FontGap = 3

// Prevent external hidden elements from adding accent styles
const emphasizedStyle: CSSProperties = {
  visibility: 'visible !important',
} as unknown as CSSProperties

export type AppendWatermark = (
  base64Url: string,
  markWidth: number,
  container: HTMLElement,
) => void

export default function useWatermark(markStyle: Ref<CSSProperties>, onRemove?: ComputedRef<(() => void) | undefined>): [
    appendWatermark: AppendWatermark,
    removeWatermark: (container: HTMLElement) => void,
    isWatermarkEle: (ele: Node, index?: number) => boolean,
] {
  const watermarkMap = reactive(new Map<HTMLElement, HTMLDivElement>())
  const appendWatermark = (base64Url: string, markWidth: number, container: HTMLElement) => {
    if (container) {
      const exist = watermarkMap.get(container)

      if (!exist) {
        const newWatermarkEle = document.createElement('div')
        watermarkMap.set(container, newWatermarkEle)
      }

      const watermarkEle = watermarkMap.get(container)!
      watermarkEle.setAttribute('style', getStyleStr({
        ...markStyle.value,
        backgroundImage: `url('${base64Url}')`,
        backgroundSize: `${Math.floor(markWidth)}px`,
        ...emphasizedStyle,
      }))
      // Prevents using the browser `Hide Element` to hide watermarks
      watermarkEle.removeAttribute('class')
      watermarkEle.removeAttribute('hidden')

      if (watermarkEle.parentElement !== container) {
        if (exist && typeof onRemove?.value === 'function') {
          onRemove.value?.()
        }
        container.append(watermarkEle)
      }
    }
    return watermarkMap.get(container)
  }

  const removeWatermark = (container: HTMLElement) => {
    const watermarkEle = watermarkMap.get(container)
    if (watermarkEle && container) {
      container.removeChild(watermarkEle)
    }
    watermarkMap.delete(container)
  }

  const isWatermarkEle = (ele: Node) => Array.from(watermarkMap.values()).includes(ele as any)
  return [appendWatermark, removeWatermark, isWatermarkEle] as const
}
