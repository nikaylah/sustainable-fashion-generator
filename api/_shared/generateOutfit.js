import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-20250514";

const SYSTEM_PROMPT =
  "You are a sustainable fashion designer who creates outfit concepts based on natural fibers, climate needs, and personal values. Always respond in JSON format with this exact top-level shape: { directions: [ ... ] }. The directions array must contain exactly 3 objects. Each object must use these exact keys: outfitName, outfitDescription, fabrics (array of {name, description}), colorPalette (array of {name, hex}), stylingNotes, sustainabilityInsight, aiReasoning.";

function stripCodeFences(text) {
  return text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
}

function parseClaudeResponse(content) {
  const textBlock = content.find((block) => block.type === "text");

  if (!textBlock?.text) {
    throw new Error("the ai response came back empty.");
  }

  try {
    return JSON.parse(stripCodeFences(textBlock.text));
  } catch {
    throw new Error("the ai sent something i couldn't turn into outfit data.");
  }
}

export function validateSelections(selections) {
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

function validateDirection(result) {
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

export function validateResult(result) {
  const hasDirections = result && Array.isArray(result.directions) && result.directions.length === 3;

  if (!hasDirections) {
    throw new Error("the ai response was missing the 3 outfit directions.");
  }

  return {
    directions: result.directions.map(validateDirection),
  };
}

export async function generateOutfitFromSelections(selections, apiKey) {
  if (!apiKey) {
    throw new Error("missing anthropic api key");
  }

  const anthropic = new Anthropic({ apiKey });
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1800,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Create 3 distinct outfit directions for these preferences:
Climate: ${selections.climate}
Fiber Preference: ${selections.fiberPreference}
Style Vibe: ${selections.styleVibe}
Color Palette: ${selections.colorPalette}
Design Priorities: ${selections.designPriorities.join(", ")}

Make each direction feel clearly different while still matching the same values. Return valid JSON only.`,
      },
    ],
  });

  return validateResult(parseClaudeResponse(response.content ?? []));
}
