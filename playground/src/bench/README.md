# Performance baseline

Two complementary measurements guard antdv-next performance work.

## 1. Reactive-object budget (CI, deterministic)

`packages/antdv-next/tests/perf/reactive-count.test.tsx` mounts each scenario
in jsdom, counts how many `computed` / `watch` calls and component instances one
instance costs, and fails when any number exceeds
`packages/antdv-next/tests/perf/reactive-baseline.json`.

```bash
pnpm -F antdv-next test tests/perf
# after an intentional change (improvement or justified increase):
UPDATE_PERF_BASELINE=1 pnpm -F antdv-next test tests/perf
```

Reference (2026-10-01, after phase 1 of the perf plan plus @v-c/util 1.3.2-rc.0,
@v-c/picker 1.5.2-rc.0, @v-c/select 1.2.8-rc.0, @v-c/table 1.3.4-rc.1,
@v-c/trigger 1.1.6-rc.1, @v-c/menu 1.4.2-rc.0 and @v-c/tooltip 1.1.4-rc.0):

| scenario | computed / instance | watch / instance | components / instance |
|---|---:|---:|---:|
| button | 51.4 | 10 | 4 |
| input | 65 | 11 | 3 |
| select | 140 | 24 | 15 |
| date-picker | 111 | 30 | 13 |
| menu-item | 70 | 20 | 14 |
| form-item-input | 178 | 43 | 17 |
| table-row | 9 | 1 | 7 |

History (computed / watch per instance):

| scenario | `main` 366836ad | + shared useToken | + rest of phase 1 | + picker/select rc | + table/trigger rc.0 | + trigger lazy, menu, tooltip rc |
|---|---:|---:|---:|---:|---:|---:|
| button | 218.9 / 21 | 97.6 / 12 | 51.4 / 10 | 51.4 / 10 | 51.4 / 10 | 51.4 / 10 |
| input | 263 / 25 | 113 / 14 | 65 / 11 | 65 / 11 | 65 / 11 | 65 / 11 |
| select | 329 / 44 | 189 / 36 | 160 / 34 | 160 / 34 | 141 / 32 | 140 / 24 |
| date-picker | 367 / 49 | 253 / 42 | 222 / 40 | 131 / 40 | 112 / 38 | 111 / 30 |
| menu-item | 262 / 40 | 122 / 32 | 90 / 30 | 90 / 30 | 71 / 28 | 70 / 20 |
| form-item-input | 901 / 95 | 331 / 53 | 178 / 43 | 178 / 43 | 178 / 43 | 178 / 43 |
| table-row | 47 / 1 | 47 / 1 | 47 / 1 | 47 / 1 | 9 / 1 | 9 / 1 |

## 2. Browser timings and memory (local, real Chrome)

`pnpm bench` builds `playground/bench.html`, drives headless Chrome through the
DevTools protocol and reports mount time, mounted heap and the heap still
retained 300ms / 1.5s after unmount. Scenes live in `scenarios.ts`; the page
can also be opened by hand via `pnpm dev:play` at `/bench.html?scene=menu&n=200`.

```bash
pnpm bench --build                     # production build, all scenes
pnpm bench --build --scenes button,menu --cpu 4
pnpm bench --build --out bench.json    # keep raw numbers
```

Absolute numbers depend on the machine. Compare runs on the same machine, and
prefer `--build`: the dev server adds Vite transform overhead to module loading
and Vue's dev build keeps extra per-instance bookkeeping.

Reference (2026-10-01, Apple M2 Pro, 32 GB, Chrome 154, production build,
3 pages x 5 hot runs).

Current: everything below plus @v-c/table 1.3.4-rc.1 (row-level hover memo,
getter refs, scrollbar measured only with `scroll.y` / `sticky`, stable
slot-children columns), @v-c/trigger 1.1.6-rc.1 (getter refs, no mirror
watchers, alignment / tracking effects created on first open), @v-c/menu
1.4.2-rc.0 and @v-c/tooltip 1.1.4-rc.0 (forward only defined props), and the
antdv-next InternalTable handing @v-c/table referentially stable columns,
transforms and expandable config (rows and cells render once per mount):

