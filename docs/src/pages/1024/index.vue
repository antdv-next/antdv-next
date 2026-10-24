<script setup lang="ts">
import type { Shape } from './bitmaps'
import type { CommandEffect, ConsoleLine } from './commands'
import type { BugGame, BugGameState } from './game'
import type { BitScene } from './scene'
import type { AntdvMenuItem } from '@/config/menu/interface'
import { ArrowLeftOutlined, CodeOutlined, CopyOutlined, StopOutlined, ThunderboltOutlined } from '@antdv-next/icons'
import { theme } from 'antdv-next'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import logoUrl from '@/assets/antdv-next.svg'
import { daysUntilFestival } from '@/composables/festival'
import { localeStore } from '@/composables/local-store'
import { useComponentLocale } from '@/composables/use-locale'
import { componentLocales, components as componentMenu } from '@/config/menu/components'
import { loadImageShape, TEXT_1024, TEXT_CODE, textShape } from './bitmaps'
import { complete, runCommand } from './commands'
import { CODER_DAY } from './day'
import { createBugGame } from './game'
import { createBitScene } from './scene'

const locales: Record<'cn' | 'en', Record<string, string>> = {
  cn: {
    title: '1024 · 程序员节快乐',
    subtitle: '2¹⁰ —— 致敬每一行代码背后的你',
    today: '今天 · 10.24 程序员节',
    countdown: '距下一个 1024 还有 {n} 天',
    statTitle: '程序员节',
    demoTitle: 'Hello 1024',
    demoDesc: '程序员节限定演示：敲完代码，按下按钮。',
    gridHint: '点击翻转 bit，按住拖动可以连续涂抹',
    placeholder: '输入 help() 回车，Tab 补全',
    welcome1: '// 欢迎来到 antdv-next 的 1024 控制台',
    welcome2: '// 输入 help() 看看能做什么',
    timeLeft: '剩余',
    squashed: '抓到',
    best: '最高',
    gameOver: '⏱ 时间到！抓到 {score} 只虫子，跑掉 {escaped} 只。',
    newRecord: '🏆 新纪录！',
    bestRecord: '最高纪录：{best} 只',
    prodBugs: '线上剩余 bug：0 只（目前已知）',
    back: '返回',
    skip: '跳过',
  },
  en: {
    title: 'Happy 1024, Programmers',
    subtitle: '2¹⁰ — for the human behind every line of code',
    today: 'Today · Oct 24 · Programmer\'s Day',
    countdown: '{n} days until the next 1024',
    statTitle: 'Programmer\'s Day',
    demoTitle: 'Hello 1024',
    demoDesc: 'A Programmer\'s Day demo: type the code, press the button.',
    gridHint: 'Click to flip a bit, or press and drag to paint',
    placeholder: 'Type help() and press Enter, Tab to complete',
    welcome1: '// Welcome to the antdv-next 1024 console',
    welcome2: '// Type help() to see what you can do',
    timeLeft: 'Time',
    squashed: 'Squashed',
    best: 'Best',
    gameOver: '⏱ Time\'s up! You squashed {score} bugs, {escaped} got away.',
    newRecord: '🏆 New record!',
    bestRecord: 'Best: {best} bugs',
    prodBugs: 'Bugs left in production: 0 (that we know of)',
    back: 'Back',
    skip: 'Skip',
  },
}

const { t } = useComponentLocale(locales)
const lang = computed(() => (localeStore.value.startsWith('zh') ? 'cn' : 'en'))
const router = useRouter()

const darkTheme = { algorithm: theme.darkAlgorithm }

const BEST_STORAGE_KEY = '1024-bug-best'
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
const QUICK_COMMANDS = ['help()', 'fortune()', 'ls()', 'play()', 'coffee()']

const reducedMotion = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const slotRef = useTemplateRef<HTMLDivElement>('slot')
const previewRef = useTemplateRef<HTMLDivElement>('preview')
const logRef = useTemplateRef<HTMLDivElement>('log')
const inputRef = useTemplateRef<HTMLInputElement>('input')

const scene = shallowRef<BitScene | null>(null)
let game: BugGame | null = null

