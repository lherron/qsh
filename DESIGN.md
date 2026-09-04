# wrkq.sh design brief

This file is the design contract for wrkq.sh. Every implementer reads it before
touching `apps/web`. When a task spec and this file disagree, this file wins
unless the task spec says it is amending this file.

## 1. Subject, audience, job

**Subject.** wrkq: a local-first task ledger for humans and coding agents. A
filesystem-flavored CLI (`ls`, `cat`, `touch`, `mkdir`, `mv`, `rm`, `tree`,
`find`) over one SQLite file. Every mutation is attributed to a principal
(`agent:cody`, a human), logged append-only, and readable as JSON, NDJSON, or
porcelain. Agents claim tasks atomically, comment, hand off context to their
next session, and wait on state. Task state can be exported and committed so it
rides your PR. MIT licensed. github.com/lherron/wrkq.

**Audience.** Developers who run coding agents (Claude Code, Codex, opencode,
pi, their own harness) and are tired of tasks living in the agent's context
window, a Markdown file, or a SaaS board the agent can't read.

**The page's single job.** Get a developer to install wrkq and add `wrkq info`
to their agent's startup hook. Everything on the landing page serves that.

## 2. Voice

Plain, specific, a little dry. Sentence case everywhere, including headings.
Verbs over adjectives. No "supercharge", "seamless", "powerful", "blazing".
Never sell; describe what the thing does and show the command that does it.
Copy in this file is final unless a task says otherwise. The one wordplay the
site allows is the name itself: wrkq is *work queue* with the vowels gone (its
sibling binary wrkf is *work flows*). Use it where § 6 says and nowhere else. If you must invent
copy, match this register and keep it shorter than you think.

**Every command shown on the site must be real.** The source of truth is
`content/help/*.txt` (regenerate with `scripts/extract-help.sh`). Before you
render a command, find the file that proves each flag exists. Invented flags
are a defect.

## 3. Tokens

### Color (dark only; the site has no light mode)

| token | hex | use |
| --- | --- | --- |
| `--ink` | `#11100e` | page background |
| `--ink-2` | `#181614` | raised surfaces: terminal, cards, nav on scroll |
| `--ink-3` | `#221f1b` | hover surfaces, table row highlight |
| `--paper` | `#e7e2d8` | primary text |
| `--paper-muted` | `#a39d91` | secondary text, captions |
| `--paper-faint` | `#6e695f` | tertiary text, disabled, prompt glyphs |
| `--rule` | `rgba(231,226,216,0.10)` | hairlines, borders |
| `--rule-strong` | `rgba(231,226,216,0.22)` | focused borders, active tabs |
| `--signal` | `#ffcb45` | the one accent: `in_progress`, active path, links on hover, cursor |
| `--done` | `#8fcf9a` | `completed` state only |
| `--blocked` | `#e0705a` | `blocked` state only, error text |

State colors map to wrkq's real task states and are used **only** to render
state. `--signal` is the accent for everything interactive. No gradients as
decoration. No glows. No glassmorphism. A single radial vignette behind the hero
grid is the only atmospheric effect on the page.

### Type

Loaded through `next/font/google`, `display: swap`, subsets `latin`.

| role | face | notes |
| --- | --- | --- |
| Display | **Bricolage Grotesque** | Variable. Hero and section headings. Use the width axis: `font-variation-settings: "wdth" 87, "opsz" 96` on the hero, `"wdth" 92` on section headings. Weight 500–600. Tracking `-0.04em` at hero size, `-0.02em` at section size. Line-height 0.92 hero, 1.05 sections. |
| Body | **IBM Plex Sans** | 400/500/600. 16px base, 1.6 line-height. Paragraph measure max 62ch. |
| Mono | **JetBrains Mono** | 400/500/700. `font-variant-ligatures: none`. All terminal output, commands, IDs, eyebrows, nav, table data. 13.5px in terminals, 14px in prose code. |

Type scale (rem): 0.75 / 0.8125 / 0.875 / 1 / 1.125 / 1.375 / 1.75 / 2.25 /
3 / `clamp(3.25rem, 7.4vw, 6.5rem)` for the hero (the 7.5rem cap overflowed the two-line H1 at 1440; amended after T-08036).

### Space and shape

