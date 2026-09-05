import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * The command surface, read from `content/help/*.txt` at build time
 * (DESIGN.md § 6 / commands). Nothing here is hand-written: the groups are the
 * six from the brief, the descriptions come out of the help corpus.
 */

export type CommandEntry = {
  /** The verb as the reader types it: `wrkq <name>`. */
  name: string;
  /** First sentence of the command's help text. */
  description: string;
  /** Anchor on `/commands`. Differs from `name` only for aliases. */
  anchor: string;
};

export type CommandGroup = {
  group: string;
  members: CommandEntry[];
};

/**
 * DESIGN.md § 6 lists `info` under `agents`, but there is no `wrkq-info.txt`:
 * `info` is an alias of `usage` (`content/help/wrkq-usage.txt` declares
 * `Aliases: usage, info`), which is why the root `wrkq.txt` command list shows
 * only `usage`. The command is real — it is the one the whole page asks the
 * reader to put in their agent hook — so it stays in the grid, resolved to the
 * `usage` help file and anchored at `#usage` on the reference page.
 */
const HELP_ALIASES: Record<string, string> = { info: "usage" };

const GROUPS: Array<{ group: string; names: string[] }> = [
  {
    group: "files",
    names: [
      "ls", "tree", "cat", "stat", "touch", "mkdir",
      "mv", "cp", "rm", "rmdir", "restore", "rename-container",
    ],
  },
  {
    group: "work",
    names: [
      "set", "apply", "comment", "attach", "relation",
      "claim", "release", "ack", "check", "diff",
    ],
  },
  { group: "find", names: ["find", "search", "index", "log", "timeline", "usage"] },
  { group: "watch", names: ["watch", "monitor", "webhook"] },
  {
    group: "agents",
    names: [
      "info", "agent-info", "agent-context", "agent",
      "whoami", "handoff", "promise", "check-inbox",
    ],
  },
  {
    group: "projects",
    names: ["projects", "container", "campaign", "server", "rpc", "completion", "version"],
  },
];

/** Walk up from the working directory to the repo root holding `content/help`. */
function helpDir(): string | null {
  let dir = process.cwd();
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, "content", "help");
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/** What three lines of the grid's description column hold at 1024px. */
const MAX_DESCRIPTION = 84;

/**
 * A help file opens with a description paragraph, then a blank line or
 * `Usage:`. Take that paragraph, unwrap it, and keep the first sentence —
 * enough to say what the verb does on one row. A sentence that still overruns
 * the cell falls back to its leading clause, then to a word-boundary cut.
 * The full text is on `/commands`; this column is an index, not the reference.
 */
function condense(text: string): string {
  const paragraph: string[] = [];
  for (const line of text.split("\n")) {
    if (line.trim() === "" || /^Usage:/.test(line)) break;
    paragraph.push(line.trim());
  }

  const unwrapped = paragraph.join(" ").replace(/\s+/g, " ").trim();
  const sentence = cutAt(unwrapped, /[.;](\s|$)/);
  if (sentence.length <= MAX_DESCRIPTION) return sentence;

  const clause = cutAt(sentence, /,(\s|$)/);
  if (clause.length >= 30 && clause.length <= MAX_DESCRIPTION) return clause;

  const space = sentence.lastIndexOf(" ", MAX_DESCRIPTION);
  const head = sentence.slice(0, space > 0 ? space : MAX_DESCRIPTION);
  return `${head.replace(/[\s,;:.-]+$/, "")}\u2026`;
}

function cutAt(text: string, terminator: RegExp): string {
  const stop = text.search(terminator);
  return stop === -1 ? text : text.slice(0, stop);
}

export function getCommandGroups(): CommandGroup[] {
  const dir = helpDir();

  return GROUPS.map(({ group, names }) => ({
    group,
    members: names.flatMap((name): CommandEntry[] => {
      const anchor = HELP_ALIASES[name] ?? name;
      const file = dir ? path.join(dir, `wrkq-${anchor}.txt`) : null;
      // A verb with no help file is unprovable, so it does not go on the page.
      if (!file || !existsSync(file)) return [];
      const description = condense(readFileSync(file, "utf8"));
      if (!description) return [];
      return [{ name, description, anchor }];
    }),
  }));
}