| scene | n | cold ms | hot ms | heap MB | retained@300ms MB | retained@1.5s MB | DOM nodes | style tags | CSS KB |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| button | 1000 | 166.7 | 116.3 | 48.3 | 2.4 | 2.4 | 2000 | 6 | 38 |
| input | 500 | 111.0 | 64.8 | 27.1 | 1.8 | 1.7 | 500 | 7 | 47 |
| select | 500 | 267.7 | 199.9 | 76.5 | 4.1 | 4.0 | 3500 | 13 | 50 |
| date-picker | 200 | 215.9 | 155.6 | 46.7 | 3.2 | 3.2 | 1400 | 13 | 68 |
| tooltip | 300 | 121.4 | 73.2 | 33.0 | 2.4 | 2.4 | 601 | 12 | 49 |
| menu | 500 | 205.4 | 142.6 | 47.3 | 3.9 | 3.8 | 1052 | 15 | 78 |
| form | 100 | 109.0 | 57.0 | 20.6 | 2.4 | 2.3 | 901 | 13 | 127 |
| table | 1000 | 224.5 | 159.7 | 57.3 | 2.6 | 2.5 | 7016 | 9 | 65 |
| admin | 1 | 133.9 | 38.1 | 13.3 | 4.7 | 4.3 | 407 | 44 | 376 |

The `tooltip` scene (300 closed tooltips, placement top, click trigger) was
added with this step.

Previous step, @v-c/table 1.3.4-rc.0 and @v-c/trigger 1.1.6-rc.0:

| scene | n | cold ms | hot ms | heap MB | retained@300ms MB | retained@1.5s MB | DOM nodes | style tags | CSS KB |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| button | 1000 | 168.9 | 115.7 | 48.3 | 2.4 | 2.4 | 2000 | 6 | 38 |
| input | 500 | 114.5 | 64.9 | 27.1 | 1.8 | 1.7 | 500 | 7 | 47 |
| select | 500 | 290.4 | 230.1 | 80.0 | 3.9 | 3.7 | 3500 | 13 | 50 |
| date-picker | 200 | 230.2 | 162.7 | 48.2 | 3.3 | 3.2 | 1400 | 13 | 68 |
| menu | 500 | 257.9 | 175.2 | 53.3 | 4.1 | 4.0 | 1052 | 15 | 78 |
| form | 100 | 110.7 | 57.7 | 20.6 | 2.4 | 2.3 | 901 | 13 | 127 |
| table | 1000 | 451.2 | 173.6 | 57.6 | 2.8 | 2.7 | 7016 | 9 | 65 |
| admin | 1 | 144.8 | 39.6 | 14.1 | 5.0 | 4.6 | 407 | 44 | 376 |

Phase 1 plus "forward only defined props" in the DatePicker / Select
wrappers and in @v-c/picker 1.5.2-rc.0, @v-c/select 1.2.8-rc.0, @v-c/util
1.3.2-rc.0, plus lazy merged props in useMergeSemantic:

| scene | n | cold ms | hot ms | heap MB | retained@300ms MB | retained@1.5s MB | DOM nodes | style tags | CSS KB |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| button | 1000 | 167.9 | 115.4 | 48.3 | 2.4 | 2.4 | 2000 | 6 | 38 |
| input | 500 | 111.2 | 64.7 | 27.1 | 1.8 | 1.7 | 500 | 7 | 47 |
| select | 500 | 293.4 | 223.0 | 81.8 | 3.9 | 3.7 | 3500 | 13 | 50 |
| date-picker | 200 | 234.0 | 164.0 | 49.0 | 3.3 | 3.3 | 1400 | 13 | 68 |
| menu | 500 | 255.6 | 174.5 | 55.1 | 4.1 | 4.0 | 1052 | 15 | 78 |
| form | 100 | 109.2 | 56.7 | 20.6 | 2.4 | 2.3 | 901 | 13 | 127 |
| table | 1000 | 431.8 | 166.5 | 63.6 | 2.8 | 2.7 | 7016 | 9 | 65 |
| admin | 1 | 139.0 | 39.5 | 14.4 | 5.0 | 4.6 | 407 | 44 | 376 |

