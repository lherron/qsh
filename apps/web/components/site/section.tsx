import type { ReactNode } from "react";

/**
 * The tree gutter (DESIGN.md § 4). At >= 1024px the section is a two-column
 * grid: a 200px gutter holding a sticky path eyebrow and the trunk rule, then
 * the content column. Below that the gutter collapses and the rule disappears.
 * The gutter's border-right is drawn on the full-height cell of every section,
 * so consecutive sections join into one continuous trunk.
 */
export function Section({
  path,
  title,
  id,
  children,
}: {
  path: string;
  title: string;
  id?: string;
  children?: ReactNode;
}) {
  const anchor = id ?? path;
  const headingId = `${anchor}-title`;

  return (
    <section
      id={anchor}
      aria-labelledby={headingId}
      data-section-path={path}
      className="scroll-mt-[calc(var(--anchor-gap)-var(--section-pad))]"
    >
      <div className="mx-auto grid max-w-(--container-page) grid-cols-1 px-(--page-gutter) lg:grid-cols-[var(--tree-gutter)_1fr]">
        <div className="pt-(--section-pad) pb-4 lg:border-r lg:border-rule lg:pb-(--section-pad)">
          {/* 12px is the measured gap between the mono eyebrow's baseline and
              the 36px display heading's baseline when both start at the
              section's top padding; adding it here puts them on one line. */}
          <p className="lg:sticky lg:top-24 lg:pt-3">
            <span
              data-path-for={path}
              className="font-mono text-xs text-paper-faint transition-colors duration-[120ms] data-[active=true]:text-signal"
            >
              <span aria-hidden="true">/ </span>
              {path}
            </span>
          </p>
        </div>

        <div className="pb-(--section-pad) lg:pt-(--section-pad) lg:pl-(--tree-gap)">
          <h2
            id={headingId}
            className="font-display text-2xl leading-[1.05] font-semibold tracking-[-0.02em] text-paper [font-variation-settings:'wdth'_92] sm:text-3xl"
          >
            {title}
          </h2>
          {children}
        </div>
      </div>
    </section>
  );
}
