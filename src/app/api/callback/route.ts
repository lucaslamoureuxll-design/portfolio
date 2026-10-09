import { NextResponse, type NextRequest } from "next/server";

/**
 * Étape 2 : GitHub redirige ici avec un code, échangé contre un jeton d'accès.
 * Le jeton est transmis à la fenêtre Decap CMS (même origine uniquement) via postMessage.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get("decap_oauth_state")?.value;

  if (!code || !state || state !== expectedState) {
    return renderResult("error", { message: "Requête d'authentification invalide." });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      code,
    }),
  });
  const data = (await tokenResponse.json()) as { access_token?: string; error_description?: string };

  if (!data.access_token) {
    return renderResult("error", { message: data.error_description ?? "Échec de l'authentification GitHub." });
  }
  return renderResult("success", { token: data.access_token, provider: "github" });
}

function renderResult(status: "success" | "error", content: Record<string, string>) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const html = `<!doctype html><html><body><script>
(function () {
  var message = ${JSON.stringify(message).replace(/</g, "\\u003c")};
  function receive(event) {
    if (event.origin !== window.location.origin) return;
    window.opener.postMessage(message, event.origin);
    window.removeEventListener("message", receive);
  }
  window.addEventListener("message", receive);
  window.opener.postMessage("authorizing:github", window.location.origin);
})();
</script></body></html>`;

  const response = new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  response.cookies.delete({ name: "decap_oauth_state", path: "/api/callback" });
  return response;
}
