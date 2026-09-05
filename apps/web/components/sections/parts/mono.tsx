import type { ReactNode } from "react";

/** Inline code in prose: mono at 14px, per DESIGN.md § 3. */
export function Mono({ children }: { children: ReactNode }) {
  return <code className="text-sm text-paper">{children}</code>;
}
