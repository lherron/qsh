import type { ReactNode } from "react";

/**
 * One accordion row. Native `<details>`/`<summary>`: no JS, keyboard and
 * find-in-page work for free. The `+`/`−` glyph is the open-state indicator
 * (DESIGN.md § 6 / faq).
 */
export function FaqItem({
  question,
  children,
}: {
  question: string;
  children: ReactNode;
}) {
  return (
    <details className="group border-b border-rule">
      <summary className="flex cursor-pointer list-none items-baseline gap-4 py-5 font-mono text-xs text-paper transition-colors duration-[120ms] group-open:text-signal hover:text-signal [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="w-3 shrink-0 text-paper-faint transition-colors duration-[120ms]"
        >
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">&minus;</span>
        </span>
        {question}
      </summary>
      <div className="max-w-[62ch] pt-1 pb-6 pl-7 text-paper-muted">
        {children}
      </div>
    </details>
  );
}
