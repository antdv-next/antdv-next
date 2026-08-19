/**
 * 七夕彩蛋 canvas 场景。
 *
 * 时间线（ms）：
 *   0     星空淡入
 *   400   银河淡入
 *   800   牛郎星 / 织女星亮起
 *   1600  喜鹊分批飞入，落到桥拱上
 *   4600  鹊桥辉光亮起
 *   5000  双星（Ant 蓝 / Vue 绿）沿桥拱相向而行
 *   7600  相会：心形粒子爆发 + 光环，之后进入常驻氛围
 *
 * 所有布局按画布尺寸的比例计算，粒子之外的动画都是时间的纯函数，
 * 因此 skip() 只需把时间推到相会时刻。
 */

export interface QixiSceneOptions {
  labels?: {
    vega?: string
    altair?: string
  }
  /** 相会瞬间由星尘汇聚而成的标题文字 */
  title?: string
  onMeet?: () => void
}

export interface QixiScene {
  /** 放飞心愿灯；传入两个名字则成对放飞，汇合时打出「A ❤ B」 */
  launchWish: (names?: { a?: string, b?: string }) => void
  /** 两个人的名字，会分别挂在织女星 / 牛郎星下方 */
  setNames: (a?: string, b?: string) => void
  /** 跳过开场动画，直达相会 */
  skip: () => void
  destroy: () => void
}

const T_MAGPIE_START = 1600
const MAGPIE_STAGGER = 70
const MAGPIE_FLIGHT = 1600
const T_BRIDGE_GLOW = 4600
const T_TRAVEL_START = 5000
const T_TRAVEL_DUR = 2600
const T_MEET = T_TRAVEL_START + T_TRAVEL_DUR

const MAGPIE_COUNT = 26

interface Star {
  fx: number
  fy: number
  layer: number
  r: number
  phase: number
  speed: number
}

interface Magpie {
  startFx: number
  startFy: number
  t: number
  delay: number
  flapPhase: number
  lift: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  gravity: number
  drag: number
  kind: 'spark' | 'heart'
}

interface Ring {
  x: number
  y: number
  born: number
  maxR: number
  color: string
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  born: number
  life: number
  len: number
}

interface LanternPair {
  remaining: number
  text: string
  sumX: number
  sumY: number
}

interface Lantern {
  x: number
  y: number
  vy: number
  swayPhase: number
  burstY: number
  /** 成对放飞时朝中心靠拢的横向速度 */
  vx: number
  pair: LanternPair | null
}

interface Rocket {
  x: number
  y: number
  vy: number
  targetY: number
  color: string
}

interface FloatingText {
  text: string
  x: number
  y: number
  born: number
}

interface AssemblyDot {
  sx: number
  sy: number
  tx: number
  ty: number
  delay: number
  dur: number
  color: string
  size: number
  phase: number
}

function rand(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function gauss() {
  return (Math.random() + Math.random() + Math.random()) / 3 - 0.5
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t))
}

/** 阶段进度：now 在 [start, start+dur] 内映射到 [0,1] */
function phase(now: number, start: number, dur: number) {
  return clamp01((now - start) / dur)
}

const VUE_GREEN = '#42d392'
const VUE_GREEN_DEEP = '#42b883'
const ANT_BLUE = '#4096ff'
const ANT_BLUE_DEEP = '#1677ff'
const GOLD = '#ffd666'
const PINK = '#ff85c0'

const BURST_COLORS = [ANT_BLUE, VUE_GREEN, GOLD, PINK, '#ffffff', '#b37feb']

/** 与 DOM 标题一致的渐变色带（绿 → 粉 → 金 → 蓝） */
const TITLE_STOPS: [number, [number, number, number]][] = [
  [0, [0x42, 0xD3, 0x92]],
  [0.45, [0xFF, 0xD6, 0xE7]],
  [0.6, [0xFF, 0xD6, 0x66]],
  [1, [0x40, 0x96, 0xFF]],
]

function titleGradientColor(t: number) {
  const x = clamp01(t)
  for (let i = 1; i < TITLE_STOPS.length; i++) {
    const [t1, c1] = TITLE_STOPS[i]!
    const [t0, c0] = TITLE_STOPS[i - 1]!
    if (x <= t1) {
      const p = (x - t0) / (t1 - t0)
      const r = Math.round(c0[0] + (c1[0] - c0[0]) * p)
      const g = Math.round(c0[1] + (c1[1] - c0[1]) * p)
      const b = Math.round(c0[2] + (c1[2] - c0[2]) * p)
      return `rgb(${r}, ${g}, ${b})`
    }
  }
  return 'rgb(64, 150, 255)'
}

