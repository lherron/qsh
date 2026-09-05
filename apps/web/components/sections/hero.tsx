import { LedgerReplay } from "@/components/ledger/replay";
import { InstallTabs } from "@/components/site/install-tabs";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="hero-grid" aria-hidden="true" />
      <div className="mx-auto max-w-(--container-page) px-(--page-gutter) pt-[calc(var(--nav-h)+var(--anchor-gap)*2.5)] pb-(--section-pad) lg:pt-28">
        <p className="font-mono text-xs text-paper-faint">
          local-first · sqlite · mit
        </p>

        {/* The wordmark device: the reader sees wrkq fall out of the words. */}
        <h1
          id="hero-title"
          className="wq-device mt-8 text-hero leading-[0.92] tracking-[-0.04em] [font-variation-settings:'wdth'_87,'opsz'_96]"
        >
          <span className="block">
            <b>W</b>o<b>rk</b> <b>q</b>ueues
          </span>
          <span className="block">for humans and agents.</span>
        </h1>

        <div className="mt-14 grid grid-cols-1 items-start gap-12 lg:mt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <p className="max-w-[46ch] text-paper-muted">
              wrkq is a task ledger that lives next to your code. Unix verbs, one
              SQLite file, JSON on every command, and a principal on every write.
              Humans and agents work the same queue.
            </p>

            <div className="mt-10">
              <InstallTabs size="hero" />
            </div>

            <p className="mt-6">
              <a
                href="#agents"
                className="font-mono text-xs text-paper-muted transition-colors duration-[120ms] hover:text-signal"
              >
                or read what wrkq info tells your agent{" "}
                <span aria-hidden="true">→</span>
              </a>
            </p>
          </div>

          {/* The ledger replay (DESIGN.md § 5). */}
          <aside aria-label="Ledger replay">
            <LedgerReplay />
          </aside>
        </div>
      </div>
    </section>
  );
}
