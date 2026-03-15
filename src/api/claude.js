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

function validateResult(result) {
  const hasDirections = result && Array.isArray(result.directions) && result.directions.length === 3;

  if (!hasDirections) {
    throw new Error("the ai response was missing the 3 outfit directions.");
  }

  return {
    directions: result.directions.map(validateDirection),
  };
}

export async function generateFashionOutfit(selections) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(selections),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "the ai request didn't go through. check the key and try again.");
  }

  return validateResult(await response.json());
}
