import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Icône pour l'écran d'accueil iPhone / iPad. */
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
          background: "linear-gradient(135deg, #4338ca 0%, #a21caf 100%)",
          color: "white",
          fontSize: 92,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        LL
      </div>
    ),
    size,
  );
}
