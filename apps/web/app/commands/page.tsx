import type { Metadata } from "next";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";
import { SectionTracker } from "@/components/site/section-tracker";
import { Terminal } from "@/components/site/terminal";
import { aliasAnchors, loadGlobalFlags, loadReference } from "@/lib/help";
import { getVersion } from "@/lib/site";
import { CommandEntry } from "./command-entry";
import { CommandIndex } from "./command-index";

export const metadata: Metadata = {
  title: "Command reference — wrkq",
  description:
    "Every wrkq command, its usage line and its flags, generated from the CLI's own help output.",
};

function flagLabel(short: string | undefined, long: string, type?: string) {
  return `${short ? `-${short}, ` : "    "}--${long}${type ? ` ${type}` : ""}`;
}

export default function CommandsPage() {
  const groups = loadReference();
  const globalFlags = loadGlobalFlags();
  const aliases = Object.fromEntries(aliasAnchors());
  const version = getVersion();

  const labelWidth = Math.max(
    ...globalFlags.map((flag) => flagLabel(flag.short, flag.long, flag.type).length),
  );

  return (
    <>
      <Nav />
      <main>
        <div className="mx-auto grid max-w-(--container-page) grid-cols-1 px-(--page-gutter) lg:grid-cols-[var(--tree-gutter)_minmax(0,1fr)]">
          <div className="pt-12 pb-8 lg:border-r lg:border-rule lg:pt-20 lg:pb-32">
            {/* Only labels and anchors cross to the client, not the commands. */}
            <CommandIndex
              groups={groups.map(({ name, entries }) => ({ name, entries }))}
            />
          </div>

          <div className="pb-(--section-pad) lg:pt-20 lg:pl-(--tree-gap)">
            <header>
              <h1 className="font-display text-3xl leading-[1.05] font-semibold tracking-[-0.02em] text-paper [font-variation-settings:'wdth'_92] sm:text-4xl">
                Command reference
              </h1>
              <p className="mt-6 max-w-[62ch] text-paper-muted">
                Every wrkq command with its usage line and flags, generated at
                build time from the CLI&rsquo;s own{" "}
                <code className="text-paper">--help</code> output. Nothing here
                is written by hand, so it cannot drift from the binary you
                installed.
              </p>
              <p className="mt-3 font-mono text-xs text-paper-faint">
                generated from {version.full}
              </p>
            </header>

            <section
              aria-labelledby="global-flags-title"
              id="global-flags"
              className="mt-16 scroll-mt-28"
            >
              <h2
                id="global-flags-title"
                className="font-mono text-xl font-medium text-paper"
              >
                global flags
              </h2>
              <p className="mt-5 max-w-[62ch] text-paper-muted">
                Accepted by every command below, so they are listed once here
                and never repeated. Each command also takes{" "}
                <code className="text-paper">-h, --help</code>.
              </p>
              <Terminal
                className="mt-6"
                lines={globalFlags.map((flag) => ({
                  text: `${flagLabel(flag.short, flag.long, flag.type).padEnd(labelWidth + 3)}${flag.description}`,
                  tone: "muted",
                }))}
              />
            </section>

            {groups.map((group) => (
              <div
                key={group.name}
                id={`group-${group.name}`}
                data-section-path={group.name}
                className="mt-20 scroll-mt-28"
              >
                <p className="flex items-center gap-4 font-mono text-xs text-paper-faint">
                  <span>
                    <span aria-hidden="true">/ </span>
                    {group.name}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-rule" />
                  <span>{group.entries.length}</span>
                </p>

                <div className="mt-8 flex flex-col gap-12">
                  {group.commands.map((command) => (
                    <CommandEntry
                      key={command.slug}
                      command={command}
                      aliasAnchors={aliases}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <SectionTracker />
    </>
  );
}
