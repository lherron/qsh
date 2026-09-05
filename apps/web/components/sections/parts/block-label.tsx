import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The sub-block marker used inside the dense sections: a lowercase mono word
 * over a hairline, optionally with a right-aligned figure. It borrows the
 * grammar of a `wrkq ls` header rather than numbering the blocks.
 *
 * The margin lives on the wrapper, not the heading: `app/globals.css` zeroes
 * margins on `h1..h3, p, dl, dd` outside any cascade layer, which outranks
 * Tailwind's layered `mt-*` utilities on those elements.
 */
export function BlockLabel({
  children,
  trailing,
  className,
}: {
  children: ReactNode;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-rule pb-2", className)}>
      <h3 className="flex items-baseline justify-between gap-4 font-mono text-2xs text-paper-faint">
        <span>{children}</span>
        {trailing !== undefined && (
          <span aria-hidden="true" className="tabular-nums">
            {trailing}
          </span>
        )}
      </h3>
    </div>
  );
}
