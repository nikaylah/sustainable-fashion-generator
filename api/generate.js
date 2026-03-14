import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-20250514";

const SYSTEM_PROMPT =
  "You are a sustainable fashion designer who creates outfit concepts based on natural fibers, climate needs, and personal values. Always respond in JSON format with these exact keys: outfitName, outfitDescription, fabrics (array of {name, description}), colorPalette (array of {name, hex}), stylingNotes, sustainabilityInsight, aiReasoning.";

function stripCodeFences(text) {
  return text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
}

function parseSelections(body) {
  if (!body) return null;
  if (typeof body === "string") return JSON.parse(body);
  return body;
}

function parseClaudeResponse(content) {
  const textBlock = content.find((block) => block.type === "text");

  if (!textBlock?.text) {
    throw new Error("the ai response came back empty.");
  }

  return JSON.parse(stripCodeFences(textBlock.text));
}

function validateSelections(selections) {
  const hasShape =
    selections &&
    typeof selections.climate === "string" &&
    typeof selections.fiberPreference === "string" &&
    typeof selections.styleVibe === "string" &&
    typeof selections.colorPalette === "string" &&
    Array.isArray(selections.designPriorities);

  if (!hasShape) {
    throw new Error("missing or invalid outfit preferences.");
  }

  return selections;
}

function validateResult(result) {
  const hasBasics =
    result &&
    typeof result.outfitName === "string" &&
    typeof result.outfitDescription === "string" &&
    typeof result.stylingNotes === "string" &&
    typeof result.sustainabilityInsight === "string" &&
    typeof result.aiReasoning === "string" &&
    Array.isArray(result.fabrics) &&
    Array.isArray(result.colorPalette);

  if (!hasBasics) {
    throw new Error("the ai response was missing a few pieces.");
  }

  return result;
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
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 900,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Create one outfit concept for these preferences:
Climate: ${selections.climate}
Fiber Preference: ${selections.fiberPreference}
Style Vibe: ${selections.styleVibe}
Color Palette: ${selections.colorPalette}
Design Priorities: ${selections.designPriorities.join(", ")}

Keep the tone elegant, practical, and specific. Return valid JSON only.`,
        },
      ],
    });

    return res.status(200).json(validateResult(parseClaudeResponse(response.content ?? [])));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "something went wrong while generating the outfit.";

    return res.status(500).json({ error: message });
  }
}
