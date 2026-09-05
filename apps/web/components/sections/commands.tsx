import { CommandGrid } from "@/components/sections/parts/command-grid";
import { Section } from "@/components/site/section";
import { getCommandGroups } from "@/lib/commands";

export function Commands() {
  const groups = getCommandGroups();

  return (
    <Section path="commands" title="The whole surface.">
      <div className="mt-6">
        <p className="max-w-[62ch] text-paper-muted">
          Forty-odd verbs, grouped by what you&rsquo;re doing. Every one has{" "}
          <code className="text-sm text-paper">--help</code> and{" "}
          <code className="text-sm text-paper">--json</code>.
        </p>
      </div>

      <CommandGrid groups={groups} />

      <div className="mt-12 border-t border-rule pt-6">
        <a
          href="/commands"
          className="font-mono text-xs text-paper-muted transition-colors duration-[120ms] hover:text-signal"
        >
          Full reference with every flag <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </Section>
  );
}
