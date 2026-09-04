import { InstallTabs } from "@/components/site/install-tabs";
import { Section } from "@/components/site/section";

export function Install() {
  return (
    <Section path="install" title="Install it, then tell your agent.">
      <div className="mt-8">
        <InstallTabs size="section" />
      </div>
      <p className="mt-8 max-w-[62ch] text-paper-muted">
        <code className="text-paper">wrkq info</code> prints the task lifecycle
        rules and the command reference an agent needs. Put it in your harness&rsquo;s
        session-start hook. Nothing else to configure.
      </p>
    </Section>
  );
}
