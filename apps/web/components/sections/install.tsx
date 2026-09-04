import type { ReactNode } from "react";
import {
  Cmd,
  TERM_SCROLL,
  TermBody,
  TermLine,
  TermScrollStyle,
} from "@/components/sections/parts/term";
import { CopyButton } from "@/components/site/copy-button";
import { InstallTabs } from "@/components/site/install-tabs";
import { Section } from "@/components/site/section";
import { Terminal } from "@/components/site/terminal";

const HOOK = `wrkq info 2>/dev/null || echo "wrkq not installed; ask the user"`;

/**
 * The five commands a first session actually runs, in order. Verified against
 * content/help: touch -t (wrkq-touch.txt), set --state (wrkq-set.txt),
 * comment add -m (wrkq-comment-add.txt), cat (wrkq-cat.txt).
 */
const FIRST_FIVE = [
  { command: `wrkq touch inbox/login-flow -t "Login flow"`, does: "create a task" },
  { command: "wrkq set T-00001 --state in_progress", does: "start it" },
  { command: `wrkq comment add T-00001 -m "Added the form"`, does: "leave a note" },
  { command: "wrkq cat T-00001", does: "read it back" },
  { command: "wrkq set T-00001 --state completed", does: "finish it" },
];

/**
 * Numbered steps appear here and nowhere else on the page: install, then wire
 * the hook, is a real sequence, so the numerals carry information rather than
 * decorating it (DESIGN.md § 6 / install). The numeral hangs in its own
 * column so the step content keeps one left edge.
 *
 * Spacing is padding and flex gaps, not `mt-*`: globals.css zeroes `p`/`h3`
 * margins in an unlayered rule that outranks Tailwind's layered utilities.
 * Reported to mable on T-08038.
 */
function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[2rem_1fr] gap-x-2 sm:grid-cols-[2.5rem_1fr]">
      <span
        aria-hidden="true"
        className="font-mono text-sm text-paper-faint tabular-nums"
      >
        {n}
      </span>
      <div className="flex min-w-0 flex-col gap-4">
        <h3 className="text-base font-semibold text-paper">
          <span className="sr-only">{`Step ${n} `}</span>
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

export function Install() {
  return (
    <Section path="install" title="Install it, then tell your agent.">
      <TermScrollStyle />
      <div className="pt-10">
        <InstallTabs size="section" />
      </div>

      <div className="mt-16 flex flex-col gap-10 border-t border-rule pt-12">
        <Step n="1." title="Initialize the ledger in your repo">
          <div className="max-w-xl">
            <Terminal bodyClassName={TERM_SCROLL}>
              <TermBody>
                <TermLine prompt>
                  <span className="text-paper">wrkqadm init</span>
                </TermLine>
                <TermLine prompt>
                  <span className="text-paper">wrkq mkdir inbox</span>
                </TermLine>
              </TermBody>
            </Terminal>
          </div>
        </Step>

        <div className="border-t border-rule" />

        <Step n="2." title="Add the hook to your agent's startup">
          <p className="max-w-[62ch] text-paper-muted">
            Claude Code, Codex, opencode, pi and most harnesses run a shell hook
            at session start. Put this in it:
          </p>
          <div className="max-w-xl border border-rule bg-ink-2">
            <div className="flex items-center gap-4 px-4 py-3">
              <pre
                className={`terminal-body m-0 min-w-0 flex-1 overflow-x-auto font-mono! ${TERM_SCROLL}`}
              >
                <code className="font-mono! whitespace-pre text-paper">
                  {HOOK}
                </code>
              </pre>
              <CopyButton value={HOOK} />
            </div>
          </div>
          <p className="max-w-[62ch] text-paper-muted">
            <Cmd>wrkq info</Cmd> prints the task lifecycle rules and the command
            reference an agent needs. Nothing else to configure.
          </p>
        </Step>
      </div>

      <div className={`mt-16 overflow-x-auto border-t border-rule pt-12 ${TERM_SCROLL}`}>
        <table className="w-full border-collapse text-left">
          <caption className="mb-6 text-left font-mono text-sm font-medium text-paper">
            First five commands
          </caption>
          <thead>
            <tr className="border-b border-rule">
              <th
                scope="col"
                className="py-2 pr-10 font-mono text-2xs font-normal text-paper-faint"
              >
                command
              </th>
              <th
                scope="col"
                className="w-full py-2 font-mono text-2xs font-normal text-paper-faint"
              >
                what it does
              </th>
            </tr>
          </thead>
          <tbody>
            {FIRST_FIVE.map((row) => (
              <tr
                key={row.command}
                className="border-b border-rule transition-colors duration-[120ms] hover:bg-ink-3"
              >
                <td className="terminal-body py-3.5 pr-10 font-mono! whitespace-nowrap text-paper">
                  {row.command}
                </td>
                <td className="w-full py-3.5 text-sm whitespace-nowrap text-paper-muted">
                  {row.does}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
