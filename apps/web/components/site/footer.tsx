import Link from "next/link";
import { DOCS_URL, LICENSE_URL, REPO_URL } from "@/lib/links";
import { getVersion } from "@/lib/site";

const LINKS = [
  { label: "github", href: REPO_URL, external: true },
  { label: "commands", href: "/commands", external: false },
  { label: "docs", href: DOCS_URL, external: true },
  { label: "MIT license", href: LICENSE_URL, external: true },
];

export function Footer() {
  const version = getVersion();

  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-(--container-page) px-(--page-gutter) py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-baseline md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-display text-lg leading-none font-semibold tracking-[-0.03em] text-paper">
              wrkq
            </span>
            {/* The wordmark device, second and last appearance (DESIGN.md § 6). */}
            <p className="wq-device text-base leading-snug">
              <b>W</b>o<b>rk</b> <b>q</b>ueues, vowels removed.
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs">
            {LINKS.map((link) => (
              <li key={link.label}>
                {link.external ? (
                  <a
                    href={link.href}
                    className="text-paper-muted transition-colors duration-[120ms] hover:text-signal"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-paper-muted transition-colors duration-[120ms] hover:text-signal"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-rule pt-6 font-mono text-2xs text-paper-faint sm:flex-row sm:justify-between">
          <span>built by Lance Herron</span>
          <span>{version.full}</span>
        </div>
      </div>
    </footer>
  );
}