Spacing on a 4px grid; section padding `clamp(5rem, 12vh, 9rem)` vertical.
Content max-width 1180px, page gutter `clamp(1.25rem, 4vw, 3rem)`.
Border radius: 0 on terminals, tables and rules; 4px on buttons, chips and
cards. Nothing rounder. Borders are 1px `--rule`. Shadows do not exist.

## 4. Layout: the tree gutter

The signature layout device. On viewports ≥ 1024px every section below the
hero is a two-column grid: a **left gutter** (200px) and the content column.
The gutter holds the section's **path eyebrow**, sticky at `top: 6rem`, set in
mono `--paper-faint` at 0.8125rem: a leading `/` then the section slug, e.g.
`/ install`. The path of the section the reader is in turns `--signal`. A 1px
vertical rule runs down the right edge of the gutter for the whole page below
the hero, like the trunk of `wrkq tree`.

Below 1024px the gutter collapses: the eyebrow sits above the section content,
the trunk rule disappears.

Section eyebrows are paths because wrkq addresses everything by path. They are
not numbered: the sections are not a sequence.

```
┌────────────────────────────────────────────────────────────────┐
│ wrkq        commands  docs  github ↗                    v0.1.0 │  nav, sticky, blurs ink-2 on scroll
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Work your agents           ┌─ T-00042 ─────────────────────┐ │  hero: 7/5 split ≥1024,
│  can ls.                    │ $ wrkq touch ...              │ │  stacked below
│                             │ ▏ C-00091 · @cody ...         │ │
│  wrkq is a local-first …    │ ● Retry on 429   completed    │ │
│                             └───────────────────────────────┘ │
│  ┌ brew │ curl │ go ┐                                          │
│  │ $ brew install lherron/wrkq/wrkq              [copy] │      │
│  └──────────────────────────────────────────────────────┘      │
├───────────┬────────────────────────────────────────────────────┤
│ / why     │ three claims, each with the command that proves it │
├───────────┼────────────────────────────────────────────────────┤
│ / install │ install tabs · the agent hook · first five commands│
├───────────┼────────────────────────────────────────────────────┤
│ / agents  │ what `wrkq info` injects · principals · JSON       │
├───────────┼────────────────────────────────────────────────────┤
│ / commands│ verb table grouped by what you're doing            │
├───────────┼────────────────────────────────────────────────────┤
│ / model   │ states strip · entities · addressing               │
├───────────┼────────────────────────────────────────────────────┤
│ / faq     │ six questions                                      │
├───────────┴────────────────────────────────────────────────────┤
│ MIT · github · docs · commands · built by Lance Herron         │
└────────────────────────────────────────────────────────────────┘
```

## 5. Signature: the ledger replay

The hero's right column is a **task card that replays a real session** between
a human and an agent. It is the one place the page spends its motion budget.
It is not a screenshot and not a video; it is DOM text rendered with the same
grammar as `wrkq cat --pretty`: `●` state dot, `§` section marks, `▏` comment
bars, `T-`/`C-` IDs.

The card has two zones: a **shell** strip at the top where commands are typed,
and the **card** below, which is the live `wrkq cat T-00042 --pretty` view
that updates after each command. The replay:

1. `$ wrkq touch inbox/retry-on-429 -t "Retry on 429" --kind bug --labels api`
   → card appears: `T-00042 ● Retry on 429` / `open · P3 · bug · api`
2. `$ wrkq claim T-00042 --as agent:cody`
   → state dot turns `--signal`, line `claimed by agent:cody · gen 1` appears
3. `$ wrkq comment add T-00042 -m "Backoff 250ms→4s, 5 tries. Tests added."`
   → `▏ C-00091 · @cody` block appears with the comment text
4. `$ wrkq set T-00042 --state completed --as agent:cody`
   → dot turns `--done`, meta reads `completed · P3 · bug · api`
5. `$ wrkq monitor wait T-00042 --until state=completed`
   → prints `T-00042 completed` and exits 0 — the human's side was waiting
   the whole time.

Typing speed 28–40ms per character with slight jitter, 600ms pause after
Enter, 1.4s hold on each result. After step 5 hold 4s, fade the shell, reset,
loop. The first frame on page load is step 1 already typed so the card is never
empty. `prefers-reduced-motion: reduce` renders the final state (step 4's card
with step 5's output) and never animates. A `Replay` control (mono, tiny,
`--paper-faint`) sits in the card's bottom-right corner.

