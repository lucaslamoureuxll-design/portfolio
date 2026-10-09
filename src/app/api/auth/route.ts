import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Étape 1 de l'authentification Decap CMS ↔ GitHub (OAuth).
 * Decap ouvre une popup sur /api/auth ; on redirige vers la page d'autorisation GitHub.
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("GITHUB_OAUTH_CLIENT_ID n'est pas configuré.", { status: 500 });
  }

  const state = randomBytes(16).toString("hex");
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", new URL("/api/callback", request.nextUrl.origin).toString());
  authorizeUrl.searchParams.set("scope", request.nextUrl.searchParams.get("scope") || "repo");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set("decap_oauth_state", state, {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/api/callback",
    maxAge: 600,
  });
  return response;
}
