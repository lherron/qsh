import { Section } from "@/components/site/section";

export function Agents() {
  return (
    <Section path="agents" title="Built to be read by something that isn't you.">
      <p className="mt-6 max-w-[62ch] text-paper-muted">
        Agents don&rsquo;t browse. They run a command, parse the result and run the
        next one. wrkq was designed from that side of the screen.
      </p>
    </Section>
  );
}
