// Server-side proxy to the InferGrid inference API. Running server-side avoids
// the browser's mixed-content and CORS restrictions when the backend is plain
// HTTP. Point it at a live backend with the INFERGRID_ENDPOINT env var.
const ENDPOINT = process.env.INFERGRID_ENDPOINT ?? "http://35.255.145.27";
const TIMEOUT_MS = 6000;
const MAX_LEN = 10_000;

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const text = (body as { text?: unknown })?.text;
  if (typeof text !== "string" || text.trim().length === 0) {
    return Response.json({ ok: false, error: "empty_text" }, { status: 400 });
  }
  if (text.length > MAX_LEN) {
    return Response.json({ ok: false, error: "too_long" }, { status: 400 });
  }

  const started = Date.now();
  try {
    const res = await fetch(`${ENDPOINT}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    const latencyMs = Date.now() - started;

    if (!res.ok) {
      return Response.json(
        { ok: false, error: "upstream_error", status: res.status, latencyMs, endpoint: ENDPOINT },
        { status: 502 }
      );
    }
    const data = await res.json();
    return Response.json({ ok: true, data, latencyMs, endpoint: ENDPOINT });
  } catch (err) {
    const latencyMs = Date.now() - started;
    const reason =
      err instanceof Error && err.name === "TimeoutError" ? "timeout" : "unreachable";
    return Response.json(
      { ok: false, error: "offline", reason, latencyMs, endpoint: ENDPOINT },
      { status: 503 }
    );
  }
}
