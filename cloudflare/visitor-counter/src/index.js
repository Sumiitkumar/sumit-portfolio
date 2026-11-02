const jsonResponse = (data, status, headers) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers,
  },
});

const hashVisitorId = async (visitorId) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(visitorId));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") ?? "";
    const allowedOrigins = (env.ALLOWED_ORIGINS ?? "").split(",").map((value) => value.trim());
    if (!allowedOrigins.includes(origin)) {
      return jsonResponse({ error: "Origin is not allowed." }, 403, {});
    }

    const headers = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (new URL(request.url).pathname !== "/count") {
      return jsonResponse({ error: "Not found." }, 404, headers);
    }

    if (request.method === "GET") {
      const result = await env.DB.prepare(
        "SELECT total FROM visitor_counter WHERE id = 1",
      ).first();
      if (!result) {
        return jsonResponse({ error: "Counter has not been initialized." }, 500, headers);
      }
      return jsonResponse({ count: result.total }, 200, headers);
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed." }, 405, headers);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Request body must be valid JSON." }, 400, headers);
    }

    if (typeof body.visitorId !== "string" ||
      !/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|[0-9a-f]{32})$/i.test(body.visitorId)) {
      return jsonResponse({ error: "A valid visitor ID is required." }, 400, headers);
    }

    const visitorHash = await hashVisitorId(body.visitorId);
    await env.DB.prepare(
      "INSERT OR IGNORE INTO counted_visitors (visitor_hash) VALUES (?)",
    ).bind(visitorHash).run();

    const result = await env.DB.prepare(
      "SELECT total FROM visitor_counter WHERE id = 1",
    ).first();
    if (!result) {
      return jsonResponse({ error: "Counter has not been initialized." }, 500, headers);
    }
    return jsonResponse({ count: result.total }, 200, headers);
  },
};
