import type { ReactNode } from "react";

/**
 * Opts a command pane into the visible 6px scrollbar defined in
 * `app/globals.css`. Every pane that can overflow its box carries it, so a cut
 * line always says "scroll me" rather than reading as a rendering bug.
 */
export const TERM_SCROLL = "term-scroll";

export function TermBody({ children }: { children: ReactNode }) {
  return (
    <pre className="m-0">
      <code>{children}</code>
    </pre>
  );
}

export function TermLine({
  prompt,
  children,
}: {
  prompt?: boolean;
  children: ReactNode;
}) {
  return (
    <span className="block whitespace-pre">
      {prompt && <span className="text-paper-faint select-none">$ </span>}
      {children}
    </span>
  );
}

/**
 * The `●` state dot from `wrkq cat --pretty`. `open` has no colour of its own
 * (DESIGN.md § 3 maps only in_progress, completed and blocked), so it sits at
 * --paper-faint.
 */
export function Dot({
  tone = "open",
}: {
  tone?: "open" | "in_progress" | "completed" | "blocked";
}) {
  const color = {
    open: "text-paper-faint",
    in_progress: "text-signal",
    completed: "text-done",
    blocked: "text-blocked",
  }[tone];
  return (
    <span className={color} aria-hidden="true">
      ●
    </span>
  );
}

/** Inline command or identifier inside a body paragraph. 14px (DESIGN.md § 3). */
export function Cmd({ children }: { children: ReactNode }) {
  return <code className="text-sm text-paper">{children}</code>;
}
