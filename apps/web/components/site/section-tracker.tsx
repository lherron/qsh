"use client";

import { useEffect } from "react";

/**
 * Marks the path eyebrow of the section the reader is in (DESIGN.md § 4).
 * Sections stay server components; this is the only client code involved.
 */
export function SectionTracker() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-path]"),
    );
    if (sections.length === 0) return;

    const eyebrows =
      document.querySelectorAll<HTMLElement>("[data-path-for]");
    const visible = new Set<Element>();

    const paint = () => {
      const current = sections.find((section) => visible.has(section));
      eyebrows.forEach((eyebrow) => {
        eyebrow.dataset.active = String(
          current?.dataset.sectionPath === eyebrow.dataset.pathFor,
        );
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        paint();
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return null;
}
