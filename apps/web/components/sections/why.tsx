import { Fragment, type ReactNode } from "react";
import {
  Cmd,
  Dot,
  TERM_SCROLL,
  TermBody,
  TermLine,
} from "@/components/sections/parts/term";
import { Section } from "@/components/site/section";
import { Terminal } from "@/components/site/terminal";
import { cn } from "@/lib/utils";

/**
 * Three claims and, beneath them, one full-width terminal replaying all three
 * proving exchanges as a single session (DESIGN.md § 6 / why). The comment
 * line above each exchange is what pairs it with its column.
 *
 * Every command and flag is verified against content/help:
 *   ls                     content/help/wrkq-ls.txt
 *   set --state --if-match content/help/wrkq-set.txt
 *   claim --as             content/help/wrkq-claim.txt (--as is a global flag)
 */
const CLAIMS: {
  label: string;
  comment: string;
  body: ReactNode;
  proof: ReactNode;
}[] = [
  {
    label: "Verbs you already know.",
    comment: "# verbs",
    body: (
      <>
        Tasks and projects are paths. <Cmd>ls</Cmd> lists them, <Cmd>cat</Cmd>{" "}
        shows one, <Cmd>touch</Cmd> makes one, <Cmd>mv</Cmd> moves it,{" "}
        <Cmd>rm</Cmd> retires it. An agent that can use a shell can use wrkq
        with zero instructions, and <Cmd>wrkq info</Cmd> gives it the rest.
      </>
    ),
    proof: (
      <>
        <TermLine prompt>
          <span className="text-paper">wrkq ls inbox</span>
        </TermLine>
        <TermLine>
          <span className="text-paper-muted">{"T-00042  "}</span>
          <Dot /> <span className="text-paper">Retry on 429</span>
          <span className="text-paper-muted">{"            open      P3"}</span>
        </TermLine>
        <TermLine>
          <span className="text-paper-muted">{"T-00043  "}</span>
          <Dot /> <span className="text-paper">Cache ETag on list</span>
          <span className="text-paper-muted">{"      open      P2"}</span>
        </TermLine>
      </>
    ),
  },
  {
    label: "One file, no server.",
    comment: "# one file",
    body: (
      <>
        Everything durable is in <Cmd>.wrkq/wrkq.db</Cmd>. WAL mode, busy
        timeouts and etag checks make concurrent agents safe. No accounts, no
        sync, nothing to run. Export the state and it goes through your PR like
        any other change.
      </>
    ),
    // The binary's real stderr line, reproduced by running `wrkqadm init` in a
    // scratch directory and then `wrkq set <id> --state in_progress
    // --if-match 7` (exit 1). DESIGN.md § why was amended to match.
    proof: (
      <>
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
      </>
    ),
  },
  {
    label: "Every write has a name on it.",
    comment: "# names",
    body: (
      <>
        Each mutation records a principal: <Cmd>agent:cody</Cmd>,{" "}
        <Cmd>agent:mable</Cmd>, you. Comments, claims and state flips are
        attributed and appended to an event log you can tail. When two agents
        touch the same task, <Cmd>claim</Cmd> makes the winner explicit.
      </>
    ),
    proof: (
      <>
        <TermLine prompt>
          <span className="text-paper">wrkq claim T-00042 --as agent:cody</span>
        </TermLine>
        <TermLine>
          <span className="text-paper-muted">Claimed </span>
          <span className="text-paper">T-00042</span>
          <span className="text-paper-muted">
            {" as agent:cody on macbook (generation 1)"}
          </span>
        </TermLine>
      </>
    ),
  },
];

export function Why() {
  return (
    <Section path="why" title="Three things it gets right.">
      {/* The grid is pulled 24px past the content column on both sides so
          every column can carry the same padding — equal content widths, and
          the outer edges still line up with the heading. The columns' left
          hairlines are the trunk rule branching (§ 4). */}
      <div className="mt-12 grid grid-cols-1 gap-y-10 md:-mx-6 md:grid-cols-3 md:gap-x-0 md:gap-y-0">
        {CLAIMS.map((claim, index) => (
          <div
            key={claim.label}
            className={cn("md:px-6", index > 0 && "md:border-l md:border-rule")}
          >
            {/* Two lines' worth of space so the paragraphs start on one line
                across all three columns, however long the label runs. */}
            <h3 className="font-mono text-sm font-medium text-paper md:min-h-[2lh]">
              {claim.label}
            </h3>
            <p className="mt-4 max-w-[62ch] text-paper-muted">{claim.body}</p>
          </div>
        ))}
      </div>

      {/* One session, in column order: the commands get the full measure. */}
      <div className="mt-12">
        <Terminal bodyClassName={TERM_SCROLL}>
          <TermBody>
            {CLAIMS.map((claim, index) => (
              <Fragment key={claim.comment}>
                {index > 0 && <TermLine> </TermLine>}
                <TermLine>
                  <span className="text-paper-faint">{claim.comment}</span>
                </TermLine>
                {claim.proof}
              </Fragment>
            ))}
          </TermBody>
        </Terminal>
      </div>
    </Section>
  );
}