/** card：演示卡片敲代码；grid：矩阵开场；main：常驻 */
const phase = ref<'card' | 'grid' | 'main'>('card')
const shaking = ref(false)

const daysLeft = daysUntilFestival(CODER_DAY)
const badgeText = computed(() => {
  if (daysLeft === 0)
    return t('today')
  if (daysLeft != null)
    return t('countdown').replace('{n}', String(daysLeft))
  return ''
})

// ---------------- 演示卡片：代码逐字敲出，预览区跟着渲染 ----------------

const codeLines = computed(() => [
  '<template>',
  '  <a-tag color="green">2¹⁰</a-tag>',
  `  <a-statistic title="${t('statTitle')}" :value="1024" />`,
  '  <a-button type="primary">Hello, 1024</a-button>',
  '</template>',
])
const typed = ref(0)
const statValue = ref(0)
const pressed = ref(false)
const timers: number[] = []
let statRaf = 0

const lineStarts = computed(() => {
  const starts: number[] = []
  let offset = 0
  for (const line of codeLines.value) {
    starts.push(offset)
    offset += line.length + 1
  }
  return starts
})
const totalChars = computed(() => codeLines.value.reduce((n, line) => n + line.length + 1, 0))

/** 已经完整敲完的行数 */
const doneLines = computed(() => codeLines.value.filter((line, i) => typed.value >= lineStarts.value[i]! + line.length).length)

const visibleLines = computed(() => codeLines.value.map((line, i) => line.slice(0, Math.max(0, typed.value - lineStarts.value[i]!))))
const caretLine = computed(() => Math.min(doneLines.value, codeLines.value.length - 1))

interface Token { text: string, cls: string }

/** 极简的模板高亮，只需要认出这段固定代码里的标签、属性和字符串 */
function highlight(line: string): Token[] {
  const tokens: Token[] = []
  const re = /(<\/?[\w-]+)|(\s[:@]?[\w-]+(?==))|("[^"]*"?)|(\/?>)/g
  let last = 0
  for (const m of line.matchAll(re)) {
    if (m.index! > last)
      tokens.push({ text: line.slice(last, m.index), cls: '' })
    const cls = m[1] ? 'tok-tag' : m[2] ? 'tok-attr' : m[3] ? 'tok-str' : 'tok-tag'
    tokens.push({ text: m[0], cls })
    last = m.index! + m[0].length
  }
  if (last < line.length)
    tokens.push({ text: line.slice(last), cls: '' })
  return tokens
}

function later(fn: () => void, delay: number) {
  timers.push(window.setTimeout(fn, delay))
}

function clearTimers() {
  timers.forEach(id => window.clearTimeout(id))
  timers.length = 0
  cancelAnimationFrame(statRaf)
}

function countUp() {
  const start = performance.now()
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / 900)
    statValue.value = Math.round(1024 * (1 - (1 - p) ** 3))
    if (p < 1)
      statRaf = requestAnimationFrame(step)
  }
  statRaf = requestAnimationFrame(step)
}

function typeNext() {
  if (typed.value >= totalChars.value) {
    later(pressButton, 380)
    return
  }
  typed.value++
  const lineIndex = lineStarts.value.findIndex((s, i) => typed.value === s + codeLines.value[i]!.length)
  if (lineIndex === 2)
    countUp()
  // 敲完一个组件那一行，停一下让预览区渲染出来
  const pause = lineIndex >= 1 && lineIndex <= 3 ? 280 : 0
  later(typeNext, 15 + pause + Math.random() * 18)
}

function pressButton() {
  pressed.value = true
  previewRef.value?.querySelector<HTMLButtonElement>('.ant-btn')?.click()
  later(startGrid, 420)
}

function startGrid() {
  const el = previewRef.value
  if (!scene.value || !el) {
    enterMain()
    return
  }
  const r = el.getBoundingClientRect()
  phase.value = 'grid'
  scene.value.intro({ x: r.left, y: r.top, width: r.width, height: r.height }, () => {
    phase.value = 'main'
    printWelcome()
  })
}

