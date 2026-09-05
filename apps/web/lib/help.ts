/**
 * The command reference is generated from `content/help/*.txt` — the verbatim
 * `--help` output of the installed binary, refreshed by `scripts/extract-help.sh`.
 * Nothing on `/commands` is written by hand (DESIGN.md § 7), so the page cannot
 * drift from the CLI.
 *
 * Cobra's help layout, which everything below parses:
 *
 *     <summary, one or more paragraphs>
 *     Usage:
 *       wrkq ls [path...] [flags]
 *     Aliases:
 *       ls, list
 *     Examples:
 *       wrkq cat T-00001 --json
 *     Commands:
 *       add         Add a comment to a task or container
 *     Flags:
 *       -a, --all             Include archived and deleted items
 *     Global Flags:
 *           --db string       Path to database file
 *     Use "wrkq <command> --help" for command details.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { GROUPS } from "./commands.ts";

export type HelpFlag = {
  /** Single-letter form without the dash: `a` for `-a`. */
  short?: string;
  /** Long form without the dashes: `all` for `--all`. */
  long: string;
  /** pflag's value type: `string`, `int`, `stringArray`. Absent for booleans. */
  type?: string;
  description: string;
};

/**
 * A paragraph of a command's summary. Cobra long descriptions mix prose with
 * indented blocks (`wrkq monitor` lists its subcommands and examples inline);
 * the page renders `pre` blocks in a terminal and `text` blocks as prose.
 */
export type SummaryBlock = { kind: "text" | "pre"; content: string };

export type HelpCommand = {
  /** Leaf name: `ls`, or `wait` for `wrkq monitor wait`. */
  name: string;
  /** Ancestors, outermost first: `[]`, or `["monitor"]`. */
  parents: string[];
  /** Anchor and index key: `ls`, `monitor-wait`. */
  slug: string;
  /** What you type: `wrkq monitor wait`. */
  command: string;
  /** Everything above `Usage:`, verbatim. */
  summary: string;
  summaryBlocks: SummaryBlock[];
  /** First paragraph on one line — the description used in indexes. */
  headline: string;
  usage: string;
  aliases: string[];
  examples: string[];
  flags: HelpFlag[];
  subcommands: HelpCommand[];
};

export type CommandGroup = {
  name: string;
  /** Members as DESIGN.md § 6 lists them, including the `info` alias. */
  members: string[];
};

/**
 * The `/commands` index, derived from the landing grid's grouping so the six
 * groups are defined exactly once (`lib/commands.ts`). Every anchor the landing
 * grid emits — `#<member>` — resolves on this page.
 */
export const COMMAND_GROUPS: CommandGroup[] = GROUPS.map(({ group, names }) => ({
  name: group,
  members: names,
}));

/**
 * Names that are aliases of another command and have no help file of their own.
 * `wrkq info` is `wrkq usage` (`content/help/wrkq-usage.txt`, `Aliases: usage, info`).
 */
export const COMMAND_ALIASES: Record<string, string> = { info: "usage" };

/** pflag's complete value-type vocabulary. A token is only read as a type if
 *  it is one of these, so a one-space description gap cannot be mistaken for one. */
const FLAG_TYPES = new Set([
  "string",
  "strings",
  "stringArray",
  "stringSlice",
  "stringToString",
  "int",
  "ints",
  "intSlice",
  "int8",
  "int16",
  "int32",
  "int64",
  "uint",
  "uint8",
  "uint16",
  "uint32",
  "uint64",
  "float32",
  "float64",
  "bool",
  "bools",
  "boolSlice",
  "duration",
  "durationSlice",
  "count",
  "ip",
  "ipSlice",
  "bytesHex",
]);

const SECTION_HEADER = /^([A-Z][A-Za-z ]*):\s*$/;
const FLAG_LINE =
  /^\s{2,}(?:-([A-Za-z0-9]),\s)?--([A-Za-z0-9][A-Za-z0-9-]*)(?: (\S+))?(?:\s{2,}(.*))?$/;

/** `-h` is on every command; the page says so once instead of 46 times. */
const HELP_FLAG = "help";

