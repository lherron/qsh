import { Section } from "@/components/site/section";

export function Faq() {
  return (
    <Section path="faq" title="Questions people ask first.">
      <p className="mt-6 max-w-[62ch] text-paper-muted">
        Does it need a server? No. <code className="text-paper">wrkq</code> opens
        the SQLite file directly. <code className="text-paper">wrkqd</code>{" "}
        exists for the case where several machines share one ledger over HTTP,
        and <code className="text-paper">wrkq server start</code> wraps it. You
        will probably never run it.
      </p>
    </Section>
  );
}
