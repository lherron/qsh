import { Fragment, type ReactNode } from "react";
import { BlockLabel } from "@/components/sections/parts/block-label";
import { Mono } from "@/components/sections/parts/mono";
import { StatesStrip } from "@/components/sections/parts/states-strip";
import { Section } from "@/components/site/section";

/** DESIGN.md § 6 / model. IDs and kinds verified against content/help. */
const ENTITIES: Array<{ term: string; id?: string; body: ReactNode }> = [
  {
    term: "Container",
    id: "P-00007",
    body: "A project, directory, feature or area. Hierarchical.",
  },
  {
    term: "Task",
    id: "T-00123",
    body: (
      <>
        Kinds <Mono>task</Mono>, <Mono>subtask</Mono>, <Mono>spike</Mono>,{" "}
        <Mono>bug</Mono>, <Mono>chore</Mono>. Priority 1&ndash;4.
      </>
    ),
  },
  { term: "Comment", id: "C-00091", body: "Append-only." },
  {
    term: "Attachment",
    body: "Bytes on disk under the task's UUID, metadata in SQLite.",
  },
  {
    term: "Relation",
    body: (
      <>
        <Mono>blocks</Mono>, <Mono>relates_to</Mono>, <Mono>duplicates</Mono>.
        Open blockers make <Mono>wrkq check blocked</Mono> fail.
      </>
    ),
  },
  {
    term: "Handoff",
    id: "H-00012",
    body: "An agent's note to its next session.",
  },
  { term: "Claim", body: "Single holder, scope, generation, one-time token." },
];

const ADDRESSES = [
  "inbox/retry-on-429",
  "T-00042",
  "7a6ffe78-d331-4cad-9bfc-ae093e3aa071",
];

export function Model() {
  return (
    <Section path="model" title="Small model, stable IDs.">
      <div className="mt-10">
        <BlockLabel>states</BlockLabel>
        <StatesStrip />
      </div>

      <div className="mt-14">
        <BlockLabel trailing={ENTITIES.length}>entities</BlockLabel>
        <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {ENTITIES.map(({ term, id, body }) => (
            <div key={term} className="border-b border-rule py-4">
              <dt className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-paper">{term}</span>
                {id && (
                  <span className="font-mono text-2xs text-paper-faint">
                    {id}
                  </span>
                )}
              </dt>
              <dd className="pt-1 text-sm text-paper-muted">{body}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-14">
        <BlockLabel>addressing</BlockLabel>
        <div className="mt-6">
          <p className="max-w-[62ch] text-paper-muted">
            Path, friendly ID or UUID. All three work everywhere.
          </p>
        </div>
        <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
          {ADDRESSES.map((address, index) => (
            <Fragment key={address}>
              {index > 0 && (
                <li aria-hidden="true" className="hidden text-paper-faint sm:block">
                  &middot;
                </li>
              )}
              <li className="font-mono text-xs break-all text-paper">
                {address}
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </Section>
  );
}
