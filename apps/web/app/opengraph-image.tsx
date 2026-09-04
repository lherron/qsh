import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "wrkq — work queues for humans and coding agents.";

const INK = "#11100e";
const PAPER = "#e7e2d8";
const PAPER_MUTED = "#a39d91";
const PAPER_FAINT = "#6e695f";
const GRID = "rgba(231,226,216,0.07)";

/** The hero grid at its own cell size (DESIGN.md § 6). */
const CELL = 88;

const LINE_ONE = "Work queues";
const LINE_TWO = "for humans and coding agents.";
const MARK = "wrkq.sh";

/**
 * Satori cannot read woff2, so the fonts come from the Google Fonts CSS API,
 * which serves truetype to a plain `fetch`. Subset to the characters actually
 * drawn. Returns null if the network is unavailable at build time; the image
 * then falls back to the platform faces rather than failing the build.
 */
async function googleFont(
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer | null> {
  try {
    const query = `family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?${query}`)
    ).text();
    const url = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(css)?.[1];
    if (!url) return null;
    const response = await fetch(url);
    return response.ok ? await response.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** `W`o`rk` `q`ueues — the wordmark device of DESIGN.md § 6, first of its two
 *  appearances on the site. */
const WORDMARK: { text: string; heavy: boolean }[] = [
  { text: "W", heavy: true },
  { text: "o", heavy: false },
  { text: "rk", heavy: true },
  { text: " ", heavy: false },
  { text: "q", heavy: true },
  { text: "ueues", heavy: false },
];

export default async function OpengraphImage() {
  const displayText = LINE_ONE + LINE_TWO;
  const [light, heavy, mono] = await Promise.all([
    googleFont("Bricolage Grotesque", 400, displayText),
    googleFont("Bricolage Grotesque", 700, LINE_ONE),
    googleFont("JetBrains Mono", 400, MARK),
  ]);

  const fonts = [
    light && { name: "Bricolage Grotesque", data: light, weight: 400 as const },
    heavy && { name: "Bricolage Grotesque", data: heavy, weight: 700 as const },
    mono && { name: "JetBrains Mono", data: mono, weight: 400 as const },
  ].filter((font) => font !== null && font !== undefined);

  const columns = Math.ceil(size.width / CELL);
  const rows = Math.ceil(size.height / CELL);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: INK,
          padding: 88,
          fontFamily: "Bricolage Grotesque",
        }}
      >
        {Array.from({ length: columns }, (_, index) => (
          <div
            key={`c${index}`}
            style={{
              position: "absolute",
              top: 0,
              left: index * CELL,
              width: 1,
              height: size.height,
              background: GRID,
            }}
          />
        ))}
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={`r${index}`}
            style={{
              position: "absolute",
              left: 0,
              top: index * CELL,
              width: size.width,
              height: 1,
              background: GRID,
            }}
          />
        ))}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 72,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
          }}
        >
          <div style={{ display: "flex", color: PAPER_MUTED, fontWeight: 400 }}>
            {WORDMARK.map((part) => (
              <div
                key={part.text}
                style={{
                  color: part.heavy ? PAPER : PAPER_MUTED,
                  fontWeight: part.heavy ? 700 : 400,
                  whiteSpace: "pre",
                }}
              >
                {part.text}
              </div>
            ))}
          </div>
          <div style={{ color: PAPER_MUTED, fontWeight: 400, marginTop: 6 }}>
            {LINE_TWO}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 88,
            bottom: 76,
            fontFamily: "JetBrains Mono",
            fontSize: 26,
            letterSpacing: "-0.01em",
            color: PAPER_FAINT,
          }}
        >
          {MARK}
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
