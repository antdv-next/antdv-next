export function isValidWaveColor(color: CSSStyleDeclaration[keyof CSSStyleDeclaration]): color is string {
  return (
    !!color
    && typeof color === 'string'
    && color !== '#fff'
    && color !== '#ffffff'
    && color !== 'rgb(255, 255, 255)'
    && color !== 'rgba(255, 255, 255, 1)'
    && !/rgba\((?:\d*, ){3}0\)/i.test(color)
    && !/^#(?:[0-9a-f]{3}0|[0-9a-f]{6}00)$/i.test(color)
    && color !== 'transparent'
    && color !== 'canvastext'
  )
}

export function getTargetWaveColor(
  node: HTMLElement,
  colorSource: keyof CSSStyleDeclaration | null = null,
) {
  const style = getComputedStyle(node)
  const { borderTopColor, borderColor, backgroundColor } = style
  if (colorSource && isValidWaveColor((style as any)[colorSource])) {
    return style[colorSource] as any
  }
  return [borderTopColor, borderColor, backgroundColor].find(isValidWaveColor) ?? null
}
