"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DOCS_URL, REPO_URL, formatStars } from "@/lib/links";

export function NavBar({
  version,
  stars,
}: {
  version: string;
  stars: number | null;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 h-[var(--nav-h)] transition-[background-color,border-color] duration-200",
        scrolled
          ? "border-b border-rule bg-ink-2/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <nav
        aria-label="Site"
        className="mx-auto flex h-full max-w-(--container-page) items-center justify-between gap-4 px-(--page-gutter)"
      >
        <Link href="/" className="shrink-0 text-lg leading-none">
          <span className="font-display font-semibold tracking-[-0.03em] text-paper">
            wrkq
          </span>
          <span className="font-display font-semibold tracking-[-0.03em] text-paper-faint">
            .sh
          </span>
        </Link>

        <div className="flex items-center gap-5 font-mono text-xs sm:gap-6">
          <Link
            href="/commands"
            className="text-paper-muted transition-colors duration-[120ms] hover:text-signal"
          >
            commands
          </Link>
          <a
            href={DOCS_URL}
            className="hidden text-paper-muted transition-colors duration-[120ms] hover:text-signal sm:inline"
          >
            docs
          </a>
          <a
            href={REPO_URL}
            className="text-paper-muted transition-colors duration-[120ms] hover:text-signal"
          >
            github <span aria-hidden="true">↗</span>
            {stars !== null && (
              <span className="ml-2 text-paper-faint">{formatStars(stars)}</span>
            )}
          </a>
          <span className="rounded-sm border border-rule px-2 py-1 leading-none text-paper-faint">
            {version}
          </span>
        </div>
      </nav>
    </header>
  );
}
