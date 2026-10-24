/**
 * 1024 彩蛋 canvas 场景：一块 32×32 的比特矩阵。
 *
 * canvas 铺满整个视口（粒子可以飞出矩阵），矩阵本身画在占位元素 slot 的位置上，
 * 每帧读取 slot 的位置，因此页面布局、滚动都不需要额外同步。
 *
 * 开场时间线（ms，从 intro() 起算）：
 *   0     矩阵从演示卡片的预览区放大到 slot，同时下比特雨
 *   1900  比特雨收拢成第一张图（1024）
 *   +1600 依次切换到后面的图（logo、</>），最后一张出现后回调 onDone
 * 之后进入常驻状态：背景 bit 随机闪烁，图形每 7 秒轮换一次。
 */
import type { Shape } from './bitmaps'
import { ANT_BLUE, CELLS, GRID, VUE_GREEN } from './bitmaps'

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface BitSceneOptions {
  /** 决定矩阵位置和大小的占位元素，同时承接点击 */
  slot: HTMLElement
  /** 轮换展示的图形，第一张是比特雨收拢后的样子 */
  shapes: Shape[]
  reducedMotion?: boolean
  /**
   * 按下某个格子时先问一下页面要不要接管（打虫子时由游戏处理），
   * 返回 true 表示已处理，矩阵不再翻转 / 拖动涂抹
   */
  interceptPress?: (index: number) => boolean
}

export interface BitScene {
  /** 播放开场：from 是动画起点（演示卡片预览区的位置） */
  intro: (from: Rect, onDone: () => void) => void
  /** 跳过开场，直接进入常驻状态 */
  skipIntro: () => void
  setShapes: (shapes: Shape[]) => void
  /** Konami：全部点亮 + 字符烟花 */
  celebrate: () => void
  /** sudo rm -rf /：矩阵故障一下 */
  glitch: () => void
  /** 打虫子时压暗图形，让虫子更显眼 */
  setDim: (dim: boolean) => void
  addBug: (index: number) => void
  removeBug: (index: number, squashed: boolean) => void
  clearBugs: () => void
  destroy: () => void
}

const T_RAIN_END = 1900
const T_SHAPE_STEP = 1600
const CYCLE_INTERVAL = 7000
/** 用户亲手翻过 / 画过的图多留一会儿再轮换 */
const USER_HOLD = 15000
const INTRO_GROW = 800

const PARTICLE_TEXTS = ['{', '}', ';', '</>', '0', '1', '=>', '()', '[]', '1024', '&&', '++']

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  born: number
  life: number
  color: string
  size: number
  text?: string
}

function hexToInt(hex: string) {
  return Number.parseInt(hex.slice(1), 16)
}

const GREEN = hexToInt(VUE_GREEN)
const BLUE = hexToInt(ANT_BLUE)
const RAIN_COLORS = [GREEN, BLUE, 0x36CFC9, 0x73D13D]
const BUG_RED = '#ff4d4f'

function hslToInt(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))))
  }
  return (f(0) << 16) | (f(8) << 8) | f(4)
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function rand(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)]!
}

