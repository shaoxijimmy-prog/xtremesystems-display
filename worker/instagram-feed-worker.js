const DEFAULT_GRAPH_VERSION = "v21.0";
const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 12;
const CACHE_SECONDS = 900;

const jsonHeaders = (origin) => ({
  "content-type": "application/json; charset=utf-8",
  "cache-control": `public, max-age=${CACHE_SECONDS}`,
  "access-control-allow-origin": origin,
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "content-type",
});

function pickCorsOrigin(request, env) {
  const allowed = (env.ALLOWED_ORIGIN || "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = request.headers.get("Origin");

  if (!allowed.length || allowed.includes("*")) return "*";
  if (requestOrigin && allowed.includes(requestOrigin)) return requestOrigin;
  return allowed[0];
}

function cleanCaption(caption) {
  if (!caption) return "Latest update from XtremeSystem.";
  return caption.replace(/\s+/g, " ").trim().slice(0, 140);
}

function mapMediaItem(item) {
  const image = item.media_type === "VIDEO"
    ? item.thumbnail_url || item.media_url
    : item.media_url || item.thumbnail_url;

  if (!image) return null;

  return {
    image,
    caption: cleanCaption(item.caption),
    url: item.permalink,
    tag: item.media_type === "VIDEO" ? "Video" : "Instagram",
    timestamp: item.timestamp,
  };
}

function envError(env) {
  if (!env.IG_ACCESS_TOKEN) return "Missing IG_ACCESS_TOKEN";
  if (!env.IG_USER_ID) return "Missing IG_USER_ID";
  return "";
}

async function fetchInstagramPosts(request, env, ctx) {
  const url = new URL(request.url);
  const limit = Math.min(
    Math.max(Number.parseInt(url.searchParams.get("limit") || DEFAULT_LIMIT, 10), 1),
    MAX_LIMIT
  );
  const cacheUrl = new URL(request.url);
  cacheUrl.search = `?limit=${limit}`;
  const cacheKey = new Request(cacheUrl.toString(), request);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);

  if (cached) return cached;

  const version = env.IG_GRAPH_VERSION || DEFAULT_GRAPH_VERSION;
  const fields = [
    "id",
    "caption",
    "media_type",
    "media_url",
    "permalink",
    "thumbnail_url",
    "timestamp",
  ].join(",");
  const apiUrl = new URL(`https://graph.instagram.com/${version}/${env.IG_USER_ID}/media`);
  apiUrl.searchParams.set("fields", fields);
  apiUrl.searchParams.set("limit", String(limit));
  apiUrl.searchParams.set("access_token", env.IG_ACCESS_TOKEN);

  const response = await fetch(apiUrl.toString(), {
    headers: { accept: "application/json" },
  });
  const data = await response.json();

  if (!response.ok) {
    return new Response(
      JSON.stringify({
        posts: [],
        source: "instagram",
        error: data.error?.message || "Instagram API request failed",
      }),
      { status: 502, headers: jsonHeaders(pickCorsOrigin(request, env)) }
    );
  }

  const posts = (data.data || []).map(mapMediaItem).filter(Boolean);
  const body = JSON.stringify({
    posts,
    source: "instagram",
    fetchedAt: new Date().toISOString(),
  });
  const finalResponse = new Response(body, {
    status: 200,
    headers: jsonHeaders(pickCorsOrigin(request, env)),
  });

  ctx.waitUntil(cache.put(cacheKey, finalResponse.clone()));
  return finalResponse;
}

export default {
  async fetch(request, env, ctx) {
    const origin = pickCorsOrigin(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: jsonHeaders(origin) });
    }

    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response(
        JSON.stringify({
          ok: !envError(env),
          service: "xtremesystems-instagram-feed",
          message: envError(env) || "Ready",
        }),
        { headers: jsonHeaders(origin) }
      );
    }

    if (url.pathname !== "/instagram-feed") {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: jsonHeaders(origin),
      });
    }

    const configError = envError(env);
    if (configError) {
      return new Response(JSON.stringify({ posts: [], error: configError }), {
        status: 500,
        headers: jsonHeaders(origin),
      });
    }

    return fetchInstagramPosts(request, env, ctx);
  },
};
