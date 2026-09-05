import type { ReactNode } from "react";
import { Cmd, TERM_SCROLL } from "@/components/sections/parts/term";
import { WRKQ_INFO } from "@/components/sections/parts/wrkq-info";
import { Section } from "@/components/site/section";
import { Terminal } from "@/components/site/terminal";

/**
 * Three claims, each with the command behind it (DESIGN.md § 6 / agents).
 * Verified against content/help:
 *   cat --json --one                content/help/wrkq-cat.txt
 *   monitor wait --until --timeout  content/help/wrkq-monitor-wait.txt
 *   handoff create -t --body-file - content/help/wrkq-handoff-create.txt
 *   handoff list                    content/help/wrkq-handoff-list.txt
 *
 * DESIGN.md lists `--yaml` and `--tsv` alongside the others. Neither is a
 * global flag: only `wrkq comment ls` defines them, and everywhere else those
 * formats are reached through the global `--output` ("Output mode: table,
 * human, json, ndjson, porcelain, yaml, tsv, raw"). The copy says
 * `--output yaml` and `--output tsv` instead; raised with mable on T-08038.
 */
const CLAIMS: { lead: string; body: ReactNode; command: string }[] = [
  {
    lead: "Structured output on every command.",
    body: (
      <>
        <Cmd>--json</Cmd>, <Cmd>--ndjson</Cmd>, <Cmd>--porcelain</Cmd>, and{" "}
        <Cmd>--output yaml</Cmd> or <Cmd>--output tsv</Cmd> on anything. The
        command below returns one object, not an array, because that is what the
        caller asserted.
      </>
    ),
    command: "wrkq cat T-00042 --json --one",
  },
  {
    lead: "Wait, don't poll.",
    body: (
      <>
        Blocks until the condition is true and exits 0. Exit 1 means the timeout
        won. Built for the Monitor tool.
      </>
    ),
    command: "wrkq monitor wait T-00042 --until state=completed --timeout 30m",
  },
  {
    lead: "Context that survives the session.",
    body: (
      <>
        Leaves a note scoped to the agent and project. The next session runs{" "}
        <Cmd>wrkq handoff list</Cmd> and picks up.
      </>
    ),
    command: `wrkq handoff create -t "Where I left off" --body-file -`,
  },
];

export function Agents() {
  return (
    <Section path="agents" title="Built to be read by something that isn't you.">
      <div className="mt-10 grid grid-cols-1 items-start gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p className="max-w-[62ch] text-paper-muted">
            Agents don&rsquo;t browse. They run a command, parse the result and
            run the next one. wrkq was designed from that side of the screen.
          </p>

          <dl className="mt-10">
            {CLAIMS.map((claim) => (
              <div
                key={claim.lead}
                className="flex flex-col gap-3 border-t border-rule py-7 first:border-t-0 first:pt-0"
              >
                <dt className="font-semibold text-paper">{claim.lead}</dt>
                <dd className="max-w-[62ch] text-paper-muted">{claim.body}</dd>
                {/* These three commands are the point of the section, so none
                    of them may be cut. The column is ~415px at 1440 and the
                    monitor-wait line needs ~550px, so it wraps with a 2ch
                    hanging indent — the continuation sits under the command,
                    where a shell puts it — and the whole command is readable
                    at every width. Widening the column instead (mable's other
                    option on T-08041) would have starved the `wrkq info`
                    specimen next to it down to ~305px. */}
                <dd className="border border-rule bg-ink-2 px-4 py-2.5">
                  <pre className="terminal-body m-0 pl-[2ch] -indent-[2ch]">
                    <code className="whitespace-pre-wrap">
                      <span className="text-paper-faint select-none">$ </span>
                      <span className="text-paper">{claim.command}</span>
                    </code>
                  </pre>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="m-0 lg:sticky lg:top-24">
          <Terminal
            title="wrkq info"
            bodyClassName={`max-h-[34rem] overflow-y-auto ${TERM_SCROLL}`}
          >
            <pre className="m-0">
              <code className="whitespace-pre text-paper-muted">
                {WRKQ_INFO}
              </code>
            </pre>
          </Terminal>
          <figcaption className="mt-4 text-sm text-paper-muted">
            This is what your agent sees at startup.
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
