import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardBody, Chip } from "@heroui/react";
import GeneratorForm from "./components/GeneratorForm";
import LoadingOverlay from "./components/LoadingOverlay";
import RecentGenerations from "./components/RecentGenerations";
import ResultCard from "./components/ResultCard";
import { generateFashionOutfit } from "./api/claude";

const INITIAL_SELECTIONS = {
  fiberPreference: "",
  styleVibe: "",
  designPriorities: [],
};

export default function App() {
  const [selections, setSelections] = useState(INITIAL_SELECTIONS);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardKey, setCardKey] = useState(0);
  const [recentRefreshKey, setRecentRefreshKey] = useState(0);

  const canGenerate = !isLoading;

  async function handleGenerate(nextSelections = selections) {
    setSelections(nextSelections);
    setIsLoading(true);
    setError("");
    setResult(null);
    setCardKey((value) => value + 1);

    try {
      const generated = await generateFashionOutfit(nextSelections);
      setResult(generated);
      setRecentRefreshKey((value) => value + 1);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "something went weird while generating the outfit."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-8 text-stone-800 sm:px-6 lg:px-8">
      <LoadingOverlay isVisible={isLoading} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="grid items-start gap-6 md:grid-cols-[minmax(380px,1fr)_minmax(0,1.5fr)]">
          <Card className="main-card-surface min-w-0 w-full md:min-w-[320px] bg-white/80 backdrop-blur md:sticky md:top-8 md:self-start">
            <CardBody className="gap-6 p-6 sm:p-8">
              <GeneratorForm
                selections={selections}
                setSelections={setSelections}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                canGenerate={canGenerate}
              />

              {result ? (
                <div className="inner-card-surface border-l-[3px] border-sage bg-[#F5F0E8] px-5 py-4">
                  <p className="font-heading text-sm italic leading-6 text-stone-700">
                    A design experiment exploring what clothing concepts look like when
                    sustainability values shape the creative process — not trends.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[selections.fiberPreference, selections.styleVibe, ...selections.designPriorities]
                      .filter(Boolean)
                      .map((priority) => (
                      <Chip
                        key={priority}
                        radius="full"
                        variant="flat"
                        classNames={{
                          base: "bg-white/80 border border-sand/50",
                          content: "text-xs font-medium text-stone-700",
                        }}
                      >
                        {priority}
                      </Chip>
                    ))}
                  </div>
                </div>
              ) : null}

              {error ? (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
            </CardBody>
          </Card>

          <div className="flex min-h-[420px] w-full min-w-0 flex-col items-stretch">
            <AnimatePresence mode="wait">
              {result ? (
                <div key={cardKey} className="w-full">
                  <ResultCard
                    result={result}
                    selections={selections}
                    isLoading={isLoading}
                    onGenerateAnother={() => handleGenerate()}
                  />
                </div>
              ) : (
                <motion.div
                  key="empty-state"
                  className="w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    height: "100%",
                    minHeight: "600px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "32px",
                    padding: "48px 32px",
                    textAlign: "center",
                  }}
                >
                  <motion.div
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg
                      width="100"
                      height="200"
                      viewBox="0 0 200 400"
                      fill="none"
                      stroke="#7C9A7E"
                      strokeWidth="1.2"
                    >
                      <path d="M85,60 C80,65 75,75 74,90 L74,160 L126,160 L126,90 C125,75 120,65 115,60 Z" />
                      <path d="M74,160 C65,180 55,220 50,280 C60,285 140,285 150,280 C145,220 135,180 126,160 Z" />
                      <path d="M85,60 C90,55 95,52 100,52 C105,52 110,55 115,60" />
                      <path d="M85,65 C78,68 70,75 65,88 C70,92 76,90 80,85 L85,65 Z" />
                      <path d="M115,65 C122,68 130,75 135,88 C130,92 124,90 120,85 L115,65 Z" />
                    </svg>
                  </motion.div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <p
                      style={{
                        fontFamily: "'Give You Glory', cursive",
                        fontSize: "2.2rem",
                        fontWeight: 700,
                        color: "#5C4A32",
                        lineHeight: 1.2,
                      }}
                    >
                      your design lives here
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#8B7355",
                        maxWidth: "280px",
                        lineHeight: 1.7,
                        margin: "0 auto",
                      }}
                    >
                      choose a fiber and a vibe{" "}
                      <span className="sm:hidden">above</span>
                      <span className="hidden sm:inline">on the left</span>, then hit generate
                      to see your sustainable design come to life.
                    </p>
                  </div>

                  <svg width="80" height="12" viewBox="0 0 120 12" fill="none">
                    <path
                      d="M2 10C10 10 14 2 22 2C30 2 34 10 42 10C50 10 54 2 62 2C70 2 74 10 82 10C90 10 94 2 102 2C110 2 114 10 118 10"
                      stroke="#C4B5A0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#D4B896",
                        opacity: 0.5,
                      }}
                    />
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: "#7C9A7E",
                        opacity: 0.4,
                      }}
                    />
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#C4A882",
                        opacity: 0.5,
                      }}
                    />
                  </div>

                  <p
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#8B7355",
                      opacity: 0.5,
                    }}
                  >
                    sustainable fashion · ai generated · made with intent
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <RecentGenerations refreshKey={recentRefreshKey} />
      </div>
    </main>
  );
}