The commands in the replay are verified against `content/help/`. Do not add
flags that are not there.

## 6. Section briefs and copy

### Nav

Left: `wrkq` wordmark in Bricolage 600 at 1.125rem, followed by `.sh` in
`--paper-faint`. Right, mono 0.8125rem: `commands` (→ `/commands`), `docs`
(→ github README until docs exist), `github ↗` (→ repo, with the star count
fetched at build time; render no count if the fetch fails or the count is
below 10, a `0` next to the link says nothing useful), and a version chip
from `content/help/version.txt` (`v0.1.0` – strip the `-N-gHASH` suffix).
Sticky; gains an `--ink-2` background at 92% opacity with `backdrop-filter`
once the page scrolls past 24px.

### Hero

Eyebrow (mono, `--paper-faint`): `local-first · sqlite · mit`

H1, two lines: **Work queues** / **for humans and agents.**

The first line is the type signature of the site. The letters that spell the
product name are set at Bricolage weight 700 in `--paper`; every other letter
in both lines is weight 400 in `--paper-muted`. So `Work queues` renders as
**W**o**rk** **q**ueues: the reader sees "wrkq" fall out of the words. Mark
the heavy letters up with `<b>` so the effect survives copy-paste and screen
readers still hear "Work queues". Line two is entirely the light weight. Do
not animate the letters. This device appears exactly twice on the site: here
and in the footer tagline (§ Footer).

Sub (body, `--paper-muted`, max 46ch):
"wrkq is a task ledger that lives next to your code. Unix verbs, one SQLite
file, JSON on every command, and a principal on every write. Humans and agents
work the same queue."

Install block: tabs `brew` / `curl` / `go`, each a real one-line command
(see § install). Copy button. Below it a secondary link, mono:
`or read what wrkq info tells your agent →` (jumps to `/ agents`).

Right column: the ledger replay (§ 5).

Layout note (amended after T-08036): the eyebrow and H1 span the full
content width; the 7/5 split governs only the row beneath them (sub, install
tabs and secondary link on the left, the replay `aside` on the right).

Background: the existing hero grid (5.5rem cells, `--rule`, radial mask),
kept as-is.

### / why

Heading: **Three things it gets right.**

Three columns (stack below 768px), each a mono label and a body paragraph.
Beneath the three columns, one full-width terminal that shows all three
proving exchanges as a single session, in column order, separated by a blank
line; each exchange begins with a faint `# verbs` / `# one file` / `# names`
comment line in `--paper-faint` so the eye can pair it with its column. The
terminal is one component, not three. (Ruled after T-08038: at 1440 a
three-column terminal gets ~25 characters and two of the three commands were
cut off. The session form gives the commands the full measure and reads like
a real shell.)

**Verbs you already know.**
"Tasks and projects are paths. `ls` lists them, `cat` shows one, `touch` makes
one, `mv` moves it, `rm` retires it. An agent that can use a shell can use
wrkq with zero instructions, and `wrkq info` gives it the rest."
```
$ wrkq ls inbox
T-00042  ● Retry on 429            open      P3
T-00043  ● Cache ETag on list      open      P2
```

**One file, no server.**
"Everything durable is in `.wrkq/wrkq.db`. WAL mode, busy timeouts and etag
checks make concurrent agents safe. No accounts, no sync, nothing to run.
Export the state and it goes through your PR like any other change."
```
$ wrkq set T-00042 --state in_progress --if-match 7
Error: task etag precondition failed
```
(That is the binary's real stderr line, reproduced by T-08038; render it in
`--blocked`.)

**Every write has a name on it.**
"Each mutation records a principal: `agent:cody`, `agent:mable`, you. Comments,
claims and state flips are attributed and appended to an event log you can
tail. When two agents touch the same task, `claim` makes the winner explicit."
```
$ wrkq claim T-00042 --as agent:cody
claimed T-00042 · holder agent:cody · generation 1
```

### / install

Heading: **Install it, then tell your agent.**

