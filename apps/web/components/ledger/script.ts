/**
 * The ledger replay script (DESIGN.md § 5).
 *
 * Five commands a human and an agent run against the same task. Every command
 * and flag below is provable from `content/help/`:
 *
 *   touch        --kind, --labels, -t, --priority default 3, --state default open
 *                → content/help/wrkq-touch.txt
 *   claim        --as is a global flag; claim also sets the task in_progress
 *                → content/help/wrkq-claim.txt, wrkq internal/wrkqapi/claims.go
 *   comment add  -m/--message
 *                → content/help/wrkq-comment-add.txt
 *   set          --state, --as (global)
 *                → content/help/wrkq-set.txt
 *   monitor wait --until state=<s>
 *                → content/help/wrkq-monitor-wait.txt
 *
 * Deviation from DESIGN.md § 5, step 5: the brief has `monitor wait` print
 * `T-00042 completed`. It does not. The real command emits one NDJSON terminal
 * line in every output mode (observed against a live ledger), so that is what
 * the shell strip prints. Recorded in a task comment for mable.
 */

export type CardState = "open" | "in_progress" | "completed";

export type ReplayStep = {
  /** The text typed after the `$ ` prompt. */
  command: string;
  /** Lines the command prints when it returns. */
  output: string[];
  /** The card's state after the command returns. */
  state: CardState;
  /** The claim trailer, once the task has a holder. */
  claim: string | null;
  /** Whether the comment block is on the card yet. */
  comment: boolean;
};

export const TASK = {
  id: "T-00042",
  title: "Retry on 429",
  priority: "P3",
  kind: "bug",
  labels: "api",
  description: "Retry idempotent calls on HTTP 429 with backoff.",
} as const;

export const COMMENT = {
  id: "C-00091",
  actor: "@cody",
  body: "Backoff 250ms→4s, 5 tries. Tests added.",
} as const;

const CLAIM = "claimed by agent:cody · gen 1";

export const SCRIPT: readonly ReplayStep[] = [
  {
    command: `wrkq touch inbox/retry-on-429 -t "Retry on 429" --kind bug --labels api`,
    output: [],
    state: "open",
    claim: null,
    comment: false,
  },
  {
    command: "wrkq claim T-00042 --as agent:cody",
    output: [],
    state: "in_progress",
    claim: CLAIM,
    comment: false,
  },
  {
    command: `wrkq comment add T-00042 -m "Backoff 250ms→4s, 5 tries. Tests added."`,
    output: [],
    state: "in_progress",
    claim: CLAIM,
    comment: true,
  },
  {
    command: "wrkq set T-00042 --state completed --as agent:cody",
    output: [],
    state: "completed",
    claim: CLAIM,
    comment: true,
  },
  {
    command: "wrkq monitor wait T-00042 --until state=completed",
    output: [
      '{"type":"wrkq.monitor.terminal","result":"met","reason":"condition_met","unmet":[]}',
    ],
    state: "completed",
    claim: CLAIM,
    comment: true,
  },
];

export const LAST = SCRIPT.length - 1;

/** Output rows the shell strip always reserves, so printing never resizes it. */
export const OUTPUT_ROWS = SCRIPT.reduce(
  (most, step) => Math.max(most, step.output.length),
  0,
);

/** Timing, all in ms (DESIGN.md § 5). */
export const TIMING = {
  typeMin: 28,
  typeMax: 40,
  afterEnter: 600,
  hold: 1400,
  loopHold: 4000,
  fade: 400,
  /** Beat after the reset, before step 2 starts typing again. */
  restart: 600,
  cursorBlink: 1100,
} as const;
