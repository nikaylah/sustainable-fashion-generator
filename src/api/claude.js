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

async function fetchDirection(selections, directionIndex) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      ...selections,
      directionIndex,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "the ai request didn't go through. check the key and try again.");
  }

  return validateDirection(await response.json());
}

export async function generateFashionOutfit(selections, onDirection) {
  const requests = [0, 1, 2].map((directionIndex) =>
    fetchDirection(selections, directionIndex).then((direction) => {
      onDirection?.(directionIndex, direction);
      return {
        directionIndex,
        direction,
      };
    })
  );

  const settled = await Promise.allSettled(requests);
  const fulfilled = settled
    .filter((entry) => entry.status === "fulfilled")
    .map((entry) => entry.value)
    .sort((a, b) => a.directionIndex - b.directionIndex);

  if (!fulfilled.length) {
    const firstError = settled.find((entry) => entry.status === "rejected");
    throw firstError?.reason || new Error("the ai request didn't go through. check the key and try again.");
  }

  return {
    directions: fulfilled.map((entry) => entry.direction),
  };
}
