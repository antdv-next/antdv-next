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

Reference (2026-10-01, after sharing `useToken()` per context, commit on top of 366836ad):

| scenario | computed / instance | watch / instance | components / instance |
|---|---:|---:|---:|
| button | 97.6 | 12 | 4 |
| input | 113 | 14 | 3 |
| select | 189 | 36 | 15 |
| date-picker | 253 | 42 | 13 |
| menu-item | 122 | 32 | 14 |
| form-item-input | 331 | 53 | 17 |
| table-row | 47 | 1 | 7 |

Before that change (`main` at 366836ad) the same scenarios measured: button
218.9 / 21, input 263 / 25, select 329 / 44, date-picker 367 / 49, menu-item
262 / 40, form-item-input 901 / 95 (computed / watch per instance).

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

After sharing `useToken()` per context:

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
