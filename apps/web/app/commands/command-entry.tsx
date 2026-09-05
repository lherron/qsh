import { Terminal } from "@/components/site/terminal";
import type { HelpCommand, HelpFlag, SummaryBlock } from "@/lib/help";

/** Extra ids a section must answer to — `#info` lands on `wrkq usage`. */
export type AliasAnchors = Record<string, string[] | undefined>;

function Summary({ blocks }: { blocks: SummaryBlock[] }) {
  return (
    <>
      {blocks.map((block, index) =>
        block.kind === "text" ? (
          <p key={index} className="mt-5 max-w-[62ch] text-paper-muted">
            {block.content}
          </p>
        ) : (
          <Terminal key={index} className="mt-5">
            <pre className="m-0 whitespace-pre text-paper-muted">
              {block.content}
            </pre>
          </Terminal>
        ),
      )}
    </>
  );
}

function FlagTable({ flags, command }: { flags: HelpFlag[]; command: string }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Flags for {command}</caption>
        <thead>
          <tr className="border-b border-rule-strong">
            <th
              scope="col"
              className="py-2 pr-6 font-mono text-2xs font-normal text-paper-faint md:w-60"
            >
              flag
            </th>
            <th
              scope="col"
              className="hidden py-2 pr-6 font-mono text-2xs font-normal text-paper-faint md:table-cell md:w-24"
            >
              type
            </th>
            <th
              scope="col"
              className="py-2 font-mono text-2xs font-normal text-paper-faint"
            >
              description
            </th>
          </tr>
        </thead>
        <tbody>
          {flags.map((flag) => (
            <tr
              key={flag.long}
              className="border-b border-rule transition-colors duration-[120ms] hover:bg-ink-3"
            >
              <th
                scope="row"
                className="py-2 pr-6 align-top font-mono text-xs font-normal whitespace-nowrap text-paper"
              >
                {flag.short && (
                  <span className="text-paper-faint">-{flag.short}, </span>
                )}
                --{flag.long}
                {/* Below md the type column is folded into the flag, the way
                    the CLI itself prints it. */}
                {flag.type && (
                  <span className="text-paper-faint md:hidden"> {flag.type}</span>
                )}
              </th>
              <td className="hidden py-2 pr-6 align-top font-mono text-xs whitespace-nowrap text-paper-faint md:table-cell">
                {flag.type}
              </td>
              <td className="py-2 align-top text-sm text-paper-muted">
                {flag.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Body({ command }: { command: HelpCommand }) {
  return (
    <>
      <Summary blocks={command.summaryBlocks} />

      <Terminal
        className="mt-6"
        lines={command.usage
          .split("\n")
          .map((line) => ({ prompt: true, text: line }))}
      />

      {command.flags.length > 0 && (
        <FlagTable flags={command.flags} command={command.command} />
      )}

      {command.examples.length > 0 && (
        <Terminal
          className="mt-6"
          title="examples"
          lines={command.examples.map((line) => ({ prompt: true, text: line }))}
        />
      )}
    </>
  );
}

/**
 * One command as a section (DESIGN.md § 7): the name as a mono `h2`, its
 * description, usage, flags table, examples, then its subcommands one level
 * down as `h3`s with `id="<name>-<sub>"`.
 */
export function CommandEntry({
  command,
  aliasAnchors,
}: {
  command: HelpCommand;
  aliasAnchors: AliasAnchors;
}) {
  const headingId = `${command.slug}-title`;

  return (
    <section
      id={command.slug}
      aria-labelledby={headingId}
      className="scroll-mt-(--anchor-gap) border-t border-rule pt-10 pb-2 first:border-t-0 first:pt-0"
    >
      {/* An alias with no help file of its own still needs its anchor. */}
      {aliasAnchors[command.name]?.map((alias) => (
        <span key={alias} id={alias} className="block scroll-mt-(--anchor-gap)" />
      ))}

      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
        <h2
          id={headingId}
          className="font-mono text-xl font-medium text-paper"
        >
          <span className="text-paper-faint">wrkq </span>
          {command.name}
        </h2>
        {command.aliases.length > 0 && (
          <p className="font-mono text-2xs text-paper-faint">
            alias{command.aliases.length > 1 ? "es" : ""}{" "}
            <span className="text-paper-muted">
              {command.aliases.join(", ")}
            </span>
          </p>
        )}
      </div>

      <Body command={command} />

      {command.subcommands.length > 0 && (
        <div className="mt-10 flex flex-col gap-10 border-l border-rule pl-5 sm:pl-8">
          {command.subcommands.map((sub) => (
            <section
              key={sub.slug}
              id={sub.slug}
              aria-labelledby={`${sub.slug}-title`}
              className="scroll-mt-(--anchor-gap)"
            >
              <h3
                id={`${sub.slug}-title`}
                className="font-mono text-base font-medium text-paper"
              >
                <span className="text-paper-faint">
                  wrkq {sub.parents.join(" ")}{" "}
                </span>
                {sub.name}
              </h3>
              <Body command={sub} />
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