// ------------------------------------------------------------------ parsing

function sectionsOf(lines: string[]): Map<string, string[]> {
  const sections = new Map<string, string[]>();
  let current: string | null = null;

  for (const line of lines) {
    const header = SECTION_HEADER.exec(line);
    if (header) {
      current = header[1];
      if (!sections.has(current)) sections.set(current, []);
      continue;
    }
    if (current === null) continue;
    if (line.trim() === "") {
      sections.get(current)!.push("");
      continue;
    }
    // A flush-left line ends the block: cobra's `Use "wrkq ..." for details.`
    if (!/^\s/.test(line)) {
      current = null;
      continue;
    }
    sections.get(current)!.push(line);
  }
  return sections;
}

function trimBlank(lines: string[]): string[] {
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start].trim() === "") start++;
  while (end > start && lines[end - 1].trim() === "") end--;
  return lines.slice(start, end);
}

function toSummaryBlocks(lines: string[]): SummaryBlock[] {
  const blocks: SummaryBlock[] = [];
  let buffer: string[] = [];

  const flush = () => {
    const paragraph = trimBlank(buffer);
    buffer = [];
    if (paragraph.length === 0) return;
    // A paragraph holding an indented line is a listing, not prose.
    const preformatted = paragraph.some((line) => /^\s+\S/.test(line));
    blocks.push({
      kind: preformatted ? "pre" : "text",
      content: preformatted
        ? paragraph.join("\n")
        : paragraph.map((line) => line.trim()).join(" "),
    });
  };

  for (const line of lines) {
    if (line.trim() === "") flush();
    else buffer.push(line);
  }
  flush();
  return blocks;
}

export function parseFlags(lines: string[]): HelpFlag[] {
  const flags: HelpFlag[] = [];

  for (const line of lines) {
    if (line.trim() === "") continue;
    const match = FLAG_LINE.exec(line);
    if (!match) {
      // A wrapped description continues the flag above it.
      const previous = flags[flags.length - 1];
      if (previous) {
        previous.description = `${previous.description} ${line.trim()}`.trim();
      }
      continue;
    }
    const [, short, long, token, description] = match;
    const typed = token !== undefined && FLAG_TYPES.has(token);
    flags.push({
      ...(short ? { short } : {}),
      long,
      ...(typed ? { type: token } : {}),
      description: [typed ? undefined : token, description]
        .filter(Boolean)
        .join(" ")
        .trim(),
    });
  }
  return flags;
}

/** Names listed under `Commands:`. Cobra prints either `name  description`
 *  rows or, when no command has a description, a multi-column grid of names. */
function parseCommandNames(lines: string[]): string[] {
  const names: string[] = [];
  for (const line of lines) {
    if (line.trim() === "") continue;
    const cells = line.trim().split(/\s{2,}/);
    if (cells.every((cell) => !/\s/.test(cell))) names.push(...cells);
    else names.push(cells[0]);
  }
  return names;
}

export type ParsedHelp = Omit<HelpCommand, "subcommands"> & {
  /** Subcommand names as listed under `Commands:`, before their files are read. */
  subcommandNames: string[];
  globalFlags: HelpFlag[];
};

export function parseHelp(
  text: string,
  { name, parents = [] }: { name: string; parents?: string[] },
): ParsedHelp {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const usageAt = lines.findIndex((line) => line.trim() === "Usage:");
  const summaryLines = trimBlank(usageAt === -1 ? lines : lines.slice(0, usageAt));
  const sections = sectionsOf(usageAt === -1 ? [] : lines.slice(usageAt));

  const body = (key: string) => trimBlank(sections.get(key) ?? []);
  const globalFlags = parseFlags(body("Global Flags"));
  const globalNames = new Set(globalFlags.map((flag) => flag.long));

  const summaryBlocks = toSummaryBlocks(summaryLines);
  const commandNames = parseCommandNames([
    ...body("Commands"),
    ...body("Available Commands"),
  ]);

  return {
    name,
    parents,
    slug: [...parents, name].join("-"),
    command: ["wrkq", ...parents, name].join(" "),
    summary: summaryLines.map((line) => line.trimEnd()).join("\n"),
    summaryBlocks,
    headline:
      summaryBlocks.find((block) => block.kind === "text")?.content ?? "",
    usage: body("Usage")
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n"),
    aliases: (body("Aliases")[0] ?? "")
      .split(",")
      .map((alias) => alias.trim())
      .filter((alias) => alias !== "" && alias !== name),
    examples: body("Examples")
      .map((line) => line.trim())
      .filter(Boolean),
    // Global flags live in their own block at the top of the page, and `--help`
    // is universal; neither belongs in a per-command table.
    flags: parseFlags(body("Flags")).filter(
      (flag) => flag.long !== HELP_FLAG && !globalNames.has(flag.long),
    ),
    subcommandNames: commandNames,
    globalFlags,
  };
}

