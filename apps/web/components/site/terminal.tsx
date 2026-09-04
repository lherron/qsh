import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TerminalTone = "default" | "muted" | "signal" | "done" | "blocked";

export type TerminalLine = {
  /** Render a `$` prompt glyph before the text. */
  prompt?: boolean;
  text: string;
  tone?: TerminalTone;
};

const TONE: Record<TerminalTone, string> = {
  default: "text-paper",
  muted: "text-paper-muted",
  signal: "text-signal",
  done: "text-done",
  blocked: "text-blocked",
};

export function Terminal({
  title,
  lines,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  lines?: TerminalLine[];
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cn("border border-rule bg-ink-2", className)}>
      {title && (
        <div className="border-b border-rule px-4 py-2 font-mono text-2xs text-paper-faint">
          {title}
        </div>
      )}
      <div className={cn("terminal-body overflow-x-auto px-4 py-3", bodyClassName)}>
        {lines && (
          <pre className="m-0">
            <code>
              {lines.map((line, index) => (
                <span key={index} className="block whitespace-pre">
                  {line.prompt && (
                    <span className="text-paper-faint select-none">$ </span>
                  )}
                  <span className={TONE[line.tone ?? "default"]}>{line.text}</span>
                </span>
              ))}
            </code>
          </pre>
        )}
        {children}
      </div>
    </div>
  );
}
