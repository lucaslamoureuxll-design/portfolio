import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Icône de l'onglet : initiales « LL » sur fond dégradé (remplace le logo Next.js). */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: "linear-gradient(135deg, #4338ca 0%, #a21caf 100%)",
          color: "white",
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        LL
      </div>
    ),
    size,
  );
}