Install tabs (same component as the hero, larger):
- brew: `brew tap lherron/wrkq && brew install wrkq`
- curl: `curl -fsSL https://raw.githubusercontent.com/lherron/wrkq/main/install.sh | bash`
- go: `git clone https://github.com/lherron/wrkq && cd wrkq && just install`

Verify each against `~/praesidium/wrkq/README.md` and `install.sh`; if the
curl path is wrong, fix it here and in the hero. The source path requires Go 1.25 or newer (from wrkq's `go.mod`, which is
the real gate; its README is stale); say so under that tab only.

Then a two-step strip:

**1. Initialize the ledger in your repo**
```
$ wrkqadm init
$ wrkq mkdir inbox
```

**2. Add the hook to your agent's startup**
"Claude Code, Codex, opencode, pi and most harnesses run a shell hook at
session start. Put this in it:"
```
wrkq info 2>/dev/null || echo "wrkq not installed; ask the user"
```
"`wrkq info` prints the task lifecycle rules and the command reference an
agent needs. Nothing else to configure."

Then **First five commands**, a compact table (mono). Below 768px the table
renders as stacked rows: the command on one line, its description beneath in
`--paper-muted`; the description must never be off-screen.
```
wrkq touch inbox/login-flow -t "Login flow"    create a task
wrkq set T-00001 --state in_progress            start it
wrkq comment add T-00001 -m "Added the form"    leave a note
wrkq cat T-00001                                read it back
wrkq set T-00001 --state completed              finish it
```

### / agents

Heading: **Built to be read by something that isn't you.**

Left: body copy.
"Agents don't browse. They run a command, parse the result and run the next
one. wrkq was designed from that side of the screen."

Three short claims with a command each:
- **Structured output on every command.** `--json`, `--ndjson`, `--porcelain`,
  and `--output yaml` or `--output tsv` (the global `--output` flag; `--yaml`
  and `--tsv` are not global flags). `wrkq cat T-00042 --json --one` returns one object, not an
  array, when that is what the caller asserted.
- **Wait, don't poll.** `wrkq monitor wait T-00042 --until state=completed
  --timeout 30m` blocks until the condition is true and exits 0. Exit 1 means
  the timeout won. Built for the Monitor tool.
- **Context that survives the session.** `wrkq handoff create -t "Where I
  left off" --body-file -` leaves a note scoped to the agent and project.
  The next session runs `wrkq handoff list` and picks up.

Right: a terminal titled `wrkq info` that shows the first ~18 real lines of
`content/help/`-verified `wrkq info` output (take it from
`wrkq info` directly; trim, do not paraphrase). Caption under it:
"This is what your agent sees at startup."

### / commands

Heading: **The whole surface.**

Sub: "Forty-odd verbs, grouped by what you're doing. Every one has `--help`
and `--json`."

