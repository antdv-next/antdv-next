import type { CSSProperties } from 'vue'
import type { WatermarkContent, WatermarkFont, WatermarkText } from '.'
import toList from '../_util/toList'

/** converting camel-cased strings to be lowercase and link it with Separator */
export function toLowercaseSeparator(key: string) {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export function getStyleStr(style: CSSProperties): string {
  return Object.keys(style)
    .map(key => `${toLowercaseSeparator(key)}: ${style[key as keyof CSSProperties]};`)
    .join(' ')
}

/** Returns the ratio of the device's physical pixel resolution to the css pixel resolution */
export function getPixelRatio() {
  return window.devicePixelRatio || 1
}

function isWatermarkText(content: WatermarkContent | null | undefined): content is WatermarkText {
  return typeof content === 'object' && content !== null && !Array.isArray(content)
}

export interface WatermarkContentLine {
  text: string
  font: Required<WatermarkFont>
}

export function getFontSize(font: Required<WatermarkFont>, ratio = 1) {
  return Number(font.fontSize) * ratio
}

export function getCanvasFont(font: Required<WatermarkFont>, ratio = 1, lineHeight?: number) {
  const mergedLineHeight = lineHeight === undefined ? '' : `/${lineHeight}px`

  return `${font.fontStyle} normal ${font.fontWeight} ${getFontSize(font, ratio)}px${mergedLineHeight} ${font.fontFamily}`
}

/** Merge per-line font over the base font, ignoring `undefined` overrides. */
function mergeFont(base: Required<WatermarkFont>, override: WatermarkFont): Required<WatermarkFont> {
  const merged = { ...base }
  for (const key of Object.keys(override) as (keyof WatermarkFont)[]) {
    const value = override[key]
    if (value !== undefined) {
      (merged as any)[key] = value
    }
  }
  return merged
}

export function getContentLines(
  content: WatermarkContent | WatermarkContent[] | undefined,
  font: Required<WatermarkFont>,
): WatermarkContentLine[] {
  return toList(content as any, true).map((item: WatermarkContent) => {
    if (isWatermarkText(item)) {
      return {
        text: item.text ?? '',
        font: mergeFont(font, item.font ?? {}),
      }
    }

    return {
      text: (item as string) ?? '',
      font,
    }
  })
}

/** Whether to re-render the watermark */
export function reRendering(
  mutation: MutationRecord,
  isWatermarkEle: (ele: Node, index?: number) => boolean,
) {
  let flag = false
  // Whether to delete the watermark node
  if (mutation.removedNodes.length) {
    flag = Array.from<Node>(mutation.removedNodes).some(isWatermarkEle)
  }
  // Whether the watermark dom property value has been modified
  if (mutation.type === 'attributes' && isWatermarkEle(mutation.target)) {
    flag = true
  }
  return flag
}
