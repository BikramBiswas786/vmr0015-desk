import { createFileRoute } from "@tanstack/react-router";

function hostAllowed(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(":")) return false;
  if (host === "climission.com" || host === "www.climission.com") return true;
  if (host === "guardianservice.io" || host === "www.guardianservice.io") return true;
  if (host.endsWith(".guardianservice.app")) return true;
  if (host.endsWith(".hedera.com")) return true;
  return false;
}

export const Route = createFileRoute("/api/guardian")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { baseUrl?: unknown; token?: unknown };
        try {
          body = (await request.json()) as { baseUrl?: unknown; token?: unknown };
        } catch {
          return Response.json({ ok: false, message: "The request was not readable." }, { status: 400 });
        }
        if (typeof body.baseUrl !== "string" || typeof body.token !== "string") {
          return Response.json({ ok: false, message: "A Guardian address and a token are both required." }, { status: 400 });
        }
        const token = body.token.trim();
        if (token.length < 8 || token.length > 2000 || /[\r\n]/.test(token)) {
          return Response.json({ ok: false, message: "That token is not usable." }, { status: 400 });
        }
        let url: URL;
        try {
          url = new URL(body.baseUrl.trim());
        } catch {
          return Response.json({ ok: false, message: "That address is not a URL." }, { status: 400 });
        }
        if (url.protocol !== "https:" || !hostAllowed(url.hostname)) {
          return Response.json(
            { ok: false, message: "Only a Hedera Guardian or Managed Guardian Service address is accepted." },
            { status: 400 },
          );
        }
        const target = new URL("/api/v1/policies", url.origin);
        target.searchParams.set("pageIndex", "0");
        target.searchParams.set("pageSize", "5");
        try {
          const response = await fetch(target, {
            method: "GET",
            redirect: "manual",
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            signal: AbortSignal.timeout(8000),
          });
          if (response.status >= 300 && response.status < 400) {
            return Response.json({ ok: false, message: "Guardian tried to redirect. That was refused." });
          }
          if (response.status === 401 || response.status === 403) {
            return Response.json({ ok: false, message: "Guardian answered. The token was refused." });
          }
          if (!response.ok) {
            return Response.json({ ok: false, message: `Guardian answered ${response.status}. No project was posted.` });
          }
          const data: unknown = await response.json();
          const list = Array.isArray(data) ? data : [];
          const names = list
            .map((item) => (item && typeof item === "object" && "name" in item ? String((item as { name: unknown }).name) : ""))
            .filter(Boolean)
            .slice(0, 3);
          return Response.json({
            ok: true,
            message: "Guardian answered. Nothing was posted into it.",
            count: list.length,
            names,
          });
        } catch {
          return Response.json({ ok: false, message: "That Guardian address did not answer." });
        }
      },
    },
  },
});
