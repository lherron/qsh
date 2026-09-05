import { cn } from "@/lib/utils";
import { COMMENT, TASK, type CardState, type ReplayStep } from "./script";

/**
 * The `wrkq cat T-00042 --pretty` view (DESIGN.md § 5).
 *
 * Every element the replay ever shows is in the DOM on every step; the parts
 * that have not happened yet are hidden with `visibility` so they still hold
 * their space. That is what keeps the hero from moving during the loop.
 */

const DOT: Record<CardState, string> = {
  open: "text-paper-muted",
  in_progress: "text-signal",
  completed: "text-done",
};

/** Meta values align under the title, as the CLI aligns them: len("T-00042") + 3. */
const META_INDENT = "pl-[10ch]";

function Sep() {
  return <span className="text-paper-faint"> · </span>;
}

function Rule() {
  return <div className="my-3 border-t border-rule" aria-hidden="true" />;
}

export function LedgerCard({
  step,
  className,
}: {
  step: ReplayStep;
  className?: string;
}) {
  return (
    <div className={cn("terminal-body", className)}>
      <p className="break-words">
        <span className="text-paper-faint">{TASK.id}</span>
        <span> </span>
        <span className={cn("transition-colors duration-200", DOT[step.state])}>●</span>
        <span> </span>
        <span className="text-paper">{TASK.title}</span>
      </p>

      <p className={cn(META_INDENT, "break-words")}>
        <span className={cn("transition-colors duration-200", DOT[step.state])}>
          {step.state}
        </span>
        <Sep />
        <span className="text-paper-muted">{TASK.priority}</span>
        <Sep />
        <span className="text-paper-muted">{TASK.kind}</span>
        <Sep />
        <span className="text-paper-muted">{TASK.labels}</span>
      </p>

      {/* Step 2. Held in flow from the first paint so the card never grows. */}
      <p
        className={cn(META_INDENT, "break-words text-paper-faint")}
        style={{ visibility: step.claim ? "visible" : "hidden" }}
      >
        {step.claim ?? "claimed by agent:cody · gen 1"}
      </p>

      <Rule />

      <p className="text-paper-muted">§ Description</p>
      <Rule />
      <p className="pl-4 text-paper-muted">{TASK.description}</p>

      {/* Step 3. */}
      <div
        style={{ visibility: step.comment ? "visible" : "hidden" }}
        aria-hidden={step.comment ? undefined : "true"}
      >
        <div className="mt-5">
          <p className="text-paper-muted">Comments (1)</p>
          <Rule />
          <div className="grid grid-cols-[1ch_1fr] gap-x-3">
            <span className="text-paper-faint select-none">▏</span>
            <p className="text-paper-faint break-words">
              {COMMENT.id}
              <Sep />
              {COMMENT.actor}
            </p>
            <span className="text-paper-faint select-none">▏</span>
            <p className="text-paper-muted break-words">{COMMENT.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
