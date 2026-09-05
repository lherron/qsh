import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The sub-block marker used inside the dense sections: a lowercase mono word
 * over a hairline, optionally with a right-aligned figure. It borrows the
 * grammar of a `wrkq ls` header rather than numbering the blocks.
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
    <h3
      className={cn(
        "flex items-baseline justify-between gap-4 border-b border-rule pb-2 font-mono text-2xs text-paper-faint",
        className,
      )}
    >
      <span>{children}</span>
      {trailing !== undefined && (
        <span aria-hidden="true" className="tabular-nums">
          {trailing}
        </span>
      )}
    </h3>
  );
}
