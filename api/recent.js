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
    const items = await redis.lrange("recent_generations", 0, 5);
    const parsed = items
      .map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return res.status(200).json({ generations: parsed });
  } catch {
    return res.status(200).json({ generations: [] });
  }
}