function enterMain() {
  clearTimers()
  phase.value = 'main'
  scene.value?.skipIntro()
  printWelcome()
}

function skip() {
  if (phase.value === 'card') {
    enterMain()
    return
  }
  // grid 阶段：skipIntro 会触发 intro 的 onDone
  scene.value?.skipIntro()
}

// ---------------- 控制台 ----------------

const lines = ref<ConsoleLine[]>([])
const inputText = ref('')
const history: string[] = []
let historyIndex = -1
let welcomed = false

const componentLinks = (() => {
  const leaves: AntdvMenuItem[] = []
  const walk = (items: AntdvMenuItem[]) => items.forEach((item) => {
    if (item.children)
      walk(item.children)
    else if (typeof item.key === 'string' && item.key !== '/components/overview' && item.key !== '/components/changelog')
      leaves.push(item)
  })
  walk(componentMenu)
  return leaves.map(item => ({
    label: componentLocales[item.key as string]?.['en-US'] ?? String(item.key).replace('/components/', ''),
    to: item.key as string,
  }))
})()

function print(...next: ConsoleLine[]) {
  lines.value.push(...next)
  // 只留最近 200 行，避免一直刷 fortune() 把 DOM 撑大
  if (lines.value.length > 200)
    lines.value.splice(0, lines.value.length - 200)
  nextTick(() => {
    if (logRef.value)
      logRef.value.scrollTop = logRef.value.scrollHeight
  })
}

function printWelcome() {
  if (welcomed)
    return
  welcomed = true
  print({ kind: 'log', text: t('welcome1'), tone: 'muted' }, { kind: 'log', text: t('welcome2'), tone: 'muted' })
}

function applyEffect(effect: CommandEffect | undefined) {
  switch (effect) {
    case 'clear':
      lines.value = []
      break
    case 'play':
      game?.start()
      break
    case 'glitch':
      scene.value?.glitch()
      shaking.value = true
      window.setTimeout(() => (shaking.value = false), 650)
      break
    case 'celebrate':
      scene.value?.celebrate()
      break
    case 'exit':
      later(() => router.push('/'), 500)
      break
  }
}

function execute(text: string) {
  const value = text.trim()
  if (!value)
    return
  history.push(value)
  historyIndex = history.length
  print({ kind: 'input', text: value })
  const result = runCommand(value, { lang: lang.value, components: componentLinks, gameRunning: !!game?.running })
  if (result.effect === 'clear') {
    applyEffect('clear')
    return
  }
  print(...result.lines)
  applyEffect(result.effect)
}

function onSubmit() {
  execute(inputText.value)
  inputText.value = ''
}

function onInputKeydown(ev: KeyboardEvent) {
  if (ev.key === 'Tab') {
    ev.preventDefault()
    const { value, candidates } = complete(inputText.value)
    if (value)
      inputText.value = value
    else if (candidates.length)
      print({ kind: 'log', text: candidates.join('   '), tone: 'muted' })
  }
  else if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
    if (!history.length)
      return
    ev.preventDefault()
    historyIndex = Math.max(0, Math.min(history.length, historyIndex + (ev.key === 'ArrowUp' ? -1 : 1)))
    inputText.value = history[historyIndex] ?? ''
  }
}

function runQuick(cmd: string) {
  execute(cmd)
  inputRef.value?.focus({ preventScroll: true })
}

// ---------------- 打虫子 ----------------

const gameState = ref<BugGameState | null>(null)
const best = ref(0)

function onGameEnd(state: BugGameState) {
  const isRecord = state.score > best.value
  if (isRecord) {
    best.value = state.score
    try {
      localStorage.setItem(BEST_STORAGE_KEY, String(state.score))
    }
    catch {}
  }
  print(
    { kind: 'log', text: t('gameOver').replace('{score}', String(state.score)).replace('{escaped}', String(state.escaped)), tone: 'success' },
    { kind: 'log', text: isRecord && state.score > 0 ? t('newRecord') : t('bestRecord').replace('{best}', String(best.value)), tone: 'warn' },
    { kind: 'log', text: t('prodBugs'), tone: 'muted' },
  )
  window.setTimeout(() => (gameState.value = null), 1600)
}

