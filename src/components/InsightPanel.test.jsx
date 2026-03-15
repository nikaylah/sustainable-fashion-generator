import { render, screen } from "@testing-library/react";
import InsightPanel from "./InsightPanel";

describe("InsightPanel", () => {
  it("renders the sustainability score details for a known fiber", () => {
    render(
      <InsightPanel
        selectedFiber="Organic Hemp"
        sustainabilityHighlight="Saves 2000 liters of water per garment"
        designReasoning="The fiber keeps the silhouette grounded while supporting breathable layering."
      />
    );

    expect(screen.getByText("Sustainability Score")).toBeInTheDocument();
    expect(screen.getByText("The Earth-First Choice")).toBeInTheDocument();
    expect(screen.getByText(/94/)).toBeInTheDocument();
    expect(screen.getByText(/Saves 2000 liters of water per garment/)).toBeInTheDocument();
    expect(screen.getByText((_, node) => node?.textContent === "Material: Organic Hemp")).toBeInTheDocument();
  });

  it("returns nothing when the fiber is unknown and no fallback exists", () => {
    const { container } = render(
      <InsightPanel
        selectedFiber="Mystery Fiber"
        sustainabilityHighlight="Hidden fact"
        designReasoning="Hidden reason"
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("falls back to the primary fabric tag when the selected fiber is messy", () => {
    render(
      <InsightPanel
        selectedFiber="hemp-forward structured blend"
        primaryFabricTag="Organic Hemp"
        sustainabilityHighlight="Saves 2000 liters of water per garment"
        designReasoning="The fiber keeps the silhouette grounded while supporting breathable layering."
      />
    );

    expect(screen.getByText("The Earth-First Choice")).toBeInTheDocument();
    expect(screen.getByText((_, node) => node?.textContent === "Material: Organic Hemp")).toBeInTheDocument();
  });

  it("shows a fiber-based fallback sustainability highlight when the ai leaves it blank", () => {
    render(
      <InsightPanel
        selectedFiber="Organic Hemp"
        sustainabilityHighlight=""
        designReasoning="The fiber keeps the silhouette grounded while supporting breathable layering."
      />
    );

    expect(
      screen.getByText(/Saves 2400 liters of water per garment compared to conventional cotton equivalent/i)
    ).toBeInTheDocument();
  });
});
