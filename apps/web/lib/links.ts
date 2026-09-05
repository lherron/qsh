export const REPO = "lherron/wrkq";
export const REPO_URL = `https://github.com/${REPO}`;
export const DOCS_URL = `${REPO_URL}#readme`;
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;

/**
 * Below this the nav renders no count at all (DESIGN.md § 6 Nav): a `0` next
 * to the github link says nothing useful about the project.
 */
export const STAR_FLOOR = 10;

export function formatStars(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
}
