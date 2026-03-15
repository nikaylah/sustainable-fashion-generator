const VISUAL_FLAIR = [
  "asymmetrical hemline",
  "oversized statement collar",
  "modular layering system",
  "raw edge finishing",
  "gathered volume at sleeves",
  "intentional visible seaming",
  "wrap-style front closure",
  "draped cowl detail",
  "elongated proportions",
  "structured yoke detail",
];

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

async function fetchDirection(selections) {
  const randomFlair = VISUAL_FLAIR[Math.floor(Math.random() * VISUAL_FLAIR.length)];
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      ...selections,
      visualFlair: randomFlair,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "the ai request didn't go through. check the key and try again.");
  }

  return validateDirection(await response.json());
}

export async function generateFashionOutfit(selections) {
  return fetchDirection(selections);
}
