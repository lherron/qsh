/**
 * First focusable element on every page (DESIGN.md § 9). Off-screen until it
 * takes focus, then it sits over the sticky nav so a keyboard reader can jump
 * past the nav into `main`.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-sm focus:border focus:border-rule-strong focus:bg-ink-2 focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-paper"
    >
      Skip to content
    </a>
  );
}
