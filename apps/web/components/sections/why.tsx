import type { ReactNode } from "react";
import {
  Cmd,
  Dot,
  TERM_SCROLL,
  TermBody,
  TermLine,
  TermScrollStyle,
} from "@/components/sections/parts/term";
import { Section } from "@/components/site/section";
import { Terminal } from "@/components/site/terminal";
import { cn } from "@/lib/utils";

/**
 * Three claims, each with the command that proves it (DESIGN.md § 6 / why).
 * Every command and flag is verified against content/help:
 *   ls                     content/help/wrkq-ls.txt
 *   set --state --if-match content/help/wrkq-set.txt
 *   claim --as             content/help/wrkq-claim.txt (--as is a global flag)
 *
 * Spacing uses padding, not margin: globals.css zeroes `p`/`h3` margins in an
 * unlayered rule, which outranks Tailwind's layered `mt-*` utilities. Reported
 * to mable on T-08038.
 */
const CLAIMS: { label: string; body: ReactNode; proof: ReactNode }[] = [
  {
    label: "Verbs you already know.",
    body: (
      <>
        Tasks and projects are paths. <Cmd>ls</Cmd> lists them, <Cmd>cat</Cmd>{" "}
        shows one, <Cmd>touch</Cmd> makes one, <Cmd>mv</Cmd> moves it,{" "}
        <Cmd>rm</Cmd> retires it. An agent that can use a shell can use wrkq
        with zero instructions, and <Cmd>wrkq info</Cmd> gives it the rest.
      </>
    ),
    proof: (
      <TermBody>
        <TermLine prompt>
          <span className="text-paper">wrkq ls inbox</span>
        </TermLine>
        <TermLine>
          <span className="text-paper-muted">T-00042 </span>
          <Dot /> <span className="text-paper">Retry on 429</span>
          <span className="text-paper-muted">{"        open  P3"}</span>
        </TermLine>
        <TermLine>
          <span className="text-paper-muted">T-00043 </span>
          <Dot /> <span className="text-paper">Cache ETag on list</span>
          <span className="text-paper-muted">{"  open  P2"}</span>
        </TermLine>
      </TermBody>
    ),
  },
  {
    label: "One file, no server.",
    body: (
      <>
        Everything durable is in <Cmd>.wrkq/wrkq.db</Cmd>. WAL mode, busy
        timeouts and etag checks make concurrent agents safe. No accounts, no
        sync, nothing to run. Export the state and it goes through your PR like
        any other change.
      </>
    ),
    /*
     * DESIGN.md § 6 prints `error: etag mismatch (current 8)` here. The real
     * binary says something else, so the real text is on the page: verified by
     * running `wrkqadm init` in a scratch directory, creating a task, then
     * `wrkq set <id> --state in_progress --if-match 7`, which prints
     * `Error: task etag precondition failed` and exits 1.
     */
    proof: (
      <TermBody>
        <TermLine prompt>
          <span className="text-paper">
            wrkq set T-00042 --state in_progress --if-match 7
          </span>
        </TermLine>
        <TermLine>
          <span className="text-blocked">
            Error: task etag precondition failed
          </span>
        </TermLine>
      </TermBody>
    ),
  },
  {
    label: "Every write has a name on it.",
    body: (
      <>
        Each mutation records a principal: <Cmd>agent:cody</Cmd>,{" "}
        <Cmd>agent:mable</Cmd>, you. Comments, claims and state flips are
        attributed and appended to an event log you can tail. When two agents
        touch the same task, <Cmd>claim</Cmd> makes the winner explicit.
      </>
    ),
    proof: (
      <TermBody>
        <TermLine prompt>
          <span className="text-paper">wrkq claim T-00042 --as agent:cody</span>
        </TermLine>
        <TermLine>
          <span className="text-paper-muted">claimed </span>
          <span className="text-paper">T-00042</span>
          <span className="text-paper-muted">
            {" · holder agent:cody · generation 1"}
          </span>
        </TermLine>
      </TermBody>
    ),
  },
];

export function Why() {
  return (
    <Section path="why" title="Three things it gets right.">
      <TermScrollStyle />
      {/* The grid is pulled 24px past the content column on both sides so
          every column can carry the same padding — equal content widths, and
          the outer edges still line up with the heading. The columns' left
          hairlines are the trunk rule branching (§ 4). */}
      <div className="grid grid-cols-1 gap-y-14 pt-12 md:-mx-6 md:grid-cols-3 md:gap-x-0 md:gap-y-0">
        {CLAIMS.map((claim, index) => (
          <article
            key={claim.label}
            className={cn(
              "flex flex-col md:px-6",
              index > 0 && "md:border-l md:border-rule",
            )}
          >
            {/* Two lines' worth of space so the paragraphs start on one line
                across all three columns, however long the label runs. */}
            <h3 className="font-mono text-sm font-medium text-paper md:min-h-[2lh]">
              {claim.label}
            </h3>
            <p className="max-w-[62ch] pt-4 text-paper-muted">{claim.body}</p>
            <div className="mt-auto pt-8">
              <Terminal bodyClassName={TERM_SCROLL}>{claim.proof}</Terminal>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
