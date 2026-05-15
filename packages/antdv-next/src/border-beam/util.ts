// Ported from ant-design/components/border-beam/util.ts (6.4.0).

export interface BorderBeamGradientItem {
  color: string
  percent: number
}

export type BorderBeamGradient = BorderBeamGradientItem[]
export type BorderBeamColor = string | BorderBeamGradient

export const MAX_BEAM_COLOR_STOP_PERCENT = 70

function getLinearGradient(...colorStops: string[]): string {
  return `linear-gradient(to left, ${colorStops.join(', ')}, transparent)`
}

function normalizeBorderBeamColor(value?: BorderBeamColor): BorderBeamGradient {
  return typeof value === 'string'
    ? [{ color: value, percent: 0 }]
    : (value ?? [])
}

function fillGradientEnd(items: BorderBeamGradient): BorderBeamGradient {
  const lastItem = items[items.length - 1]
  if (!lastItem || lastItem.percent === 100) {
    return items
  }
  return [...items, { ...lastItem, percent: 100 }]
}

// Map user-facing 0~100 stops into the visible beam segment so the tail area
// stays reserved. Matches the React port comment.
function getMappedBeamColorStopPercent(percent: number): number {
  return Number(((Math.min(Math.max(percent, 0), 100) / 100) * MAX_BEAM_COLOR_STOP_PERCENT).toFixed(2))
}

function normalizeGradientItems(items: BorderBeamGradient) {
  return fillGradientEnd(items).map(item => ({
    ...item,
    percent: getMappedBeamColorStopPercent(item.percent),
  }))
}

export function getBorderBeamGradient(value?: BorderBeamColor): string | undefined {
  const normalizedStops = normalizeGradientItems(normalizeBorderBeamColor(value))
  return normalizedStops.length
    ? getLinearGradient(...normalizedStops.map(item => `${item.color} ${item.percent}%`))
    : undefined
}
