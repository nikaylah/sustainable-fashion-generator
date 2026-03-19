import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HeroUIProvider } from "@heroui/react";
import ResultCard from "../../components/ResultCard";
import html2canvas from "html2canvas";

vi.mock("html2canvas", () => ({
  default: vi.fn(),
}));

vi.mock("../../components/FashionSilhouette", () => ({
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
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the editorial result view with insight panel content", () => {
    renderWithProvider(
      <ResultCard
        result={result}
        selections={{ styleVibe: "Minimal", designPriorities: ["Breathability"] }}
        onGenerateAnother={() => {}}
        isLoading={false}
      />
    );

    expect(screen.getAllByText("Soft Utility Form").length).toBeGreaterThan(0);
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

  it("creates a share image when the share button is pressed", async () => {
    const blob = new Blob(["share-image"], { type: "image/png" });
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test-url");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    Object.defineProperty(window.navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(window.navigator, "canShare", {
      configurable: true,
      value: undefined,
    });

    html2canvas.mockResolvedValue({
      toBlob: (callback) => callback(blob),
    });

    renderWithProvider(
      <ResultCard
        result={result}
        selections={{
          fiberPreference: "Organic Hemp",
          styleVibe: "Minimal",
          designPriorities: ["Breathability"],
        }}
        onGenerateAnother={() => {}}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /share this design/i }));

    await waitFor(() => {
      expect(screen.getByText(/your share card is ready/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /download image/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /download image/i }));

    await waitFor(() => {
      expect(html2canvas).toHaveBeenCalled();
    });
  });
});
