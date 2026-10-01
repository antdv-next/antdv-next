/**
 * Browser-side half of `pnpm bench` (see scripts/bench.ts).
 *
 * Open /bench.html?scene=<name>&n=<count> and the page exposes `window.__bench`
 * with `run()` / `unmount()` that the CDP runner drives. It can also be opened
 * by hand from `pnpm dev:play` for a quick look at a scenario.
 */
import type { App } from 'vue'
import { createApp, nextTick } from 'vue'

interface RunResult {
  scene: string
  n: number
  /** First mount on this page: includes CSS-in-JS generation and style injection. */
  cold: number
  /** Re-mounts after unmount: styles are already cached. */
  hot: number[]
  domNodes: number
  styleTags: number
  cssBytes: number
  /** Time of the scene's interaction (see `Scenario.update`), when it has one. */
  updateMs?: number
}

declare global {
  interface Window {
    __bench: {
      ready: boolean
      scene: string
      n: number
      run: (hotRuns?: number) => Promise<RunResult>
      unmount: () => void
    }
  }
}

// Dev builds of Vue buffer devtools events (with component instances attached)
// for 3 seconds when no devtools hook is present. That keeps every unmounted
// instance alive and would make the "retained after unmount" numbers
// meaningless, so install a no-op hook before the renderer is created.
// Production builds strip this code path entirely.
if (!(window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__ = {
    emit() {},
    on() {},
    once() {},
    off() {},
    appRecords: [],
  }
}

const params = new URLSearchParams(location.search)
const scene = params.get('scene') || 'button'
// Loaded on demand so another scenario module (e.g. an adapter for a second
// component library) can be swapped in for side-by-side comparisons.
async function setupBench() {
  const { scenarios } = await import('./scenarios')
  const scenario = scenarios[scene]
  if (!scenario) {
    throw new Error(`Unknown bench scene "${scene}". Known: ${Object.keys(scenarios).join(', ')}`)
  }
  const n = Number(params.get('n')) || scenario.defaultN

  const root = document.getElementById('root')!
  let app: App | null = null

  function forceLayout() {
    // Force style recalculation + layout so the measurement includes what the
    // browser has to do before the frame can be painted.
    void root.offsetHeight
    void getComputedStyle(root).color
  }

  async function mountOnce() {
    app = createApp(scenario.component(n))
    const start = performance.now()
    app.mount(root)
    await nextTick()
    forceLayout()
    return performance.now() - start
  }

  function unmount() {
    app?.unmount()
    app = null
  }

  function injectedCss() {
    const tags = Array.from(document.querySelectorAll('style[data-css-hash]'))
    return {
      styleTags: tags.length,
      cssBytes: tags.reduce((sum, tag) => sum + (tag.textContent?.length ?? 0), 0),
    }
  }

  window.__bench = {
    ready: true,
    scene,
    n,
    async run(hotRuns = 5) {
      const cold = await mountOnce()
      unmount()

      const hot: number[] = []
      for (let i = 0; i < hotRuns; i += 1) {
        hot.push(await mountOnce())
        if (i < hotRuns - 1) {
          unmount()
        }
      }

      let updateMs: number | undefined
      if (scenario.update) {
        const start = performance.now()
        await scenario.update()
        await nextTick()
        forceLayout()
        updateMs = performance.now() - start
      }

      // Leave the last run mounted so the runner can measure the mounted heap.
      return {
        scene,
        n,
        cold,
        hot,
        updateMs,
        domNodes: root.querySelectorAll('*').length,
        ...injectedCss(),
      }
    },
    unmount,
  }
}

setupBench()
