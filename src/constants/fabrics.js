export const FIBER_LIBRARY = {
  "Organic Hemp": {
    carbon: 9,
    water: 10,
    ethical: 9,
    label: "The Earth-First Choice",
    description:
      "Hemp breathes carbon back into the soil and requires 50% less water than cotton.",
  },
  "Tencel Lyocell": {
    carbon: 8,
    water: 8,
    ethical: 8,
    label: "The Bio-Tech Marvel",
    description:
      "Made from eucalyptus wood pulp in a closed-loop system where 99% of solvents are reused.",
  },
  "Recycled Polyester": {
    carbon: 7,
    water: 7,
    ethical: 6,
    label: "The Circular Solution",
    description:
      "Diverts plastic from landfills and oceans, though it still sheds microplastics.",
  },
  "Deadstock Silk": {
    carbon: 6,
    water: 7,
    ethical: 9,
    label: "The Waste-Not Luxury",
    description:
      "Utilizes high-end leftover fabrics from luxury fashion houses that would otherwise be burned.",
  },
  "Conventional Cotton": {
    carbon: 4,
    water: 2,
    ethical: 5,
    label: "The Industry Standard",
    description:
      "High water footprint and pesticide use. This serves as our baseline for improvement.",
  },
};

export function calculateScore(fiber) {
  return Math.round(fiber.carbon * 4 + fiber.water * 4 + fiber.ethical * 2);
}

export function getFiberData(fiberName) {
  const key = Object.keys(FIBER_LIBRARY).find(
    (k) =>
      fiberName.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(fiberName.toLowerCase().split(" ")[0])
  );

  return key
    ? { ...FIBER_LIBRARY[key], name: key, score: calculateScore(FIBER_LIBRARY[key]) }
    : null;
}