/** 打虫子时点击交给游戏，不翻 bit；也不支持拖动连抓，免得一划全清 */
function interceptPress(i: number) {
  if (!game?.running)
    return false
  game.hit(i)
  return true
}

// ---------------- Konami ----------------

let konamiPos = 0

function onWindowKeydown(ev: KeyboardEvent) {
  const el = ev.target as HTMLElement | null
  if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable))
    return
  const key = ev.key.toLowerCase()
  konamiPos = key === KONAMI[konamiPos] ? konamiPos + 1 : key === KONAMI[0] ? 1 : 0
  if (konamiPos === KONAMI.length) {
    konamiPos = 0
    execute('konami()')
  }
}

onMounted(() => {
  try {
    best.value = Number(localStorage.getItem(BEST_STORAGE_KEY)) || 0
  }
  catch {}

  const shape1024 = textShape(TEXT_1024)
  const shapeCode = textShape(TEXT_CODE)
  if (canvasRef.value && slotRef.value) {
    const created = createBitScene(canvasRef.value, {
      slot: slotRef.value,
      shapes: [shape1024, shapeCode],
      reducedMotion,
      interceptPress,
    })
    scene.value = created
    game = createBugGame({
      scene: created,
      onUpdate: s => (gameState.value = s),
      onEnd: onGameEnd,
    })
    // logo 栅格化是异步的，加载好了再插进轮换；开场一般还没播到这里
    void loadImageShape(logoUrl).then((logo: Shape | null) => {
      if (logo && scene.value === created)
        created.setShapes([shape1024, logo, shapeCode])
    })
  }

  window.addEventListener('keydown', onWindowKeydown)

  if (reducedMotion) {
    typed.value = totalChars.value
    statValue.value = 1024
    enterMain()
  }
  else {
    later(typeNext, 500)
  }
})

onBeforeUnmount(() => {
  clearTimers()
  window.removeEventListener('keydown', onWindowKeydown)
  game?.stop()
  game = null
  scene.value?.destroy()
  scene.value = null
})
</script>