// ------------------------------------------------------------------- loading

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

export function readHelpFile(slug: string): string | null {
  const dir = helpDir();
  if (!dir) return null;
  const file = path.join(dir, `wrkq-${slug}.txt`);
  return existsSync(file) ? readFileSync(file, "utf8") : null;
}

/** Read one command and, one level down, each subcommand that has a help file. */
export function loadCommand(
  name: string,
  parents: string[] = [],
): HelpCommand | null {
  const slug = [...parents, name].join("-");
  const text = readHelpFile(slug);
  if (text === null) return null;

  const parsed = parseHelp(text, { name, parents });
  const subcommands =
    parents.length > 0
      ? []
      : parsed.subcommandNames
          .map((sub) => loadCommand(sub, [name]))
          .filter((sub): sub is HelpCommand => sub !== null);

  return {
    name: parsed.name,
    parents: parsed.parents,
    slug: parsed.slug,
    command: parsed.command,
    summary: parsed.summary,
    summaryBlocks: parsed.summaryBlocks,
    headline: parsed.headline,
    usage: parsed.usage,
    aliases: parsed.aliases,
    examples: parsed.examples,
    flags: parsed.flags,
    subcommands,
  };
}

/**
 * The flags every command accepts. Parsed once from `wrkq ls`, whose
 * `Global Flags:` block is the same block cobra prints on all 94 files
 * that have one.
 */
export function loadGlobalFlags(): HelpFlag[] {
  const text = readHelpFile("ls");
  if (text === null) return [];
  return parseHelp(text, { name: "ls" }).globalFlags;
}

export type ReferenceEntry = {
  /** How the group lists it — `info` where the command is `usage`. */
  label: string;
  /** The anchor to jump to. Aliases point at the command they alias. */
  anchor: string;
};

export type ReferenceGroup = {
  name: string;
  entries: ReferenceEntry[];
  /** Commands rendered under this group. An alias renders nothing of its own. */
  commands: HelpCommand[];
};

/**
 * The whole page: six groups, each command loaded once. A name that aliases a
 * command rendered in an earlier group keeps its index entry but points at the
 * section that already exists.
 */
export function loadReference(): ReferenceGroup[] {
  const rendered = new Map<string, string>();
  const groups: ReferenceGroup[] = [];

  for (const group of COMMAND_GROUPS) {
    const entries: ReferenceEntry[] = [];
    const commands: HelpCommand[] = [];

    for (const member of group.members) {
      const target = COMMAND_ALIASES[member] ?? member;
      const existing = rendered.get(target);
      if (existing !== undefined) {
        entries.push({ label: member, anchor: existing });
        continue;
      }
      const command = loadCommand(target);
      if (!command) continue;
      rendered.set(target, command.slug);
      entries.push({ label: member, anchor: command.slug });
      commands.push(command);
    }

    groups.push({ name: group.name, entries, commands });
  }
  return groups;
}

/** Every alias that needs an anchor of its own, keyed by the section it lives in. */
export function aliasAnchors(): Map<string, string[]> {
  const byTarget = new Map<string, string[]>();
  for (const [alias, target] of Object.entries(COMMAND_ALIASES)) {
    byTarget.set(target, [...(byTarget.get(target) ?? []), alias]);
  }
  return byTarget;
}
