import {
  generateOutfitFromSelections,
  validateSelections,
} from "./_shared/generateOutfit.js";

function parseSelections(body) {
  if (!body) return null;
  if (typeof body === "string") return JSON.parse(body);
  return body;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method not allowed" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "missing anthropic api key" });
  }

  try {
    const selections = validateSelections(parseSelections(req.body));
    const directionIndex =
      Number.isInteger(selections.directionIndex) && selections.directionIndex >= 0
        ? selections.directionIndex
        : 0;
    const result = await generateOutfitFromSelections(
      selections,
      process.env.ANTHROPIC_API_KEY,
      directionIndex
    );

    return res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "something went wrong while generating the outfit.";

    return res.status(500).json({ error: message });
  }
}
