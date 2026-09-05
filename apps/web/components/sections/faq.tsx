import { FaqItem } from "@/components/sections/parts/faq-item";
import { Mono } from "@/components/sections/parts/mono";
import { Section } from "@/components/site/section";

export function Faq() {
  return (
    <Section path="faq" title="Questions people ask first.">
      <div className="mt-8 border-t border-rule">
        <FaqItem question="Does it need a server?">
          No. <Mono>wrkq</Mono> opens the SQLite file directly.{" "}
          <Mono>wrkqd</Mono> exists for the case where several machines share
          one ledger over HTTP, and <Mono>wrkq server start</Mono> wraps it. You
          will probably never run it.
        </FaqItem>

        <FaqItem question="How do agents know how to use it?">
          They run <Mono>wrkq info</Mono>. It prints the lifecycle rules and a
          command reference. Put it in your startup hook and every session
          begins oriented.
        </FaqItem>

        <FaqItem question="What about concurrency?">
          WAL mode, busy timeouts, and an etag on every row. Pass{" "}
          <Mono>--if-match</Mono> to refuse a write that would clobber someone
          else&rsquo;s. <Mono>claim</Mono> is atomic and single-holder.
        </FaqItem>

        <FaqItem question="Can I version it?">
          The database is local. <Mono>wrkqadm</Mono> exports and imports state
          so a project&rsquo;s tasks can be committed, reviewed and merged like
          code.
        </FaqItem>

        <FaqItem question="Is there an MCP server?">
          Yes, <Mono>mcp-server/</Mono> in the repo exposes selected operations
          over stdio. The CLI is still the primary surface and does more.
        </FaqItem>

        <FaqItem question="License?">MIT.</FaqItem>
      </div>
    </Section>
  );
}
