import type { ReactNode } from "react";

/**
 * The `/ why` columns are ~200px of usable width, so most proving commands are
 * longer than their pane. DESIGN.md § 9 allows a terminal its own overflow-x,
 * but a line that is silently cut reads as a bug, so these panes keep a
 * permanently visible 6px scrollbar: --paper-faint thumb on an --ink-3 track.
 *
 * The rules live in a style element rather than Tailwind utilities because
 * ::-webkit-scrollbar cannot be expressed as one, and styling it is what opts
 * a scroll container out of overlay scrollbars in the first place. The
 * standard `scrollbar-width`/`scrollbar-color` pair is deliberately absent:
 * setting either makes Chrome ignore the ::-webkit-scrollbar rules and fall
 * back to an overlay bar that appears only while scrolling. Scoped to the
 * class below, so it touches nothing outside these sections.
 */
export const TERM_SCROLL = "term-scroll";

export function TermScrollStyle() {
  return (
    <style>{`
      .term-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
      .term-scroll::-webkit-scrollbar-track { background: var(--ink-3); }
      .term-scroll::-webkit-scrollbar-thumb { background: var(--paper-faint); }
    `}</style>
  );
}

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