The `select` scene (500 closed selects) was added with this step; before the
vc changes it measured 305 ms hot / 472 ms cold on the same machine.

After the rest of phase 1 (one token lookup per component, trimmed
style-register computeds, getter refs in `useComponentBaseConfig`):

| scene | n | cold ms | hot ms | heap MB | retained@300ms MB | retained@1.5s MB | DOM nodes | style tags | CSS KB |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| button | 1000 | 187.7 | 123.6 | 49.4 | 2.4 | 2.4 | 2000 | 6 | 38 |
| input | 500 | 116.3 | 70.0 | 28.1 | 1.8 | 1.7 | 500 | 7 | 47 |
| date-picker | 200 | 423.9 | 365.2 | 53.8 | 3.4 | 3.4 | 1400 | 13 | 68 |
| menu | 500 | 270.0 | 178.8 | 55.7 | 4.1 | 4.0 | 1052 | 15 | 78 |
| form | 100 | 112.4 | 58.3 | 20.8 | 2.4 | 2.3 | 901 | 13 | 127 |
| table | 1000 | 434.3 | 171.4 | 63.6 | 2.8 | 2.7 | 7016 | 9 | 65 |
| admin | 1 | 144.0 | 43.5 | 14.6 | 5.0 | 4.6 | 407 | 44 | 376 |

After sharing `useToken()` per context only:

| scene | n | cold ms | hot ms | heap MB | retained@300ms MB | retained@1.5s MB | DOM nodes | style tags | CSS KB |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| button | 1000 | 195.4 | 135.4 | 56.4 | 2.4 | 2.4 | 2000 | 6 | 38 |
| input | 500 | 119.1 | 75.9 | 32.0 | 1.8 | 1.7 | 500 | 7 | 47 |
| date-picker | 200 | 451.1 | 373.5 | 54.8 | 3.4 | 3.4 | 1400 | 13 | 68 |
| menu | 500 | 290.8 | 196.1 | 58.2 | 4.1 | 4.0 | 1052 | 15 | 78 |
| form | 100 | 120.5 | 65.0 | 23.6 | 2.5 | 2.4 | 901 | 13 | 127 |
| table | 1000 | 447.9 | 186.0 | 63.5 | 2.8 | 2.7 | 7016 | 9 | 65 |
| admin | 1 | 157.5 | 46.8 | 15.0 | 5.0 | 4.6 | 407 | 44 | 376 |

`main` at 366836ad plus only the delayed-removal fix:

| scene | n | cold ms | hot ms | heap MB | retained@300ms MB | retained@1.5s MB | DOM nodes | style tags | CSS KB |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| button | 1000 | 217.7 | 157.3 | 92.4 | 4.4 | 4.3 | 2000 | 6 | 38 |
| input | 500 | 137.2 | 91.1 | 54.1 | 3.2 | 3.1 | 500 | 7 | 47 |
| date-picker | 200 | 446.6 | 368.1 | 61.3 | 3.6 | 3.4 | 1400 | 13 | 68 |
| menu | 500 | 287.2 | 206.0 | 77.3 | 5.1 | 4.8 | 1052 | 15 | 78 |
| form | 100 | 136.6 | 83.9 | 40.2 | 3.4 | 3.1 | 901 | 13 | 127 |
| table | 1000 | 439.3 | 174.9 | 63.6 | 2.8 | 2.6 | 7016 | 9 | 65 |
| admin | 1 | 151.6 | 49.6 | 18.1 | 5.2 | 4.7 | 407 | 44 | 376 |

Before the delayed-removal fix in `@antdv-next/cssinjs` (`useGlobalCache.ts`),
`button` retained 79.0 MB at 300ms after unmount on the same build.

### Pitfall: Vue devtools buffer

Vue's dev build buffers devtools events, including the component instances, for
3 seconds when no devtools hook is installed. `main.ts` installs a no-op hook so
that "retained after unmount" is not polluted by that buffer; without it the
dev-server numbers show the whole tree alive for seconds after unmount.
