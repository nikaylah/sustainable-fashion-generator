import { Redis } from "@upstash/redis";

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const redis = getRedis();

    console.log("KV_REST_API_URL exists:", !!process.env.KV_REST_API_URL);
    console.log("KV_REST_API_TOKEN exists:", !!process.env.KV_REST_API_TOKEN);

    const items = await redis.lrange("recent_generations", 0, 5);
    console.log("Items from Redis:", items?.length);

    const parsed = (items || [])
      .map((item) => {
        try {
          return typeof item === "string" ? JSON.parse(item) : item;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return res.status(200).json({ generations: parsed });
  } catch (e) {
    console.error("Redis error:", e.message);
    return res.status(200).json({ generations: [], error: e.message });
  }
}
