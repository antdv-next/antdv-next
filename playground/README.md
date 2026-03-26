# Playground

Dev sandbox for testing antdv-next components. Start with:

```bash
pnpm dev:play
```

## VC_LOCAL Mode

Debug `@v-c/*` packages locally with auto-rebuild on source change.

### Prerequisites

- Clone [vue-components](https://github.com/nicepkg/vue-components) as `antdv-vc` sibling directory (or set `VC_PATH`)
- Ensure the target package has been built at least once (`pnpm -F @v-c/input build`)

### Quick Start

```bash
# CLI — watch input + textarea (defaults)
VC_LOCAL=1 pnpm dev:play

# CLI — specific packages
VC_LOCAL=input,textarea pnpm dev:play

# Persistent — copy .env.example to .env.local
cp playground/.env.example playground/.env.local
# Edit .env.local, uncomment VC_LOCAL=input,textarea
pnpm dev:play
```

### How It Works

1. `loadEnv` reads `VC_LOCAL` / `VC_PATH` from `.env.local` (or CLI env vars)
2. Vite `resolve.alias` redirects `@v-c/{pkg}` to local `dist/` instead of `node_modules`
3. Chokidar watches `antdv-vc/packages/{pkg}/src/`
4. On file change → `pnpm -F @v-c/{pkg} build` (~1s) → browser full-reload

### Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `VC_LOCAL` | Packages to watch. `1` = input,textarea. `*` = all packages. Comma-separated list for specific packages. | _(disabled)_ |
| `VC_PATH` | Path to vue-components repo root (relative to `playground/` or absolute). | `../../antdv-vc` |

### Limitations

- **Root imports only** — `@v-c/input` is aliased, but subpath imports like `@v-c/picker/generate/*` are not. Add aliases manually if needed.
- **Playground only** — `pnpm test` and `pnpm build` still use npm-published versions.
- **Sync rebuild** — Vite blocks for ~1s during each rebuild. Fine for 1-2 packages.
