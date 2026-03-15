import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-20250514";

const SYSTEM_PROMPT =
  `Act as a Sustainable Fashion Creative Technologist.

Your Goal: Create a high-end fashion concept based on user inputs. You must return your response in valid JSON format only - no other text, no markdown, no backticks.

The Constraints:

1. Fiber Mapping: You MUST select the most appropriate fiber from ONLY this list: ["Organic Hemp", "Tencel Lyocell", "Recycled Polyester", "Deadstock Silk", "Conventional Cotton"]. Use the exact string from this list as the value for "selected_fiber".

2. Silhouette Logic: Select a silhouette type from ONLY this list: ["midi-dress", "abaya", "wide-leg-tunic", "structured-coat", "asymmetric", "wrap-dress", "aline-blouse", "layered-coat"]. This will be used to render an animated SVG silhouette.

3. Visual Precision: Describe the garment with specific construction details, fabric weights, and natural dye references where relevant.

4. Design Logic: Explain how the chosen fiber interacts with the user's Style Vibe and Design Priorities for sustainability.

CRITICAL: outfitDescription must be a MAXIMUM of 12 words. It should be a mood or feeling, not a description. Examples of good descriptions: "Structured softness for those who move with intention." / "Earth-toned layers that breathe with you." / "Romantic restraint in natural cream and sage." BAD example (too long): "A billowing organic hemp midi dress with hand-gathered bodice and flowing three-quarter sleeves." If your description exceeds 12 words it is wrong - shorten it.

JSON Schema - return EXACTLY this structure:
{
  "outfitName": "A short evocative name for the design concept",
  "selected_fiber": "Exact fiber name from the constrained list above",
  "silhouette_type": "Exact silhouette key from the constrained list above",
  "outfitDescription": "One sentence of 12 words or fewer capturing the mood of the outfit",
  "fabrics": [
    {"name": "fabric name", "description": "why this fabric serves these inputs"}
  ],
  "colorPalette": [
    {"name": "color name", "hex": "#hexcode"}
  ],
  "stylingNotes": "2-3 sentences with specific styling directions",
  "sustainabilityInsight": "2-3 sentences on environmental benefits",
  "design_reasoning": "2 sentences explaining why this fiber and style work together for sustainability",
  "sustainability_highlight": "One specific fact about this material's impact e.g. Saves 2000 liters of water per garment",
  "aiReasoning": "2-3 sentences on design tensions resolved and decisions made",
  "primaryFabricTag": "Same value as selected_fiber"
}

ADDITIONAL RULES:
- If Design Priorities include Modest Layering, silhouette_type must be abaya or layered-coat
- Natural dye hex values: Yellows #E2B13C, Reds #B04E4E, Blues #2B4561, Earth #634F3A
- Reference specific certifications (GOTS, OEKO-TEX, Bluesign) where relevant

CRITICAL REQUIREMENT: Your JSON response MUST include "selected_fiber" set to exactly one of: "Organic Hemp", "Tencel Lyocell", "Recycled Polyester", "Deadstock Silk", "Conventional Cotton". This field must never be empty or null. It must always be present.`;

function stripCodeFences(text) {
  return text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
}

function parseClaudeResponse(content) {
  const textBlock = content.find((block) => block.type === "text");

  if (!textBlock?.text) {
    throw new Error("the ai response came back empty.");
  }

  let parsed;
  try {
    parsed = JSON.parse(stripCodeFences(textBlock.text));
  } catch {
    throw new Error("the ai sent something i couldn't turn into outfit data.");
  }

  // Add console log to see what Claude actually returned
  console.log("Parsed response keys:", Object.keys(parsed));
  console.log("selected_fiber:", parsed.selected_fiber);
  console.log("primaryFabricTag:", parsed.primaryFabricTag);

  // Fallback: if selected_fiber is missing or empty, derive it from fabrics array
  if (!parsed.selected_fiber || parsed.selected_fiber === "") {
    const fiberMap = {
      hemp: "Organic Hemp",
      tencel: "Tencel Lyocell",
      lyocell: "Tencel Lyocell",
      polyester: "Recycled Polyester",
      silk: "Deadstock Silk",
      cotton: "Conventional Cotton",
    };
    const firstFabricName = (parsed.fabrics?.[0]?.name || "").toLowerCase();
    console.log("Deriving fiber from fabric name:", firstFabricName);
    const matchedKey = Object.keys(fiberMap).find((k) => firstFabricName.includes(k));
    parsed.selected_fiber = matchedKey ? fiberMap[matchedKey] : "Organic Hemp";
    parsed.primaryFabricTag = parsed.selected_fiber;
    console.log("Derived selected_fiber:", parsed.selected_fiber);
  }

  // Same fallback for primaryFabricTag
  if (!parsed.primaryFabricTag || parsed.primaryFabricTag === "") {
    parsed.primaryFabricTag = parsed.selected_fiber;
  }

  return parsed;
}

export function validateSelections(selections) {
  const hasShape =
    selections &&
    typeof selections.fiberPreference === "string" &&
    typeof selections.styleVibe === "string" &&
    Array.isArray(selections.designPriorities) &&
    (typeof selections.visualFlair === "string" || typeof selections.visualFlair === "undefined");

  if (!hasShape) {
    throw new Error("missing or invalid outfit preferences.");
  }

  return selections;
}

function validateDirection(result) {
  const hasBasics =
    result &&
    typeof result.outfitName === "string" &&
    typeof result.selected_fiber === "string" &&
    typeof result.silhouette_type === "string" &&
    typeof result.outfitDescription === "string" &&
    typeof result.stylingNotes === "string" &&
    typeof result.sustainabilityInsight === "string" &&
    typeof result.design_reasoning === "string" &&
    typeof result.sustainability_highlight === "string" &&
    typeof result.primaryFabricTag === "string" &&
    typeof result.aiReasoning === "string" &&
    Array.isArray(result.fabrics) &&
    Array.isArray(result.colorPalette);

  if (!hasBasics) {
    throw new Error("the ai response was missing a few pieces.");
  }

  return result;
}

export const validateResult = validateDirection;

export async function generateOutfitFromSelections(selections, apiKey) {
  if (!apiKey) {
    throw new Error("missing anthropic api key");
  }

  const anthropic = new Anthropic({ apiKey });
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 900,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate one outfit direction for someone with these SPECIFIC requirements:
- Hero fiber: ${selections.fiberPreference} - must be the dominant material
- Aesthetic vibe: ${selections.styleVibe} - must be unmistakably present
- Design priorities: ${selections.designPriorities.join(", ")}
- Visual detail to incorporate: ${selections.visualFlair || "asymmetrical hemline"}

IMPORTANT: You must include "selected_fiber" in your JSON response. It must be EXACTLY one of these five strings - copy and paste exactly: "Organic Hemp", "Tencel Lyocell", "Recycled Polyester", "Deadstock Silk", "Conventional Cotton". Do not use any other value. This field is required and must not be null or undefined.

Make sure someone could look at the output and immediately know which options were selected. The selections should create a completely unique result that would look nothing like a different combination of inputs.`,
      },
    ],
  });

  const parsedResponse = parseClaudeResponse(response.content ?? []);

  console.log("Raw Claude response:", JSON.stringify(parsedResponse).slice(0, 500));
  console.log("selected_fiber value:", parsedResponse.selected_fiber);
  console.log("primaryFabricTag value:", parsedResponse.primaryFabricTag);

  return validateResult(parsedResponse);
}
