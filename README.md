# qsh

The monorepo for [wrkq.sh](https://wrkq.sh/), the marketing and reference site
for [wrkq](https://github.com/lherron/wrkq) — a local-first task ledger for
humans and coding agents. The site is a Next.js app in `apps/web`.

## Develop

```bash
pnpm i
pnpm dev            # http://localhost:3000
```

`pnpm typecheck && pnpm lint && pnpm build` must be clean before anything lands.

## Screenshots

```bash
pnpm shot                      # shots/home-1440.png, shots/home-390.png
pnpm shot /commands            # shots/commands-1440.png, shots/commands-390.png
pnpm shot / --out /tmp/review  # write somewhere else
```

`pnpm shot` screenshots a page full-height at 1440×900 and 390×844. It starts no
server: run `pnpm dev` (or `pnpm build && pnpm start`) first. The first run needs
`pnpm exec playwright install chromium`.

## Command content

Every wrkq command shown on the site must be real. `content/help/` holds the
verbatim `--help` output of every command and is the source of truth; regenerate
it against an installed wrkq with:

```bash
scripts/extract-help.sh
```

## Design

[DESIGN.md](DESIGN.md) is the design contract: tokens, layout, copy and the
quality floor. Read it before touching `apps/web`.
