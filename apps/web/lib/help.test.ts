/**
 * Parser tests for `lib/help.ts`, run with `node --test` (Node strips the
 * types). The fixtures are the real help dumps in `content/help/`: `ls` is the
 * plain shape, `cat` has a summary that runs several paragraphs before
 * `Usage:`, and `monitor` carries an indented listing inside its summary and
 * defers everything else to subcommands.
 */
import assert from "node:assert/strict";
import test from "node:test";
import {
  COMMAND_ALIASES,
  COMMAND_GROUPS,
  loadCommand,
  loadGlobalFlags,
  parseFlags,
  parseHelp,
  readHelpFile,
} from "./help.ts";

function fixture(slug: string): string {
  const text = readHelpFile(slug);
  assert.ok(text, `content/help/wrkq-${slug}.txt should be readable`);
  return text;
}

test("ls: the plain shape", () => {
  const ls = parseHelp(fixture("ls"), { name: "ls" });

  assert.equal(ls.name, "ls");
  assert.deepEqual(ls.parents, []);
  assert.equal(ls.slug, "ls");
  assert.equal(ls.command, "wrkq ls");
  assert.equal(ls.headline, "List containers and tasks");
  assert.equal(ls.usage, "wrkq ls [path...] [flags]");
  assert.deepEqual(ls.aliases, ["list"]);
  assert.deepEqual(ls.examples, []);
  assert.deepEqual(ls.subcommandNames, []);

  assert.deepEqual(
    ls.flags.find((flag) => flag.long === "all"),
    { short: "a", long: "all", description: "Include archived and deleted items" },
  );
  assert.deepEqual(
    ls.flags.find((flag) => flag.long === "sort"),
    {
      long: "sort",
      type: "string",
      description:
        'Sort by field: slug, updated_at, created_at, id (default "slug")',
    },
  );
  // A digit short flag still parses: `-0, --nul`.
  assert.equal(ls.flags.find((flag) => flag.long === "nul")?.short, "0");
});

test("ls: --help and the global flags stay out of the per-command table", () => {
  const ls = parseHelp(fixture("ls"), { name: "ls" });

  assert.equal(
    ls.flags.some((flag) => flag.long === "help"),
    false,
  );
  for (const global of ["as", "db", "output", "principal-ref", "project"]) {
    assert.equal(
      ls.flags.some((flag) => flag.long === global),
      false,
      `--${global} is a global flag`,
    );
  }

  assert.deepEqual(
    ls.globalFlags.map((flag) => flag.long),
    ["as", "db", "output", "principal-ref", "project"],
  );
  assert.deepEqual(loadGlobalFlags(), ls.globalFlags);
});

test("cat: a summary of several paragraphs, plus examples", () => {
  const cat = parseHelp(fixture("cat"), { name: "cat" });

  assert.equal(cat.summaryBlocks.length, 2);
  assert.equal(cat.summaryBlocks[0].kind, "text");
  assert.equal(
    cat.headline,
    "Print one or more tasks, containers, or promises.",
  );
  // The second paragraph is wrapped prose; it joins onto one line.
  assert.equal(cat.summaryBlocks[1].kind, "text");
  assert.match(cat.summaryBlocks[1].content, /^JSON output is always array-shaped/);
  assert.match(cat.summaryBlocks[1].content, /counts toward the explicit-selector/);
  assert.equal(cat.summaryBlocks[1].content.includes("\n"), false);
  // `summary` keeps the file's own line breaks.
  assert.equal(cat.summary.split("\n").length, 6);

  assert.equal(cat.usage, "wrkq cat <path|id>... [flags]");
  assert.deepEqual(cat.aliases, ["show"]);
  assert.deepEqual(cat.examples, [
    "wrkq cat T-00001 --json",
    "wrkq cat T-00001 T-00002 --json",
    "wrkq cat T-00001 --json --one",
  ]);
  assert.deepEqual(
    cat.flags.find((flag) => flag.long === "one"),
    {
      long: "one",
      description:
        "Assert one selector/result and emit one bare JSON object (requires --json)",
    },
  );
});

test("monitor: an indented listing in the summary, and subcommands", () => {
  const monitor = parseHelp(fixture("monitor"), { name: "monitor" });

  const kinds = monitor.summaryBlocks.map((block) => block.kind);
  assert.deepEqual(kinds, ["text", "pre", "pre", "text"]);
  assert.equal(
    monitor.headline,
    "Stream and query task events for agent observation via the Claude Monitor tool.",
  );
  // `Subcommands:` and `Examples:` sit above `Usage:`, so they are summary text,
  // not sections — the indentation has to survive.
  assert.match(monitor.summaryBlocks[1].content, /^Subcommands:\n {2}watch/);
  assert.match(monitor.summaryBlocks[2].content, /^Examples:\n {2}wrkq monitor watch/);
  assert.match(monitor.summaryBlocks[3].content, /^Exit codes: 0=condition met/);

  assert.equal(monitor.usage, "wrkq monitor [flags]");
  assert.deepEqual(monitor.subcommandNames, ["wait", "watch"]);
  // Only `-h`, which is filtered.
  assert.deepEqual(monitor.flags, []);

  const loaded = loadCommand("monitor");
  assert.ok(loaded);
  assert.deepEqual(
    loaded.subcommands.map((sub) => sub.slug),
    ["monitor-wait", "monitor-watch"],
  );
  const wait = loaded.subcommands[0];
  assert.deepEqual(wait.parents, ["monitor"]);
  assert.equal(wait.command, "wrkq monitor wait");
  assert.equal(
    wait.flags.some((flag) => flag.long === "until"),
    true,
  );
  // Subcommands are rendered one level down and no further.
  assert.deepEqual(wait.subcommands, []);
});

test("parseFlags: types, bare booleans and wrapped descriptions", () => {
  assert.deepEqual(
    parseFlags([
      "      --label stringArray     Filter by exact task label",
      "                              (repeatable; all must match)",
      "  -R, --recursive             List recursively",
      "      --limit int             Maximum number of results",
    ]),
    [
      {
        long: "label",
        type: "stringArray",
        description: "Filter by exact task label (repeatable; all must match)",
      },
      { short: "R", long: "recursive", description: "List recursively" },
      { long: "limit", type: "int", description: "Maximum number of results" },
    ],
  );

  // A word that is not one of pflag's value types is description, not a type.
  assert.deepEqual(parseFlags(["      --pretty  Force human-readable output"]), [
    { long: "pretty", description: "Force human-readable output" },
  ]);
});

test("every grouped command resolves to a help file", () => {
  for (const group of COMMAND_GROUPS) {
    for (const member of group.members) {
      const target = COMMAND_ALIASES[member] ?? member;
      assert.ok(
        loadCommand(target),
        `${member} should resolve (content/help/wrkq-${target}.txt)`,
      );
    }
  }
});
