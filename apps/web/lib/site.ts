import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { REPO } from "./links";

export type Version = {
  /** Release tag with the commit-distance suffix stripped: `v0.1.0`. */
  short: string;
  /** Exactly what `wrkq version` reports: `v0.1.0-272-g7854f29`. */
  full: string;
};

const FALLBACK_VERSION: Version = { short: "v0.1.0", full: "v0.1.0" };

/** Walk up from the working directory to the repo root holding `content/help`. */
function helpDir(): string | null {
  let dir = process.cwd();
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, "content", "help");
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

export function getVersion(): Version {
  const dir = helpDir();
  if (!dir) return FALLBACK_VERSION;
  const file = path.join(dir, "version.txt");
  if (!existsSync(file)) return FALLBACK_VERSION;

  const raw = readFileSync(file, "utf8").trim();
  let full: string | undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "version" in parsed) {
      const value = (parsed as { version?: unknown }).version;
      if (typeof value === "string") full = value;
    }
  } catch {
    full = raw.split("\n")[0]?.trim();
  }
  if (!full) return FALLBACK_VERSION;

  // Strip the `-<commits>-g<hash>` describe suffix: v0.1.0-272-g7854f29 -> v0.1.0
  const short = full.replace(/-\d+-g[0-9a-f]+$/i, "");
  return { short, full };
}

/**
 * Star count for the repo, fetched at build time. Returns null on any failure
 * so the nav can render the link without a count (DESIGN.md § 6 Nav).
 */
export async function getStarCount(): Promise<number | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    const count = (data as { stargazers_count?: unknown }).stargazers_count;
    return typeof count === "number" ? count : null;
  } catch {
    return null;
  }
}