<template>
  <a-config-provider :theme="darkTheme">
    <div class="coder-page" :class="{ 'is-shaking': shaking }">
      <canvas ref="canvas" class="coder-canvas" />

      <div class="coder-topbar">
        <router-link to="/" class="coder-topbar-link">
          <a-button ghost class="coder-ghost-btn">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
            {{ t('back') }}
          </a-button>
        </router-link>
        <a-button v-if="phase !== 'main'" ghost class="coder-ghost-btn" @click="skip">
          {{ t('skip') }}
        </a-button>
      </div>

      <!-- 开场：和组件文档里一样的代码演示卡片 -->
      <transition name="coder-card">
        <div v-if="phase === 'card'" class="coder-demo">
          <div ref="preview" class="coder-demo-preview">
            <transition-group name="coder-pop">
              <a-tag v-if="doneLines >= 2" key="tag" color="green" class="coder-demo-tag">
                2¹⁰
              </a-tag>
              <a-statistic v-if="doneLines >= 3" key="stat" :title="t('statTitle')" :value="statValue" />
              <a-button
                v-if="doneLines >= 4"
                key="btn"
                type="primary"
                class="coder-demo-btn"
                :class="{ 'is-pressed': pressed }"
              >
                Hello, 1024
              </a-button>
            </transition-group>
          </div>
          <div class="coder-demo-meta">
            <div class="coder-demo-title">
              {{ t('demoTitle') }}
            </div>
            <p class="coder-demo-desc">
              {{ t('demoDesc') }}
            </p>
            <div class="coder-demo-actions" aria-hidden="true">
              <ThunderboltOutlined />
              <CopyOutlined />
              <CodeOutlined class="is-active" />
            </div>
          </div>
          <pre class="coder-demo-code"><code><span
            v-for="(line, i) in visibleLines"
            :key="i"
            class="coder-code-line"
          ><span
            v-for="(tok, j) in highlight(line)"
            :key="j"
            :class="tok.cls"
          >{{ tok.text }}</span><span v-if="i === caretLine" class="coder-caret" />{{ '\n' }}</span></code></pre>
        </div>
      </transition>

      <!-- 常驻：矩阵 + 标题 + 控制台；开场期间就占好位置，矩阵从卡片飞过来 -->
      <div class="coder-main" :class="{ 'is-ready': phase === 'main' }">
        <div class="coder-grid-col">
          <div ref="slot" class="coder-grid-slot" :class="{ 'is-playing': !!gameState }">
            <div v-if="gameState" class="coder-hud">
              <span>⏱ {{ t('timeLeft') }} {{ Math.ceil(gameState.timeLeft / 1000) }}s</span>
              <span>🐛 {{ t('squashed') }} {{ gameState.score }}</span>
              <span>🏆 {{ t('best') }} {{ Math.max(best, gameState.score) }}</span>
            </div>
          </div>
          <p class="coder-grid-hint">
            {{ t('gridHint') }}
          </p>
        </div>

        <div class="coder-side">
          <div v-if="badgeText" class="coder-badge">
            <span class="coder-badge-dot" />{{ badgeText }}
          </div>
          <h1 class="coder-title">
            {{ t('title') }}
          </h1>
          <p class="coder-subtitle">
            {{ t('subtitle') }}
          </p>

          <div class="coder-console" @click="inputRef?.focus({ preventScroll: true })">
            <div class="coder-console-tabs" aria-hidden="true">
              <span>Elements</span>
              <span class="is-active">Console</span>
              <span>Sources</span>
              <span>Network</span>
            </div>
            <div class="coder-console-toolbar" aria-hidden="true">
              <StopOutlined />
              <span class="coder-console-context">top ▾</span>
              <span class="coder-console-filter">Filter</span>
            </div>
            <div ref="log" class="coder-console-log" role="log" aria-live="polite">
              <div
                v-for="(line, i) in lines"
                :key="i"
                class="coder-line"
                :class="[`is-${line.kind}`, line.kind === 'log' && line.tone ? `tone-${line.tone}` : '']"
              >
                <template v-if="line.kind === 'input'">
                  <span class="coder-line-prompt">›</span>{{ line.text }}
                </template>
                <template v-else-if="line.kind === 'error'">
                  <span class="coder-line-icon">✕</span>{{ line.text }}
                </template>
                <template v-else-if="line.kind === 'pre'">
                  <pre>{{ line.text }}</pre>
                </template>
                <template v-else-if="line.kind === 'links'">
                  <div class="coder-links">
                    <router-link v-for="item in line.items" :key="item.to" :to="item.to">
                      {{ item.label }}
                    </router-link>
                  </div>
                </template>
                <template v-else>
                  {{ line.text }}
                </template>
              </div>
            </div>
            <form class="coder-console-input" @submit.prevent="onSubmit">
              <span class="coder-line-prompt">›</span>
              <input
                ref="input"
                v-model="inputText"
                :placeholder="t('placeholder')"
                spellcheck="false"
                autocomplete="off"
                autocapitalize="off"
                aria-label="console"
                @keydown="onInputKeydown"
              >
            </form>
          </div>

          <div class="coder-quick">
            <button v-for="cmd in QUICK_COMMANDS" :key="cmd" type="button" class="coder-chip" @click="runQuick(cmd)">
              {{ cmd }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </a-config-provider>
</template>

<style scoped lang="less">
@mono: 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace;

.coder-page {
  position: fixed;
  inset: 0;
  z-index: 1100;
  overflow-x: hidden;
  overflow-y: auto;
  color: #e8eaed;
  background:
    radial-gradient(ellipse at 20% 0%, rgba(66, 184, 131, 0.14), transparent 55%),
    radial-gradient(ellipse at 90% 100%, rgba(22, 119, 255, 0.16), transparent 55%),
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px) 0 0 / 32px 32px,
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px) 0 0 / 32px 32px,
    #090c12;

  // CRT 扫描线
  &::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.16) 0 1px, transparent 1px 3px);
  }

  &.is-shaking {
    animation: coder-shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97);
  }
}