export function createBitScene(canvas: HTMLCanvasElement, options: BitSceneOptions): BitScene {
  const ctx = canvas.getContext('2d')!
  const { slot, reducedMotion = false } = options
  let shapes = options.shapes
  let shapeIndex = 0

  // 每个格子的状态：当前/目标亮度、当前/目标颜色、过渡开始时刻
  const val = new Float32Array(CELLS)
  const target = new Float32Array(CELLS)
  const startAt = new Float64Array(CELLS)
  const cur = new Float32Array(CELLS * 3)
  const dst = new Float32Array(CELLS * 3)
  /** 背景 bit 闪一下的截止时刻 */
  const flash = new Float64Array(CELLS)
  /** 每个格子上印着的 0 / 1 */
  const bits = new Uint8Array(CELLS)
  for (let i = 0; i < CELLS; i++) {
    bits[i] = Math.random() < 0.5 ? 0 : 1
    cur[i * 3] = 0x42
    cur[i * 3 + 1] = 0xB8
    cur[i * 3 + 2] = 0x83
  }

  const bugs = new Map<number, number>()
  const particles: Particle[] = []
  const timers: number[] = []

  let dpr = 1
  let vw = 0
  let vh = 0
  let rafId = 0
  let last = performance.now()
  let destroyed = false
  /** 开场前（演示卡片阶段）矩阵还不出现 */
  let visible = false

  let introStart = -1
  let introFrom: Rect | null = null
  let introDone: (() => void) | null = null
  let raining = false
  let cycling = false
  let nextCycleAt = 0
  let celebrateUntil = 0
  let glitchUntil = 0
  let dim = false
  let dimLevel = 1
  let hover = -1
  /** 按住拖动时要涂成的状态（第一格翻转后的值），-1 表示没在拖 */
  let paintValue = -1
  let paintPointer = -1
  let lastPainted = -1
  let nextTwinkleAt = 0
  let rect: Rect = { x: 0, y: 0, width: 0, height: 0 }

  function setCell(i: number, v: number, color: number, delay: number, now: number) {
    target[i] = v
    startAt[i] = now + delay
    dst[i * 3] = (color >> 16) & 0xFF
    dst[i * 3 + 1] = (color >> 8) & 0xFF
    dst[i * 3 + 2] = color & 0xFF
  }

  function show(shape: Shape | undefined, now = performance.now(), instant = reducedMotion) {
    if (!shape)
      return
    for (let i = 0; i < CELLS; i++) {
      const on = shape.mask[i] === 1
      setCell(i, on ? 1 : 0, on ? shape.colors[i]! : GREEN, instant ? 0 : rand(0, 450), now)
    }
  }

  function currentShape() {
    return shapes[shapeIndex % Math.max(shapes.length, 1)]
  }

  function schedule(fn: () => void, delay: number) {
    timers.push(window.setTimeout(fn, delay))
  }

  function clearTimers() {
    timers.forEach(id => window.clearTimeout(id))
    timers.length = 0
  }

  function finishIntro() {
    introStart = -1
    introFrom = null
    raining = false
    cycling = !reducedMotion
    nextCycleAt = performance.now() + CYCLE_INTERVAL
    const done = introDone
    introDone = null
    done?.()
  }

  function measureSlot(now: number) {
    const r = slot.getBoundingClientRect()
    const to: Rect = { x: r.left, y: r.top, width: r.width, height: r.height }
    if (introFrom && introStart >= 0) {
      const t = easeInOutCubic(Math.min(1, (now - introStart) / INTRO_GROW))
      rect = {
        x: introFrom.x + (to.x - introFrom.x) * t,
        y: introFrom.y + (to.y - introFrom.y) * t,
        width: introFrom.width + (to.width - introFrom.width) * t,
        height: introFrom.height + (to.height - introFrom.height) * t,
      }
    }
    else {
      rect = to
    }
  }

  /** 矩阵始终保持正方形，居中放在 rect 里 */
  function gridBox() {
    const size = Math.min(rect.width, rect.height)
    return {
      x: rect.x + (rect.width - size) / 2,
      y: rect.y + (rect.height - size) / 2,
      size,
      cell: size / GRID,
    }
  }

  function cellCenter(i: number) {
    const { x, y, cell } = gridBox()
    return {
      x: x + ((i % GRID) + 0.5) * cell,
      y: y + (Math.floor(i / GRID) + 0.5) * cell,
    }
  }

  function burst(cx: number, cy: number, count: number, opts: { texts?: boolean, colors: string[], speed: number, life: number }) {
    if (reducedMotion)
      return
    const now = performance.now()
    for (let k = 0; k < count; k++) {
      const angle = rand(0, Math.PI * 2)
      const speed = rand(opts.speed * 0.3, opts.speed)
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - opts.speed * 0.25,
        born: now,
        life: rand(opts.life * 0.6, opts.life),
        color: pick(opts.colors),
        size: opts.texts ? rand(12, 22) : rand(2, 5),
        text: opts.texts ? pick(PARTICLE_TEXTS) : undefined,
      })
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    vw = window.innerWidth
    vh = window.innerHeight
    canvas.width = Math.round(vw * dpr)
    canvas.height = Math.round(vh * dpr)
  }

  function update(now: number, dt: number) {
    if (raining) {
      for (let k = 0; k < 46; k++) {
        const i = Math.floor(Math.random() * CELLS)
        const on = Math.random() < 0.3
        setCell(i, on ? rand(0.5, 1) : 0, pick(RAIN_COLORS), 0, now)
        bits[i] = bits[i]! ^ 1
      }
    }

    if (glitchUntil > now) {
      for (let k = 0; k < 90; k++) {
        const i = Math.floor(Math.random() * CELLS)
        setCell(i, Math.random() < 0.5 ? 1 : 0, Math.random() < 0.5 ? 0xFF4D4F : 0x13C2C2, 0, now)
      }
    }

    const calm = !raining && !dim && glitchUntil <= now && celebrateUntil <= now && introStart < 0
    if (calm && !reducedMotion && now >= nextTwinkleAt) {
      nextTwinkleAt = now + 70
      const i = Math.floor(Math.random() * CELLS)
      if (target[i] === 0)
        flash[i] = now + 480
      bits[Math.floor(Math.random() * CELLS)]! ^= 1
    }

    if (calm && cycling && shapes.length > 1 && now >= nextCycleAt) {
      nextCycleAt = now + CYCLE_INTERVAL
      shapeIndex = (shapeIndex + 1) % shapes.length
      show(currentShape(), now)
    }

    const kv = reducedMotion ? 1 : 1 - Math.exp(-dt / 70)
    const kc = reducedMotion ? 1 : 1 - Math.exp(-dt / 120)
    for (let i = 0; i < CELLS; i++) {
      if (now < startAt[i]!)
        continue
      const goal = flash[i]! > now ? Math.max(target[i]!, 0.3) : target[i]!
      val[i]! += (goal - val[i]!) * kv
      for (let c = 0; c < 3; c++)
        cur[i * 3 + c]! += (dst[i * 3 + c]! - cur[i * 3 + c]!) * kc
    }

    dimLevel += ((dim ? 0.22 : 1) - dimLevel) * (reducedMotion ? 1 : 1 - Math.exp(-dt / 160))

    const step = dt / 16.7
    for (let k = particles.length - 1; k >= 0; k--) {
      const p = particles[k]!
      p.x += p.vx * step
      p.y += p.vy * step
      p.vy += 0.12 * step
      p.vx *= 0.99
      if (now - p.born > p.life)
        particles.splice(k, 1)
    }
  }

  function draw(now: number) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, vw, vh)
    if (!visible)
      return
    const { x: gx, y: gy, size, cell } = gridBox()
    if (size <= 0)
      return
    const gap = Math.max(1, cell * 0.14)
    const inner = cell - gap
    const glitching = glitchUntil > now
    const rowShift = glitching
      ? Array.from({ length: GRID }, () => (Math.random() < 0.18 ? rand(-cell * 3, cell * 3) : 0))
      : null

    // 背景格 + 印在格子上的 0/1
    const showBits = cell >= 9
    ctx.font = `${Math.round(cell * 0.56)}px "JetBrains Mono", "Fira Code", Menlo, monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let i = 0; i < CELLS; i++) {
      const cx = gx + (i % GRID) * cell + (rowShift ? rowShift[Math.floor(i / GRID)]! : 0)
      const cy = gy + Math.floor(i / GRID) * cell
      ctx.fillStyle = 'rgba(160, 190, 255, 0.045)'
      ctx.fillRect(cx + gap / 2, cy + gap / 2, inner, inner)
      if (showBits && val[i]! < 0.5) {
        ctx.fillStyle = `rgba(150, 200, 180, ${0.1 + (1 - dimLevel) * 0.04})`
        ctx.fillText(bits[i] ? '1' : '0', cx + cell / 2, cy + cell / 2 + cell * 0.04)
      }
    }

    // 亮起的格子：先叠一层柔光，再画实心
    ctx.globalCompositeOperation = 'lighter'
    for (let i = 0; i < CELLS; i++) {
      const v = val[i]! * dimLevel
      if (v < 0.04)
        continue
      const cx = gx + (i % GRID) * cell + (rowShift ? rowShift[Math.floor(i / GRID)]! : 0)
      const cy = gy + Math.floor(i / GRID) * cell
      ctx.fillStyle = `rgba(${cur[i * 3]! | 0}, ${cur[i * 3 + 1]! | 0}, ${cur[i * 3 + 2]! | 0}, ${v * 0.16})`
      ctx.fillRect(cx - cell * 0.35, cy - cell * 0.35, cell * 1.7, cell * 1.7)
    }
    ctx.globalCompositeOperation = 'source-over'
    for (let i = 0; i < CELLS; i++) {
      const v = val[i]! * dimLevel
      if (v < 0.04)
        continue
      const cx = gx + (i % GRID) * cell + (rowShift ? rowShift[Math.floor(i / GRID)]! : 0)
      const cy = gy + Math.floor(i / GRID) * cell
      ctx.fillStyle = `rgba(${cur[i * 3]! | 0}, ${cur[i * 3 + 1]! | 0}, ${cur[i * 3 + 2]! | 0}, ${Math.min(1, v)})`
      ctx.fillRect(cx + gap / 2, cy + gap / 2, inner, inner)
    }

    // 虫子
    if (bugs.size) {
      ctx.font = `${Math.round(cell * 0.82)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`
      bugs.forEach((born, i) => {
        const age = now - born
        const s = reducedMotion ? 1 : Math.min(1, age / 160)
        const pulse = 0.55 + Math.sin(age / 90) * 0.2
        const cx = gx + (i % GRID) * cell
        const cy = gy + Math.floor(i / GRID) * cell
        ctx.fillStyle = BUG_RED
        // 外圈光晕：格子小的时候也能一眼看到虫子
        ctx.globalAlpha = pulse * 0.3
        ctx.fillRect(cx + cell / 2 - cell * 1.1 * s, cy + cell / 2 - cell * 1.1 * s, cell * 2.2 * s, cell * 2.2 * s)
        ctx.globalAlpha = pulse
        const pad = (inner * (1 - s)) / 2
        ctx.fillRect(cx + gap / 2 + pad, cy + gap / 2 + pad, inner * s, inner * s)
        ctx.globalAlpha = 1
        ctx.save()
        ctx.translate(cx + cell / 2, cy + cell / 2)
        ctx.scale(s * 1.25, s * 1.25)
        ctx.fillText('🐛', 0, cell * 0.04)
        ctx.restore()
      })
    }

    // 悬停的格子描个边，提示可以点
    if (hover >= 0 && introStart < 0) {
      const cx = gx + (hover % GRID) * cell
      const cy = gy + Math.floor(hover / GRID) * cell
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.lineWidth = 1
      ctx.strokeRect(cx + gap / 2 + 0.5, cy + gap / 2 + 0.5, inner - 1, inner - 1)
    }

    // 粒子
    for (const p of particles) {
      const alpha = Math.max(0, 1 - (now - p.born) / p.life)
      ctx.globalAlpha = alpha
      ctx.fillStyle = p.color
      if (p.text) {
        ctx.font = `bold ${p.size}px "JetBrains Mono", Menlo, monospace`
        ctx.fillText(p.text, p.x, p.y)
      }
      else {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
    }
    ctx.globalAlpha = 1
  }

  function frame(now: number) {
    if (destroyed)
      return
    const dt = Math.min(50, now - last)
    last = now
    measureSlot(now)
    update(now, dt)
    draw(now)
    rafId = requestAnimationFrame(frame)
  }

  function cellAt(ev: PointerEvent) {
    // 不依赖上一帧的位置：页面刚滚动过，或者后台标签页里 rAF 停了，都要按当下的布局算
    measureSlot(performance.now())
    const { x, y, size, cell } = gridBox()
    const px = ev.clientX - x
    const py = ev.clientY - y
    if (px < 0 || py < 0 || px >= size || py >= size)
      return -1
    return Math.floor(py / cell) * GRID + Math.floor(px / cell)
  }

  /** 把格子设成指定状态，返回是否真的变了 */
  function paintCell(i: number, on: boolean, now: number, sparks: number) {
    if ((target[i]! >= 0.5) === on)
      return false
    setCell(i, on ? 1 : 0, on ? pick(RAIN_COLORS) : GREEN, 0, now)
    bits[i] = bits[i]! ^ 1
    if (on) {
      const c = cellCenter(i)
      burst(c.x, c.y, sparks, { colors: [VUE_GREEN, ANT_BLUE], speed: 2.4, life: 420 })
    }
    nextCycleAt = Math.max(nextCycleAt, now + USER_HOLD)
    return true
  }

  /** 从 a 到 b 沿直线涂过去：鼠标移得快时中间的格子也不会漏掉 */
  function paintLine(a: number, b: number, on: boolean, now: number) {
    let x0 = a % GRID
    let y0 = Math.floor(a / GRID)
    const x1 = b % GRID
    const y1 = Math.floor(b / GRID)
    const dx = Math.abs(x1 - x0)
    const dy = -Math.abs(y1 - y0)
    const sx = x0 < x1 ? 1 : -1
    const sy = y0 < y1 ? 1 : -1
    let err = dx + dy
    while (true) {
      paintCell(y0 * GRID + x0, on, now, 2)
      if (x0 === x1 && y0 === y1)
        break
      const e2 = 2 * err
      if (e2 >= dy) {
        err += dy
        x0 += sx
      }
      if (e2 <= dx) {
        err += dx
        y0 += sy
      }
    }
  }

  function endPaint() {
    if (paintPointer >= 0 && slot.hasPointerCapture?.(paintPointer))
      slot.releasePointerCapture(paintPointer)
    paintValue = -1
    paintPointer = -1
    lastPainted = -1
  }

  function onPointerMove(ev: PointerEvent) {
    const i = cellAt(ev)
    hover = i
    if (paintValue < 0 || ev.pointerId !== paintPointer)
      return
    // 拖出矩阵再拖回来时从新位置接着涂，不和出去前的位置连线
    if (i < 0) {
      lastPainted = -1
      return
    }
    if (i === lastPainted)
      return
    const now = performance.now()
    if (lastPainted >= 0)
      paintLine(lastPainted, i, paintValue === 1, now)
    else
      paintCell(i, paintValue === 1, now, 2)
    lastPainted = i
  }

  function onPointerLeave() {
    hover = -1
  }

  function onPointerDown(ev: PointerEvent) {
    if (introStart >= 0 || (ev.pointerType === 'mouse' && ev.button !== 0))
      return
    const i = cellAt(ev)
    if (i < 0 || options.interceptPress?.(i))
      return
    // 第一格翻转，之后拖过的格子都涂成和它一样的状态（来回拖不会闪）
    const on = target[i]! < 0.5
    paintCell(i, on, performance.now(), 6)
    paintValue = on ? 1 : 0
    paintPointer = ev.pointerId
    lastPainted = i
    slot.setPointerCapture?.(ev.pointerId)
  }

  resize()
  show(currentShape(), performance.now(), true)
  for (let i = 0; i < CELLS; i++) val[i] = 0
  window.addEventListener('resize', resize)
  slot.addEventListener('pointermove', onPointerMove)
  slot.addEventListener('pointerleave', onPointerLeave)
  slot.addEventListener('pointerdown', onPointerDown)
  slot.addEventListener('pointerup', endPaint)
  slot.addEventListener('pointercancel', endPaint)
  slot.addEventListener('lostpointercapture', endPaint)
  rafId = requestAnimationFrame(frame)

  return {
    intro(from, onDone) {
      clearTimers()
      visible = true
      introDone = onDone
      if (reducedMotion) {
        shapeIndex = shapes.length - 1
        show(currentShape())
        finishIntro()
        return
      }
      const now = performance.now()
      introStart = now
      introFrom = from
      raining = true
      for (let i = 0; i < CELLS; i++) setCell(i, 0, GREEN, 0, now)
      schedule(() => {
        raining = false
        introFrom = null
        introStart = -1
        shapeIndex = 0
        show(currentShape())
      }, T_RAIN_END)
      for (let k = 1; k < shapes.length; k++) {
        schedule(() => {
          shapeIndex = k
          show(currentShape())
        }, T_RAIN_END + T_SHAPE_STEP * k)
      }
      schedule(finishIntro, T_RAIN_END + T_SHAPE_STEP * Math.max(shapes.length - 1, 0) + 400)
    },
    skipIntro() {
      clearTimers()
      visible = true
      introStart = -1
      introFrom = null
      shapeIndex = Math.max(shapes.length - 1, 0)
      show(currentShape(), performance.now(), true)
      finishIntro()
    },
    setShapes(next) {
      shapes = next
      shapeIndex = Math.min(shapeIndex, Math.max(next.length - 1, 0))
    },
    celebrate() {
      const now = performance.now()
      celebrateUntil = now + 3200
      const mid = (GRID - 1) / 2
      for (let i = 0; i < CELLS; i++) {
        const dx = (i % GRID) - mid
        const dy = Math.floor(i / GRID) - mid
        const dist = Math.hypot(dx, dy)
        const hue = (Math.atan2(dy, dx) / Math.PI) * 180 + 180
        setCell(i, 1, hslToInt(hue, 0.75, 0.58), reducedMotion ? 0 : dist * 26, now)
      }
      const { x, y, size } = gridBox()
      const colors = [VUE_GREEN, ANT_BLUE, '#ffd666', '#ff85c0', '#b37feb', '#36cfc9']
      burst(x + size / 2, y + size / 2, 70, { texts: true, colors, speed: 11, life: 2200 })
      schedule(() => burst(x + size * 0.2, y + size * 0.3, 40, { texts: true, colors, speed: 8, life: 1800 }), 450)
      schedule(() => burst(x + size * 0.8, y + size * 0.3, 40, { texts: true, colors, speed: 8, life: 1800 }), 800)
      schedule(() => show(currentShape()), 3200)
    },
    glitch() {
      const now = performance.now()
      glitchUntil = now + (reducedMotion ? 300 : 900)
      schedule(() => show(currentShape()), reducedMotion ? 300 : 950)
    },
    setDim(next) {
      dim = next
    },
    addBug(i) {
      bugs.set(i, performance.now())
    },
    removeBug(i, squashed) {
      if (!bugs.delete(i))
        return
      const c = cellCenter(i)
      if (squashed) {
        burst(c.x, c.y, 14, { colors: [BUG_RED, VUE_GREEN, '#ffd666'], speed: 4.5, life: 600 })
        if (!reducedMotion) {
          particles.push({ x: c.x, y: c.y - 6, vx: 0, vy: -1.6, born: performance.now(), life: 700, color: VUE_GREEN, size: 14, text: '+1' })
        }
      }
      else {
        burst(c.x, c.y, 6, { colors: ['#8c8c8c'], speed: 1.6, life: 450 })
      }
    },
    clearBugs() {
      bugs.clear()
    },
    destroy() {
      destroyed = true
      clearTimers()
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      slot.removeEventListener('pointermove', onPointerMove)
      slot.removeEventListener('pointerleave', onPointerLeave)
      slot.removeEventListener('pointerdown', onPointerDown)
      slot.removeEventListener('pointerup', endPaint)
      slot.removeEventListener('pointercancel', endPaint)
      slot.removeEventListener('lostpointercapture', endPaint)
      particles.length = 0
      bugs.clear()
    },
  }
}
