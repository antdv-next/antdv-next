/**
 * 颜色相关工具函数
 */
import type { ColorName } from './types'
import { colorNames } from './types'

/**
 * 生成单个颜色调色板
 */
export function generatePalette(name: ColorName, antPrefix: string = 'ant') {
  const palette: Record<string, string> = {}
  // 基础色 (e.g. text-blue) -> 对应 AntD 默认的主色(通常是6)
  palette[name] = `var(--${antPrefix}-${name})`

  // 1-10 级色阶 (e.g. bg-blue-1)
  for (let i = 1; i <= 10; i++) {
    palette[`${name}-${i}`] = `var(--${antPrefix}-${name}-${i})`
  }
  return palette as Record<`${typeof name}-${number}` | typeof name, string>
}

/**
 * 构建完整的调色板
 */
export function buildPalettes(antPrefix: string) {
  return colorNames.reduce((acc, name) => {
    return { ...acc, ...generatePalette(name, antPrefix) }
  }, {})
}
