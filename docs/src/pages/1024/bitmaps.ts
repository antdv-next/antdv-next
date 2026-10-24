/**
 * 1024 = 2¹⁰ = 32 × 32：彩蛋里的比特矩阵正好 1024 个格子。
 * 这里放矩阵会拼出的图形（像素字），控制台彩蛋也复用同一套字形。
 */
export const GRID = 32
export const CELLS = GRID * GRID

export const VUE_GREEN = '#42b883'
export const ANT_BLUE = '#1677ff'

/** 6×10 像素数字，只需要 1、0、2、4 */
const DIGITS: Record<string, string[]> = {
  1: [
    '..##..',
    '.###..',
    '####..',
    '..##..',
    '..##..',
    '..##..',
    '..##..',
    '..##..',
    '######',
    '######',
  ],
  0: [
    '.####.',
    '######',
    '##..##',
    '##..##',
    '##..##',
    '##..##',
    '##..##',
    '##..##',
    '######',
    '.####.',
  ],
  2: [
    '.####.',
    '######',
    '##..##',
    '....##',
    '...###',
    '..###.',
    '.###..',
    '###...',
    '######',
    '######',
  ],
  4: [
    '...###',
    '..####',
    '.##.##',
    '##..##',
    '##..##',
    '######',
    '######',
    '....##',
    '....##',
    '....##',
  ],
}

/** 生成 `<`、`/`、`>` 三个 14 行高的斜线字形 */
function angleGlyph(dir: 'left' | 'right'): string[] {
  const rows: string[] = []
  for (let r = 0; r < 14; r++) {
    const step = r < 7 ? r : 13 - r
    const x = dir === 'left' ? 5 - step : step
    rows.push(Array.from({ length: 7 }, (_, c) => (c === x || c === x + 1 ? '#' : '.')).join(''))
  }
  return rows
}

function slashGlyph(): string[] {
  const rows: string[] = []
  for (let r = 0; r < 14; r++) {
    const x = Math.round(((13 - r) * 6) / 13)
    rows.push(Array.from({ length: 8 }, (_, c) => (c === x || c === x + 1 ? '#' : '.')).join(''))
  }
  return rows
}

/** 把若干字形横向排开，返回各字形逐行拼好的结果 */
export function joinGlyphs(glyphs: string[][], gap: number): string[] {
  const height = Math.max(...glyphs.map(g => g.length))
  const spacer = '.'.repeat(gap)
  return Array.from({ length: height }, (_, r) =>
    glyphs.map(g => g[r] ?? '.'.repeat(g[0]!.length)).join(spacer))
}

export const TEXT_1024 = joinGlyphs(['1', '0', '2', '4'].map(d => DIGITS[d]!), 2)
export const TEXT_CODE = joinGlyphs([angleGlyph('left'), slashGlyph(), angleGlyph('right')], 2)

/** 一张 32×32 的图：mask 标记亮起的格子，colors 是每格颜色（0xRRGGBB） */
export interface Shape {
  mask: Uint8Array
  colors: Uint32Array
}

function hexToInt(hex: string) {
  return Number.parseInt(hex.slice(1), 16)
}

function lerpColor(a: number, b: number, t: number) {
  const ch = (shift: number) => {
    const x = (a >> shift) & 0xFF
    const y = (b >> shift) & 0xFF
    return Math.round(x + (y - x) * t) << shift
  }
  return ch(16) | ch(8) | ch(0)
}

/** 像素字居中放进矩阵，颜色沿横向从 Vue 绿渐变到 Ant 蓝 */
export function textShape(rows: string[]): Shape {
  const mask = new Uint8Array(CELLS)
  const colors = new Uint32Array(CELLS)
  const h = rows.length
  const w = rows[0]!.length
  const ox = Math.floor((GRID - w) / 2)
  const oy = Math.floor((GRID - h) / 2)
  const green = hexToInt(VUE_GREEN)
  const blue = hexToInt(ANT_BLUE)
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (rows[r]![c] !== '#')
        continue
      const i = (oy + r) * GRID + ox + c
      mask[i] = 1
      colors[i] = lerpColor(green, blue, c / (w - 1))
    }
  }
  return { mask, colors }
}

/** 把图片（logo）栅格化成 32×32，保留原图配色 */
export function loadImageShape(src: string, padding = 3): Promise<Shape | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = GRID
        canvas.height = GRID
        const ctx = canvas.getContext('2d')
        if (!ctx)
          return resolve(null)
        const size = GRID - padding * 2
        ctx.drawImage(img, padding, padding, size, size)
        const data = ctx.getImageData(0, 0, GRID, GRID).data
        const mask = new Uint8Array(CELLS)
        const colors = new Uint32Array(CELLS)
        for (let i = 0; i < CELLS; i++) {
          if (data[i * 4 + 3]! > 110) {
            mask[i] = 1
            colors[i] = (data[i * 4]! << 16) | (data[i * 4 + 1]! << 8) | data[i * 4 + 2]!
          }
        }
        resolve({ mask, colors })
      }
      catch {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = src
  })
}
