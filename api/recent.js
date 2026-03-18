import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const items = await kv.lrange("recent_generations", 0, 5);
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