A grid of command rows grouped under mono group labels. Each row: command in
mono `--paper`, one-line description in body `--paper-muted`. Hovering a row
sets a `●` before it to `--signal`. Groups and members (descriptions come from
`content/help/wrkq.txt` and each command's help file):

- **files** — `ls` `tree` `cat` `stat` `touch` `mkdir` `mv` `cp` `rm` `rmdir`
  `restore` `rename-container`
- **work** — `set` `apply` `comment` `attach` `relation` `claim` `release`
  `ack` `check` `diff`
- **find** — `find` `search` `index` `log` `timeline` `usage`
- **watch** — `watch` `monitor` `webhook`
- **agents** — `info` `agent-info` `agent-context` `agent` `whoami` `handoff`
  `promise` `check-inbox`
- **projects** — `projects` `container` `campaign` `server` `rpc` `completion`
  `version`

Link at the end: `Full reference with every flag →` (`/commands`).

### / model

Heading: **Small model, stable IDs.**

**States strip.** A horizontal row of the nine states, mono chips joined by
thin rules. The common path `idea → draft → open → in_progress → completed`
is rendered in `--paper`; `blocked`, `cancelled`, `archived`, `deleted` sit
below it in `--paper-faint`. `in_progress` chip is `--signal`, `completed` is
`--done`, `blocked` is `--blocked`. Caption: "Any valid state is accepted; the
common path is a convention, not a gate."

**Entities.** A definition list in two columns:
- **Container** — a project, directory, feature or area. Hierarchical. `P-00007`.
- **Task** — kinds `task`, `subtask`, `spike`, `bug`, `chore`. Priority 1–4.
  `T-00123`.
- **Comment** — append-only. `C-00091`.
- **Attachment** — bytes on disk under the task's UUID, metadata in SQLite.
- **Relation** — `blocks`, `relates_to`, `duplicates`. Open blockers make
  `wrkq check blocked` fail.
- **Handoff** — an agent's note to its next session. `H-00012`.
- **Claim** — single holder, scope, generation, one-time token.

**Addressing.** One line of body copy, then three mono examples:
`inbox/retry-on-429` · `T-00042` · `7a6ffe78-d331-4cad-9bfc-ae093e3aa071`.
"Path, friendly ID or UUID. All three work everywhere."

### / faq

Heading: **Questions people ask first.**

Accordion, six items, mono question, body answer. No icons.

- **Does it need a server?** No. `wrkq` opens the SQLite file directly.
  `wrkqd` exists for the case where several machines share one ledger over
  HTTP, and `wrkq server start` wraps it. You will probably never run it.
- **How do agents know how to use it?** They run `wrkq info`. It prints the
  lifecycle rules and a command reference. Put it in your startup hook and
  every session begins oriented.
- **What about concurrency?** WAL mode, busy timeouts, and an etag on every
  row. Pass `--if-match` to refuse a write that would clobber someone else's.
  `claim` is atomic and single-holder.
- **Can I version it?** The database is local. `wrkqadm` exports and imports
  state so a project's tasks can be committed, reviewed and merged like code.
- **Is there an MCP server?** Yes, `mcp-server/` in the repo exposes selected
  operations over stdio. The CLI is still the primary surface and does more.
- **License?** MIT.

### Footer

One row on desktop, stacked on mobile. Left: `wrkq` wordmark and the tagline
"**W**o**rk** **q**ueues, vowels removed." using the same `<b>` device as the
hero at body size (700 in `--paper` against 400 in `--paper-muted`). Right, mono: `github` `commands` `docs`
`MIT license`. Bottom line, `--paper-faint`: `built by Lance Herron` and the
full version string from `content/help/version.txt`.

## 7. /commands page

A reference page generated from `content/help/`. Same nav and footer. Left
gutter becomes a sticky index of the six groups from § commands. Each command
is a section: the name as an `h2` in mono, the description, usage line,
flags table (flag, type, description) parsed from the help text, and nested
subcommands rendered the same way one level down. Global flags appear once at
the top of the page, not per command. Generated at build time from the text
files; no hand-written command content.

## 8. Motion

- Ledger replay (§ 5): the one orchestrated moment.
- Nav background on scroll: 200ms.
- Copy button: label swaps to `copied` for 1.2s. No icon animation.
- Command rows and FAQ: 120ms color transitions only.
- No scroll-triggered reveals, no parallax, no floating shapes, no marquee.
- `prefers-reduced-motion: reduce` disables the replay and every transition.

## 9. Quality floor

- Responsive at 360, 768, 1024, 1440. Nothing scrolls horizontally except a
  terminal's own `overflow-x: auto`.
- Visible focus rings: 2px `--signal` outline, 2px offset.
- Semantic landmarks: one `h1`, `nav`, `main`, `section` with `aria-labelledby`,
  `footer`.
- Lighthouse performance ≥ 95 on the landing page in a production build.
- Fonts self-hosted through `next/font`; no external stylesheet requests.
- `pnpm typecheck && pnpm lint && pnpm build` clean.
- Screenshots at 1440 and 390 saved to `~/praesidium/var/evidence/qsh/<task-id>/`
  and listed by path in the completion comment. (`wrkq attach put` is
  unavailable until the daemon gets `WRKQ_ATTACH_DIR`; do not block on it.)

## 10. What not to do

- No light mode. No theme toggle.
- No numbered section markers, no "01 / 02 / 03".
- No hero stat row, no logo wall, no testimonials, no pricing.
- No emoji. No icons except the `↗` external-link glyph and lucide `Copy`
  / `Check` in the copy button.
- No gradient text, no glow, no blur except the nav backdrop.
- No placeholder copy. If the content isn't in this file or in
  `content/help/`, it doesn't go on the page.
