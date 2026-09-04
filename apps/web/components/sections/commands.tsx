import { Section } from "@/components/site/section";

export function Commands() {
  return (
    <Section path="commands" title="The whole surface.">
      <p className="mt-6 max-w-[62ch] text-paper-muted">
        Forty-odd verbs, grouped by what you&rsquo;re doing. Every one has{" "}
        <code className="text-paper">--help</code> and{" "}
        <code className="text-paper">--json</code>.
      </p>
    </Section>
  );
}
