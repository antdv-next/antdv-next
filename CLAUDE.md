# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Antdv Next is a Vue 3 enterprise component library porting [Ant Design (React)](https://github.com/ant-design/ant-design) to Vue 3 using TSX and Composition API. CSS-in-JS theming via `@antdv-next/cssinjs`.

**Requirements:** Node >=22.18.0, pnpm 10.28.2

## Component Conventions

@AGENTS.md  <!-- Full spec: React-Vue mapping, props/emits/slots, utilities, component template -->

**Quick reference:**
- `defineComponent<Props, Emits, string, SlotsType<Slots>>(...)`
- No `on*` props → all events through `emits`
- Slot > prop > null (via `getSlotPropFnRun`)
- `attrs.class`/`attrs.style` always merged last
- Class prefix: `ant-*` (e.g., `ant-btn`, `ant-modal`)

## Common Commands

```bash
pnpm dev                              # Docs site dev server (turbo dev --filter docs)
pnpm dev:play                         # Playground dev server
pnpm build:antdv                      # Build component library only
pnpm test                             # Run all Vitest tests
pnpm test:coverage                    # Tests with coverage
pnpm -F antdv-next test button.test   # Run specific test file
pnpm lint                             # ESLint check + fix
pnpm -F antdv-next build:llm          # Generate LLM-friendly docs
pnpm -F antdv-next build:web-types    # Generate web-types for IDE
```

## Architecture

```
antdv-next (pnpm monorepo + Turbo)
├── packages/antdv-next/       # Main component library (70+ components)
│   ├── src/<component>/       # Each component: Component.tsx, index.ts, style/
│   ├── src/_util/             # Shared utilities, hooks, types
│   └── tests/
├── packages/cssinjs/          # @antdv-next/cssinjs — CSS-in-JS theme engine
├── docs/                      # Vite-based documentation site
├── playground/                # Component playground
├── scripts/                   # Build & generation scripts
└── tests/                     # Shared test setup (setup.ts, setupAfterEnv.ts)
```

**Build chain:** Turbo orchestrates: cssinjs → antdv-next ESM (tsdown) → token metadata → docs (Vite).

## Testing

- Vitest + jsdom + @vue/test-utils
- Test files: `packages/*/tests/*.test.ts(x)`
- `@v-c/*` packages inlined via `server.deps.inline`
- Setup: `ResizeObserver`, `matchMedia`, `scrollIntoView` globally mocked; Vue warnings suppressed; custom HTML snapshot serializer

## Git Setup

- **origin**: `shiqkuangsan/antdv-next` (fork)
- **upstream**: `antdv-next/antdv-next` (upstream)

## Commit Conventions

Conventional commits enforced by `scripts/verify-commit.js`:
- `feat:`, `fix:`, `docs:`, `dx:`, `style:`, `refactor:`, `perf:`, `test:`, `workflow:`, `build:`, `ci:`, `chore:`, `types:`, `wip:`, `release:`
- Git hooks: `pre-commit` → lint-staged, `commit-msg` → verify-commit.js

## Dependency Management

pnpm workspace with catalog-based versioning (`catalog:prod`, `catalog:dev`, `catalog:docs`, `catalog:vc`, `catalog:types`). Internal packages use `workspace:^`.

`@v-c/*` headless primitives live in `../antdv-vc/` — user is maintainer.
