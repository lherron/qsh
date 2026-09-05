import { BlockLabel } from "@/components/sections/parts/block-label";
import type { CommandGroup } from "@/lib/commands";

/**
 * The command index (DESIGN.md § 6 / commands): group labels are row headers
 * that span the grid, members flow into two columns at >= 1024px. Rows are
 * links into the `/commands` reference. The `●` is the only thing that takes
 * color on hover, matching how wrkq renders state.
 */
export function CommandGrid({ groups }: { groups: CommandGroup[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
      {groups.map(({ group, members }) => (
        <CommandGroupRows key={group} group={group} members={members} />
      ))}
    </div>
  );
}

function CommandGroupRows({ group, members }: CommandGroup) {
  return (
    <>
      <BlockLabel trailing={members.length} className="col-span-full mt-14 first:mt-10">
        {group}
      </BlockLabel>

      {members.map(({ name, description, anchor }) => (
        <a
          key={name}
          href={`/commands#${anchor}`}
          className="group -mx-2 mt-3 grid grid-cols-1 items-baseline gap-x-3 rounded-sm px-2 py-1 transition-colors duration-[120ms] hover:bg-ink-3 focus-visible:bg-ink-3 sm:grid-cols-[9.25rem_1fr]"
        >
          <span className="flex items-baseline gap-2 font-mono text-xs text-paper">
            <span
              aria-hidden="true"
              className="text-rule-strong transition-colors duration-[120ms] group-hover:text-signal group-focus-visible:text-signal"
            >
              ●
            </span>
            {name}
          </span>
          <span className="line-clamp-4 text-sm text-paper-muted">
            {description}
          </span>
        </a>
      ))}
    </>
  );
}
