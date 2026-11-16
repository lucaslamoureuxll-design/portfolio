import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Gabarit commun des images de partage (LinkedIn, X, messageries…). */
export function renderOgImage({ eyebrow, title, subtitle, footer }: { eyebrow: string; title: string; subtitle: string; footer: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 15% 10%, rgba(129,140,248,0.45), transparent 45%), radial-gradient(circle at 90% 95%, rgba(236,72,153,0.30), transparent 45%)",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#a5b4fc" }}>{eyebrow}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 32, color: "#a3a3a3", lineHeight: 1.35 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#d4d4d4" }}>{footer}</div>
      </div>
    ),
    ogSize,
  );
}