export function createQixiScene(canvas: HTMLCanvasElement, options: QixiSceneOptions = {}): QixiScene {
  const ctx = canvas.getContext('2d')!
  const reducedMotion = typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let w = 0
  let h = 0
  let dpr = 1
  let bgGradient: CanvasGradient | null = null
  let milkyWay: HTMLCanvasElement | null = null

  const startTime = performance.now()
  let timeOffset = reducedMotion ? T_MEET + 800 : 0
  let prevNow = 0
  let rafId = 0
  let destroyed = false
  let metFired = false

  // 视差
  let pointerX = 0
  let pointerY = 0
  let parallaxX = 0
  let parallaxY = 0

  const stars: Star[] = []
  const magpies: Magpie[] = []
  const particles: Particle[] = []
  const rings: Ring[] = []
  const shootingStars: ShootingStar[] = []
  const lanterns: Lantern[] = []
  const rockets: Rocket[] = []
  const floatingTexts: FloatingText[] = []
  let nextShootingStarAt = 2600
  let nextAmbientHeartAt = T_MEET + 2000
  let nextAutoFireworkAt = T_MEET + 1200
  let nameVega = ''
  let nameAltair = ''
  // 标题星尘汇聚（Particle Reveal 思路的原生实现）
  let assembly: { dots: AssemblyDot[], start: number } | null = null
  let assemblyDone = reducedMotion || !options.title

  // ---------- 布局（每帧按画布比例计算） ----------
  function layout() {
    const vega = { x: w * 0.26, y: h * 0.36 }
    const altair = { x: w * 0.74, y: h * 0.52 }
    const control = {
      x: (vega.x + altair.x) / 2,
      y: Math.min(vega.y, altair.y) - h * 0.16,
    }
    return { vega, altair, control }
  }

  function bridgePoint(t: number) {
    const { vega, altair, control } = layout()
    const mt = 1 - t
    return {
      x: mt * mt * vega.x + 2 * mt * t * control.x + t * t * altair.x,
      y: mt * mt * vega.y + 2 * mt * t * control.y + t * t * altair.y,
    }
  }

  /** 下层桥面：同端点、拱度稍缓，与上层栏杆形成梭形桥身 */
  function bridgeDeckPoint(t: number) {
    const { vega, altair, control } = layout()
    const mt = 1 - t
    const cy = control.y + 20
    return {
      x: mt * mt * vega.x + 2 * mt * t * control.x + t * t * altair.x,
      y: mt * mt * vega.y + 2 * mt * t * cy + t * t * altair.y,
    }
  }

  // ---------- 初始化实体 ----------
  function initStars() {
    stars.length = 0
    const total = 320
    for (let i = 0; i < total; i++) {
      const layer = i < total * 0.6 ? 0 : i < total * 0.88 ? 1 : 2
      stars.push({
        fx: Math.random(),
        fy: Math.random(),
        layer,
        r: layer === 0 ? rand(0.4, 0.9) : layer === 1 ? rand(0.7, 1.4) : rand(1.2, 2),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.0008, 0.0024),
      })
    }
  }

  function initMagpies() {
    magpies.length = 0
    // 桥拱上的落点均匀分布，中心留出双星相会的位置
    const slots: number[] = []
    for (let i = 0; i < MAGPIE_COUNT; i++) {
      const t = 0.05 + (0.9 * i) / (MAGPIE_COUNT - 1)
      slots.push(t < 0.5 ? t * 0.88 : 1 - (1 - t) * 0.88)
    }
    const order = slots.map((t, i) => ({ t, i })).sort(() => Math.random() - 0.5)
    order.forEach(({ t }, idx) => {
      const fromLeft = t < 0.5
      magpies.push({
        startFx: fromLeft ? -0.06 : 1.06,
        startFy: rand(0.12, 0.85),
        t,
        delay: T_MAGPIE_START + idx * MAGPIE_STAGGER,
        flapPhase: rand(0, Math.PI * 2),
        lift: rand(30, 70),
      })
    })
  }

  // ---------- 银河离屏纹理 ----------
  function buildMilkyWay() {
    const off = document.createElement('canvas')
    off.width = Math.max(1, w)
    off.height = Math.max(1, h)
    const octx = off.getContext('2d')!
    const { vega, altair } = layout()
    const cx = (vega.x + altair.x) / 2
    const cy = (vega.y + altair.y) / 2
    // 银河方向：与两星连线垂直，形成斜贯屏幕的光带
    const dx = altair.x - vega.x
    const dy = altair.y - vega.y
    const dLen = Math.hypot(dx, dy) || 1
    const bandX = -dy / dLen
    const bandY = dx / dLen
    const bandLen = Math.hypot(w, h) * 0.85
    const bandWidth = Math.min(w, h) * 0.13

    // 大块星云
    for (let i = 0; i < 10; i++) {
      const t = rand(-1, 1)
      const px = cx + bandX * bandLen * t + gauss() * bandWidth * 2
      const py = cy + bandY * bandLen * t + gauss() * bandWidth * 2
      const r = rand(60, 170)
      const g = octx.createRadialGradient(px, py, 0, px, py, r)
      const warm = Math.random() < 0.3
      g.addColorStop(0, warm ? 'rgba(190, 120, 220, 0.05)' : 'rgba(120, 145, 225, 0.06)')
      g.addColorStop(1, 'rgba(0, 0, 0, 0)')
      octx.fillStyle = g
      octx.fillRect(px - r, py - r, r * 2, r * 2)
    }

    // 密集星尘
    for (let i = 0; i < 850; i++) {
      const t = rand(-1, 1)
      const px = cx + bandX * bandLen * t + gauss() * bandWidth * 2.6
      const py = cy + bandY * bandLen * t + gauss() * bandWidth * 2.6
      const r = rand(0.3, 1.3)
      const warm = Math.random() < 0.18
      octx.fillStyle = warm
        ? `rgba(255, 220, 180, ${rand(0.05, 0.4)})`
        : `rgba(200, 215, 255, ${rand(0.05, 0.45)})`
      octx.beginPath()
      octx.arc(px, py, r, 0, Math.PI * 2)
      octx.fill()
    }
    milkyWay = off
  }

  /**
   * 对标题文字做像素采样，生成从鹊桥汇合点飞向各自落点的星尘。
   * 布局尽量贴近 DOM 标题（top 7% + 徽标高度），交接时用交叉淡化掩盖细微偏差。
   */
  function createAssembly(now: number) {
    const text = options.title!
    const fontSize = Math.min(56, Math.max(34, w * 0.06))
    const font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
    const off = document.createElement('canvas')
    off.width = Math.max(1, w)
    off.height = Math.ceil(fontSize * 1.8)
    const octx = off.getContext('2d', { willReadFrequently: true })!
    octx.font = font
    if ('letterSpacing' in octx)
      octx.letterSpacing = `${Math.round(fontSize * 0.12)}px`
    octx.textAlign = 'center'
    octx.textBaseline = 'middle'
    octx.fillStyle = '#fff'
    octx.fillText(text, off.width / 2, off.height / 2)

    const offsetY = h * 0.07 + 41 + fontSize * 0.62 - off.height / 2
    const image = octx.getImageData(0, 0, off.width, off.height).data
    const step = Math.max(2, Math.round(fontSize / 16))
    const points: { x: number, y: number }[] = []
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        if (image[(y * off.width + x) * 4 + 3]! > 128)
          points.push({ x, y: y + offsetY })
      }
    }
    if (!points.length)
      return
    // 控制粒子总量，均匀抽稀
    const MAX_DOTS = 760
    const keep = Math.min(1, MAX_DOTS / points.length)
    const minX = Math.min(...points.map(p => p.x))
    const maxX = Math.max(...points.map(p => p.x))
    const apex = bridgePoint(0.5)
    const dots: AssemblyDot[] = []
    for (const p of points) {
      if (Math.random() > keep)
        continue
      const angle = rand(0, Math.PI * 2)
      const radius = rand(0, 60)
      dots.push({
        sx: apex.x + Math.cos(angle) * radius,
        sy: apex.y + Math.sin(angle) * radius,
        tx: p.x,
        ty: p.y,
        delay: rand(0, 600),
        dur: rand(1000, 1600),
        color: titleGradientColor((p.x - minX) / Math.max(1, maxX - minX)),
        size: rand(0.9, 1.8),
        phase: rand(0, Math.PI * 2),
      })
    }
    assembly = { dots, start: now }
  }

  // ---------- 尺寸 ----------
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = Math.max(1, Math.round(w * dpr))
    canvas.height = Math.max(1, Math.round(h * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    bgGradient = ctx.createLinearGradient(0, 0, 0, h)
    bgGradient.addColorStop(0, '#050714')
    bgGradient.addColorStop(0.55, '#0a1028')
    bgGradient.addColorStop(1, '#141a3d')
    buildMilkyWay()
    // 尺寸变化后旧的采样点已失效，DOM 标题此时已接管
    if (assembly) {
      assembly = null
      assemblyDone = true
    }
  }

  // ---------- 粒子 ----------
  function spawnSpark(x: number, y: number, color: string, speed: number, kind: Particle['kind'] = 'spark') {
    const angle = rand(0, Math.PI * 2)
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: rand(600, 1400),
      size: kind === 'heart' ? rand(4, 8) : rand(0.8, 2.2),
      color,
      gravity: kind === 'heart' ? -0.00002 : 0.00008,
      drag: 0.985,
      kind,
    })
  }

  function spawnHeartBurst(x: number, y: number) {
    // 心形轮廓向外扩散的粒子
    for (let i = 0; i < 46; i++) {
      const a = (i / 46) * Math.PI * 2
      const hx = 16 * Math.sin(a) ** 3
      const hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a))
      const len = Math.hypot(hx, hy) || 1
      const speed = rand(0.06, 0.1)
      particles.push({
        x,
        y,
        vx: (hx / len) * speed * (len / 10),
        vy: (hy / len) * speed * (len / 10),
        life: 0,
        maxLife: rand(1400, 2200),
        size: rand(1.2, 2.4),
        color: Math.random() < 0.5 ? PINK : GOLD,
        gravity: 0.00003,
        drag: 0.99,
        kind: 'spark',
      })
    }
    // 四散的彩色火花
    for (let i = 0; i < 130; i++)
      spawnSpark(x, y, BURST_COLORS[i % BURST_COLORS.length]!, rand(0.05, 0.4))
    // 飘起的小心心
    for (let i = 0; i < 8; i++) {
      particles.push({
        x: x + rand(-30, 30),
        y: y + rand(-10, 10),
        vx: rand(-0.02, 0.02),
        vy: rand(-0.09, -0.05),
        life: 0,
        maxLife: rand(2200, 3600),
        size: rand(4, 9),
        color: Math.random() < 0.6 ? PINK : '#ff9ecb',
        gravity: -0.00001,
        drag: 0.998,
        kind: 'heart',
      })
    }
    rings.push({ x, y, born: prevNow, maxR: Math.min(w, h) * 0.42, color: 'rgba(255, 200, 230,' })
    rings.push({ x, y, born: prevNow + 180, maxR: Math.min(w, h) * 0.3, color: 'rgba(140, 180, 255,' })
  }

  function spawnFirework(x: number, y: number) {
    const palette = [BURST_COLORS[Math.floor(rand(0, BURST_COLORS.length))]!, '#ffffff', GOLD]
    for (let i = 0; i < 84; i++) {
      const angle = rand(0, Math.PI * 2)
      const speed = rand(0.05, 0.32)
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: rand(900, 1900),
        size: rand(1, 2.4),
        color: palette[i % palette.length]!,
        gravity: 0.0001,
        drag: 0.982,
        kind: 'spark',
      })
    }
    // 中心闪光
    particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 320,
      size: rand(4, 6),
      color: '#ffffff',
      gravity: 0,
      drag: 1,
      kind: 'spark',
    })
    rings.push({ x, y, born: prevNow, maxR: rand(40, 64), color: 'rgba(255, 255, 255,' })
  }

  // ---------- 绘制原语 ----------
  function drawGlowDot(x: number, y: number, r: number, color: string, alpha: number) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, color)
    g.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.globalAlpha = alpha
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  function drawHeart(x: number, y: number, size: number, color: string, alpha: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(size, size)
    ctx.globalAlpha = alpha
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(0, 0.32)
    ctx.bezierCurveTo(-0.5, -0.28, -1.1, 0.28, 0, 1)
    ctx.bezierCurveTo(1.1, 0.28, 0.5, -0.28, 0, 0.32)
    ctx.fill()
    ctx.restore()
    ctx.globalAlpha = 1
  }

  function drawNamedStar(x: number, y: number, core: string, deep: string, label: string | undefined, alpha: number, now: number) {
    if (alpha <= 0)
      return
    const pulse = 1 + Math.sin(now * 0.0016) * 0.08
    drawGlowDot(x, y, 46 * pulse, `${hexToRgba(deep, 0.5)}`, alpha)
    drawGlowDot(x, y, 16 * pulse, core, alpha)
    // 十字光芒
    ctx.save()
    ctx.globalAlpha = alpha * 0.85
    ctx.strokeStyle = core
    ctx.lineCap = 'round'
    for (const [len, width, rot] of [[34 * pulse, 1.6, 0], [22 * pulse, 1, Math.PI / 4]] as const) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(-len, 0)
      ctx.lineTo(len, 0)
      ctx.moveTo(0, -len)
      ctx.lineTo(0, len)
      ctx.stroke()
      ctx.restore()
    }
    ctx.restore()
    // 白色核心
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(x, y, 2.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
    if (label) {
      ctx.globalAlpha = alpha * 0.8
      ctx.fillStyle = 'rgba(200, 212, 240, 1)'
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(label, x, y + 64)
      ctx.globalAlpha = 1
    }
  }

  function drawMagpie(x: number, y: number, dir: number, flap: number, scale: number, alpha: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(dir * scale, scale)
    ctx.globalAlpha = alpha
    ctx.shadowColor = 'rgba(150, 180, 255, 0.7)'
    ctx.shadowBlur = 5
    ctx.fillStyle = 'rgba(206, 217, 242, 0.95)'
    // 身体 + 头
    ctx.beginPath()
    ctx.ellipse(0, 0, 5.6, 2.5, -0.12, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(5, -1.4, 1.9, 0, Math.PI * 2)
    ctx.fill()
    // 喙
    ctx.beginPath()
    ctx.moveTo(6.6, -1.6)
    ctx.lineTo(8.6, -1)
    ctx.lineTo(6.6, -0.5)
    ctx.closePath()
    ctx.fill()
    // 尾羽
    ctx.beginPath()
    ctx.moveTo(-4.6, -0.6)
    ctx.lineTo(-10.5, -1.8 + flap * 1.2)
    ctx.lineTo(-9.5, 0.8)
    ctx.lineTo(-4.4, 0.9)
    ctx.closePath()
    ctx.fill()
    // 双翼
    ctx.beginPath()
    ctx.moveTo(0.6, -1.4)
    ctx.quadraticCurveTo(-1.6, -3.5 - flap * 6.5, -6.5, -2.5 - flap * 8)
    ctx.quadraticCurveTo(-3, -1 - flap * 2, 0.2, 0)
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = alpha * 0.7
    ctx.beginPath()
    ctx.moveTo(1, -0.6)
    ctx.quadraticCurveTo(-0.8, 1.8 + flap * 4.5, -5.4, 2.6 + flap * 5.5)
    ctx.quadraticCurveTo(-2.4, 1, 0.6, 0.6)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
    ctx.globalAlpha = 1
  }

  function drawBridgeGlow(now: number) {
    const alpha = phase(now, T_BRIDGE_GLOW, 1400)
    if (alpha <= 0)
      return
    const { vega, altair, control } = layout()
    const deckControlY = control.y + 20
    const grad = ctx.createLinearGradient(vega.x, vega.y, altair.x, altair.y)
    grad.addColorStop(0, hexToRgba(VUE_GREEN, 0.8))
    grad.addColorStop(0.5, 'rgba(255, 210, 235, 0.9)')
    grad.addColorStop(1, hexToRgba(ANT_BLUE, 0.8))

    const traceRail = () => {
      ctx.beginPath()
      ctx.moveTo(vega.x, vega.y)
      ctx.quadraticCurveTo(control.x, control.y, altair.x, altair.y)
    }
    const traceDeck = () => {
      ctx.beginPath()
      ctx.moveTo(vega.x, vega.y)
      ctx.quadraticCurveTo(control.x, deckControlY, altair.x, altair.y)
    }

    ctx.save()
    ctx.lineCap = 'round'

    // 外层雾状光晕
    ctx.globalAlpha = alpha * 0.3
    ctx.strokeStyle = grad
    ctx.shadowColor = 'rgba(180, 190, 255, 0.9)'
    ctx.shadowBlur = 26
    ctx.lineWidth = 12
    traceRail()
    ctx.stroke()

    // 上层栏杆（主光带）
    ctx.globalAlpha = alpha * 0.9
    ctx.shadowBlur = 14
    ctx.lineWidth = 4
    traceRail()
    ctx.stroke()

    // 下层桥面
    ctx.globalAlpha = alpha * 0.65
    ctx.shadowBlur = 8
    ctx.lineWidth = 2.4
    traceDeck()
    ctx.stroke()

    // 桥板：两层弧线之间的竖向连接
    ctx.globalAlpha = alpha * 0.4
    ctx.shadowBlur = 0
    ctx.strokeStyle = 'rgba(222, 208, 255, 0.9)'
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let t = 0.07; t <= 0.935; t += 0.035) {
      const top = bridgePoint(t)
      const bottom = bridgeDeckPoint(t)
      ctx.moveTo(top.x, top.y)
      ctx.lineTo(bottom.x, bottom.y)
    }
    ctx.stroke()

    // 栏杆流光
    ctx.globalAlpha = alpha * 0.75
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.lineWidth = 1.4
    ctx.setLineDash([10, 26])
    ctx.lineDashOffset = -now * 0.045
    traceRail()
    ctx.stroke()
    ctx.restore()

    // 桥身星尘：不时从桥面洒落
    if (alpha > 0.8 && Math.random() < 0.22) {
      const p = bridgeDeckPoint(rand(0.06, 0.94))
      particles.push({
        x: p.x,
        y: p.y + 2,
        vx: rand(-0.008, 0.008),
        vy: rand(0.008, 0.03),
        life: 0,
        maxLife: rand(900, 1700),
        size: rand(0.6, 1.6),
        color: Math.random() < 0.4 ? GOLD : '#e6ecff',
        gravity: 0.00004,
        drag: 0.995,
        kind: 'spark',
      })
    }
  }

  function drawOrb(x: number, y: number, core: string, deep: string, r: number, alpha: number) {
    drawGlowDot(x, y, r * 3.2, hexToRgba(deep, 0.55), alpha)
    drawGlowDot(x, y, r * 1.4, core, alpha)
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(x, y, r * 0.42, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  function hexToRgba(hex: string, alpha: number) {
    const n = Number.parseInt(hex.slice(1), 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
  }

  // ---------- 每帧 ----------
  function frame(rafNow: number) {
    if (destroyed)
      return
    const now = rafNow - startTime + timeOffset
    const dt = Math.min(now - prevNow, 50)
    prevNow = now

    parallaxX += (pointerX - parallaxX) * 0.04
    parallaxY += (pointerY - parallaxY) * 0.04

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = bgGradient!
    ctx.fillRect(0, 0, w, h)

    const introAlpha = easeOutCubic(phase(now, 0, 1200))

    // 银河
    if (milkyWay) {
      const mwAlpha = easeOutCubic(phase(now, 400, 1800))
      ctx.globalAlpha = mwAlpha
      const driftX = Math.sin(now * 0.00004) * 8 + parallaxX * 5
      const driftY = Math.cos(now * 0.00005) * 5 + parallaxY * 5
      ctx.drawImage(milkyWay, driftX, driftY, w, h)
      ctx.globalAlpha = 1
    }

    // 星空（3 层视差 + 闪烁）
    for (const star of stars) {
      const depth = (star.layer + 1) * 6
      const x = star.fx * w + parallaxX * depth
      const y = star.fy * h + parallaxY * depth
      const tw = 0.5 + 0.5 * Math.sin(now * star.speed + star.phase)
      const alpha = introAlpha * (0.25 + tw * 0.75)
      ctx.globalAlpha = alpha
      ctx.fillStyle = star.layer === 2 ? '#ffffff' : '#cfd9f5'
      ctx.beginPath()
      ctx.arc(x, y, star.r, 0, Math.PI * 2)
      ctx.fill()
      if (star.layer === 2)
        drawGlowDot(x, y, star.r * 5, 'rgba(190, 205, 255, 0.6)', alpha * 0.6)
    }
    ctx.globalAlpha = 1

    // 流星
    if (now > nextShootingStarAt) {
      nextShootingStarAt = now + rand(2600, 6500)
      const speed = rand(0.25, 0.5)
      const angle = rand(Math.PI * 0.12, Math.PI * 0.24)
      shootingStars.push({
        x: rand(w * 0.15, w * 1.05),
        y: rand(-20, h * 0.25),
        vx: -Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        born: now,
        life: rand(900, 1500),
        len: rand(70, 150),
      })
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i]!
      const age = now - s.born
      if (age > s.life) {
        shootingStars.splice(i, 1)
        continue
      }
      s.x += s.vx * dt
      s.y += s.vy * dt
      const fade = Math.sin((age / s.life) * Math.PI)
      const tailX = s.x - s.vx * s.len * 3
      const tailY = s.y - s.vy * s.len * 3
      const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * fade})`)
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.6
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(tailX, tailY)
      ctx.stroke()
    }

    // 桥 + 喜鹊
    ctx.save()
    ctx.translate(parallaxX * 4, parallaxY * 4)
    drawBridgeGlow(now)

    for (const m of magpies) {
      const p = phase(now, m.delay, MAGPIE_FLIGHT)
      if (p <= 0)
        continue
      const target = bridgePoint(m.t)
      const targetY = target.y - 7
      let x: number
      let y: number
      let flapAmp: number
      let dir: number
      if (p < 1) {
        const e = easeInOutCubic(p)
        const sx = m.startFx * w
        const sy = m.startFy * h
        x = sx + (target.x - sx) * e
        y = sy + (targetY - sy) * e - Math.sin(e * Math.PI) * m.lift
        flapAmp = 1
        dir = target.x >= sx ? 1 : -1
      }
      else {
        // 停在桥上轻轻起伏
        x = target.x
        y = targetY + Math.sin(now * 0.003 + m.flapPhase) * 1.6
        flapAmp = 0.14
        dir = m.t < 0.5 ? 1 : -1
      }
      const flap = Math.sin(now * 0.02 + m.flapPhase) * flapAmp
      drawMagpie(x, y, dir, flap, p < 1 ? 1 : 0.86, Math.min(1, p * 3))
    }

    // 牛郎织女双星
    const { vega, altair } = layout()
    const namedAlpha = easeOutCubic(phase(now, 800, 1400))
    drawNamedStar(vega.x, vega.y, VUE_GREEN, VUE_GREEN_DEEP, options.labels?.vega, namedAlpha, now)
    drawNamedStar(altair.x, altair.y, ANT_BLUE, ANT_BLUE_DEEP, options.labels?.altair, namedAlpha, now + 700)
    // 两个人的名字分别守在两颗星下
    if (namedAlpha > 0 && (nameVega || nameAltair)) {
      ctx.globalAlpha = namedAlpha * 0.95
      ctx.fillStyle = '#ffb8d9'
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      ctx.textAlign = 'center'
      ctx.shadowColor = 'rgba(255, 133, 192, 0.8)'
      ctx.shadowBlur = 8
      if (nameVega)
        ctx.fillText(nameVega, vega.x, vega.y + 84)
      if (nameAltair)
        ctx.fillText(nameAltair, altair.x, altair.y + 84)
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }

    // 双星沿桥相向而行
    const travel = easeInOutCubic(phase(now, T_TRAVEL_START, T_TRAVEL_DUR))
    if (travel > 0 && travel < 1) {
      const a = bridgePoint(travel * 0.5)
      const b = bridgePoint(1 - travel * 0.5)
      drawOrb(a.x, a.y, VUE_GREEN, VUE_GREEN_DEEP, 7, 1)
      drawOrb(b.x, b.y, ANT_BLUE, ANT_BLUE_DEEP, 7, 1)
      if (Math.random() < 0.6) {
        spawnSpark(a.x, a.y, VUE_GREEN, rand(0.01, 0.05))
        spawnSpark(b.x, b.y, ANT_BLUE, rand(0.01, 0.05))
      }
    }

    // 相会
    if (now >= T_MEET && !metFired) {
      metFired = true
      const apex = bridgePoint(0.5)
      spawnHeartBurst(apex.x, apex.y)
      options.onMeet?.()
    }
    if (metFired) {
      // 相会后的合体之星：蓝绿双色互绕
      const apex = bridgePoint(0.5)
      const orbit = 4 + Math.sin(now * 0.002) * 1.5
      const angle = now * 0.0012
      const pulse = 1 + Math.sin(now * 0.003) * 0.12
      drawGlowDot(apex.x, apex.y, 40 * pulse, 'rgba(255, 220, 240, 0.5)', 0.9)
      drawOrb(apex.x + Math.cos(angle) * orbit, apex.y + Math.sin(angle) * orbit, VUE_GREEN, VUE_GREEN_DEEP, 5.5, 1)
      drawOrb(apex.x - Math.cos(angle) * orbit, apex.y - Math.sin(angle) * orbit, ANT_BLUE, ANT_BLUE_DEEP, 5.5, 1)
      // 常驻氛围：桥心不时飘起小心心
      if (now > nextAmbientHeartAt) {
        nextAmbientHeartAt = now + rand(2600, 5200)
        particles.push({
          x: apex.x + rand(-24, 24),
          y: apex.y,
          vx: rand(-0.015, 0.015),
          vy: rand(-0.07, -0.04),
          life: 0,
          maxLife: rand(2600, 4200),
          size: rand(3.5, 7),
          color: Math.random() < 0.6 ? PINK : '#ff9ecb',
          gravity: -0.00001,
          drag: 0.999,
          kind: 'heart',
        })
      }
    }
    ctx.restore()

    // 星尘汇聚成标题（画在视差平移之外，与 DOM 标题坐标对齐），随后交叉淡化交给 DOM 接管
    if (metFired && !assemblyDone) {
      if (!assembly)
        createAssembly(now)
      if (!assembly) {
        assemblyDone = true
      }
      else {
        const age = now - assembly.start
        // DOM 标题约 2.2s 起淡入、3.4s 完全显现，粒子再退场，避免交接空档
        const FADE_START = 3600
        const FADE_END = 4600
        const globalFade = age > FADE_START ? 1 - (age - FADE_START) / (FADE_END - FADE_START) : 1
        if (globalFade <= 0) {
          assembly = null
          assemblyDone = true
        }
        else {
          for (const dot of assembly.dots) {
            const p = clamp01((age - dot.delay) / dot.dur)
            if (p <= 0)
              continue
            const e = easeOutCubic(p)
            const x = dot.sx + (dot.tx - dot.sx) * e
            const y = dot.sy + (dot.ty - dot.sy) * e
            const twinkle = p >= 1 ? 0.7 + 0.3 * Math.sin(now * 0.006 + dot.phase) : 0.9
            ctx.globalAlpha = globalFade * twinkle
            ctx.fillStyle = dot.color
            ctx.beginPath()
            ctx.arc(x, y, dot.size, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.globalAlpha = 1
        }
      }
    }

    // 自动烟花：相会后从地平线升起烟花火箭
    if (metFired && now > nextAutoFireworkAt) {
      nextAutoFireworkAt = now + rand(2400, 5200)
      const count = Math.random() < 0.25 ? 2 : 1
      for (let i = 0; i < count; i++) {
        rockets.push({
          x: rand(w * 0.1, w * 0.9),
          y: h + 12,
          vy: -rand(0.3, 0.42),
          targetY: rand(h * 0.1, h * 0.42),
          color: BURST_COLORS[Math.floor(rand(0, BURST_COLORS.length))]!,
        })
      }
    }
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i]!
      r.y += r.vy * dt
      if (r.y <= r.targetY) {
        spawnFirework(r.x, r.y)
        rockets.splice(i, 1)
        continue
      }
      // 上升拖尾
      drawGlowDot(r.x, r.y, 8, 'rgba(255, 236, 200, 0.9)', 1)
      if (Math.random() < 0.8)
        spawnSpark(r.x, r.y + 4, Math.random() < 0.5 ? GOLD : '#fff3d6', rand(0.004, 0.02))
    }

    // 心愿灯
    for (let i = lanterns.length - 1; i >= 0; i--) {
      const l = lanterns[i]!
      l.y += l.vy * dt
      l.x += l.vx * dt + Math.sin(now * 0.0016 + l.swayPhase) * 0.35
      if (l.y <= l.burstY) {
        for (let j = 0; j < 26; j++)
          spawnSpark(l.x, l.y, j % 3 === 0 ? '#fff3d6' : GOLD, rand(0.02, 0.14))
        rings.push({ x: l.x, y: l.y, born: now, maxR: 46, color: 'rgba(255, 214, 102,' })
        if (l.pair) {
          l.pair.remaining -= 1
          l.pair.sumX += l.x
          l.pair.sumY += l.y
          // 两盏灯都到达银河，绽放合体庆祝并打出名字
          if (l.pair.remaining === 0) {
            const cx = l.pair.sumX / 2
            const cy = l.pair.sumY / 2
            for (let j = 0; j < 40; j++)
              spawnSpark(cx, cy, j % 2 === 0 ? PINK : GOLD, rand(0.03, 0.2))
            for (let j = 0; j < 6; j++) {
              particles.push({
                x: cx + rand(-20, 20),
                y: cy + rand(-8, 8),
                vx: rand(-0.015, 0.015),
                vy: rand(-0.08, -0.04),
                life: 0,
                maxLife: rand(2200, 3400),
                size: rand(4, 8),
                color: Math.random() < 0.6 ? PINK : '#ff9ecb',
                gravity: -0.00001,
                drag: 0.998,
                kind: 'heart',
              })
            }
            rings.push({ x: cx, y: cy, born: now, maxR: 90, color: 'rgba(255, 184, 217,' })
            floatingTexts.push({ text: l.pair.text, x: cx, y: cy, born: now })
          }
        }
        lanterns.splice(i, 1)
        continue
      }
      const flicker = 0.85 + Math.sin(now * 0.02 + l.swayPhase * 3) * 0.15
      drawGlowDot(l.x, l.y, 22, `rgba(255, 190, 100, ${0.5 * flicker})`, 1)
      const g = ctx.createLinearGradient(l.x, l.y - 7, l.x, l.y + 7)
      g.addColorStop(0, '#ffd58a')
      g.addColorStop(1, '#ff8c50')
      ctx.fillStyle = g
      ctx.globalAlpha = flicker
      ctx.beginPath()
      ctx.ellipse(l.x, l.y, 5, 7, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
      if (Math.random() < 0.2)
        spawnSpark(l.x, l.y + 6, GOLD, rand(0.005, 0.02))
    }

    // 光环
    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i]!
      const age = now - ring.born
      if (age < 0)
        continue
      const p = age / 1200
      if (p >= 1) {
        rings.splice(i, 1)
        continue
      }
      const e = easeOutCubic(p)
      ctx.strokeStyle = `${ring.color} ${0.55 * (1 - p)})`
      ctx.lineWidth = 2 * (1 - p) + 0.5
      ctx.beginPath()
      ctx.arc(ring.x, ring.y, ring.maxR * e, 0, Math.PI * 2)
      ctx.stroke()
    }

    // 通用粒子
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]!
      p.life += dt
      if (p.life >= p.maxLife) {
        particles.splice(i, 1)
        continue
      }
      p.vx *= p.drag
      p.vy = p.vy * p.drag + p.gravity * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      const fade = 1 - p.life / p.maxLife
      if (p.kind === 'heart') {
        drawHeart(p.x, p.y, p.size * (0.7 + 0.3 * Math.sin(p.life * 0.004)), p.color, fade * 0.9)
      }
      else {
        ctx.globalAlpha = fade
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }
    if (particles.length > 900)
      particles.splice(0, particles.length - 900)

    // 汇合处升起的「A ❤ B」
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i]!
      const age = now - ft.born
      const DURATION = 5200
      if (age >= DURATION) {
        floatingTexts.splice(i, 1)
        continue
      }
      const fadeIn = clamp01(age / 500)
      const fadeOut = clamp01((DURATION - age) / 1400)
      const alpha = Math.min(fadeIn, fadeOut)
      const y = ft.y - age * 0.014
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      ctx.textAlign = 'center'
      ctx.shadowColor = 'rgba(255, 133, 192, 0.9)'
      ctx.shadowBlur = 16
      ctx.fillStyle = '#ffe3f0'
      ctx.fillText(ft.text, ft.x, y)
      ctx.restore()
    }

    rafId = requestAnimationFrame(frame)
  }

  // ---------- 事件 ----------
  function onPointerMove(ev: PointerEvent) {
    pointerX = (ev.clientX / window.innerWidth - 0.5) * 2
    pointerY = (ev.clientY / window.innerHeight - 0.5) * 2
  }

  function onClick(ev: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    spawnFirework(ev.clientX - rect.left, ev.clientY - rect.top)
  }

  resize()
  initStars()
  initMagpies()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('click', onClick)
  rafId = requestAnimationFrame(frame)

  return {
    launchWish(names) {
      const a = names?.a?.trim()
      const b = names?.b?.trim()
      if (a && b) {
        // 成对放飞：两盏灯从两侧升起、向中心靠拢，同一高度汇合
        // 汇合点落在桥拱下方，避开顶部标题文字
        const burstY = h * rand(0.36, 0.42)
        const rise = rand(0.085, 0.095)
        const travelMs = (h + 16 - burstY) / rise
        const startOffset = w * rand(0.16, 0.2)
        const pair: LanternPair = { remaining: 2, text: `${a} ❤ ${b}`, sumX: 0, sumY: 0 }
        for (const side of [-1, 1] as const) {
          const startX = w * 0.5 + side * startOffset
          lanterns.push({
            x: startX,
            y: h + 16,
            vy: -rise,
            // 汇合时两盏灯相距约 40px
            vx: (w * 0.5 + side * 20 - startX) / travelMs,
            swayPhase: rand(0, Math.PI * 2),
            burstY,
            pair,
          })
        }
        return
      }
      lanterns.push({
        x: w * 0.5 + rand(-w * 0.08, w * 0.08),
        y: h + 16,
        vy: -rand(0.05, 0.07),
        vx: 0,
        swayPhase: rand(0, Math.PI * 2),
        burstY: h * rand(0.2, 0.34),
        pair: null,
      })
    },
    setNames(a, b) {
      nameVega = a?.trim() ?? ''
      nameAltair = b?.trim() ?? ''
    },
    skip() {
      if (prevNow < T_MEET)
        timeOffset += T_MEET - prevNow
    },
    destroy() {
      destroyed = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('click', onClick)
    },
  }
}