.coder-canvas {
  position: fixed;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.coder-topbar {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 4;
  display: flex;
  justify-content: space-between;
  pointer-events: none;

  .coder-topbar-link {
    text-decoration: none;
  }

  .coder-ghost-btn {
    pointer-events: auto;
    color: rgba(232, 234, 237, 0.85);
    border-color: rgba(232, 234, 237, 0.3);
    backdrop-filter: blur(4px);

    &:hover {
      color: #fff;
      border-color: rgba(255, 255, 255, 0.6);
    }
  }
}

// ---------------- 演示卡片 ----------------

.coder-demo {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 2;
  width: min(calc(100vw - 32px), 560px);
  transform: translate(-50%, -50%);
  background: #141414;
  border: 1px solid #303030;
  border-radius: 8px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
}

.coder-demo-preview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px 28px;
  min-height: 180px;
  padding: 32px 24px;
}

.coder-demo-tag {
  margin: 0;
  font-family: @mono;
}

.coder-demo-btn.is-pressed {
  transform: scale(0.94);
  transition: transform 0.15s;
}

.coder-demo-meta {
  position: relative;
  padding: 18px 24px 12px;
  border-top: 1px solid #303030;
}

.coder-demo-title {
  position: absolute;
  top: -11px;
  left: 16px;
  padding: 0 8px;
  font-weight: 500;
  background: #141414;
}

.coder-demo-desc {
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
}

.coder-demo-actions {
  display: flex;
  justify-content: center;
  gap: 18px;
  padding-top: 10px;
  color: rgba(255, 255, 255, 0.45);
  border-top: 1px dashed #303030;

  .is-active {
    color: #1677ff;
  }
}

.coder-demo-code {
  margin: 0;
  padding: 16px 24px 20px;
  overflow-x: auto;
  font-family: @mono;
  font-size: 13px;
  line-height: 1.7;
  color: #d4d4d4;
  background: #0d0d0d;
  border-top: 1px dashed #303030;
  border-radius: 0 0 8px 8px;

  .tok-tag {
    color: #569cd6;
  }

  .tok-attr {
    color: #9cdcfe;
  }

  .tok-str {
    color: #ce9178;
  }
}

.coder-caret {
  display: inline-block;
  width: 7px;
  height: 1.1em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: #42b883;
  animation: coder-blink 1s steps(1) infinite;
}

.coder-card-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.6s cubic-bezier(0.5, 0, 0.75, 0);
}

.coder-card-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.12);
}

.coder-pop-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.coder-pop-enter-from {
  opacity: 0;
  transform: scale(0.6);
}

// ---------------- 常驻界面 ----------------

.coder-main {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: auto minmax(0, 520px);
  gap: 56px;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 88px 32px 40px;

  .coder-grid-hint,
  .coder-side {
    opacity: 0;
    transform: translateY(16px);
    pointer-events: none;
    transition:
      opacity 0.7s ease,
      transform 0.7s ease;
  }

  &.is-ready {
    .coder-grid-hint,
    .coder-side {
      opacity: 1;
      transform: none;
      pointer-events: auto;
    }

    .coder-side {
      transition-delay: 0.15s;
    }
  }
}

.coder-grid-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.coder-grid-slot {
  position: relative;
  width: min(44vw, calc(100vh - 200px), 560px);
  aspect-ratio: 1;
  cursor: pointer;
  // 按住拖动是在涂 bit，不能让浏览器拿去滚动页面
  touch-action: none;
  user-select: none;

  &.is-playing {
    cursor: crosshair;
  }
}

.coder-hud {
  position: absolute;
  top: -34px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 18px;
  font-family: @mono;
  font-size: 13px;
  color: #e8eaed;
  pointer-events: none;
}

.coder-grid-hint {
  margin: 14px 0 0;
  font-family: @mono;
  font-size: 12px;
  color: rgba(232, 234, 237, 0.45);
}

.coder-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 3px 12px;
  margin-bottom: 14px;
  font-family: @mono;
  font-size: 12px;
  color: #42b883;
  border: 1px solid rgba(66, 184, 131, 0.4);
  border-radius: 999px;
  background: rgba(66, 184, 131, 0.08);
}

