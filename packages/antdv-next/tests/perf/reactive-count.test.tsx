/**
 * Per-instance reactive-object budget.
 *
 * Counts how many `computed` / `watch` / `watchEffect` calls and how many
 * component instances a single component instance costs at mount time, and
 * compares the numbers against `reactive-baseline.json`.
 *
 * - A number going DOWN is an improvement: update the baseline.
 * - A number going UP fails the test. If the increase is intentional
 *   (new feature that really needs more reactive state), update the baseline
 *   in the same PR so the change is reviewed on purpose.
 *
 * Update the baseline with:
 *   UPDATE_PERF_BASELINE=1 pnpm -F antdv-next test tests/perf
 *
 * Counts are measured as `(N instances - 1 instance) / (N - 1)` so that the
 * one-time cost of the root component and providers is excluded.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, reactive } from 'vue'

const counters = vi.hoisted(() => ({
  computed: 0,
  watch: 0,
  instances: 0,
}))

vi.mock('vue', async (importOriginal) => {
  const vue = await importOriginal<typeof import('vue')>()
  const wrap = <T extends (...args: any[]) => any>(fn: T, key: 'computed' | 'watch'): T => {
    return ((...args: any[]) => {
      counters[key] += 1
      return fn(...args)
    }) as T
  }
  return {
    ...vue,
    computed: wrap(vue.computed, 'computed'),
    watch: wrap(vue.watch, 'watch'),
    watchEffect: wrap(vue.watchEffect, 'watch'),
    watchPostEffect: wrap(vue.watchPostEffect, 'watch'),
    watchSyncEffect: wrap(vue.watchSyncEffect, 'watch'),
  }
})

// Imported after the mock so every module in the graph sees the wrapped `vue`.
const {
  Button,
  DatePicker,
  Form,
  FormItem,
  Input,
  Menu,
  Select,
  Table,
} = await import('../../src')

interface Metrics {
  computed: number
  watch: number
  instances: number
}

type Scenario = (n: number) => () => any

const columns = Array.from({ length: 6 }, (_, i) => ({
  title: `Col ${i}`,
  dataIndex: `c${i}`,
  key: `c${i}`,
}))

const scenarios: Record<string, Scenario> = {
  'button': n => () => Array.from({ length: n }, (_, i) => h(Button, { key: i }, () => 'Button')),
  'input': n => () => Array.from({ length: n }, (_, i) => h(Input, { key: i, value: 'text' })),
  'select': n => () => Array.from({ length: n }, (_, i) => h(Select, {
    key: i,
    value: 'a',
    options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }],
  })),
  'date-picker': n => () => Array.from({ length: n }, (_, i) => h(DatePicker, { key: i })),
  'menu-item': n => () => h(Menu, {
    mode: 'inline',
    items: Array.from({ length: n }, (_, i) => ({ key: `item-${i}`, label: `Item ${i}` })),
  }),
  'form-item-input': (n) => {
    const model = reactive<Record<string, string>>({})
    for (let i = 0; i < n; i += 1) {
      model[`field${i}`] = ''
    }
    return () => h(Form, { model }, () => Array.from({ length: n }, (_, i) => h(
      FormItem,
      { key: i, name: `field${i}`, label: `Field ${i}` },
      () => h(Input, { value: model[`field${i}`] }),
    )))
  },
  'table-row': n => () => h(Table, {
    columns,
    pagination: false,
    dataSource: Array.from({ length: n }, (_, r) => {
      const row: Record<string, any> = { key: r }
      columns.forEach((col, c) => {
        row[col.dataIndex] = `r${r}c${c}`
      })
      return row
    }),
  }),
}

async function measure(render: () => any): Promise<Metrics> {
  const el = document.createElement('div')
  document.body.appendChild(el)

  counters.computed = 0
  counters.watch = 0
  counters.instances = 0

  const app = createApp(defineComponent({ render }))
  app.mixin({
    beforeCreate() {
      counters.instances += 1
    },
  })
  app.mount(el)
  await nextTick()

  const result = { ...counters }

  app.unmount()
  el.remove()
  return result
}

async function measurePerInstance(scenario: Scenario, n = 11): Promise<Metrics> {
  const single = await measure(scenario(1))
  const many = await measure(scenario(n))
  const per = (key: keyof Metrics) => Number(((many[key] - single[key]) / (n - 1)).toFixed(1))
  return {
    computed: per('computed'),
    watch: per('watch'),
    instances: per('instances'),
  }
}

const baselinePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'reactive-baseline.json')
const baseline: Record<string, Metrics> = fs.existsSync(baselinePath)
  ? JSON.parse(fs.readFileSync(baselinePath, 'utf-8'))
  : {}
const shouldUpdate = !!process.env.UPDATE_PERF_BASELINE

describe('per-instance reactive object budget', () => {
  const measured: Record<string, Metrics> = {}

  for (const [name, scenario] of Object.entries(scenarios)) {
    it(name, async () => {
      const metrics = await measurePerInstance(scenario)
      measured[name] = metrics

      const expected = baseline[name]
      if (shouldUpdate || !expected) {
        return
      }

      for (const key of Object.keys(metrics) as (keyof Metrics)[]) {
        expect(
          metrics[key],
          `${name}.${key} grew from ${expected[key]} to ${metrics[key]}; update reactive-baseline.json if intended`,
        ).toBeLessThanOrEqual(expected[key])
      }
    })
  }

  it('report', () => {
    const rows = Object.entries(measured).map(([name, m]) => {
      const b = baseline[name]
      const fmt = (key: keyof Metrics) => b ? `${m[key]} (base ${b[key]})` : `${m[key]}`
      return `| ${name} | ${fmt('computed')} | ${fmt('watch')} | ${fmt('instances')} |`
    })
    process.stdout.write([
      '',
      '| scenario | computed / instance | watch / instance | components / instance |',
      '|---|---:|---:|---:|',
      ...rows,
      '',
      '',
    ].join('\n'))

    if (shouldUpdate) {
      fs.writeFileSync(baselinePath, `${JSON.stringify(measured, null, 2)}\n`)
      process.stdout.write(`[perf] baseline written to ${baselinePath}\n`)
    }
  })
})
