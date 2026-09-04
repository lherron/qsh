import { Section } from "@/components/site/section";

export function Model() {
  return (
    <Section path="model" title="Small model, stable IDs.">
      <p className="mt-6 max-w-[62ch] text-paper-muted">
        Path, friendly ID or UUID. All three work everywhere.
      </p>
    </Section>
  );
}
