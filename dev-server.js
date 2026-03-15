import "dotenv/config";
import http from "node:http";
import {
  generateOutfitFromSelections,
  validateSelections,
} from "./api/_shared/generateOutfit.js";

const HOST = "127.0.0.1";
const PORT = 3001;

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : null);
      } catch {
        reject(new Error("invalid json body"));
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url !== "/api/generate") {
    return sendJson(res, 404, { error: "not found" });
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "method not allowed" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return sendJson(res, 500, { error: "missing anthropic api key" });
  }

  try {
    const selections = validateSelections(await readJsonBody(req));
    const result = await generateOutfitFromSelections(
      selections,
      process.env.ANTHROPIC_API_KEY
    );

    return sendJson(res, 200, result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "something went wrong while generating the outfit.";

    return sendJson(res, 500, { error: message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`local api ready at http://${HOST}:${PORT}`);
});
