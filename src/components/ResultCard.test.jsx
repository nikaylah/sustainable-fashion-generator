import { render, screen } from "@testing-library/react";
import { HeroUIProvider } from "@heroui/react";
import ResultCard from "./ResultCard";

vi.mock("./FashionSilhouette", () => ({
  default: function MockFashionSilhouette() {
    return <div data-testid="fashion-silhouette" />;
  },
}));

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }) => children,
  motion: {
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

function renderWithProvider(ui) {
  return render(<HeroUIProvider>{ui}</HeroUIProvider>);
}

const result = {
  outfitName: "Soft Utility Form",
  selected_fiber: "Organic Hemp",
  silhouette_type: "wide-leg-tunic",
  outfitDescription: "A sculpted hemp set that feels airy and precise.",
  fabrics: [
    { name: "Organic Hemp Twill", description: "Breathable structure." },
    { name: "Tencel Facing", description: "Soft against skin." },
  ],
  colorPalette: [
    { name: "Clay", hex: "#634F3A" },
    { name: "Ochre", hex: "#E2B13C" },
  ],
  stylingNotes: "Pair it with flat sandals and a soft belt.",
  sustainabilityInsight: "The fiber mix lowers water use and improves durability.",
  design_reasoning: "Hemp brings structure while the soft drape keeps the silhouette from feeling rigid.",
  sustainability_highlight: "Uses dramatically less water than conventional cotton.",
  aiReasoning: "The look balances structure and movement.",
};

describe("ResultCard", () => {
  it("renders the editorial result view with insight panel content", () => {
    renderWithProvider(
      <ResultCard
        result={result}
        selections={{ styleVibe: "Minimal", designPriorities: ["Breathability"] }}
        onGenerateAnother={() => {}}
        isLoading={false}
      />
    );

    expect(screen.getByText("Soft Utility Form")).toBeInTheDocument();
    expect(screen.getByTestId("fashion-silhouette")).toBeInTheDocument();
    expect(screen.getByText("Organic Hemp Twill")).toBeInTheDocument();
    expect(screen.getByText("Clay")).toBeInTheDocument();
    expect(screen.getByText("The Earth-First Choice")).toBeInTheDocument();
    expect(screen.getByText(/Uses dramatically less water than conventional cotton/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Regenerate/i })).toBeInTheDocument();
  });

  it("shows the loading card while generating", () => {
    renderWithProvider(
      <ResultCard
        result={null}
        selections={{ styleVibe: "Minimal", designPriorities: [] }}
        onGenerateAnother={() => {}}
        isLoading
      />
    );

    expect(screen.getByText("Reading your values...")).toBeInTheDocument();
  });
});
