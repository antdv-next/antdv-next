/**
 * 打虫子：30 秒内，点掉矩阵里冒出来的 🐛。
 * 玩法逻辑放在这里，画面交给 BitScene（addBug / removeBug）。
 */
import type { BitScene } from './scene'
import { CELLS, GRID } from './bitmaps'

export interface BugGameState {
  score: number
  escaped: number
  timeLeft: number
}

export interface BugGameOptions {
  scene: BitScene
  duration?: number
  onUpdate?: (state: BugGameState) => void
  onEnd?: (state: BugGameState) => void
}

export interface BugGame {
  start: () => void
  /** 点中了虫子返回 true */
  hit: (index: number) => boolean
  stop: () => void
  readonly running: boolean
}

const TICK = 100
const MAX_BUGS = 6

export function createBugGame(options: BugGameOptions): BugGame {
  const { scene, duration = 30000 } = options
  /** 虫子所在格子 → 逃跑时刻 */
  const bugs = new Map<number, number>()
  let running = false
  let startedAt = 0
  let nextSpawnAt = 0
  let tickId: number | undefined
  const state: BugGameState = { score: 0, escaped: 0, timeLeft: duration }

  function emit() {
    options.onUpdate?.({ ...state })
  }

  function spawn(now: number) {
    // 越往后虫子越多、跑得越快
    const progress = Math.min(1, (now - startedAt) / duration)
    const count = Math.random() < 0.15 + progress * 0.35 ? 2 : 1
    for (let k = 0; k < count && bugs.size < MAX_BUGS; k++) {
      let i = Math.floor(Math.random() * CELLS)
      while (bugs.has(i))
        i = Math.floor(Math.random() * CELLS)
      bugs.set(i, now + 2400 - progress * 1000)
      scene.addBug(i)
    }
    nextSpawnAt = now + 950 - progress * 450
  }

  function tick() {
    const now = performance.now()
    state.timeLeft = Math.max(0, duration - (now - startedAt))
    bugs.forEach((deadline, i) => {
      if (now >= deadline) {
        bugs.delete(i)
        scene.removeBug(i, false)
        state.escaped++
      }
    })
    if (state.timeLeft <= 0) {
      finish()
      return
    }
    if (now >= nextSpawnAt)
      spawn(now)
    emit()
  }

  function finish() {
    if (!running)
      return
    running = false
    window.clearInterval(tickId)
    bugs.clear()
    scene.clearBugs()
    scene.setDim(false)
    state.timeLeft = 0
    emit()
    options.onEnd?.({ ...state })
  }

  return {
    start() {
      if (running)
        return
      running = true
      state.score = 0
      state.escaped = 0
      state.timeLeft = duration
      startedAt = performance.now()
      nextSpawnAt = startedAt + 400
      scene.setDim(true)
      tickId = window.setInterval(tick, TICK)
      emit()
    },
    hit(index) {
      if (!running)
        return false
      // 格子很小（手机上更小），点到虫子旁边一格也算中
      const row = Math.floor(index / GRID)
      const col = index % GRID
      let i = -1
      for (let dr = -1; dr <= 1 && i < 0; dr++) {
        for (let dc = -1; dc <= 1 && i < 0; dc++) {
          const r = row + dr
          const c = col + dc
          if (r >= 0 && r < GRID && c >= 0 && c < GRID && bugs.has(r * GRID + c))
            i = r * GRID + c
        }
      }
      if (bugs.has(index))
        i = index
      if (i < 0)
        return false
      bugs.delete(i)
      scene.removeBug(i, true)
      state.score++
      emit()
      return true
    },
    stop() {
      if (!running)
        return
      running = false
      window.clearInterval(tickId)
      bugs.clear()
      scene.clearBugs()
      scene.setDim(false)
    },
    get running() {
      return running
    },
  }
}
