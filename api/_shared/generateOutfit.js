import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-20250514";

const SYSTEM_PROMPT =
  `You are a sustainable fashion designer and creative director. Your job is to generate ONE highly specific outfit direction that is unmistakably shaped by the user's exact inputs.

CRITICAL RULES:
- The outfit concept, fabrics, colors, and styling must feel COMPLETELY DIFFERENT depending on what the user selects
- If the user selects "Warm" climate, the outfit must feel visibly warm-weather appropriate - no heavy layers, no dark colors
- If the user selects "Cold" climate, the outfit must feel visibly cold-weather appropriate - layering, warmth, structure
- If the user selects "Linen", linen must be the HERO fabric, not a footnote
- If the user selects "Wool", wool must be the HERO fabric
- If the user selects "Romantic" style, the outfit must have clearly romantic details - gathering, draping, softness, florals
- If the user selects "Minimal" style, the outfit must be strikingly simple - clean lines, no decoration, architectural
- If the user selects "Contemporary", the outfit must feel fashion-forward and modern - unexpected proportions, interesting cuts
- If the user selects "Earthy", the outfit must feel grounded and natural - organic textures, earth tones, utilitarian details
- Color palettes must be DRAMATICALLY different per selection:
  - Neutrals = true neutrals only: white, cream, oatmeal, stone, charcoal
  - Desert Tones = warm terracotta, sand, burnt orange, rust, clay
  - Forest Tones = deep green, moss, bark brown, pine, olive
  - Soft Pastels = blush, lavender, powder blue, mint, soft rose
- Design Priorities must visibly shape the design:
  - Breathability = loose weaves, open constructions, minimal layering mentioned explicitly
  - Durability = reinforced details, sturdy fabrics, timeless silhouettes mentioned explicitly
  - Minimal Environmental Impact = specific certifications (GOTS, OEKO-TEX), natural dyes, zero waste construction mentioned explicitly
  - Modest Layering = specific coverage details, layering system, modest silhouettes mentioned explicitly

ADDITIONAL RULES:
- If Vegan Only is selected, NEVER suggest wool, silk, alpaca, or any animal-derived fiber
- If Compostable/Biodegradable is selected, only suggest GOTS certified organic fibers with natural dyes
- If Machine Wash is selected, avoid delicate silks, high-micron wools, and dry-clean-only fabrics
- If Dry Clean Only is selected, you may suggest luxurious delicate fabrics
- Opacity must match the garment construction - Fully Opaque means no sheers, no voile as outerwear
- Activity Level shapes fabric weight and construction:
  - Office/Static = structured, pressed fabrics, 150-250gsm
  - Daily/Walking = medium weight, some stretch, 130-200gsm
  - Active/Commuting = lighter weight, stretch or drape, moisture wicking priority
- Reference specific certifications (GOTS, OEKO-TEX, Bluesign, Fair Trade) where relevant
- For natural dye color palettes use these hex ranges:
  - Yellows/Golds: #E2B13C to #C59D31
  - Reds/Pinks: #B04E4E to #7D2D2D
  - Blues: #2B4561 to #1A2A3A
  - Earth Tones: #634F3A to #4B3B2B

The outfit name must immediately evoke the combination of inputs - someone should be able to guess the user's selections just from reading the outfit name and description.

Respond ONLY in this exact JSON format with no other text:
{
  "outfitName": "evocative name that reflects the specific input combination",
  "outfitDescription": "2-3 sentences describing the outfit with specific details that clearly reflect every selected input",
  "fabrics": [
    {"name": "fabric name", "description": "why this specific fabric serves these specific inputs"},
    {"name": "fabric name", "description": "why this specific fabric serves these specific inputs"},
    {"name": "fabric name", "description": "why this specific fabric serves these specific inputs"}
  ],
  "colorPalette": [
    {"name": "color name", "hex": "#hexcode"},
    {"name": "color name", "hex": "#hexcode"},
    {"name": "color name", "hex": "#hexcode"}
  ],
  "stylingNotes": "2-3 sentences with specific styling directions that reflect the selected vibe and priorities",
  "sustainabilityInsight": "2-3 sentences explaining the specific environmental benefits of these exact fabric and construction choices",
  "aiReasoning": "2-3 sentences explaining how the specific combination of inputs created tensions or interesting design decisions, and how those were resolved"
}`;

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
    Array.isArray(selections.designPriorities) &&
    typeof selections.opacityPreference === "string" &&
    typeof selections.activityLevel === "string" &&
    typeof selections.careCapacity === "string" &&
    Array.isArray(selections.specificEthics);

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
- Climate: ${selections.climate}
- Hero fiber: ${selections.fiberPreference} - must be the dominant material
- Aesthetic vibe: ${selections.styleVibe} - must be unmistakably present
- Color world: ${selections.colorPalette} - stay strictly within this palette
- Design priorities: ${selections.designPriorities.join(", ")}
- Opacity needed: ${selections.opacityPreference} - fabric sheerness must match this
- Activity level: ${selections.activityLevel} - dictates breathability vs durability weighting
- Care capacity: ${selections.careCapacity} - only suggest fabrics appropriate for this care level
- Ethics focus: ${selections.specificEthics.join(", ")} - if Vegan Only, use NO animal fibers; if Compostable, prioritize biodegradable natural fibers only

Make sure someone could look at the output and immediately know which options were selected. The selections should create a completely unique result that would look nothing like a different combination of inputs.`,
      },
    ],
  });

  return validateResult(parseClaudeResponse(response.content ?? []));
}
