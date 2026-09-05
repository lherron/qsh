import { ImageResponse } from "next/og";

// The favicon motif at touch-icon size: the `--ink` square with a `--signal`
// block cursor centred in it (DESIGN.md § 3).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#11100e",
        }}
      >
        <div style={{ width: 56, height: 102, background: "#ffcb45" }} />
      </div>
    ),
    size,
  );
}
