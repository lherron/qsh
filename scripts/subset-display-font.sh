#!/usr/bin/env bash
# Regenerate apps/web/app/fonts/bricolage-grotesque-latin.woff2.
#
# Bricolage Grotesque is the display face (DESIGN.md § 3) and the only font the
# site loads outside next/font/google. Google's own latin instance carries 268
# glyphs of three-axis variable outlines — 131 KB — to set eleven words of
# display type, and it was the single reason the landing page could not reach
# the § 9 Lighthouse floor of 95. This cuts it to printable latin plus the
# typographic marks the copy uses: 77 KB, 111 glyphs, all three axes
# (opsz 12–96, wght 200–800, wdth 75–100) and kerning intact. The H1 renders
# byte for byte identically — verified by screenshot diff on T-08041.
#
# Needs fontTools and brotli, which are not repo dependencies; this is a
# one-off run whose output is committed:
#
#   python3 -m venv /tmp/fv && /tmp/fv/bin/pip install fonttools brotli
#   PYTHON=/tmp/fv/bin/python scripts/subset-display-font.sh
#
# Bricolage Grotesque is SIL Open Font License 1.1; see the OFL.txt beside the
# woff2, which the licence requires to travel with the file.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/apps/web/app/fonts/bricolage-grotesque-latin.woff2"
PYTHON="${PYTHON:-python3}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# The exact request next/font/google made for `axes: ["opsz", "wdth"]`.
CSS_URL='https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&display=swap'
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'

curl -fsSL -H "User-Agent: $UA" "$CSS_URL" -o "$WORK/font.css"

# The `latin` block is the one whose unicode-range opens at U+0000-00FF.
FONT_URL="$("$PYTHON" - "$WORK/font.css" <<'PY'
import re, sys
css = open(sys.argv[1]).read()
for block in css.split("@font-face"):
    if "U+0000-00FF" in block:
        print(re.search(r"url\((https://[^)]+)\)", block).group(1))
        break
PY
)"
curl -fsSL "$FONT_URL" -o "$WORK/latin.woff2"

# Printable ASCII covers every heading, wordmark and the footer tagline with
# room for new copy; the rest are the marks the site's prose already uses.
"$PYTHON" -m fontTools.subset "$WORK/latin.woff2" \
  --output-file="$OUT" \
  --flavor=woff2 \
  --unicodes="U+0020-007E,U+00A0,U+2018-2019,U+201C-201D,U+2013-2014,U+2026,U+00B7" \
  --layout-features="kern,liga,calt,ccmp,locl,mark,mkmk,rlig" \
  --no-hinting

printf 'wrote %s (%s bytes, from %s bytes)\n' \
  "${OUT#"$ROOT"/}" "$(wc -c <"$OUT" | tr -d ' ')" "$(wc -c <"$WORK/latin.woff2" | tr -d ' ')"