.coder-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #42b883;
  box-shadow: 0 0 6px #42b883;
}

.coder-title {
  margin: 0;
  font-size: clamp(30px, 4vw, 46px);
  font-weight: 700;
  line-height: 1.2;
  background: linear-gradient(110deg, #42b883 10%, #36cfc9 45%, #1677ff 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.coder-subtitle {
  margin: 10px 0 22px;
  font-size: 15px;
  color: rgba(232, 234, 237, 0.7);
}

// ---------------- DevTools 风格控制台 ----------------

.coder-console {
  overflow: hidden;
  font-family: @mono;
  font-size: 12.5px;
  background: rgba(32, 33, 36, 0.92);
  border: 1px solid #3c4043;
  border-radius: 8px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  cursor: text;
}

.coder-console-tabs {
  display: flex;
  gap: 2px;
  padding: 0 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 12px;
  color: #9aa0a6;
  background: #292a2d;
  border-bottom: 1px solid #3c4043;

  span {
    padding: 7px 10px 6px;
    border-bottom: 2px solid transparent;
  }

  .is-active {
    color: #e8eaed;
    border-bottom-color: #8ab4f8;
  }
}

.coder-console-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 10px;
  color: #9aa0a6;
  border-bottom: 1px solid #3c4043;
}

.coder-console-context {
  font-size: 11.5px;
}

.coder-console-filter {
  flex: 1;
  padding: 1px 8px;
  font-size: 11.5px;
  color: #5f6368;
  background: #202124;
  border: 1px solid #3c4043;
  border-radius: 3px;
}

.coder-console-log {
  height: 248px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.coder-line {
  padding: 3px 10px 3px 26px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  color: #e8eaed;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  pre {
    margin: 0;
    font: inherit;
    white-space: pre;
    overflow-x: auto;
  }

  &.tone-muted {
    color: #9aa0a6;
  }

  &.tone-success {
    color: #81c995;
  }

  &.tone-warn {
    color: #fdd663;
    background: rgba(253, 214, 99, 0.06);
  }

  &.is-error {
    color: #f28b82;
    background: rgba(242, 139, 130, 0.08);
    border-bottom-color: rgba(242, 139, 130, 0.18);
  }
}

.coder-line-prompt,
.coder-line-icon {
  display: inline-block;
  width: 16px;
  margin-left: -16px;
  color: #8ab4f8;
}

.coder-line-icon {
  color: #f28b82;
}

.coder-links {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 12px;

  a {
    color: #8ab4f8;

    &:hover {
      text-decoration: underline;
    }
  }
}

.coder-console-input {
  display: flex;
  align-items: center;
  padding: 6px 10px 8px 26px;

  input {
    flex: 1;
    min-width: 0;
    padding: 0;
    font: inherit;
    color: #e8eaed;
    background: transparent;
    border: 0;
    outline: none;
    caret-color: #8ab4f8;

    &::placeholder {
      color: #5f6368;
    }
  }
}

.coder-quick {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.coder-chip {
  padding: 3px 10px;
  font-family: @mono;
  font-size: 12px;
  color: rgba(232, 234, 237, 0.8);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 4px;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s;

  &:hover {
    color: #42b883;
    border-color: rgba(66, 184, 131, 0.6);
  }
}

@media (max-width: 900px) {
  .coder-main {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
    justify-items: center;
    align-content: start;
    padding: 76px 16px 32px;
  }

  .coder-grid-slot {
    width: min(calc(100vw - 32px), 440px);
  }

  .coder-side {
    width: 100%;
    max-width: 520px;
    text-align: center;
  }

  .coder-quick {
    justify-content: center;
  }

  .coder-console {
    text-align: left;
  }

  .coder-console-log {
    height: 200px;
  }
}

@keyframes coder-blink {
  50% {
    opacity: 0;
  }
}

@keyframes coder-shake {
  10%,
  90% {
    transform: translateX(-2px);
  }
  20%,
  80% {
    transform: translateX(4px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-8px);
  }
  40%,
  60% {
    transform: translateX(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .coder-page.is-shaking {
    animation: none;
  }

  .coder-caret {
    animation: none;
  }
}
</style>
