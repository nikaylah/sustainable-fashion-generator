import { calculateScore, getFiberData, FIBER_LIBRARY } from "./fabrics";

describe("fabric helpers", () => {
  it("calculates weighted fiber scores", () => {
    expect(calculateScore(FIBER_LIBRARY["Organic Hemp"])).toBe(94);
    expect(calculateScore(FIBER_LIBRARY["Conventional Cotton"])).toBe(34);
  });

  it("matches fibers by close naming", () => {
    expect(getFiberData("Hemp Twill")).toMatchObject({
      name: "Organic Hemp",
      label: "The Earth-First Choice",
      score: 94,
    });

    expect(getFiberData("Deadstock")).toMatchObject({
      name: "Deadstock Silk",
      score: 70,
    });
  });

  it("returns null for unknown fibers", () => {
    expect(getFiberData("Banana Peel Fiber")).toBeNull();
  });
});
