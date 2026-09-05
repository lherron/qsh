import { cn } from "@/lib/utils";

/**
 * The nine task states (`wrkq touch --state`, verified in
 * content/help/wrkq-touch.txt). The common path is one joined strip; the four
 * side and terminal states sit beneath it, quieter. Only `in_progress`,
 * `completed` and `blocked` take color, and only ever to mean that state.
 */

type State = { name: string; tone?: "signal" | "done" | "blocked" };

const COMMON_PATH: State[] = [
  { name: "idea" },
  { name: "draft" },
  { name: "open" },
  { name: "in_progress", tone: "signal" },
  { name: "completed", tone: "done" },
];

const SIDE_STATES: State[] = [
  { name: "blocked", tone: "blocked" },
  { name: "cancelled" },
  { name: "archived" },
  { name: "deleted" },
];

const TONE = {
  signal: "text-signal",
  done: "text-done",
  blocked: "text-blocked",
} as const;

function Strip({ states, rest }: { states: State[]; rest: string }) {
  return (
    <div className="-mx-(--page-gutter) overflow-x-auto px-(--page-gutter) lg:mx-0 lg:px-0">
      <ul className="flex w-max rounded-sm border border-rule">
        {states.map(({ name, tone }) => (
          <li
            key={name}
            className={cn(
              "px-2 py-1.5 font-mono text-2xs whitespace-nowrap border-l border-rule first:border-l-0 sm:px-3 sm:text-xs",
              tone ? TONE[tone] : rest,
            )}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatesStrip() {
  return (
    <div className="mt-6">
      <Strip states={COMMON_PATH} rest="text-paper" />
      <div className="mt-2">
        <Strip states={SIDE_STATES} rest="text-paper-faint" />
      </div>
      <div className="mt-4">
        <p className="max-w-[62ch] text-sm text-paper-muted">
          Any valid state is accepted; the common path is a convention, not a
          gate.
        </p>
      </div>
    </div>
  );
}
