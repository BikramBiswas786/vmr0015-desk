import { list, put, get } from "@vercel/blob";
import { createFileRoute } from "@tanstack/react-router";
import { parseVisit, type Visit } from "@/lib/desk/field";

function allowed(code: unknown): boolean {
  const expected = process.env.CREW_CODE?.trim();
  return Boolean(expected) && typeof code === "string" && code.trim() === expected;
}

async function readHouse(pathname: string): Promise<Visit | null> {
  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  const text = await new Response(result.stream).text();
  try {
    return parseVisit(JSON.parse(text));
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/crew")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.CREW_CODE) {
          return Response.json({ ok: false, houses: [], message: "The shared list is not turned on for this server." }, { status: 503 });
        }
        const code = new URL(request.url).searchParams.get("code");
        if (!allowed(code)) return Response.json({ ok: false, houses: [] }, { status: 401 });
        const found = await list({ prefix: "houses/", limit: 1000 });
        const houses = (await Promise.all(found.blobs.map((blob) => readHouse(blob.pathname)))).flatMap((visit) => (visit ? [visit] : []));
        houses.sort((a, b) => b.takenAt.localeCompare(a.takenAt));
        return Response.json({ ok: true, houses });
      },
      POST: async ({ request }) => {
        if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.CREW_CODE) {
          return Response.json({ ok: false, message: "The shared list is not turned on for this server." }, { status: 503 });
        }
        let body: { code?: unknown; visit?: unknown };
        try {
          body = (await request.json()) as { code?: unknown; visit?: unknown };
        } catch {
          return Response.json({ ok: false, message: "The house was not readable." }, { status: 400 });
        }
        if (!allowed(body.code)) return Response.json({ ok: false, message: "The crew code is wrong." }, { status: 401 });
        const visit = parseVisit(body.visit);
        if (!visit || !visit.photo) return Response.json({ ok: false, message: "The house is missing a photo or a name." }, { status: 400 });
        await put(`houses/${visit.id}.json`, JSON.stringify(visit), {
          access: "private",
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: "application/json",
        });
        return Response.json({ ok: true });
      },
      PATCH: async ({ request }) => {
        if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.CREW_CODE) {
          return Response.json({ ok: false, message: "The shared list is not turned on for this server." }, { status: 503 });
        }
        let body: { code?: unknown; id?: unknown; status?: unknown };
        try {
          body = (await request.json()) as { code?: unknown; id?: unknown; status?: unknown };
        } catch {
          return Response.json({ ok: false }, { status: 400 });
        }
        if (!allowed(body.code)) return Response.json({ ok: false, message: "The crew code is wrong." }, { status: 401 });
        if (typeof body.id !== "string" || (body.status !== "accepted" && body.status !== "returned" && body.status !== "in")) {
          return Response.json({ ok: false }, { status: 400 });
        }
        const current = await readHouse(`houses/${body.id}.json`);
        if (!current) return Response.json({ ok: false, message: "That house is not on the shared list." }, { status: 404 });
        const next = { ...current, status: body.status };
        await put(`houses/${next.id}.json`, JSON.stringify(next), {
          access: "private",
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: "application/json",
        });
        return Response.json({ ok: true });
      },
    },
  },
});
