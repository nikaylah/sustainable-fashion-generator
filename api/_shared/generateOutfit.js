import Anthropic from "@anthropic-ai/sdk";
import { Redis } from "@upstash/redis";

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

const MODEL = "claude-sonnet-4-20250514";
const ENVIRONMENT_THEMES = {
  Minimal: "a stark brutalist concrete gallery with dramatic shadows and clean architectural lines",
  Earthy: "a sun-drenched desert canyon with towering sandstone walls and soft golden-hour light",
  Romantic:
    "a misty overgrown botanical garden at dawn with soft-focus greenery and ethereal light",
  Contemporary: "a sleek high-tech design studio with glass surfaces and cool-toned ambient lighting",
};

const FIBER_NARRATIVES = {
  "Organic Hemp": "a fiber that sequesters carbon and requires 50% less water than cotton",
  "Tencel Lyocell":
    "a bio-engineered fiber from eucalyptus wood pulp processed in a closed-loop system",
  "Recycled Polyester": "a circular fiber diverted from ocean plastic and landfill waste",
  "Deadstock Silk":
    "a rescued luxury fiber salvaged from fashion house surplus that would otherwise be destroyed",
  "Conventional Cotton": "the industry baseline - high water use and pesticide dependency",
};

const BANNED_NAME_WORDS = [
  "canyon",
  "desert",
  "prairie",
  "garden",
  "forest",
  "studio",
  "whisper",
  "drift",
  "reverie",
  "bloom",
  "salvage",
  "dawn",
  "dusk",
  "valley",
  "ridge",
  "shore",
  "meadow",
  "mist",
  "shadow",
  "echo",
];

const FALLBACK_NAMES = {
  Minimal: {
    "Organic Hemp": "Soft Authority",
    "Tencel Lyocell": "Easy Structure",
    "Recycled Polyester": "Light Work",
    "Deadstock Silk": "The Still Piece",
    "Conventional Cotton": "The Quiet Layer",
  },
  Earthy: {
    "Organic Hemp": "Held Loosely",
    "Tencel Lyocell": "Worn Gently",
    "Recycled Polyester": "Light Work",
    "Deadstock Silk": "Carried Softly",
    "Conventional Cotton": "Something Gentle",
  },
  Romantic: {
    "Organic Hemp": "Carried Softly",
    "Tencel Lyocell": "Worn Like Water",
    "Recycled Polyester": "Held Loosely",
    "Deadstock Silk": "Moving in Silk",
    "Conventional Cotton": "Something Gentle",
  },
  Contemporary: {
    "Organic Hemp": "Easy Structure",
    "Tencel Lyocell": "Soft Authority",
    "Recycled Polyester": "Light Work",
    "Deadstock Silk": "The Still Piece",
    "Conventional Cotton": "The Quiet Layer",
  },
};

const SYSTEM_PROMPT =
  `Act as a Sustainable Fashion Creative Technologist.

Your Goal: Create a high-end fashion concept based on user inputs. You must return your response in valid JSON format only - no other text, no markdown, no backticks.

⚠️ FIRST RULE - READ THIS BEFORE ANYTHING ELSE:

The outfitName field MUST follow this exact pattern: [feeling word] + [optional: "in" or comma] + [fabric or physical reference].

COPY ONE OF THESE EXACT PATTERNS:
"Weightless in Hemp" - feeling + in + fiber
"Soft Authority" - feeling + quality
"Moving in Silk" - action + in + fiber
"Held Loosely" - past tense feeling
"Light Work" - two simple words
"Something Gentle" - vague but human
"Easy Structure" - contradiction that works

ABSOLUTELY FORBIDDEN WORDS - if any of these appear in outfitName the response is wrong:
Dawn, Dew, Dewdrop, Reverie, Canyon, Desert, Prairie, Garden, Forest, Whisper, Drift, Bloom, Salvage, Mist, Shadow, Echo, Valley, Ridge, Shore, Meadow, Cascade, Breeze, Petal, Gossamer, Ethereal, Celestial, Aurora, Luminary

If you are about to use any forbidden word - stop and choose a simpler human word instead.

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

function normalizeOutfitName(name, selections, result) {
  const styleFallbacks = FALLBACK_NAMES[selections.styleVibe] || FALLBACK_NAMES.Minimal;
  return (
    styleFallbacks[result.selected_fiber] ||
    styleFallbacks[selections.fiberPreference] ||
    "The Quiet Layer"
  );
}

function parseClaudeResponse(content, selections) {
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
    const matchedKey = Object.keys(fiberMap).find((k) => firstFabricName.includes(k));
    parsed.selected_fiber = matchedKey ? fiberMap[matchedKey] : "Organic Hemp";
    parsed.primaryFabricTag = parsed.selected_fiber;
  }

  // Same fallback for primaryFabricTag
  if (!parsed.primaryFabricTag || parsed.primaryFabricTag === "") {
    parsed.primaryFabricTag = parsed.selected_fiber;
  }

  parsed.outfitName = normalizeOutfitName(parsed.outfitName, selections, parsed);

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

  const styleVibe = selections.styleVibe;
  const fiber = selections.fiberPreference;
  const environmentTheme = ENVIRONMENT_THEMES[styleVibe] || "a minimalist neutral studio";
  const fiberNarrative = FIBER_NARRATIVES[fiber] || fiber;

  const environmentalContext = `
CREATIVE DIRECTION: Imagine this garment photographed in ${environmentTheme}.
The hero fiber is ${fiberNarrative}.
Let this environmental world and fiber story inform every creative decision -
the silhouette, the texture descriptions, the styling notes, and the designer reasoning
should all feel like they belong in this specific world.
`;

  const anthropic = new Anthropic({ apiKey });
  const userMessage = `REMINDER: outfitName must use feeling+fabric pattern like "Soft Authority" or "Moving in Silk". Never use Dawn, Dew, Reverie, Canyon or poetic nature words.

${environmentalContext}
Generate one outfit direction for someone with these SPECIFIC requirements:
- Hero fiber: ${selections.fiberPreference} - must be the dominant material
- Aesthetic vibe: ${selections.styleVibe} - must be unmistakably present
- Design priorities: ${selections.designPriorities.join(", ")}
- Visual detail to incorporate: ${selections.visualFlair || "asymmetrical hemline"}

IMPORTANT: You must include "selected_fiber" in your JSON response. It must be EXACTLY one of these five strings - copy and paste exactly: "Organic Hemp", "Tencel Lyocell", "Recycled Polyester", "Deadstock Silk", "Conventional Cotton". Do not use any other value. This field is required and must not be null or undefined.

Make sure someone could look at the output and immediately know which options were selected. The selections should create a completely unique result that would look nothing like a different combination of inputs.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 900,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const parsedResponse = parseClaudeResponse(response.content ?? [], selections);
  const validatedResponse = validateResult(parsedResponse);

  try {
    const recentEntry = {
      outfitName: validatedResponse.outfitName,
      fiber: validatedResponse.selected_fiber,
      styleVibe,
      colorPalette: validatedResponse.colorPalette?.slice(0, 3),
      score: validatedResponse.selected_fiber ? "calculated" : null,
      timestamp: Date.now(),
    };

    const redis = getRedis();
    await redis.lpush("recent_generations", JSON.stringify(recentEntry));
    await redis.ltrim("recent_generations", 0, 19);
  } catch {
    // don't break generation if kv isn't configured
  }

  return validatedResponse;
}
