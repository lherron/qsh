"use client";

import { useEffect, useRef } from "react";
import type { ReferenceEntry } from "@/lib/help";

export type IndexGroup = { name: string; entries: ReferenceEntry[] };

/**
 * The tree gutter's payload on this page (DESIGN.md § 4, § 7): a sticky index
 * of the six groups. At >= 1024px each group lists its members and the group
 * the reader is in turns `--signal`; below that only the group links remain,
 * as a row above the reference.
 *
 * The list is taller than the viewport, so it scrolls in its own box. The one
 * piece of client code here keeps the active group inside that box — it moves
 * `scrollTop` directly rather than calling `scrollIntoView`, which would also
 * move the page.
 */
export function CommandIndex({ groups }: { groups: IndexGroup[] }) {
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const box = nav.current;
    if (!box) return;

    const follow = (eyebrow: HTMLElement) => {
      const item = eyebrow.closest("li");
      if (!item || box.scrollHeight <= box.clientHeight) return;
      const outer = box.getBoundingClientRect();
      const inner = item.getBoundingClientRect();
      if (inner.top < outer.top) box.scrollTop += inner.top - outer.top;
      else if (inner.bottom > outer.bottom)
        box.scrollTop += inner.bottom - outer.bottom;
    };

    const eyebrows = box.querySelectorAll<HTMLElement>("[data-path-for]");
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        const eyebrow = record.target as HTMLElement;
        if (eyebrow.dataset.active === "true") follow(eyebrow);
      }
    });
    eyebrows.forEach((eyebrow) =>
      observer.observe(eyebrow, {
        attributes: true,
        attributeFilter: ["data-active"],
      }),
    );
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      ref={nav}
      aria-label="Command index"
      className="lg:sticky lg:top-24 lg:max-h-[calc(100svh-8rem)] lg:overflow-y-auto lg:pr-4"
    >
      <ul className="flex flex-row flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:gap-y-5">
        {groups.map((group) => (
          <li key={group.name}>
            <a
              href={`#group-${group.name}`}
              data-path-for={group.name}
              className="font-mono text-xs text-paper-faint transition-colors duration-[120ms] hover:text-signal data-[active=true]:text-signal"
            >
              <span aria-hidden="true">/ </span>
              {group.name}
            </a>
            <ul className="mt-1.5 hidden flex-col lg:flex">
              {group.entries.map((entry) => (
                <li key={entry.label}>
                  <a
                    href={`#${entry.anchor}`}
                    className="block py-0.5 font-mono text-2xs text-paper-muted transition-colors duration-[120ms] hover:text-signal"
                  >
                    {entry.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
